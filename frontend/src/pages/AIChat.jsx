import React, { useState, useEffect, useRef } from "react";
import api from "../api";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! 👋 I'm your AI Health Assistant. Ask me anything about your cycle, symptoms, or wellness." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.chatMessage({ message: input });
      setMessages((p) => [...p, { sender: "bot", text: res.reply }]);
    } catch {
      setMessages((p) => [...p, { sender: "bot", text: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "When is my next period?",
    "Am I in my fertile window?",
    "Any health tips for today?",
    "Why am I feeling tired?",
  ];

  const cardStyle = { background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col max-w-[900px] mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-[1.5rem] font-semibold mb-1" style={{ color: "#f0eaf8" }}>
          🤖 AI Health Assistant
        </h1>
        <p className="text-[13px]" style={{ color: "rgba(240,234,248,0.45)" }}>
          Your personal menstrual health advisor
        </p>
      </div>

      {/* Chat area */}
      <div className="flex-1 rounded-2xl flex flex-col overflow-hidden" style={cardStyle}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} gap-2.5`}>
              {msg.sender === "bot" && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px]"
                  style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
                >
                  🤖
                </div>
              )}
              <div
                className="rounded-xl px-4 py-2.5 max-w-[75%] text-[13px] leading-[1.65]"
                style={{
                  background: msg.sender === "user"
                    ? "linear-gradient(135deg, #e8617a, #9b7fe8)"
                    : "rgba(255,255,255,0.04)",
                  border: msg.sender === "user" ? "none" : "1px solid rgba(255,255,255,0.06)",
                  color: msg.sender === "user" ? "#fff" : "rgba(240,234,248,0.75)",
                  borderTopRightRadius: msg.sender === "user" ? "4px" : undefined,
                  borderTopLeftRadius: msg.sender === "bot" ? "4px" : undefined,
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px]"
                   style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}>🤖</div>
              <div className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: "rgba(240,234,248,0.3)", animation: `bounceTyping 1s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-5 pb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="px-3 py-[6px] rounded-full text-[11px] border-none cursor-pointer transition-all hover:-translate-y-px"
                style={{
                  background: "rgba(155,127,232,0.1)", border: "1px solid rgba(155,127,232,0.2)",
                  color: "#9b7fe8", fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex gap-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-[13px] outline-none transition-all disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#f0eaf8" }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all
                         disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" fill="none" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
