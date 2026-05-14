// backend/controllers/symptomController.js
const SymptomLog = require("../models/SymptomLog");

exports.logSymptoms = async (req, res) => {
  try {
    const { symptoms, mood, painLevel, notes } = req.body;
    const log = await SymptomLog.create({
      userId: req.user.id,
      date: new Date(),
      symptoms,
      mood,
      painLevel,
      notes
    });
    res.status(201).json(log);
  } catch (err) {
    console.error("error logging symptoms:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
