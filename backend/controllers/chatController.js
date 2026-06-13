// backend/controllers/chatController.js
/**
 * Chat Controller — Personalized AI Health Assistant
 * ───────────────────────────────────────────────────
 * POST /api/chat/message  — main chatbot endpoint (Grok-powered)
 * GET  /api/chat/history  — fetch message history
 * GET  /api/chat/health   — probe ML service status
 *
 * Pipeline per message (Grok path):
 *   1. Detect intent (intentEngine) — used for ML routing
 *   2. Build live HealthProfile (healthProfileService)
 *   3. Fetch last 5 chat messages from MongoDB
 *   4. Build context string (contextBuilder)
 *   5. Call Grok AI (grokService) → personalized reply
 *      └─ If Grok fails: run ML if needed → fall back to responseBuilder
 *   6. Persist to ChatLog
 *   7. Return reply + meta
 */

const ChatLog    = require("../models/ChatLog");
const Prediction = require("../models/Prediction");
const Cycle      = require("../models/CycleRecord");

const { detectIntent }  = require("../services/intentEngine");
const { buildReply }    = require("../services/responseBuilder");
const { predict, detectAnomaly, healthCheck } = require("../services/mlService");
const { buildProfile }  = require("../services/healthProfileService");
const { buildContext }  = require("../services/contextBuilder");
const { askGrok }       = require("../services/grokService");

// Maximum recent cycles sent to ML (keeps payload small)
const MAX_CYCLES_FOR_ML  = 6;
const MAX_HISTORY_MSGS   = 5;

// ── GET /api/chat/health-profile ──────────────────────────────────────────────
exports.getHealthProfile = async (req, res) => {
  try {
    const profile = await buildProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    return res.json(profile);
  } catch (err) {
    console.error("[chat.getHealthProfile]", err);
    return res.status(500).json({ msg: "Server error" });
  }
};


// ── GET /api/chat/history ─────────────────────────────────────────────────────
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

// ── GET /api/chat/health ──────────────────────────────────────────────────────
exports.mlHealth = async (req, res) => {
  const status = await healthCheck();
  if (!status) {
    return res
      .status(503)
      .json({ status: "unavailable", message: "ML service is offline." });
  }
  return res.json({ status: "ok", ...status });
};

// ── POST /api/chat/message ────────────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  const userId  = req.user.id;
  const { message } = req.body;

  // ── 0. Basic validation ──────────────────────────────────────────────────────
  if (!message || !message.trim()) {
    return res.status(400).json({ reply: "Please send a message." });
  }

  try {
    // ── 1. Intent detection (still used for ML routing + fallback) ─────────────
    const { intent } = detectIntent(message);
    console.info(`[chat] user=${userId} intent=${intent} msg="${message}"`);

    // ── 2. Fetch user context data in parallel ─────────────────────────────────
    const [healthProfile, recentHistory, cycles, dbPred] = await Promise.all([
      // Build live health profile (always fresh — never stale)
      buildProfile(userId),

      // Last 5 chat messages for conversation continuity
      ChatLog.find({ userId })
        .sort({ timestamp: -1 })
        .limit(MAX_HISTORY_MSGS)
        .lean()
        .then((msgs) => msgs.reverse()), // oldest first for natural reading

      // Cycles for ML service
      Cycle.find({ userId })
        .sort({ startDate: 1 })
        .limit(MAX_CYCLES_FOR_ML)
        .lean(),

      // Latest stored prediction (ML fallback)
      Prediction.findOne({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    // ── 3. (Optional) Call ML service for real-time prediction data ────────────
    // We run ML in parallel with context building so it's ready if Grok uses it
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
      try {
        if (needsAnomalyOnly) {
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
          mlData = await predict(cycles);
        }
      } catch (mlErr) {
        console.warn("[chat] ML service call failed:", mlErr.message);
        // Continue without ML — Grok will use profile data instead
      }
    }

    // ── 4. Build context string ────────────────────────────────────────────────
    const contextString = buildContext(healthProfile, recentHistory, message);

    // ── 5. Ask Grok for a personalized response ────────────────────────────────
    let reply   = null;
    let grokUsed = false;

    reply = await askGrok(contextString, message);

    if (reply) {
      grokUsed = true;
      console.info(`[chat] Grok responded for user=${userId}`);
    } else {
      // ── 5b. Fallback to template-based responseBuilder ─────────────────────
      console.warn(`[chat] Grok unavailable — using template fallback for intent=${intent}`);
      reply = buildReply({ intent, mlData, dbPred, cycles });
    }

    // ── 6. Persist chat log (non-blocking) ────────────────────────────────────
    ChatLog.create({
      userId,
      message,
      response: reply,
      intent,
      mlUsed:   mlData !== null,
      grokUsed,
    }).catch((err) =>
      console.warn("[chat] ChatLog save failed:", err.message)
    );

    // ── 7. Return response ────────────────────────────────────────────────────
    return res.json({
      reply,
      meta: {
        intent,
        grokUsed,
        mlUsed:          mlData !== null,
        cyclesAvailable: cycles.length,
        anomalyDetected: mlData?.anomaly ?? dbPred?.anomaly ?? healthProfile?.anomalyDetected ?? null,
        healthRisks:     healthProfile?.healthRisks ?? [],
        cycleRegularity: healthProfile?.cycleRegularity ?? "Unknown",
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
      intent:   "ERROR",
      mlUsed:   false,
      grokUsed: false,
    }).catch(() => {});

    return res.status(500).json({ reply: fallback });
  }
};
