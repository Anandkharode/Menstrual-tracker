// backend/services/mlService.js
/**
 * ML Microservice Client
 * ─────────────────────
 * Centralises all Axios calls to the Python Flask ML service (port 8000).
 * Provides: predict(), detectAnomaly(), healthCheck()
 * All functions return null (never throw) so chatbot logic degrades gracefully.
 */

const axios = require("axios");

const ML_BASE = process.env.ML_URL || "http://127.0.0.1:8000";
const TIMEOUT_MS = 10_000; // 10 s — ML inference can take a moment

const mlClient = axios.create({
  baseURL: ML_BASE,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

// ── logging ────────────────────────────────────────────────────────────────
function logWarn(fn, err) {
  console.warn(`[mlService.${fn}] ${err.message || err}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// buildCyclePayload
// Converts Mongoose CycleRecord documents → ML feature dicts.
// The ML model expects the 13 clinical/lifestyle features.
// Fields that aren't stored (lifestyle) are filled with medians.
// ─────────────────────────────────────────────────────────────────────────────
function buildCyclePayload(cycleRecords) {
  const FLOW_MAP = { light: 1.5, normal: 3.0, medium: 3.0, heavy: 5.0 };

  return cycleRecords.map((c, idx) => ({
    CycleNumber: idx + 1,
    LengthofCycle: c.duration || 28,
    LengthofMenses: c.mensesDuration || 5,
    LengthofLutealPhase: c.lutealPhase || Math.max(1, (c.duration || 28) - 14),
    TotalDaysofFertility: c.fertileDays || 6,
    MeanBleedingIntensity: FLOW_MAP[c.flowLevel] ?? 3.0,
    TotalMensesScore: (FLOW_MAP[c.flowLevel] ?? 3.0) * (c.mensesDuration || 5),
    UnusualBleeding: c.unusualBleeding ? 1 : 0,
    Age: c.age || 28,
    BMI: c.bmi || 23.0,
    stress_level: c.stressLevel || 5,
    sleep_hours: c.sleepHours || 7,
    diet_enc: c.dietEnc || 1,
    exercise_enc: c.exerciseEnc || 1,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// predict — Full LSTM + RF ensemble
// Returns enriched prediction object or null on failure.
// ─────────────────────────────────────────────────────────────────────────────
async function predict(cycleRecords) {
  if (!cycleRecords || cycleRecords.length === 0) return null;

  try {
    const payload = buildCyclePayload(cycleRecords);
    const { data } = await mlClient.post("/predict", { cycles: payload });

    // Validate we got the expected fields
    if (!data || typeof data.next_cycle_length_days === "undefined") {
      console.warn("[mlService.predict] Unexpected ML response shape:", data);
      return null;
    }

    return {
      nextCycleLengthDays: data.next_cycle_length_days,
      periodLengthDays: data.period_length_days,
      ovulationDay: data.ovulation_day,
      symptom: data.symptom || null,
      anomaly: data.anomaly === true,
      anomalyDetails: data.anomaly_details || null,
      // Derived: estimated start date of next period
      estimatedNextStart: _estimateNextStart(
        cycleRecords,
        data.next_cycle_length_days
      ),
    };
  } catch (err) {
    logWarn("predict", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// detectAnomaly — RF-only fast endpoint
// ─────────────────────────────────────────────────────────────────────────────
async function detectAnomaly(cycleRecords) {
  if (!cycleRecords || cycleRecords.length === 0) return null;

  try {
    const payload = buildCyclePayload(cycleRecords);
    const { data } = await mlClient.post("/anomaly/detect", { cycles: payload });
    return {
      anomaly: data.anomaly === true,
      probability: data.overall_rf_probability ?? null,
      perCycle: data.per_cycle || [],
      model: data.model || "RF",
    };
  } catch (err) {
    logWarn("detectAnomaly", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// healthCheck — probe the ML service
// ─────────────────────────────────────────────────────────────────────────────
async function healthCheck() {
  try {
    const { data } = await mlClient.get("/health", { timeout: 3000 });
    return data;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// _estimateNextStart — derive a calendar date from cycle records + prediction
// ─────────────────────────────────────────────────────────────────────────────
function _estimateNextStart(cycleRecords, nextCycleLengthDays) {
  try {
    // Use the start date of the most recent cycle record
    const sorted = [...cycleRecords].sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    );
    const lastStart = new Date(sorted[0].startDate);
    const days = Math.round(nextCycleLengthDays) || 28;
    const nextDate = new Date(lastStart.getTime() + days * 86_400_000);
    return nextDate.toISOString();
  } catch {
    return null;
  }
}

module.exports = { predict, detectAnomaly, healthCheck, buildCyclePayload };
