import React, { useState } from "react";
import api from "../api";

const FLOW_OPTIONS = [
  { value: "light", label: "Light", emoji: "💧", desc: "Spotting or very light" },
  { value: "medium", label: "Medium", emoji: "💧💧", desc: "Regular flow" },
  { value: "heavy", label: "Heavy", emoji: "💧💧💧", desc: "Heavy flow" },
];

const SYMPTOM_OPTIONS = [
  { emoji: "🤕", label: "Cramps" },
  { emoji: "😖", label: "Headache" },
  { emoji: "🤢", label: "Nausea" },
  { emoji: "🔥", label: "Bloating" },
  { emoji: "😴", label: "Fatigue" },
  { emoji: "🍫", label: "Cravings" },
];

export default function AddCycle() {
  const [form, setForm] = useState({
    startDate: "",
    duration: "",
    flow: "",
    symptoms: [],
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
      await api.postCycle({
        startDate: form.startDate,
        duration: form.duration,
        flow: form.flow,
        symptoms: form.symptoms.join(", "),
      });
      setStatus("success");
      setForm({ startDate: "", duration: "", flow: "", symptoms: [] });
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
        📅 Add cycle
      </h1>
      <p className="text-[13px] mb-6" style={{ color: "rgba(240,234,248,0.45)" }}>
        Record past cycles and allow the ML model to generate predictions.
      </p>

      {/* Toast */}
      {status === "success" && (
        <div className="mb-5 rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(78,205,196,0.1)", border: "1px solid rgba(78,205,196,0.25)" }}>
          <span className="text-[16px]">✅</span>
          <span className="text-[13px] font-medium" style={{ color: "#4ecdc4" }}>Cycle added successfully! Prediction Generated.</span>
        </div>
      )}
      {status === "error" && (
        <div className="mb-5 rounded-xl p-4 flex items-center gap-3" style={{ background: "rgba(232,97,122,0.1)", border: "1px solid rgba(232,97,122,0.25)" }}>
          <span className="text-[16px]">❌</span>
          <span className="text-[13px] font-medium" style={{ color: "#e8617a" }}>Failed to log. Please try again.</span>
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl p-5" style={cardStyle}>
            <label className="block text-[12px] font-medium mb-2" style={{ color: "rgba(240,234,248,0.55)" }}>Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl text-[13px] outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#f0eaf8" }}
            />
          </div>
          <div className="rounded-2xl p-5" style={cardStyle}>
            <label className="block text-[12px] font-medium mb-2" style={{ color: "rgba(240,234,248,0.55)" }}>Duration (days)</label>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              min="1" max="15" required placeholder="e.g., 5"
              className="w-full px-4 py-3 rounded-xl text-[13px] outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#f0eaf8" }}
            />
          </div>
        </div>

        <div className="rounded-2xl p-5" style={cardStyle}>
          <label className="block text-[12px] font-medium mb-3" style={{ color: "rgba(240,234,248,0.55)" }}>Flow Intensity</label>
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            {FLOW_OPTIONS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setForm({ ...form, flow: f.value })}
                className="flex-1 rounded-xl py-4 flex flex-col items-center cursor-pointer transition-all border-none min-w-[100px]"
                style={{
                  background: form.flow === f.value ? "linear-gradient(135deg, rgba(232,97,122,0.15), rgba(155,127,232,0.12))" : "rgba(255,255,255,0.03)",
                  border: form.flow === f.value ? "1px solid rgba(232,97,122,0.3)" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="text-[18px] mb-1">{f.emoji}</div>
                <div className="text-[12px] font-medium" style={{ color: form.flow === f.value ? "#e8617a" : "rgba(240,234,248,0.6)" }}>{f.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5" style={cardStyle}>
          <label className="block text-[12px] font-medium mb-3" style={{ color: "rgba(240,234,248,0.55)" }}>Any Symptoms During Cycle?</label>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl text-[14px] font-medium text-white border-none cursor-pointer transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
        >
          {loading ? "Adding..." : "💾 Add Cycle Record"}
        </button>
      </form>
    </div>
  );
}
