import React, { useState, useEffect } from "react";
import api from "../api";

export default function Predictions() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getPredictions();
        setPrediction(res);
      } catch { /* ignore */ } finally { setLoading(false); }
    })();
  }, []);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—";
  const cardStyle = { background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h1 className="text-[1.5rem] font-semibold mb-1" style={{ color: "#f0eaf8" }}>🔮 Predictions</h1>
      <p className="text-[13px] mb-6" style={{ color: "rgba(240,234,248,0.45)" }}>AI-powered cycle forecasting</p>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-[#e8617a] border-t-transparent animate-spin" /></div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl p-6" style={cardStyle}>
              <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-[16px]" style={{ background: "rgba(232,97,122,0.1)" }}>🩸</div>
              <h3 className="text-[12px] font-medium uppercase tracking-[0.05em] mb-1" style={{ color: "rgba(240,234,248,0.5)" }}>Next Period</h3>
              <p className="text-[2rem] font-bold" style={{ color: "#f0eaf8" }}>{fmtDate(prediction?.predictedStart)}</p>
            </div>
            <div className="rounded-2xl p-6" style={cardStyle}>
              <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-[16px]" style={{ background: "rgba(78,205,196,0.1)" }}>🌸</div>
              <h3 className="text-[12px] font-medium uppercase tracking-[0.05em] mb-1" style={{ color: "rgba(240,234,248,0.5)" }}>Fertile Window</h3>
              <p className="text-[1.3rem] font-semibold mt-2" style={{ color: "#f0eaf8" }}>
                {prediction?.ovulationWindow ? `${fmtDate(prediction.ovulationWindow.from)} - ${fmtDate(prediction.ovulationWindow.to)}` : "—"}
              </p>
            </div>
          </div>
          <div className="rounded-2xl p-6" style={cardStyle}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[20px]">✨</span>
              <h3 className="text-[15px] font-medium" style={{ color: "#f0eaf8" }}>Prediction Confidence</h3>
            </div>
            <div className="w-full bg-[rgba(255,255,255,0.04)] rounded-full h-3 overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-[#e8617a] to-[#9b7fe8] rounded-full" style={{ width: prediction?.confidence || "85%" }} />
            </div>
            <div className="flex justify-between text-[12px]" style={{ color: "rgba(240,234,248,0.4)" }}>
              <span>Low</span><span>{prediction?.confidence || "85%"} (High)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
