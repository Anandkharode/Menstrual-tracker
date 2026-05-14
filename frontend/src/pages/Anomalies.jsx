import React, { useState, useEffect } from "react";
import api from "../api";

export default function Anomalies() {
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

  const cardStyle = { background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h1 className="text-[1.5rem] font-semibold mb-1" style={{ color: "#f0eaf8" }}>🚨 Anomalies</h1>
      <p className="text-[13px] mb-6" style={{ color: "rgba(240,234,248,0.45)" }}>Random Forest ML anomaly detection</p>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-[#e8617a] border-t-transparent animate-spin" /></div>
      ) : (
        <>
          <div className="rounded-2xl p-6 mb-5" style={{ 
            background: prediction?.anomaly ? "rgba(232,97,122,0.05)" : "rgba(78,205,196,0.05)", 
            border: prediction?.anomaly ? "1px solid rgba(232,97,122,0.2)" : "1px solid rgba(78,205,196,0.2)" 
          }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[20px] bg-[rgba(255,255,255,0.05)] mt-1">
                {prediction?.anomaly ? "⚠️" : "✅"}
              </div>
              <div>
                <h3 className="text-[15px] font-medium" style={{ color: prediction?.anomaly ? "#e8617a" : "#4ecdc4" }}>
                  {prediction?.anomaly ? "Anomaly Detected" : "Normal Cycle Pattern"}
                </h3>
                <p className="text-[13px] mt-1" style={{ color: "rgba(240,234,248,0.6)" }}>
                  {prediction?.anomaly 
                    ? "Your AI model indicates irregular patterns in your recent cycles. Consider consulting your healthcare provider."
                    : "Your AI model indicates that your recent cycles show a normal pattern with no significant anomalies detected."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={cardStyle}>
            <h3 className="text-[14px] font-medium mb-4" style={{ color: "#f0eaf8" }}>Scanned Metrics</h3>
            <div className="space-y-3">
              {[
                { label: "Cycle Length Variability", status: prediction?.anomaly ? "Irregular" : "Normal", color: prediction?.anomaly ? "#e8617a" : "#4ecdc4" },
                { label: "Flow Intensity Curve", status: "Analyzed", color: "#9b7fe8" }
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.02)]">
                  <span className="text-[13px]" style={{ color: "rgba(240,234,248,0.7)" }}>{m.label}</span>
                  <span className="text-[12px] px-2 py-0.5 rounded" style={{ color: m.color, background: `${m.color}22` }}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
