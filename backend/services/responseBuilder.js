// backend/services/responseBuilder.js
/**
 * Response Builder
 * ────────────────
 * Takes an intent + ML data and produces a personalized, natural-language reply.
 * All ML fields are optional — the builder degrades gracefully to helpful
 * static responses when data is unavailable.
 */

// ─── Utility helpers ─────────────────────────────────────────────────────────

function formatDate(isoString) {
  if (!isoString) return null;
  try {
    return new Date(isoString).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

function daysUntil(isoString) {
  if (!isoString) return null;
  try {
    const diff = Math.round(
      (new Date(isoString) - new Date()) / 86_400_000
    );
    return diff;
  } catch {
    return null;
  }
}

function anomalyRisk(details) {
  if (!details) return null;
  const prob = details.ensemble_probability ?? details.rf_probability;
  if (prob == null) return null;
  if (prob >= 0.75) return "high";
  if (prob >= 0.50) return "moderate";
  return "low";
}

function confidenceLabel(prob) {
  if (prob == null) return "";
  const pct = Math.round(prob * 100);
  if (pct >= 85) return `with high confidence (${pct}%)`;
  if (pct >= 65) return `with moderate confidence (${pct}%)`;
  return `with ${pct}% confidence`;
}

const EMOJI = {
  calendar: "📅",
  cycle: "🔄",
  alert: "⚠️",
  check: "✅",
  sparkle: "✨",
  ovulation: "🌸",
  symptom: "💊",
  sleep: "💤",
  help: "🤖",
  info: "ℹ️",
  heart: "💗",
};

// ─────────────────────────────────────────────────────────────────────────────
// buildReply
// intent   : string from intentEngine
// mlData   : object returned from mlService.predict() (may be null)
// dbPred   : latest Prediction document from MongoDB (may be null)
// cycles   : array of CycleRecord documents (may be empty)
// ─────────────────────────────────────────────────────────────────────────────
function buildReply({ intent, mlData, dbPred, cycles }) {
  switch (intent) {
    // ── NEXT PERIOD ──────────────────────────────────────────────────────────
    case "QUERY_NEXT_PERIOD": {
      // Prefer live ML over stored prediction
      const nextStart =
        mlData?.estimatedNextStart || dbPred?.predictedStart || null;
      const days = daysUntil(nextStart);
      const dateStr = formatDate(nextStart);
      const cycleLen = mlData?.nextCycleLengthDays;
      const confidence = dbPred?.confidence;

      if (!nextStart) {
        return (
          `${EMOJI.calendar} I don't have enough cycle data to predict your next period yet. ` +
          `Please log at least 3 cycles using the Cycle Form and I'll give you a personalised forecast! 💗`
        );
      }

      let reply = `${EMOJI.calendar} **Your next period is expected on ${dateStr}`;
      if (days != null) {
        if (days === 0) reply += ` — that's today!`;
        else if (days === 1) reply += ` — that's tomorrow!`;
        else if (days > 0) reply += ` (in ${days} day${days === 1 ? "" : "s"})`;
        else reply += ` (${Math.abs(days)} day${days === -1 ? "" : "s"} ago)`;
      }
      reply += ".**";

      if (cycleLen)
        reply += `\n\n${EMOJI.cycle} Your predicted cycle length is **${cycleLen} days**.`;

      if (confidence != null)
        reply += `\n${EMOJI.info} Prediction made ${confidenceLabel(confidence)}.`;

      if (mlData?.anomaly) {
        reply += `\n\n${EMOJI.alert} Your recent cycles show some **irregular patterns**. See the Anomaly section for details.`;
      }

      return reply;
    }

    // ── CYCLE LENGTH ─────────────────────────────────────────────────────────
    case "QUERY_CYCLE_LENGTH": {
      const cycleLen = mlData?.nextCycleLengthDays;

      if (!cycleLen) {
        // Fallback: compute average from stored cycles
        if (cycles && cycles.length >= 2) {
          const avg =
            cycles.reduce((s, c) => s + (c.duration || 28), 0) / cycles.length;
          return (
            `${EMOJI.cycle} Based on your logged cycles, your **average cycle length is ${Math.round(avg)} days**. ` +
            `Log more cycles for an AI-powered prediction!`
          );
        }
        return (
          `${EMOJI.info} A typical cycle is between 21–35 days, with 28 days being average. ` +
          `Log your cycles to get your personalised cycle length!`
        );
      }

      let reply =
        `${EMOJI.cycle} Your **predicted next cycle length is ${cycleLen} days**.`;

      const normal = cycleLen >= 21 && cycleLen <= 35;
      reply += normal
        ? `\n${EMOJI.check} That's within the **normal range** (21–35 days). Your cycle looks healthy!`
        : `\n${EMOJI.alert} That's **outside the typical range** (21–35 days). Consider discussing this with a healthcare professional.`;

      return reply;
    }

    // ── ANOMALY / NORMAL CYCLE ────────────────────────────────────────────────
    case "QUERY_ANOMALY": {
      const isAnomaly = mlData?.anomaly ?? dbPred?.anomaly;
      const details = mlData?.anomalyDetails;
      const risk = anomalyRisk(details);
      const ensembleProb = details?.ensemble_probability;
      const method = details?.method || "ML model";

      if (isAnomaly == null) {
        return (
          `${EMOJI.info} I don't have enough data to assess your cycle regularity yet. ` +
          `Log at least 3 cycles and I'll analyse patterns across your history using both LSTM and Random Forest models!`
        );
      }

      if (!isAnomaly) {
        let reply =
          `${EMOJI.check} **Your cycle appears normal** — no anomalies detected! `;
        if (ensembleProb != null)
          reply += `(anomaly probability: ${Math.round(ensembleProb * 100)}%)`;
        reply += `\n\nThis analysis combines predictions from our **LSTM** and **Random Forest** models for maximum reliability.`;
        return reply;
      }

      // Anomaly detected
      let reply = `${EMOJI.alert} **Anomaly detected in your cycle patterns.**\n\n`;

      if (risk === "high")
        reply += `The AI models flag a **high risk** of irregularity`;
      else if (risk === "moderate")
        reply += `The AI models flag a **moderate risk** of irregularity`;
      else
        reply += `The AI models detected a **mild irregularity**`;

      if (ensembleProb != null)
        reply += ` (ensemble probability: ${Math.round(ensembleProb * 100)}%, detected via ${method}).`;
      else
        reply += `.`;

      const lstmProb = details?.lstm_probability;
      const rfProb = details?.rf_probability;
      if (lstmProb != null && rfProb != null) {
        reply += `\n\n📊 **Model breakdown:**`;
        reply += `\n• LSTM: ${Math.round(lstmProb * 100)}%`;
        reply += `\n• Random Forest: ${Math.round(rfProb * 100)}%`;
      }

      reply +=
        `\n\n${EMOJI.heart} **I recommend:**\n` +
        `• Review your recent cycles in the Predictions panel\n` +
        `• Track additional symptoms (stress, sleep, diet)\n` +
        `• Consult a healthcare professional if you're concerned`;

      return reply;
    }

    // ── OVULATION ────────────────────────────────────────────────────────────
    case "QUERY_OVULATION": {
      const ovuDay = mlData?.ovulationDay;
      const nextStart =
        mlData?.estimatedNextStart || dbPred?.predictedStart || null;

      if (ovuDay && nextStart) {
        // Ovulation day is counted from start of the cycle
        // We calculate from the predicted next period backwards
        const nextDate = new Date(nextStart);
        const ovuDate = new Date(
          nextDate.getTime() - (28 - ovuDay) * 86_400_000
        );
        const formatted = formatDate(ovuDate.toISOString());
        const days = daysUntil(ovuDate.toISOString());

        let reply = `${EMOJI.ovulation} **Your estimated ovulation window is around ${formatted}**`;
        if (days != null) {
          if (days > 0) reply += ` (in ${days} days)`;
          else if (days < 0) reply += ` (${Math.abs(days)} days ago)`;
        }
        reply += `.`;
        reply +=
          `\n\n${EMOJI.info} Ovulation typically lasts 12–24 hours, but sperm can survive up to 5 days — so your fertile window extends a few days either side.`;
        return reply;
      }

      if (dbPred?.ovulationWindow?.from) {
        const from = formatDate(dbPred.ovulationWindow.from);
        const to = formatDate(dbPred.ovulationWindow.to);
        return (
          `${EMOJI.ovulation} Based on your saved prediction, your **fertile window is ${from} – ${to}**.` +
          `\n\n${EMOJI.info} Log more cycles for a more precise AI-computed estimate!`
        );
      }

      return (
        `${EMOJI.ovulation} Ovulation typically occurs around **day 14** of a 28-day cycle — roughly 14 days before your next expected period. ` +
        `Log your cycles for a personalised estimate!`
      );
    }

    // ── SYMPTOMS ─────────────────────────────────────────────────────────────
    case "QUERY_SYMPTOMS": {
      const symptom = mlData?.symptom;
      if (symptom && symptom !== "None") {
        return (
          `${EMOJI.symptom} Based on your cycle history, our AI model predicts you may experience **${symptom}** in your upcoming cycle.\n\n` +
          `${EMOJI.info} **Helpful tips:**\n` +
          `• For **cramps**: heat therapy, light exercise, ibuprofen if needed\n` +
          `• For **fatigue**: prioritise 7–8 hours of sleep and iron-rich foods\n` +
          `• For **mood swings**: regular exercise, mindfulness, omega-3 intake\n` +
          `• For **bloating**: reduce salt, increase water intake, light yoga\n` +
          `\nAlways consult a healthcare provider for persistent or severe symptoms.`
        );
      }
      return (
        `${EMOJI.symptom} Tracking your symptoms helps our AI give better predictions! ` +
        `Common symptoms include cramps, fatigue, headaches, mood swings, and bloating. ` +
        `Log them via the Cycle Form for personalised insights.`
      );
    }

    // ── PERIOD DURATION ───────────────────────────────────────────────────────
    case "QUERY_PERIOD_DURATION": {
      const periodLen = mlData?.periodLengthDays;
      if (periodLen) {
        const normal = periodLen >= 2 && periodLen <= 7;
        let reply = `${EMOJI.calendar} Your predicted **period duration is ${periodLen} days**.`;
        reply += normal
          ? `\n${EMOJI.check} That's **within the normal range** (2–7 days).`
          : `\n${EMOJI.alert} That's outside the typical range (2–7 days). Consider speaking with a doctor.`;
        return reply;
      }
      return (
        `${EMOJI.info} A typical period lasts **2–7 days**. ` +
        `Log your cycle details to get your personal prediction!`
      );
    }

    // ── GREETING ─────────────────────────────────────────────────────────────
    case "GREETING": {
      const hasCycles = cycles && cycles.length > 0;
      if (hasCycles) {
        return (
          `${EMOJI.heart} Hello! Welcome back to your AI Health Assistant. ` +
          `I can see you have ${cycles.length} cycle${cycles.length === 1 ? "" : "s"} logged. ` +
          `Ask me about your next period, cycle length, ovulation, or anomaly status!`
        );
      }
      return (
        `${EMOJI.heart} Hi there! I'm your AI Health Assistant powered by LSTM + Random Forest models. ` +
        `To get started, log your first cycle and I'll provide personalised predictions for you! ${EMOJI.sparkle}`
      );
    }

    // ── HELP ─────────────────────────────────────────────────────────────────
    case "QUERY_HELP": {
      return (
        `${EMOJI.help} **Here's what I can help you with:**\n\n` +
        `${EMOJI.calendar} **Period tracking** — "When is my next period?"\n` +
        `${EMOJI.cycle} **Cycle length** — "What is my cycle length?"\n` +
        `${EMOJI.ovulation} **Ovulation** — "When do I ovulate?"\n` +
        `${EMOJI.alert} **Anomaly detection** — "Is my cycle normal?"\n` +
        `${EMOJI.symptom} **Symptoms** — "What symptoms should I expect?"\n` +
        `${EMOJI.calendar} **Period duration** — "How long will my period last?"\n\n` +
        `My predictions use a combination of **LSTM neural networks** and **Random Forest** models for maximum accuracy. ${EMOJI.sparkle}`
      );
    }

    // ── UNKNOWN / FALLBACK ────────────────────────────────────────────────────
    default: {
      return (
        `${EMOJI.info} I'm not sure I understood that. Here are some things you can ask me:\n\n` +
        `• "When is my next period?"\n` +
        `• "Is my cycle normal?"\n` +
        `• "What is my cycle length?"\n` +
        `• "When do I ovulate?"\n` +
        `• "What symptoms should I expect?"\n\n` +
        `Type **help** for the full list of capabilities!`
      );
    }
  }
}

module.exports = { buildReply };
