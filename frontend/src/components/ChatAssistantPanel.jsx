import React, { useEffect, useRef } from "react";
import { QUICK_SUGGESTIONS, useChatAssistant } from "../context/ChatAssistantContext";

/* ─── CSS injected once ─── */
const STYLES = `
  @keyframes haTypingDot {
    0%, 60%, 100% { transform: translateY(0); opacity: .5; }
    30%            { transform: translateY(-5px); opacity: 1; }
  }
  @keyframes lunaSlideUp {
    from { opacity: 0; transform: translateY(18px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .ha-scroll::-webkit-scrollbar { width: 4px; }
  .ha-scroll::-webkit-scrollbar-thumb { background: #d8c8ed; border-radius: 4px; }
  .ha-typing-dot {
    width: 7px; height: 7px;
    border-radius: 999px;
    background: #c0a0d0;
    animation: haTypingDot 1.2s ease-in-out infinite;
  }
  .luna-chip {
    transition: all .15s ease;
    cursor: pointer;
  }
  .luna-chip:hover {
    background: #ede0ff !important;
    border-color: #b090d8 !important;
    color: #6040a0 !important;
    transform: translateY(-1px);
  }
  .luna-send:hover:not(:disabled) { transform: scale(1.07); }
  .luna-send { transition: transform .15s ease, opacity .15s ease; }
`;

/* ─── Markdown renderer ─── */
function inlineMarkdown(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIdx = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
    if (match[0].startsWith("**"))
      parts.push(<strong key={match.index} style={{ fontWeight: 700 }}>{match[2]}</strong>);
    else
      parts.push(<em key={match.index} style={{ fontStyle: "italic" }}>{match[3]}</em>);
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts.length > 0 ? parts : text;
}

function renderMarkdown(text) {
  if (!text) return null;
  const elements = [];
  let ki = 0;
  text.split("\n").forEach((line) => {
    if (!line.trim()) {
      elements.push(<div key={`sp-${ki++}`} style={{ height: 6 }} />);
      return;
    }
    const bullet = line.match(/^(\s*[-•*]\s+)(.*)/);
    if (bullet) {
      elements.push(
        <div key={`b-${ki++}`} style={{ display: "flex", gap: 6, marginBottom: 2 }}>
          <span style={{ color: "#9b7fe8", fontWeight: 700, flexShrink: 0 }}>•</span>
          <span>{inlineMarkdown(bullet[2])}</span>
        </div>
      );
      return;
    }
    const num = line.match(/^(\s*\d+\.\s+)(.*)/);
    if (num) {
      const n = line.match(/\d+/)[0];
      elements.push(
        <div key={`n-${ki++}`} style={{ display: "flex", gap: 6, marginBottom: 2 }}>
          <span style={{ color: "#9b7fe8", fontWeight: 700, minWidth: 18, flexShrink: 0 }}>{n}.</span>
          <span>{inlineMarkdown(num[2])}</span>
        </div>
      );
      return;
    }
    elements.push(<p key={`p-${ki++}`} style={{ margin: "0 0 4px 0" }}>{inlineMarkdown(line)}</p>);
  });
  return elements;
}

/* ─── Bubbles ─── */
function BotBubble({ message }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg,#e8617a,#9b7fe8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, color: "#fff",
        boxShadow: "0 2px 8px rgba(155,127,232,.28)",
      }}>AI</div>
      <div>
        <div style={{
          background: "#fff",
          border: "1px solid #f0e6f5",
          borderRadius: "4px 18px 18px 18px",
          padding: "11px 14px",
          fontSize: 13, lineHeight: 1.6, color: "#3d2a4a",
          boxShadow: "0 2px 10px rgba(0,0,0,.06)",
          maxWidth: 320,
        }}>
          {renderMarkdown(message.text)}
        </div>
        <div style={{ marginTop: 4, fontSize: 10, color: "#c0aad0", paddingLeft: 2 }}>
          {message.time}
        </div>
      </div>
    </div>
  );
}

function UserBubble({ message, userInitial }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: 10 }}>
      <div>
        <div style={{
          background: "linear-gradient(135deg,rgba(232,97,122,.13),rgba(155,127,232,.18))",
          border: "1px solid rgba(155,127,232,.22)",
          borderRadius: "18px 4px 18px 18px",
          padding: "11px 14px",
          fontSize: 13, lineHeight: 1.55, color: "#3d2a4a",
        }}>
          {message.text}
        </div>
        <div style={{ marginTop: 4, fontSize: 10, color: "#c0aad0", textAlign: "right", paddingRight: 2 }}>
          {message.time}
        </div>
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg,rgba(232,97,122,.22),rgba(155,127,232,.22))",
        border: "1.5px solid #d0b0e0",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: "#9b7fe8",
      }}>{userInitial}</div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg,#e8617a,#9b7fe8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, color: "#fff",
      }}>AI</div>
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        background: "#fff", border: "1px solid #f0e6f5",
        borderRadius: "4px 18px 18px 18px",
        padding: "12px 16px",
        boxShadow: "0 2px 8px rgba(0,0,0,.06)",
      }}>
        <span className="ha-typing-dot" />
        <span className="ha-typing-dot" style={{ animationDelay: ".2s" }} />
        <span className="ha-typing-dot" style={{ animationDelay: ".4s" }} />
      </div>
    </div>
  );
}

