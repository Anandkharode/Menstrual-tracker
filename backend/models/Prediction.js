// backend/models/Prediction.js
const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  predictedStart: Date,
  ovulationWindow: {
    from: Date,
    to: Date
  },
  confidence: Number,
  anomaly: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prediction", PredictionSchema);
