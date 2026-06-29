/**
 * sounds.js — Web Audio API sound generator
 * No external files required; all tones are synthesised in the browser.
 */

function getCtx() {
  if (!window._audioCtx) {
    window._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browsers auto-suspend until user interaction)
  if (window._audioCtx.state === "suspended") {
    window._audioCtx.resume();
  }
  return window._audioCtx;
}

/**
 * Play a single bell-like tone.
 * @param {AudioContext} ctx
 * @param {number} freq      - Frequency in Hz
 * @param {number} startTime - When to start (ctx.currentTime offset)
 * @param {number} duration  - Total duration in seconds
 * @param {number} gain      - Peak gain (0–1)
 */
function playBellTone(ctx, freq, startTime, duration = 0.9, gain = 0.28) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const masterGain = ctx.createGain();

  // Sine wave for fundamental + slight triangle harmonic for warmth
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);
  // Slight frequency drop (natural bell behaviour)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.995, startTime + duration);

  // Envelope: instant attack, long exponential decay (bell-like)
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  masterGain.gain.setValueAtTime(0.7, startTime);

  osc.connect(gainNode);
  gainNode.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

/**
 * 🔔 REMINDER CHIME
 * A soft 3-note ascending chime (C5 → E5 → G5).
 * Warm, calming — like a mindfulness meditation bell.
 */
export function playReminderChime() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      playBellTone(ctx, freq, now + i * 0.22, 1.1, 0.26);
    });
  } catch (e) {
    console.warn("Audio not available:", e);
  }
}

/**
 * 🔔 NOTIFICATION PING
 * A crisp two-tone soft ping (A5 → E5).
 * Clean, modern, unobtrusive.
 */
export function playNotificationPing() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // First tone — bright
    playBellTone(ctx, 880, now, 0.55, 0.22);         // A5
    // Second tone — slightly lower, gentle resolution
    playBellTone(ctx, 659.25, now + 0.18, 0.7, 0.16); // E5
  } catch (e) {
    console.warn("Audio not available:", e);
  }
}

/**
 * Helper: unlock AudioContext on the first user interaction.
 * Call once at app/component mount.
 */
export function unlockAudio() {
  try {
    getCtx();
  } catch (e) {
    /* ignore */
  }
}
