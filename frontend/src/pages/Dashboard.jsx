import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import AuthContext from "../context/AuthContext";

/* ── Helper ── */
const fmtDate = (v, opts) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", opts);
};

/* ── Cycle ring SVG ── */
function CycleRing({ day, total }) {
  const pct = total ? ((day || 0) / total) * 100 : 0;
  const r = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="90" cy="90" r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease", transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8617a" />
            <stop offset="100%" stopColor="#9b7fe8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-[2.2rem] font-bold" style={{ color: "#f0eaf8" }}>
          {day || "—"}
        </div>
        <div className="text-[11px]" style={{ color: "rgba(240,234,248,0.5)" }}>
          of {total || 28} days
        </div>
      </div>
    </div>
  );
}

/* ── Stats card ── */
function StatCard({ label, value, color, icon }) {
  return (
    <div
      className="rounded-2xl p-5 flex-1 min-w-[140px]"
      style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px]"
          style={{ background: `${color}18` }}
        >
          {icon}
        </div>
        <span className="text-[11px]" style={{ color: "rgba(240,234,248,0.45)" }}>
          {label}
        </span>
      </div>
      <div className="text-[1.4rem] font-semibold" style={{ color: "#f0eaf8" }}>
        {value}
      </div>
    </div>
  );
}

