import React, { useState } from "react";
import api from "../api";

const FLOW_OPTIONS = [
  { value: "light", label: "Light", emoji: "💧", desc: "Spotting or very light" },
  { value: "medium", label: "Medium", emoji: "💧💧", desc: "Regular flow" },
  { value: "heavy", label: "Heavy", emoji: "💧💧💧", desc: "Heavy flow" },
];

const MOOD_OPTIONS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😤", label: "Irritable" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😌", label: "Calm" },
];

const SYMPTOM_OPTIONS = [
  { emoji: "🤕", label: "Cramps" },
  { emoji: "😖", label: "Headache" },
  { emoji: "🤢", label: "Nausea" },
  { emoji: "🔥", label: "Bloating" },
  { emoji: "😴", label: "Fatigue" },
  { emoji: "🍫", label: "Cravings" },
  { emoji: "💢", label: "Back pain" },
  { emoji: "😢", label: "Breast tenderness" },
  { emoji: "🌡️", label: "Hot flashes" },
  { emoji: "😵", label: "Dizziness" },
];

export default function LogSymptoms() {
  const [form, setForm] = useState({
    mood: "",
    symptoms: [],
    painLevel: 3,
    notes: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (label) => {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(label)
        ? prev.symptoms.filter((s) => s !== label)
        : [...prev.symptoms, label],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await api.postSymptoms({
        symptoms: form.symptoms,
        mood: form.mood,
        painLevel: form.painLevel,
        notes: form.notes
      });
      setStatus("success");
      setForm({ mood: "", symptoms: [], painLevel: 3, notes: "" });
      setTimeout(() => setStatus(""), 4000);
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: "#16111f",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  return (
    <div className="p-6 lg:p-8 max-w-[800px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h1 className="text-[1.5rem] font-semibold mb-1" style={{ color: "#f0eaf8" }}>
        📝 Log Daily Symptoms
      </h1>
      <p className="text-[13px] mb-6" style={{ color: "rgba(240,234,248,0.45)" }}>
        Record how you're feeling today
      </p>

      {/* Toast */}
      {status === "success" && (
        <div className="mb-5 rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(78,205,196,0.1)", border: "1px solid rgba(78,205,196,0.25)" }}>
          <span className="text-[16px]">✅</span>
          <span className="text-[13px] font-medium" style={{ color: "#4ecdc4" }}>Today's symptoms logged!</span>
        </div>
      )}
      {status === "error" && (
        <div className="mb-5 rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(232,97,122,0.1)", border: "1px solid rgba(232,97,122,0.25)" }}>
          <span className="text-[16px]">❌</span>
          <span className="text-[13px] font-medium" style={{ color: "#e8617a" }}>Failed to log. Please try again.</span>
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">

        {/* Mood */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <label className="block text-[12px] font-medium mb-3" style={{ color: "rgba(240,234,248,0.55)" }}>Mood</label>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setForm({ ...form, mood: m.label })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] cursor-pointer transition-all border-none"
                style={{
                  background: form.mood === m.label ? "linear-gradient(135deg, rgba(155,127,232,0.15), rgba(232,97,122,0.12))" : "rgba(255,255,255,0.04)",
                  border: form.mood === m.label ? "1px solid rgba(155,127,232,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  color: form.mood === m.label ? "#9b7fe8" : "rgba(240,234,248,0.55)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span className="text-[14px]">{m.emoji}</span>{m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <label className="block text-[12px] font-medium mb-3" style={{ color: "rgba(240,234,248,0.55)" }}>Symptoms</label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => toggleSymptom(s.label)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] cursor-pointer transition-all border-none"
                style={{
                  background: form.symptoms.includes(s.label) ? "linear-gradient(135deg, rgba(232,97,122,0.15), rgba(155,127,232,0.12))" : "rgba(255,255,255,0.04)",
                  border: form.symptoms.includes(s.label) ? "1px solid rgba(232,97,122,0.3)" : "1px solid rgba(255,255,255,0.06)",
                  color: form.symptoms.includes(s.label) ? "#e8617a" : "rgba(240,234,248,0.55)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span className="text-[14px]">{s.emoji}</span>{s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pain Level */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <label className="block text-[12px] font-medium mb-3" style={{ color: "rgba(240,234,248,0.55)" }}>
            Pain Level: <span style={{ color: "#e8617a" }}>{form.painLevel}/10</span>
          </label>
          <input
            type="range"
            min="0" max="10"
            value={form.painLevel}
            onChange={(e) => setForm({ ...form, painLevel: e.target.value })}
            className="w-full accent-[#e8617a]"
          />
        </div>

        {/* Notes */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <label className="block text-[12px] font-medium mb-2" style={{ color: "rgba(240,234,248,0.55)" }}>Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows="3"
            placeholder="Any additional notes..."
            className="w-full px-4 py-3 rounded-xl text-[13px] outline-none resize-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#f0eaf8" }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-[14px] font-medium text-white border-none cursor-pointer transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:opacity-90 hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg, #e8617a, #9b7fe8)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {loading ? "Saving..." : "💾 Save Log"}
        </button>
      </form>
    </div>
  );
}
