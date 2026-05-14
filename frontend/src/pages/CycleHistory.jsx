import React, { useState, useEffect } from "react";
import api from "../api";

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function CycleHistory() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getCycles();
        setCycles(res?.data || []);
      } catch { /* empty */ } finally { setLoading(false); }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cycle?")) return;
    try {
      await api.deleteCycle(id);
      setCycles((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete cycle", err);
    }
  };

  const cardStyle = { background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h1 className="text-[1.5rem] font-semibold mb-1" style={{ color: "#f0eaf8" }}>📅 Cycle History</h1>
      <p className="text-[13px] mb-6" style={{ color: "rgba(240,234,248,0.45)" }}>View your past cycle records</p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#e8617a", borderTopColor: "transparent" }} />
        </div>
      ) : cycles.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={cardStyle}>
          <div className="text-[3rem] mb-3">📊</div>
          <p className="text-[14px] font-medium mb-1" style={{ color: "rgba(240,234,248,0.6)" }}>No cycles recorded yet</p>
          <p className="text-[12px]" style={{ color: "rgba(240,234,248,0.35)" }}>Start logging your cycles to see history here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cycles.map((c, i) => (
            <div key={i} className="rounded-2xl p-5 flex items-center justify-between" style={cardStyle}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[14px]"
                     style={{ background: "rgba(232,97,122,0.1)" }}>🩸</div>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "#f0eaf8" }}>{fmtDate(c.startDate)}</p>
                  <p className="text-[11px]" style={{ color: "rgba(240,234,248,0.4)" }}>{c.duration || "—"} days · {c.flow || "—"} flow</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[12px] px-3 py-1 rounded-full"
                     style={{ background: "rgba(155,127,232,0.1)", color: "#9b7fe8" }}>
                  Cycle {cycles.length - i}
                </div>
                <button 
                  onClick={() => handleDelete(c._id)}
                  className="w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer transition-all hover:bg-white/5"
                  style={{ color: "#e8617a", background: "transparent" }}
                  title="Delete Cycle"
                >
                  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
