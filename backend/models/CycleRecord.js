// backend/models/CycleRecord.js
const mongoose = require("mongoose");

const CycleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  duration: { type: Number },
  flowLevel: { type: String, enum: ["light", "medium","normal", "heavy"], default: "normal" },
  symptoms: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CycleRecord", CycleSchema);
