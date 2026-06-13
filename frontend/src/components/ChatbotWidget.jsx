import React, { useEffect, useRef, useState } from "react";
import api from "../api";

// ── Quick suggestion chips (match Grok-capable personalized queries) ──────────
const QUICK_SUGGESTIONS = [
  { label: "😴 Tired?",      text: "Why am I feeling so tired before my period?" },
  { label: "🍽️ What to eat?", text: "What should I eat to help with my cramps?" },
  { label: "📅 Next period?", text: "When is my next period expected?" },
  { label: "🌸 Ovulation?",   text: "When am I ovulating this cycle?" },
  { label: "🔄 Regular?",    text: "Is my cycle regular or irregular?" },
  { label: "😔 Mood?",       text: "Why do I get mood swings before my period?" },
];

const PANEL_STYLES = {
  boxShadow: "0 20px 60px rgba(0,0,0,.18), 0 4px 16px rgba(155,127,232,.15)",
};

const fabPing  = { animation: "haFabPing 2.8s ease-out infinite" };
const fabFloat = { animation: "haFabFloat 3.5s ease-in-out infinite" };

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Lightweight markdown renderer (no extra dependency) ────────────────────────
// Supports: **bold**, *italic*, bullet lists (- / •), numbered lists, line breaks
function renderMarkdown(text) {
  if (!text) return null;

  // Split into lines first
  const lines = text.split("\n");
  const elements = [];
  let keyIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip empty lines as spacers
    if (line.trim() === "") {
      elements.push(<div key={`sp-${keyIndex++}`} style={{ height: "6px" }} />);
      continue;
    }

    // Detect bullet point (- item or • item)
    const bulletMatch = line.match(/^(\s*[-•*]\s+)(.*)/);
    if (bulletMatch) {
      elements.push(
        <div key={`b-${keyIndex++}`} style={{ display: "flex", gap: "6px", marginBottom: "2px" }}>
          <span style={{ color: "#9b7fe8", fontWeight: 700, flexShrink: 0 }}>•</span>
          <span>{inlineMarkdown(bulletMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Detect numbered list (1. item)
    const numMatch = line.match(/^(\s*\d+\.\s+)(.*)/);
    if (numMatch) {
      const num = line.match(/\d+/)[0];
      elements.push(
        <div key={`n-${keyIndex++}`} style={{ display: "flex", gap: "6px", marginBottom: "2px" }}>
          <span style={{ color: "#9b7fe8", fontWeight: 700, minWidth: "18px", flexShrink: 0 }}>{num}.</span>
          <span>{inlineMarkdown(numMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Normal paragraph line
    elements.push(
      <p key={`p-${keyIndex++}`} style={{ margin: "0 0 4px 0" }}>
        {inlineMarkdown(line)}
      </p>
    );
  }

  return elements;
}

// Process inline markdown within a text string
function inlineMarkdown(text) {
  // We'll split by **bold**, *italic*, and return React nodes
  const parts = [];
  // Regex: **bold** | *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before the match
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }

    if (match[0].startsWith("**")) {
      // Bold
      parts.push(<strong key={match.index} style={{ fontWeight: 700, color: "#3d2a4a" }}>{match[2]}</strong>);
    } else {
      // Italic
      parts.push(<em key={match.index} style={{ fontStyle: "italic" }}>{match[3]}</em>);
    }

    lastIdx = match.index + match[0].length;
  }

  // Remaining text
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return parts.length > 0 ? parts : text;
}

// ── Message bubble component ────────────────────────────────────────────────────
function BotMessage({ message }) {
  return (
    <div className="flex items-start gap-[9px]">
      <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e8617a,#9b7fe8)] text-[12px] font-semibold text-white shadow-[0_2px_8px_rgba(155,127,232,.25)]">
        AI
      </div>
      <div>
        <div className="rounded-[4px_16px_16px_16px] border border-[#f0e6f5] bg-white px-[13px] py-[10px] text-[13px] leading-[1.6] text-[#3d2a4a] shadow-[0_2px_8px_rgba(0,0,0,.06)]">
          {renderMarkdown(message.text)}
        </div>
        <div className="mt-1 px-0.5 text-[10px] text-[#c0aad0]">{message.time}</div>
      </div>
    </div>
  );
}

function UserMessage({ message, userInitial }) {
  return (
    <div className="flex items-start justify-end gap-[9px]">
      <div className="flex-1">
        <div className="flex flex-col items-end">
          <div className="rounded-[16px_4px_16px_16px] border border-[rgba(155,127,232,.2)] bg-[linear-gradient(135deg,rgba(232,97,122,.12),rgba(155,127,232,.15))] px-[13px] py-[10px] text-[13px] leading-[1.55] text-[#3d2a4a]">
            {message.text}
          </div>
          <div className="mt-1 px-0.5 text-right text-[10px] text-[#c0aad0]">
            {message.time}
          </div>
        </div>
      </div>
      <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#d0b0e0] bg-[linear-gradient(135deg,rgba(232,97,122,.2),rgba(155,127,232,.2))] text-[13px] font-semibold text-[#9b7fe8]">
        {userInitial}
      </div>
    </div>
  );
}

// ── Main ChatbotWidget ─────────────────────────────────────────────────────────
export default function ChatbotWidget() {
  const [open, setOpen]                     = useState(false);
  const [loading, setLoading]               = useState(false);
  const [input, setInput]                   = useState("");
  const [showBadge, setShowBadge]           = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const [grokActive, setGrokActive]         = useState(false); // tracks if last reply used Grok
  const [messages, setMessages]             = useState([
    {
      id: crypto.randomUUID(),
      sender: "bot",
      text: "Hi! I'm your **Health Assistant AI** 💗\n\nI can answer questions based on your cycle history, symptoms, mood patterns, and AI predictions. Try asking me anything!",
      time: "Just now",
    },
  ]);
  const messagesEndRef = useRef(null);

  const currentUserName    = localStorage.getItem("name") || "User";
  const currentUserInitial = currentUserName.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!open) setShowBadge(true);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [open]);

  const sendMessage = async (presetText) => {
    const text = (presetText ?? input).trim();
    if (!text || loading) return;

    setSuggestionsVisible(false);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "user", text, time: "Just now" },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chatMessage({ message: text });

      // Track whether Grok AI or template fallback was used
      setGrokActive(res.meta?.grokUsed === true);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: res.reply,
          time: formatTime(),
          meta: res.meta,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: "Sorry, I'm unavailable right now. Please try again later.",
          time: formatTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setShowBadge(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: "bot",
        text: `Chat cleared! How can I help you today, **${currentUserName}**? 💗`,
        time: "Just now",
      },
    ]);
    setSuggestionsVisible(true);
    setGrokActive(false);
  };

  return (
    <>
      <style>{`
        @keyframes haFabFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes haFabPing {
          0% { transform: scale(1); opacity: .65; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes haFabSpin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes haTypingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: .5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes lunaSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ha-scroll::-webkit-scrollbar { width: 4px; }
        .ha-scroll::-webkit-scrollbar-thumb {
          background: #e0d0f0;
          border-radius: 4px;
        }
        .ha-typing-dot {
          width: 7px; height: 7px;
          border-radius: 999px;
          background: #c0a0d0;
          animation: haTypingDot 1.2s ease-in-out infinite;
        }
        .luna-panel {
          animation: lunaSlideUp 0.28s cubic-bezier(.34,1.56,.64,1) both;
        }
        .luna-chip:hover {
          background: #ede0ff !important;
          border-color: #c0a0e0 !important;
          color: #6040a0 !important;
          transform: translateY(-1px);
        }
        .luna-chip { transition: all .15s ease; }
      `}</style>

      <div className="fixed bottom-[30px] right-[30px] z-[1001]">
        {/* FAB button when closed */}
        {!open && (
          <>
            <div
              className="pointer-events-none absolute inset-[-6px] rounded-full border border-[rgba(155,127,232,.4)]"
              style={fabPing}
            />
            <div className="pointer-events-none absolute inset-[-10px] rounded-full bg-[radial-gradient(circle,rgba(155,127,232,.25),transparent_70%)]" />
            <button
              type="button"
              onClick={handleOpen}
              className="relative flex h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-full border-0 bg-[linear-gradient(135deg,#e8617a,#9b7fe8)] text-white shadow-[0_8px_28px_rgba(155,127,232,.45)] transition-transform duration-200 hover:scale-110"
              style={fabFloat}
              aria-label="Open health assistant"
            >
              <span
                className="text-[22px] text-white"
                style={{ animation: "haFabSpin 8s linear infinite" }}
              >
                ✦
              </span>
            </button>
            {showBadge && (
              <div className="absolute right-[-2px] top-[-2px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#e8617a] text-[9px] font-bold text-white">
                1
              </div>
            )}
          </>
        )}

        {/* Chat panel when open */}
        {open && (
          <div
            className="luna-panel absolute bottom-0 right-0 w-[370px] overflow-hidden rounded-[24px] bg-white"
            style={PANEL_STYLES}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 bg-[linear-gradient(135deg,#e8617a,#9b7fe8)] px-5 pb-4 pt-[18px]">
              <div className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full border-2 border-[rgba(255,255,255,.4)] bg-[rgba(255,255,255,.2)] text-sm font-semibold text-white">
                AI
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-white">Health Assistant AI</div>
                <div className="mt-0.5 flex items-center gap-[5px] text-[11px] text-[rgba(255,255,255,.85)]">
                  <div className="h-[7px] w-[7px] rounded-full bg-[#a8f0b0]" />
                  <span>
                    {grokActive ? "Grok AI · Personalized" : "Online · Cycle-aware"}
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={clearChat}
                  className="flex h-[30px] items-center justify-center rounded-full border-0 bg-[rgba(255,255,255,.15)] px-2.5 text-[11px] font-medium text-white transition hover:bg-[rgba(255,255,255,.22)]"
                  aria-label="Clear chat"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-0 bg-[rgba(255,255,255,.15)] text-[16px] text-white transition hover:bg-[rgba(255,255,255,.22)]"
                  aria-label="Close chat"
                >
                  ×
                </button>
              </div>
              <div className="pointer-events-none absolute right-10 top-[-20px] h-20 w-20 rounded-full bg-[rgba(255,255,255,.07)]" />
            </div>

            {/* AI status bar */}
            <div className="flex items-center gap-2 border-b border-[#f0e6f0] bg-[#fdf4f6] px-[18px] py-[9px]">
              <span className="text-[11.5px] text-[#a070b0]">
                ✦ Powered by Grok AI
              </span>
              <span className="ml-auto text-[11px] text-[#c090c0]">
                Personalized · Safe · Supportive
              </span>
            </div>

            {/* Messages */}
            <div className="ha-scroll flex h-[300px] flex-col gap-3 overflow-y-auto bg-[#fafafa] p-4">
              {messages.map((message) =>
                message.sender === "bot" ? (
                  <BotMessage key={message.id} message={message} />
                ) : (
                  <UserMessage key={message.id} message={message} userInitial={currentUserInitial} />
                )
              )}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start gap-[9px]">
                  <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e8617a,#9b7fe8)] text-[12px] font-semibold text-white shadow-[0_2px_8px_rgba(155,127,232,.25)]">
                    AI
                  </div>
                  <div className="flex items-center gap-1 rounded-[4px_16px_16px_16px] border border-[#f0e6f5] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,.06)]">
                    <span className="ha-typing-dot" />
                    <span className="ha-typing-dot" style={{ animationDelay: ".2s" }} />
                    <span className="ha-typing-dot" style={{ animationDelay: ".4s" }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestion chips */}
            {suggestionsVisible && (
              <div className="flex flex-wrap gap-1.5 border-t border-[#f0eaf5] bg-white px-[14px] py-[10px]">
                {QUICK_SUGGESTIONS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => sendMessage(item.text)}
                    className="luna-chip whitespace-nowrap rounded-[20px] border border-[#e0d0f0] bg-[#f5eeff] px-3 py-[5px] text-[11px] text-[#8060b0]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div className="flex items-end gap-[9px] bg-white px-[14px] pb-[14px] pt-3">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={loading}
                placeholder="Ask anything about your cycle…"
                className="min-h-10 flex-1 resize-none rounded-[14px] border-[1.5px] border-[#e8dff0] bg-[#fdf8ff] px-[14px] py-[10px] text-[13px] leading-[1.4] text-[#3d2a4a] outline-none transition focus:border-[#9b7fe8] disabled:cursor-not-allowed disabled:opacity-70"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-0 bg-[linear-gradient(135deg,#e8617a,#9b7fe8)] text-base text-white shadow-[0_4px_12px_rgba(155,127,232,.35)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                ↑
              </button>
            </div>

            {/* Footer */}
            <div className="border-t border-[#f5f0fa] bg-white px-4 pb-3 pt-2 text-center text-[10px] text-[#c0aad0]">
              Health guidance only, not medical diagnosis · Always consult a doctor for medical advice
            </div>
          </div>
        )}
      </div>
    </>
  );
}
