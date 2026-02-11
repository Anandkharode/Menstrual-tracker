// backend/controllers/chatController.js
const ChatLog = require("../models/ChatLog");
const Prediction = require("../models/Prediction");
const axios = require("axios");

exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await ChatLog.find({ userId }).sort({ timestamp: 1 }).lean();
    return res.json(messages);
  } catch (err) {
    console.error("getHistory error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ reply: "Please send a message." });

    const text = message.toLowerCase();

    // 1) Intent: "When is my next period?"
    if (text.includes("next") && text.includes("period")) {
      try {
        const pred = await Prediction.findOne({ userId }).sort({ createdAt: -1 }).lean();
        if (pred) {
          const dateStr = new Date(pred.predictedStart).toDateString();
          const conf = Math.round((pred.confidence || 0) * 100);
          const reply = `Your next period is predicted on ${dateStr} (confidence ${conf}%).`;
          await ChatLog.create({ userId, message, response: reply });
          return res.json({ reply });
        } else {
          const reply = "I don't have a saved prediction yet. Please add a recent cycle and try again.";
          await ChatLog.create({ userId, message, response: reply });
          return res.json({ reply });
        }
      } catch (err) {
        console.warn("Prediction lookup failed:", err.message);
        // fall-through to NLP/fallback below
      }
    }

    // 2) Otherwise: try external NLP service if configured
    let reply = null;
    if (process.env.ML_URL) {
      try {
        const nlpResp = await axios.post(`${process.env.ML_URL}/nlp/query`, { userId, message }, { timeout: 7000 });
        reply = (nlpResp.data && (nlpResp.data.reply || nlpResp.data.response)) ? (nlpResp.data.reply || nlpResp.data.response) : null;
      } catch (err) {
        console.warn("NLP call failed:", err.message);
      }
    }

    // 3) If no NLP reply, use simple rule-based fallback
    if (!reply) {
      if (text.includes("ovulation")) {
        reply = "Ovulation typically occurs around the middle of the cycle. Check Predictions for your personalized window.";
      } else if (text.includes("anomaly") || text.includes("irregular")) {
        reply = "If you suspect an irregularity, check the Anomalies card in Predictions or consult a healthcare provider.";
      } else {
        reply = "Sorry, I'm having trouble right now. Ask about your next period or check the Predictions panel.";
      }
    }

    // Save chat log (non-blocking if it fails)
    try {
      await ChatLog.create({ userId, message, response: reply });
    } catch (dbErr) {
      console.warn("Failed to save chat log:", dbErr.message);
    }

    return res.json({ reply });
  } catch (err) {
    console.error("sendMessage error:", err);
    return res.status(500).json({ reply: "Internal server error. Please try again." });
  }
};
