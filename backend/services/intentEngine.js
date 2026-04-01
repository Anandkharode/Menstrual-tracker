// backend/services/intentEngine.js
/**
 * Intent Recognition Engine
 * ──────────────────────────
 * Maps a user's natural language message to a structured intent.
 * Kept lightweight on purpose — no external NLP dependency required.
 *
 * Intent shape: { intent: string, confidence: number, slots: object }
 */

// ─── Intent catalogue ────────────────────────────────────────────────────────
const INTENT_PATTERNS = [
  // ── Period / next period ──────────────────────────────────────────────────
  {
    intent: "QUERY_NEXT_PERIOD",
    patterns: [
      /next\s+period/i,
      /when.*(period|menstruat|bleed)/i,
      /period.*date/i,
      /next\s+cycle/i,
      /start\s+date.*period/i,
    ],
  },
  // ── Cycle length ───────────────────────────────────────────────────────────
  {
    intent: "QUERY_CYCLE_LENGTH",
    patterns: [
      /cycle\s+length/i,
      /how\s+long.*cycle/i,
      /cycle.*how\s+long/i,
      /length.*cycle/i,
      /average.*cycle/i,
    ],
  },
  // ── Anomaly / irregular ───────────────────────────────────────────────────
  {
    intent: "QUERY_ANOMALY",
    patterns: [
      /anomal/i,
      /irregular/i,
      /is\s+(my|the)\s+cycle\s+normal/i,
      /normal.*cycle/i,
      /cycle.*normal/i,
      /unusual.*bleed/i,
      /health.*status/i,
      /concern/i,
    ],
  },
  // ── Ovulation ─────────────────────────────────────────────────────────────
  {
    intent: "QUERY_OVULATION",
    patterns: [
      /ovulat/i,
      /fertile/i,
      /fertility\s+window/i,
    ],
  },
  // ── Symptoms ──────────────────────────────────────────────────────────────
  {
    intent: "QUERY_SYMPTOMS",
    patterns: [
      /symptom/i,
      /cramp/i,
      /fatigue/i,
      /headach/i,
      /mood\s+swing/i,
      /bloat/i,
      /pain/i,
    ],
  },
  // ── Greeting ──────────────────────────────────────────────────────────────
  {
    intent: "GREETING",
    patterns: [
      /^h(i|ello|ey)\b/i,
      /good\s+(morning|afternoon|evening|night)/i,
      /^hey\b/i,
    ],
  },
  // ── Help / capabilities ───────────────────────────────────────────────────
  {
    intent: "QUERY_HELP",
    patterns: [
      /what\s+can\s+you\s+do/i,
      /help/i,
      /how\s+do\s+(i|you)/i,
      /capabilities/i,
    ],
  },
  // ── Period duration ───────────────────────────────────────────────────────
  {
    intent: "QUERY_PERIOD_DURATION",
    patterns: [
      /how\s+long.*period/i,
      /period.*how\s+long/i,
      /duration.*period/i,
      /period.*duration/i,
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// detectIntent
// Returns the best-matching intent from the catalogue.
// ─────────────────────────────────────────────────────────────────────────────
function detectIntent(message) {
  const text = (message || "").trim();

  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const re of patterns) {
      if (re.test(text)) {
        return { intent, confidence: 0.9 };
      }
    }
  }

  return { intent: "UNKNOWN", confidence: 0.0 };
}

module.exports = { detectIntent };
