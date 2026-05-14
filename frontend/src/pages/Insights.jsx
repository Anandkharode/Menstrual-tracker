import React from "react";

export default function Insights() {
  const cardStyle = { background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h1 className="text-[1.5rem] font-semibold mb-1" style={{ color: "#f0eaf8" }}>📈 Insights</h1>
      <p className="text-[13px] mb-6" style={{ color: "rgba(240,234,248,0.45)" }}>Analyze your cycle trends and patterns</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl p-6" style={cardStyle}>
          <h3 className="text-[14px] font-medium mb-4" style={{ color: "#f0eaf8" }}>Cycle Length Variation</h3>
          <div className="h-[200px] flex items-end justify-between gap-2 border-b pb-2 px-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {[28, 29, 27, 30, 28, 28].map((val, i) => (
              <div key={i} className="w-full bg-gradient-to-t from-[rgba(155,127,232,0.2)] to-[#9b7fe8] rounded-t-sm" style={{ height: `${(val / 35) * 100}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] mt-3" style={{ color: "rgba(240,234,248,0.3)" }}>
            <span>6 mos ago</span><span>Now</span>
          </div>
        </div>
        
        <div className="rounded-2xl p-6" style={cardStyle}>
          <h3 className="text-[14px] font-medium mb-4" style={{ color: "#f0eaf8" }}>Top Symptoms</h3>
          <div className="space-y-4 mt-2">
            {[
              { label: "Cramps", pct: 85, color: "#e8617a" },
              { label: "Headache", pct: 60, color: "#f4a261" },
              { label: "Fatigue", pct: 45, color: "#9b7fe8" }
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-[12px] mb-1.5" style={{ color: "rgba(240,234,248,0.6)" }}>
                  <span>{s.label}</span><span>{s.pct}% of cycles</span>
                </div>
                <div className="w-full bg-[rgba(255,255,255,0.04)] rounded-full h-1.5">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
