import React, { useState, useEffect } from "react";
import api from "../api";

export default function ChatHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getChatHistory();
        setHistory(res?.data || res || []);
      } catch { /* empty */ } finally { setLoading(false); }
    })();
  }, []);

  const cardStyle = { background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="p-6 lg:p-8 max-w-[900px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <h1 className="text-[1.5rem] font-semibold mb-1" style={{ color: "#f0eaf8" }}>💬 Chat History</h1>
      <p className="text-[13px] mb-6" style={{ color: "rgba(240,234,248,0.45)" }}>Review your past conversations with the AI Health Assistant</p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#e8617a", borderTopColor: "transparent" }} />
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={cardStyle}>
          <div className="text-[3rem] mb-3">📭</div>
          <p className="text-[14px] font-medium mb-1" style={{ color: "rgba(240,234,248,0.6)" }}>No chat history yet</p>
          <p className="text-[12px]" style={{ color: "rgba(240,234,248,0.35)" }}>Start a conversation to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((chat, i) => (
            <div key={i} className="rounded-2xl p-5" style={cardStyle}>
              <div className="mb-3 border-b flex justify-between items-center pb-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="text-[12px] font-medium" style={{ color: "rgba(240,234,248,0.6)" }}>
                  {new Date(chat.createdAt || Date.now()).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}
                </span>
                <span className="text-[12px] font-medium" style={{ color: "rgba(240,234,248,0.9)", background: "rgba(155,127,232,0.15)", padding: "2px 8px", borderRadius: "8px" }}>
                  Message Pair
                </span>
              </div>
              <div className="space-y-3">
                {/* User Message */}
                <div className="flex justify-end gap-2.5">
                  <div className="rounded-xl px-4 py-2 text-[13px] leading-[1.65]" style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)", color: "#fff", borderTopRightRadius: "4px" }}>
                    {chat.message || chat.userText}
                  </div>
                </div>
                {/* Bot Message */}
                <div className="flex justify-start gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px]" style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}>🤖</div>
                  <div className="rounded-xl px-4 py-2 max-w-[85%] text-[13px] leading-[1.65]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(240,234,248,0.75)", borderTopLeftRadius: "4px" }}>
                    {chat.reply || chat.botReply}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
