import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ChatAssistantPanel from "./ChatAssistantPanel";

const fabFloat = { animation: "haFabFloat 3.5s ease-in-out infinite" };
const fabPing  = { animation: "haFabPing  2.8s ease-out  infinite" };

export default function ChatbotWidget() {
  const [open, setOpen]           = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const location                  = useLocation();

  // Hide the entire widget when the user is already on the AI page
  const isAIPage = location.pathname === "/dashboard/ai";

  useEffect(() => {
    if (isAIPage) { setOpen(false); return; }
    const t = window.setTimeout(() => { if (!open) setShowBadge(true); }, 2500);
    return () => window.clearTimeout(t);
  }, [open, isAIPage]);

  if (isAIPage) return null;

  return (
    <>
      <style>{`
        @keyframes haFabFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes haFabPing {
          0%   { transform: scale(1);   opacity: .65; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes haFabSpin {
          0%   { transform: rotate(0deg)   scale(1); }
          50%  { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes lunaSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .luna-panel { animation: lunaSlideUp 0.28s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>

      <div style={{ position: "fixed", bottom: 30, right: 30, zIndex: 1001 }}>

        {/* ── FAB (closed state) ── */}
        {!open && (
          <>
            <div
              style={{
                position: "absolute", inset: -6, borderRadius: "50%",
                border: "1px solid rgba(155,127,232,.4)",
                pointerEvents: "none",
                ...fabPing,
              }}
            />
            <div style={{
              position: "absolute", inset: -10, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(155,127,232,.22),transparent 70%)",
              pointerEvents: "none",
            }} />

            <button
              type="button"
              onClick={() => { setOpen(true); setShowBadge(false); }}
              aria-label="Open health assistant"
              style={{
                position: "relative",
                width: 54, height: 54,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg,#e8617a,#9b7fe8)",
                color: "#fff",
                boxShadow: "0 8px 28px rgba(155,127,232,.45)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
                transition: "transform .2s",
                ...fabFloat,
              }}
            >
              <span style={{ animation: "haFabSpin 8s linear infinite" }}>✦</span>
            </button>

            {showBadge && (
              <div style={{
                position: "absolute", top: -2, right: -2,
                width: 16, height: 16, borderRadius: "50%",
                background: "#e8617a",
                border: "2px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "#fff",
              }}>1</div>
            )}
          </>
        )}

        {/* ── Chat panel (open state) ── */}
        {open && (
          <div
            className="luna-panel"
            style={{
              position: "absolute", bottom: 0, right: 0,
              width: 370,
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            <ChatAssistantPanel onClose={() => setOpen(false)} />
          </div>
        )}
      </div>
    </>
  );
}
