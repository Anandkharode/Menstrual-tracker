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
        prediction = mlRespFull.data;
      } catch (err) {
        console.warn("ML service call failed or insufficient data:", err.message);
      }
    }

    if (!prediction) {
      const now = new Date(startDate);
      // Fallback logic
      prediction = {
        predictedStart: new Date(now.getTime() + (duration || 28) * 24 * 60 * 60 * 1000).toISOString(),
        ovulationWindow: {
          from: new Date(now.getTime() + ((duration || 28) / 2 - 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          to: new Date(now.getTime() + ((duration || 28) / 2 + 2) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        confidence: 0.75,
        anomaly: false
      };
    } else {
        // Ensure ovulationWindow exists if ML didn't return it
        if (!prediction.ovulationWindow) {
             const pStart = new Date(prediction.predictedStart);
             // Estimate ovulation ~14 days before next period
             const ovulationDate = new Date(pStart.getTime() - 14 * 24 * 60 * 60 * 1000);
             prediction.ovulationWindow = {
                 from: new Date(ovulationDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                 to: new Date(ovulationDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
             };
        }
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

module.exports = {
  createCycle,
  getCycles
};
