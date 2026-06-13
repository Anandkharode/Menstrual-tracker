// backend/services/contextBuilder.js
/**
 * Context Builder
 * ───────────────
 * Converts a HealthProfile + recent chat history into a structured,
 * human-readable context string that is injected into the Grok system prompt.
 *
 * Design goals:
 *  • Keep it concise — no raw DB dumps
 *  • Always current — uses the freshly-built profile
 *  • Structured so the AI can parse sections clearly
 *  • Gracefully handles missing/null data fields
 */

// ─── Date formatting helpers ──────────────────────────────────────────────────

function fmtDate(val) {
  if (!val) return null;
  try {
    return new Date(val).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

function daysUntil(val) {
  if (!val) return null;
  try {
    return Math.round((new Date(val) - new Date()) / 86_400_000);
  } catch {
    return null;
  }
}

function daysAgo(val) {
  if (!val) return null;
  try {
    return Math.round((new Date() - new Date(val)) / 86_400_000);
  } catch {
    return null;
  }
}

/** Estimate which cycle phase the user is currently in. */
function estimateCyclePhase(lastCycleStart, averageCycleLength) {
  if (!lastCycleStart) return null;
  const dayOfCycle = daysAgo(lastCycleStart);
  if (dayOfCycle === null || dayOfCycle < 0) return null;

  const cycleLen = averageCycleLength || 28;

  if (dayOfCycle <= 5)                         return `Menstruation (Day ${dayOfCycle + 1})`;
  if (dayOfCycle <= 12)                        return `Follicular Phase (Day ${dayOfCycle + 1})`;
  if (dayOfCycle >= 12 && dayOfCycle <= 16)    return `Ovulation Phase (Day ${dayOfCycle + 1})`;
  if (dayOfCycle < cycleLen)                   return `Luteal Phase (Day ${dayOfCycle + 1})`;
  return `Late Luteal / Pre-period (Day ${dayOfCycle + 1})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// buildContext — main export
// profile     : object from healthProfileService.buildProfile()
// chatHistory : array of {message, response} ChatLog docs (last 5)
// userMessage : the current user's question (string)
// ─────────────────────────────────────────────────────────────────────────────
function buildContext(profile, chatHistory, userMessage) {
  const lines = [];

  // ── Section 1: User Health Profile ────────────────────────────────────────
  lines.push("=== USER HEALTH PROFILE ===");

  if (profile.name) lines.push(`Name: ${profile.name}`);
  if (profile.age)  lines.push(`Age: ${profile.age} years`);

  // Lifestyle
  const lifestyleDetails = [
    profile.lifestyle  ? `Lifestyle: ${profile.lifestyle}`    : null,
    profile.diet       ? `Diet: ${profile.diet}`              : null,
    profile.workout    ? `Exercise: ${profile.workout}`       : null,
    profile.sleepHours ? `Sleep: ${profile.sleepHours} hrs/night` : null,
  ].filter(Boolean);
  if (lifestyleDetails.length) lines.push(lifestyleDetails.join(" | "));

  // Cycle stats
  lines.push("");
  lines.push("--- Cycle Information ---");
  lines.push(`Total Cycles Logged: ${profile.totalCyclesLogged || 0}`);

  if (profile.averageCycleLength) {
    lines.push(`Average Cycle Length: ${profile.averageCycleLength} days`);
  } else {
    lines.push("Average Cycle Length: Not enough data");
  }

  lines.push(`Cycle Regularity: ${profile.cycleRegularity || "Unknown"}`);

  if (profile.lastCycleStart) {
    const phase = estimateCyclePhase(profile.lastCycleStart, profile.averageCycleLength);
    if (phase) lines.push(`Current Estimated Phase: ${phase}`);
    lines.push(`Last Period Started: ${fmtDate(profile.lastCycleStart)} (${daysAgo(profile.lastCycleStart)} days ago)`);
  }

  if (profile.lastFlowLevel) {
    lines.push(`Last Flow Level: ${profile.lastFlowLevel}`);
  }

  // Symptoms & mood
  lines.push("");
  lines.push("--- Symptoms & Mood ---");

  if (profile.commonSymptoms && profile.commonSymptoms.length > 0) {
    lines.push(`Common Symptoms: ${profile.commonSymptoms.join(", ")}`);
  } else {
    lines.push("Common Symptoms: None logged yet");
  }

  if (profile.dominantMood) {
    lines.push(`Dominant Mood: ${profile.dominantMood}`);
  }

  if (profile.averagePainLevel !== null) {
    lines.push(`Average Pain Level: ${profile.averagePainLevel}/10`);
  } else {
    lines.push("Average Pain Level: Not logged");
  }

  // Predictions
  lines.push("");
  lines.push("--- Predictions ---");

  if (profile.predictedNextPeriod) {
    const days = daysUntil(profile.predictedNextPeriod);
    const dateStr = fmtDate(profile.predictedNextPeriod);
    if (days !== null) {
      if (days < 0) {
        lines.push(`Next Period: Likely started ${Math.abs(days)} day(s) ago (${dateStr})`);
      } else if (days === 0) {
        lines.push(`Next Period: Expected TODAY (${dateStr})`);
      } else {
        lines.push(`Next Period: Expected in ${days} day(s) — ${dateStr}`);
      }
    } else {
      lines.push(`Next Period: ${dateStr}`);
    }
  } else {
    lines.push("Next Period: Not enough data to predict");
  }

  if (profile.predictedOvulationDate) {
    const days = daysUntil(profile.predictedOvulationDate);
    const dateStr = fmtDate(profile.predictedOvulationDate);
    if (days !== null && days > 0) {
      lines.push(`Predicted Ovulation: ${dateStr} (in ${days} days)`);
    } else if (days !== null && days < 0) {
      lines.push(`Predicted Ovulation: ${dateStr} (${Math.abs(days)} days ago)`);
    } else {
      lines.push(`Predicted Ovulation: ${dateStr}`);
    }
  }

  if (profile.latestPrediction?.confidence != null) {
    const pct = Math.round(profile.latestPrediction.confidence * 100);
    lines.push(`Prediction Confidence: ${pct}%`);
  }

  // Health risks
  lines.push("");
  lines.push("--- Health Risk Indicators ---");

  if (profile.healthRisks && profile.healthRisks.length > 0) {
    for (const risk of profile.healthRisks) {
      lines.push(`• ${risk}`);
    }
  } else {
    lines.push("• No significant health risks detected");
  }

  lines.push(`Anomaly Detected by ML: ${profile.anomalyDetected ? "Yes" : "No"}`);

  // ── Section 2: Recent Conversation ────────────────────────────────────────
  lines.push("");
  lines.push("=== RECENT CONVERSATION (last 5 messages) ===");

  if (chatHistory && chatHistory.length > 0) {
    for (const entry of chatHistory) {
      lines.push(`[User]: ${entry.message}`);
      // Truncate long bot responses to keep context concise
      const shortReply =
        entry.response.length > 200
          ? entry.response.slice(0, 200) + "..."
          : entry.response;
      lines.push(`[Assistant]: ${shortReply}`);
      lines.push("");
    }
  } else {
    lines.push("(No previous conversation — this is the first message)");
  }

  // ── Section 3: Current Question ───────────────────────────────────────────
  lines.push("=== CURRENT USER QUESTION ===");
  lines.push(userMessage);
  lines.push("");
  lines.push(
    "Use all of the above information to provide a highly personalized, " +
    "empathetic, and accurate health response. Always reference the user's " +
    "specific data when relevant. Never diagnose medical conditions."
  );

  return lines.join("\n");
}

module.exports = { buildContext };