/* ── Calendar strip (7-day) ── */
function CalendarStrip() {
  const today = new Date();
  const days = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {days.map((d, i) => {
        const isToday = i === 3;
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-xl py-2.5 px-3 min-w-[52px] transition-all"
            style={{
              background: isToday
                ? "linear-gradient(135deg, #e8617a, #9b7fe8)"
                : "#16111f",
              border: isToday ? "none" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              className="text-[10px] font-medium mb-0.5"
              style={{ color: isToday ? "rgba(255,255,255,0.8)" : "rgba(240,234,248,0.35)" }}
            >
              {dayNames[d.getDay()]}
            </span>
            <span
              className="text-[16px] font-semibold"
              style={{ color: isToday ? "#fff" : "rgba(240,234,248,0.7)" }}
            >
              {d.getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Quick-log symptoms ── */
function QuickSymptoms({ onSave }) {
  const symptoms = [
    { emoji: "🤕", label: "Cramps" },
    { emoji: "😴", label: "Fatigue" },
    { emoji: "🤢", label: "Nausea" },
    { emoji: "😖", label: "Headache" },
    { emoji: "😢", label: "Mood swings" },
    { emoji: "🔥", label: "Bloating" },
  ];
  const [selected, setSelected] = useState([]);

  const toggle = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {symptoms.map((s) => (
          <button
            key={s.label}
            onClick={() => toggle(s.label)}
            className="flex items-center gap-1.5 px-3 py-[7px] rounded-full text-[12px] border-none cursor-pointer transition-all"
            style={{
              background: selected.includes(s.label)
                ? "linear-gradient(135deg, rgba(232,97,122,0.2), rgba(155,127,232,0.15))"
                : "rgba(255,255,255,0.04)",
              color: selected.includes(s.label) ? "#e8617a" : "rgba(240,234,248,0.55)",
              border: selected.includes(s.label)
                ? "1px solid rgba(232,97,122,0.3)"
                : "1px solid rgba(255,255,255,0.06)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span className="text-[14px]">{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => onSave(selected)}
        disabled={selected.length === 0}
        className="px-4 py-2 rounded-xl text-[12px] font-medium transition-all cursor-pointer border-none disabled:opacity-50"
        style={{ background: "rgba(255,255,255,0.1)", color: "#f0eaf8" }}
      >
        Log Symptoms for Today
      </button>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════ */
export default function Dashboard() {
  const { name } = useContext(AuthContext);
  const [prediction, setPrediction] = useState(null);
  const [latestCycle, setLatestCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupData, setPopupData] = useState(null); // stores { prediction, suggestion }

  useEffect(() => {
    (async () => {
      try {
        const [predRes, cyclesRes] = await Promise.all([
          api.getPredictions(),
          api.getCycles()
        ]);
        setPrediction(predRes);
        if (cyclesRes?.data?.length > 0) {
          setLatestCycle(cyclesRes.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cycleDay = latestCycle?.startDate 
    ? Math.max(1, Math.floor((new Date() - new Date(latestCycle.startDate)) / 86400000) + 1)
    : null;

  const handleSaveSymptoms = async (selectedSymptoms) => {
    try {
      // Create cycle record for today without duration, just symptoms
      const res = await api.postCycle({
        startDate: new Date().toISOString().split('T')[0],
        symptoms: selectedSymptoms.join(', '),
      });
      // Set prediction and generate a suggestion
      const pred = res.prediction;
      let suggestion = "Take some rest and stay hydrated.";
      if (pred?.anomaly) {
        suggestion = "Your cycle shows irregular patterns. Consider taking extra rest and consulting your healthcare provider if you feel unwell.";
      } else if (pred?.predictedStart) {
        suggestion = `Your next period is predicted around ${fmtDate(pred.predictedStart, { month: "short", day: "numeric" })}. Plan your days accordingly and take rest from past predictions.`;
      }

      setPopupData({ ...pred, suggestion });
    } catch (err) {
      console.error("Error saving symptoms:", err);
      alert("Failed to save symptoms.");
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[1.6rem] font-semibold mb-1" style={{ color: "#f0eaf8" }}>
          {greeting()}, {name || "User"} 👋
        </h1>
        <p className="text-[13px]" style={{ color: "rgba(240,234,248,0.45)" }}>
          Here's your health overview for today
        </p>
      </div>

      {/* Top Grid: Cycle Ring + Calendar + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Cycle Ring Card */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <CycleRing day={cycleDay} total={28} />
          <p className="text-[12px] mt-3" style={{ color: "rgba(240,234,248,0.5)" }}>
            Current cycle day
          </p>
        </div>

        {/* Calendar + Quick Log */}
        <div className="lg:col-span-2 space-y-5">
          {/* Calendar Strip */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium" style={{ color: "#f0eaf8" }}>
                📅 This Week
              </h3>
              <span className="text-[11px]" style={{ color: "rgba(240,234,248,0.35)" }}>
                {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
            <CalendarStrip />
          </div>

          {/* Quick Symptoms */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h3 className="text-[14px] font-medium mb-4" style={{ color: "#f0eaf8" }}>
              How are you feeling today?
            </h3>
            <QuickSymptoms onSave={handleSaveSymptoms} />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 mb-5 flex-wrap">
        <StatCard
          label="Next Period"
          value={loading ? "..." : fmtDate(prediction?.predictedStart, { month: "short", day: "numeric" })}
          color="#e8617a"
          icon="🩸"
        />
        <StatCard
          label="Est. Cycle Length"
          value={loading ? "..." : `28 days`}
          color="#9b7fe8"
          icon="📊"
        />
        <StatCard
          label="Ovulation"
          value={loading ? "..." : fmtDate(prediction?.ovulationWindow?.from, { month: "short", day: "numeric" })}
          color="#4ecdc4"
          icon="🌸"
        />
        <StatCard
          label="Confidence"
          value={loading ? "..." : prediction?.confidence || "N/A"}
          color="#f4a261"
          icon="✨"
        />
      </div>

      {/* Bottom Grid: Insights + AI Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Anomaly / Insight Card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-[14px] font-medium mb-4" style={{ color: "#f0eaf8" }}>
            🔍 Insights
          </h3>

          {prediction?.anomaly ? (
            <div
              className="rounded-xl p-4 flex items-start gap-3 mb-3"
              style={{ background: "rgba(232,97,122,0.08)", border: "1px solid rgba(232,97,122,0.2)" }}
            >
              <span className="text-[18px]">⚠️</span>
              <div>
                <p className="text-[13px] font-medium" style={{ color: "#e8617a" }}>
                  Cycle Anomaly Detected
                </p>
                <p className="text-[12px] mt-1" style={{ color: "rgba(240,234,248,0.5)" }}>
                  Your recent cycle shows irregular patterns. Consider consulting your healthcare provider.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-4 flex items-start gap-3 mb-3"
              style={{ background: "rgba(78,205,196,0.08)", border: "1px solid rgba(78,205,196,0.2)" }}
            >
              <span className="text-[18px]">✅</span>
              <div>
                <p className="text-[13px] font-medium" style={{ color: "#4ecdc4" }}>
                  All looks good!
                </p>
                <p className="text-[12px] mt-1" style={{ color: "rgba(240,234,248,0.5)" }}>
                  Your cycle is regular and within healthy parameters.
                </p>
              </div>
            </div>
          )}

          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ background: "rgba(155,127,232,0.08)", border: "1px solid rgba(155,127,232,0.2)" }}
          >
            <span className="text-[18px]">💡</span>
            <div>
              <p className="text-[13px] font-medium" style={{ color: "#9b7fe8" }}>
                Tip of the day
              </p>
              <p className="text-[12px] mt-1" style={{ color: "rgba(240,234,248,0.5)" }}>
                Staying hydrated during your period can help reduce bloating and cramps.
              </p>
            </div>
          </div>
        </div>

        {/* AI Chat Preview */}
        <div
          className="rounded-2xl p-6 flex flex-col"
          style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-[14px] font-medium mb-4" style={{ color: "#f0eaf8" }}>
            🤖 AI Health Assistant
          </h3>

          <div className="flex-1 space-y-3 mb-4">
            <div className="flex gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px]"
                style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
              >
                🤖
              </div>
              <div
                className="rounded-xl rounded-tl-none px-4 py-2.5 max-w-[85%] text-[13px] leading-[1.6]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "rgba(240,234,248,0.7)",
                }}
              >
                Hi {name || "there"}! 👋 I'm your AI health assistant. Ask me anything about your cycle, symptoms, or wellness tips!
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {["When is my next period?", "Am I ovulating?", "Health tips"].map((q) => (
              <button
                key={q}
                className="px-3 py-[6px] rounded-full text-[11px] border-none cursor-pointer transition-all
                           hover:-translate-y-px"
                style={{
                  background: "rgba(155,127,232,0.1)",
                  border: "1px solid rgba(155,127,232,0.2)",
                  color: "#9b7fe8",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestion Popup */}
      {popupData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            className="rounded-2xl p-6 max-w-[400px] w-full"
            style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[18px] font-semibold" style={{ color: "#f0eaf8" }}>✨ Personalized Suggestion</h3>
              <button 
                onClick={() => setPopupData(null)}
                className="bg-transparent border-none text-[16px] cursor-pointer"
                style={{ color: "rgba(240,234,248,0.5)" }}
              >
                ✕
              </button>
            </div>
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: "rgba(240,234,248,0.7)" }}>
              {popupData.suggestion}
            </p>
            {popupData.anomaly && (
               <div className="mb-4 rounded-xl p-3 flex items-start gap-2" style={{ background: "rgba(232,97,122,0.1)", border: "1px solid rgba(232,97,122,0.25)" }}>
                 <span className="text-[14px]">⚠️</span>
                 <span className="text-[12px] font-medium" style={{ color: "#e8617a" }}>Anomaly Detected in Pattern</span>
               </div>
            )}
            <button
              onClick={() => setPopupData(null)}
              className="w-full py-3 rounded-xl text-[13px] font-medium text-white border-none cursor-pointer"
              style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
