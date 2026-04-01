// backend/models/ChatLog.js
const mongoose = require("mongoose");

const ChatLogSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message:   { type: String, required: true },
  response:  { type: String, required: true },
  intent:    { type: String, default: "UNKNOWN" },     // detected intent label
  mlUsed:    { type: Boolean, default: false },         // whether ML service was called
  timestamp: { type: Date, default: Date.now },
});

// Index for fast per-user history retrieval
ChatLogSchema.index({ userId: 1, timestamp: 1 });

module.exports = mongoose.model("ChatLog", ChatLogSchema);
