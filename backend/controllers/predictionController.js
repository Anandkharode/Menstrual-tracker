// backend/controllers/predictionController.js
const Prediction = require("../models/Prediction");

exports.getLatestPrediction = async (req, res) => {
  try {
    const userId = req.user.id;
    const pred = await Prediction.findOne({ userId }).sort({ createdAt: -1 });
    if (!pred) return res.json(null);
    res.json(pred);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
