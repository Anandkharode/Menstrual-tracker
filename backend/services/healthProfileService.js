// backend/services/healthProfileService.js
/**
 * Health Profile Service
 * ──────────────────────
 * Computes a live, personalized HealthProfile for a given user by
 * aggregating data across User, CycleRecord, SymptomLog, and Prediction
 * collections.
 *
 * buildProfile(userId) → HealthProfile object (plain JS, not a Mongoose doc)
 *
 * The profile is built FRESH on every AI request so the chatbot always
 * has up-to-date information — there is no stale cache risk.
 */

const User       = require("../models/User");
const CycleRecord= require("../models/CycleRecord");
const SymptomLog = require("../models/SymptomLog");
const Prediction = require("../models/Prediction");

// How many recent records to consider for each metric
const MAX_CYCLES   = 12;
const MAX_SYMPTOMS = 30; // days' worth of logs

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Calculate age in years from a Date-of-birth. */
function calcAge(dob) {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

/**
 * Given an array of cycle durations, determine regularity.
 * A cycle is "Regular" if the standard deviation of lengths is ≤ 3 days.
 */
function calcRegularity(durations) {
  if (!durations || durations.length < 2) return "Unknown";
  const mean = durations.reduce((s, d) => s + d, 0) / durations.length;
  const variance =
    durations.reduce((s, d) => s + Math.pow(d - mean, 2), 0) / durations.length;
  const stdDev = Math.sqrt(variance);
  return stdDev <= 3 ? "Regular" : "Irregular";
}

/**
 * Count frequency of each item in an array, return top N by frequency.
 */
function topN(arr, n = 5) {
  if (!arr || arr.length === 0) return [];
  const freq = {};
  for (const item of arr) {
    if (item) freq[item] = (freq[item] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key]) => key);
}

/**
 * Derive health risk strings from ML anomaly data and cycle patterns.
 * Uses safe language — never claims diagnosis, only "possible indication".
 */
function deriveHealthRisks(anomalyDetected, averageCycleLength, cycleRegularity, averagePainLevel, prediction) {
  const risks = [];

  if (anomalyDetected) {
    risks.push("Possible hormonal imbalance (indicated by cycle anomaly detection)");
  }

  if (cycleRegularity === "Irregular") {
    risks.push("Possible ovulation irregularity due to irregular cycle patterns");
  }

  if (averageCycleLength !== null) {
    if (averageCycleLength < 21) {
      risks.push("Possible short cycle pattern — may be associated with hormonal variation");
    } else if (averageCycleLength > 35) {
      risks.push("Possible long cycle pattern — could be related to hormonal imbalance or anovulation");
    }
  }

  if (averagePainLevel !== null && averagePainLevel >= 7) {
    risks.push("High pain levels reported — consider consulting a healthcare professional about dysmenorrhea");
  }

  return risks;
}

// ─────────────────────────────────────────────────────────────────────────────
// buildProfile — main export
// ─────────────────────────────────────────────────────────────────────────────
async function buildProfile(userId) {
  try {
    // ── Fetch all data sources in parallel ────────────────────────────────────
    const [user, cycles, symptomLogs, latestPrediction] = await Promise.all([
      User.findById(userId).lean(),
      CycleRecord.find({ userId })
        .sort({ startDate: -1 })
        .limit(MAX_CYCLES)
        .lean(),
      SymptomLog.find({ userId })
        .sort({ date: -1 })
        .limit(MAX_SYMPTOMS)
        .lean(),
      Prediction.findOne({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    if (!user) return null;

    // ── Age ────────────────────────────────────────────────────────────────────
    const age = calcAge(user.dob);

    // ── Cycle stats ────────────────────────────────────────────────────────────
    const validDurations = cycles
      .map((c) => c.duration)
      .filter((d) => d && d > 0);

    const averageCycleLength =
      validDurations.length > 0
        ? Math.round(
            validDurations.reduce((s, d) => s + d, 0) / validDurations.length
          )
        : null;

    const cycleRegularity = calcRegularity(validDurations);

    // ── Symptom patterns ──────────────────────────────────────────────────────
    const allSymptoms = symptomLogs.flatMap((log) => log.symptoms || []);
    const allMoods    = symptomLogs.map((log) => log.mood).filter(Boolean);
    const allPainLevels = symptomLogs
      .map((log) => log.painLevel)
      .filter((p) => p != null && p >= 0);

    const commonSymptoms = topN(allSymptoms, 5);
    const dominantMood   = topN(allMoods, 1)[0] || null;
    const averagePainLevel =
      allPainLevels.length > 0
        ? Math.round(
            (allPainLevels.reduce((s, p) => s + p, 0) / allPainLevels.length) * 10
          ) / 10
        : null;

    // ── Prediction data ────────────────────────────────────────────────────────
    const anomalyDetected = latestPrediction?.anomaly === true;

    let predictedNextPeriod = latestPrediction?.predictedStart || null;
    let predictedOvulationDate = latestPrediction?.ovulationWindow?.from || null;

    // If no stored prediction but we have cycles, estimate from last cycle + avg
    if (!predictedNextPeriod && cycles.length > 0 && averageCycleLength) {
      const lastStart = new Date(cycles[0].startDate);
      predictedNextPeriod = new Date(
        lastStart.getTime() + averageCycleLength * 86_400_000
      );
    }

    // ── Health risk indicators ─────────────────────────────────────────────────
    const healthRisks = deriveHealthRisks(
      anomalyDetected,
      averageCycleLength,
      cycleRegularity,
      averagePainLevel,
      latestPrediction
    );

    // ── Compose & return profile ───────────────────────────────────────────────
    return {
      userId,
      name: user.name || "User",
      age,
      lifestyle: user.lifestyle || null,
      diet: user.diet || null,
      workout: user.workout || null,
      sleepHours: user.sleepHours || null,
      weight: user.weight || null,
      height: user.height || null,

      // Cycle
      totalCyclesLogged: cycles.length,
      averageCycleLength,
      cycleRegularity,

      // Symptoms & mood
      commonSymptoms,
      dominantMood,
      averagePainLevel,

      // Prediction
      latestPrediction: latestPrediction
        ? {
            predictedStart: latestPrediction.predictedStart,
            ovulationWindow: latestPrediction.ovulationWindow,
            confidence: latestPrediction.confidence,
            anomaly: latestPrediction.anomaly,
          }
        : null,
      predictedNextPeriod,
      predictedOvulationDate,

      // Risk
      healthRisks,
      anomalyDetected,

      // Most recent cycle for phase calculation
      lastCycleStart: cycles[0]?.startDate || null,
      lastCycleDuration: cycles[0]?.duration || null,
      lastFlowLevel: cycles[0]?.flowLevel || null,
    };
  } catch (err) {
    console.error("[healthProfileService.buildProfile]", err.message);
    return null;
  }
}

module.exports = { buildProfile };
