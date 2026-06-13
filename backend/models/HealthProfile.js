// backend/models/HealthProfile.js
/**
 * HealthProfile — Computed health snapshot per user.
 *
 * This is rebuilt fresh on every AI chat request to guarantee the chatbot
 * always uses the latest data. The schema exists so we can optionally cache
 * or expose it via an API endpoint in the future.
 *
 * Fields align exactly with the requirement spec:
 *   age, averageCycleLength, cycleRegularity, commonSymptoms,
 *   dominantMood, averagePainLevel, latestPrediction,
 *   predictedNextPeriod, predictedOvulationDate, healthRisks, anomalyDetected
 */

const mongoose = require("mongoose");

const HealthProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },

  // ── Demographics ────────────────────────────────────────────────────────────
  age: { type: Number, default: null },

  // ── Cycle stats (computed from CycleRecord history) ─────────────────────────
  averageCycleLength: { type: Number, default: null },
  cycleRegularity: {
    type: String,
    enum: ["Regular", "Irregular", "Unknown"],
    default: "Unknown",
  },

  // ── Symptom & mood patterns (from SymptomLog) ────────────────────────────────
  commonSymptoms: { type: [String], default: [] },
  dominantMood:   { type: String, default: null },
  averagePainLevel: { type: Number, default: null }, // 0–10

  // ── Latest ML prediction ─────────────────────────────────────────────────────
  latestPrediction: { type: mongoose.Schema.Types.Mixed, default: null },
  predictedNextPeriod:    { type: Date, default: null },
  predictedOvulationDate: { type: Date, default: null },

  // ── ML health risk indicators ────────────────────────────────────────────────
  healthRisks:     { type: [String], default: [] },
  anomalyDetected: { type: Boolean, default: false },

  // ── Cache metadata ───────────────────────────────────────────────────────────
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HealthProfile", HealthProfileSchema);
