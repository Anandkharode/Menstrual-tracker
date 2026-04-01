// backend/controllers/chatController.js
/**
 * Chat Controller
 * ───────────────
 * POST /api/chat/message  — main chatbot endpoint
 * GET  /api/chat/history  — fetch message history
 * GET  /api/chat/health   — probe ML service status
 *
 * Pipeline per message:
 *   1. Detect intent (intentEngine)
 *   2. Load user's cycle records + latest saved prediction (MongoDB)
 *   3. Call ML microservice for live prediction (mlService)
 *      — uses LSTM + RF ensemble for full /predict
 *      — uses RF-only /anomaly/detect for anomaly intents (faster)
 *   4. Build personalized reply (responseBuilder)
 *   5. Persist to ChatLog
 */

const ChatLog = require("../models/ChatLog");
const Prediction = require("../models/Prediction");
const Cycle = require("../models/CycleRecord");

const { detectIntent } = require("../services/intentEngine");
const { buildReply } = require("../services/responseBuilder");
const { predict, detectAnomaly, healthCheck } = require("../services/mlService");

// Maximum recent cycles sent to ML (keeps payload small)
const MAX_CYCLES_FOR_ML = 6;

// ── GET /api/chat/history ────────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await ChatLog.find({ userId })
      .sort({ timestamp: 1 })
      .limit(100)
      .lean();
    return res.json(messages);
  } catch (err) {
    console.error("[chat.getHistory]", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// ── GET /api/chat/health ─────────────────────────────────────────────────────
exports.mlHealth = async (req, res) => {
  const status = await healthCheck();
  if (!status) {
    return res
      .status(503)
      .json({ status: "unavailable", message: "ML service is offline." });
  }
  return res.json({ status: "ok", ...status });
};

// ── POST /api/chat/message ───────────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;

  // ── 0. Basic validation ────────────────────────────────────────────────────
  if (!message || !message.trim()) {
    return res.status(400).json({ reply: "Please send a message." });
  }

  try {
    // ── 1. Intent detection ────────────────────────────────────────────────────
    const { intent } = detectIntent(message);
    console.info(`[chat] user=${userId} intent=${intent} msg="${message}"`);

    // ── 2. Fetch user data in parallel ────────────────────────────────────────
    const [cycles, dbPred] = await Promise.all([
      Cycle.find({ userId })
        .sort({ startDate: 1 })
        .limit(MAX_CYCLES_FOR_ML)
        .lean(),
      Prediction.findOne({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    // ── 3. Call ML service ─────────────────────────────────────────────────────
    let mlData = null;
    const needsFullML = [
      "QUERY_NEXT_PERIOD",
      "QUERY_CYCLE_LENGTH",
      "QUERY_OVULATION",
      "QUERY_SYMPTOMS",
      "QUERY_PERIOD_DURATION",
    ].includes(intent);

    const needsAnomalyOnly = intent === "QUERY_ANOMALY";

    if (cycles.length >= 3) {
      if (needsAnomalyOnly) {
        // Use just the fast RF endpoint — no LSTM loading overhead
        const rfResult = await detectAnomaly(cycles);
        if (rfResult) {
          mlData = {
            anomaly: rfResult.anomaly,
            anomalyDetails: {
              ensemble_probability: rfResult.probability,
              rf_probability: rfResult.probability,
              lstm_probability: null,
              method: rfResult.model,
            },
          };
        }
      } else if (needsFullML) {
        // Full LSTM + RF ensemble
        mlData = await predict(cycles);
      }
      // For GREETING / QUERY_HELP / UNKNOWN — no ML call needed
    }

    // ── 4. Build personalized reply ───────────────────────────────────────────
    const reply = buildReply({ intent, mlData, dbPred, cycles });

    // ── 5. Persist chat log (non-blocking) ────────────────────────────────────
    ChatLog.create({
      userId,
      message,
      response: reply,
      intent,
      mlUsed: mlData !== null,
    }).catch((err) => console.warn("[chat] ChatLog save failed:", err.message));

    return res.json({
      reply,
      meta: {
        intent,
        mlUsed: mlData !== null,
        cyclesAvailable: cycles.length,
        anomalyDetected: mlData?.anomaly ?? dbPred?.anomaly ?? null,
      },
    });
  } catch (err) {
    console.error("[chat.sendMessage] Unhandled error:", err);

    // Ultimate fallback — never leave the user without a response
    const fallback =
      "Sorry, I ran into a technical issue. Please try again in a moment. " +
      "If the problem persists, check the Predictions panel for your latest data.";

    ChatLog.create({
      userId,
      message,
      response: fallback,
      intent: "ERROR",
      mlUsed: false,
    }).catch(() => {});

    return res.status(500).json({ reply: fallback });
  }
};