/* ─── Main Panel — shared by page & widget ─── */
export default function ChatAssistantPanel({ onClose, pageMode = false }) {
  const {
    messages, input, setInput, loading,
    suggestionsVisible, grokActive,
    currentUserInitial, sendMessage, clearChat,
  } = useChatAssistant();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      <div style={{
        display: "flex", flexDirection: "column",
        width: "100%", height: "100%",
        background: "#fff",
        borderRadius: pageMode ? 24 : 24,
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: pageMode
          ? "0 24px 80px rgba(155,127,232,.18)"
          : "0 24px 70px rgba(0,0,0,.22), 0 4px 16px rgba(155,127,232,.18)",
      }}>

        {/* ── Header ── */}
        <div style={{
          background: "linear-gradient(135deg,#e8617a,#9b7fe8)",
          padding: "18px 18px 16px",
          display: "flex", alignItems: "center", gap: 12,
          position: "relative", overflow: "hidden",
          flexShrink: 0,
        }}>
          {/* decorative circles */}
          <div style={{
            position: "absolute", right: 60, top: -24,
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(255,255,255,.07)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: -10, bottom: -30,
            width: 100, height: 100, borderRadius: "50%",
            background: "rgba(255,255,255,.05)", pointerEvents: "none",
          }} />

          {/* Avatar */}
          <div style={{
            width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
            background: "rgba(255,255,255,.22)",
            border: "2px solid rgba(255,255,255,.42)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#fff",
          }}>AI</div>

          {/* Title */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
              Health Assistant AI
            </div>
            <div style={{ marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#a8f0b0" }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.85)" }}>
                {grokActive ? "Grok AI · Personalized" : "Online · Cycle-aware"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0, position: "relative" }}>
            <button
              onClick={clearChat}
              style={{
                height: 30, padding: "0 12px", borderRadius: 999,
                border: "none", cursor: "pointer",
                background: "rgba(255,255,255,.18)",
                color: "#fff", fontSize: 11, fontWeight: 600,
              }}
            >Clear</button>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  width: 30, height: 30, borderRadius: "50%",
                  border: "none", cursor: "pointer",
                  background: "rgba(255,255,255,.18)",
                  color: "#fff", fontSize: 18, lineHeight: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >×</button>
            )}
          </div>
        </div>

        {/* ── Sub-header ── */}
        <div style={{
          display: "flex", alignItems: "center",
          padding: "8px 18px",
          background: "#fdf4f6",
          borderBottom: "1px solid #f0e6f0",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 11.5, color: "#a070b0" }}>✦ Powered by Grok AI</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#c090c0" }}>
            Personalized · Safe · Supportive
          </span>
        </div>

        {/* ── Messages ── */}
        <div
          className="ha-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 16px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "#fafafa",
          }}
        >
          {messages.map((msg) =>
            msg.sender === "bot"
              ? <BotBubble key={msg.id} message={msg} />
              : <UserBubble key={msg.id} message={msg} userInitial={currentUserInitial} />
          )}
          {loading && <TypingIndicator />}
          <div ref={endRef} />
        </div>

        {/* ── Quick suggestions ── */}
        {suggestionsVisible && (
          <div style={{
            padding: "10px 14px",
            borderTop: "1px solid #f0eaf5",
            background: "#fff",
            display: "flex",
            flexWrap: "wrap",
            gap: 7,
            flexShrink: 0,
          }}>
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.text)}
                className="luna-chip"
                style={{
                  padding: "5px 13px",
                  borderRadius: 20,
                  border: "1px solid #e0d0f0",
                  background: "#f5eeff",
                  color: "#8060b0",
                  fontSize: 11,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >{s.label}</button>
            ))}
          </div>
        )}

        {/* ── Input ── */}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: 9,
          padding: "12px 14px",
          background: "#fff",
          flexShrink: 0,
        }}>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
            placeholder="Ask anything about your cycle..."
            style={{
              flex: 1,
              resize: "none",
              borderRadius: 18,
              border: "1.5px solid #e8dff0",
              background: "#fdf8ff",
              padding: "10px 15px",
              fontSize: 13,
              lineHeight: 1.4,
              color: "#3d2a4a",
              outline: "none",
              fontFamily: "'DM Sans', sans-serif",
              minHeight: 40,
              maxHeight: 110,
              transition: "border-color .2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#9b7fe8")}
            onBlur={(e) => (e.target.style.borderColor = "#e8dff0")}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="luna-send"
            style={{
              width: 42, height: 42, borderRadius: "50%",
              border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#e8617a,#9b7fe8)",
              color: "#fff", fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(155,127,232,.38)",
              opacity: loading || !input.trim() ? 0.5 : 1,
              flexShrink: 0,
            }}
            aria-label="Send"
          >↑</button>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "8px 16px 12px",
          background: "#fff",
          borderTop: "1px solid #f5f0fa",
          fontSize: 10,
          color: "#c0aad0",
          textAlign: "center",
          lineHeight: 1.5,
          flexShrink: 0,
        }}>
          Health guidance only, not medical diagnosis · Always consult a doctor for medical advice
        </div>
      </div>
    </>
  );
}
