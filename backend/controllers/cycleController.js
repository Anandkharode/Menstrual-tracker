// backend/controllers/cycleController.js
const Cycle = require("../models/CycleRecord");
const Prediction = require("../models/Prediction");
const axios = require("axios");

async function createCycle(req, res) {
  try {
    const userId = req.user.id;
    const { startDate, duration, symptoms } = req.body;

    // normalize flowLevel (accept 'flow' too)
    let flowLevel = req.body.flowLevel ?? req.body.flow ?? "normal";
    flowLevel = String(flowLevel).trim().toLowerCase();
    if (flowLevel === "meduim") flowLevel = "medium";

    const allowed = ["light", "normal", "medium", "heavy"];
    if (!allowed.includes(flowLevel)) flowLevel = "normal";

    const cycle = await Cycle.create({
      userId,
      startDate,
      duration,
      flowLevel,
      symptoms
    });

    // try to call ML (non-blocking fallback)
    let prediction = null;
    if (process.env.ML_URL) {
      try {
        const mlResp = await axios.post(`${process.env.ML_URL}/predict`, { cycles: [{ startDate, duration }] }); // Send list of cycles or current cycle
        // NOTE: The ML service expects a list of cycles in "cycles" key. 
        // For better prediction, we should probably fetch previous cycles and send them too.
        // But for now, let's just send the current one or let the fallback handle it if ML fails on insufficient data.
        
        // Actually, let's fetch previous cycles to send to ML for better accuracy
        const pastCycles = await Cycle.find({ userId }).sort({ startDate: 1 }).limit(5).lean();
        // combine past + current
        const allCycles = [...pastCycles.map(c => ({ 
            startDate: c.startDate.toISOString().split('T')[0], 
            duration: c.duration 
        })), { 
            startDate: new Date(startDate).toISOString().split('T')[0], 
            duration: duration 
        }];

        const mlRespFull = await axios.post(`${process.env.ML_URL}/predict`, { cycles: allCycles });
        
        const now = new Date(startDate);
        const cycleLengthDays = mlRespFull.data.next_cycle_length_days || 28;
        
        prediction = {
           predictedStart: new Date(now.getTime() + cycleLengthDays * 24 * 60 * 60 * 1000).toISOString(),
           ovulationWindow: {
              from: new Date(now.getTime() + (cycleLengthDays / 2 - 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              to: new Date(now.getTime() + (cycleLengthDays / 2 + 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
           },
           confidence: 0.85,
           anomaly: mlRespFull.data.anomaly || false
        };

      } catch (err) {
        console.warn("ML service call failed or insufficient data:", err.message);
      }
    }

    if (!prediction) {
      const now = new Date(startDate);
      // Fallback logic uses 28 days for cycle length, NOT bleeding duration
      prediction = {
        predictedStart: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        ovulationWindow: {
          from: new Date(now.getTime() + (28 / 2 - 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          to: new Date(now.getTime() + (28 / 2 + 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        confidence: 0.75,
        anomaly: false
      };
    }

    const savedPred = await Prediction.create({
      userId,
      predictedStart: prediction.predictedStart,
      ovulationWindow: prediction.ovulationWindow,
      confidence: prediction.confidence,
      anomaly: prediction.anomaly
    });

    return res.status(201).json({
      msg: "Cycle saved successfully",
      cycle,
      prediction: savedPred
    });
  } catch (err) {
    console.error("createCycle error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}

async function getCycles(req, res) {
  try {
    const userId = req.user.id;
    const records = await Cycle.find({ userId }).sort({ startDate: -1 }).lean();
    return res.json({ msg: "Cycles fetched successfully", data: records });
  } catch (err) {
    console.error("getCycles error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}

async function deleteCycle(req, res) {
  try {
    const cycleId = req.params.id;
    const userId = req.user.id;
    // ensure the cycle exists and belongs to user
    const cycle = await Cycle.findOneAndDelete({ _id: cycleId, userId });
    if (!cycle) {
      return res.status(404).json({ msg: "Cycle not found" });
    }
    return res.json({ msg: "Cycle deleted successfully" });
  } catch (err) {
    console.error("deleteCycle error:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}

module.exports = {
  createCycle,
  getCycles,
  deleteCycle
};
