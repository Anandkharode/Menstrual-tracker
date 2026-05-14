// backend/models/SymptomLog.js
const mongoose = require("mongoose");

const SymptomLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  symptoms: [String],
  mood: String,
  painLevel: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SymptomLog", SymptomLogSchema);
