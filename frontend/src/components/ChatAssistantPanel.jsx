import React, { useEffect, useRef } from "react";
import { Bot, Send, Trash2, X } from "lucide-react";
import {
  QUICK_SUGGESTIONS,
  useChatAssistant,
} from "../context/ChatAssistantContext";

function inlineMarkdown(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }

    if (match[0].startsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-semibold text-[#f7efff]">
          {match[2]}
        </strong>
      );
    } else {
      parts.push(
        <em key={match.index} className="italic">
          {match[3]}
        </em>
      );
    }

    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return parts.length > 0 ? parts : text;
}

function renderMarkdown(text) {
  if (!text) return null;

  return text.split("\n").map((line, index) => {
    if (!line.trim()) {
      return <div key={`space-${index}`} className="h-1" />;
    }

    const bulletMatch = line.match(/^(\s*[-*]\s+)(.*)/);
    if (bulletMatch) {
      return (
        <div key={`bullet-${index}`} className="mb-1 flex gap-2">
          <span className="text-[#7dd3c7]">-</span>
          <span>{inlineMarkdown(bulletMatch[2])}</span>
        </div>
      );
    }

    const numberMatch = line.match(/^(\s*\d+\.\s+)(.*)/);
    if (numberMatch) {
      const number = line.match(/\d+/)?.[0];
      return (
        <div key={`number-${index}`} className="mb-1 flex gap-2">
          <span className="min-w-5 text-[#7dd3c7]">{number}.</span>
          <span>{inlineMarkdown(numberMatch[2])}</span>
        </div>
      );
    }

    return (
      <p key={`line-${index}`} className="mb-1 last:mb-0">
        {inlineMarkdown(line)}
      </p>
    );
  });
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#e8617a] text-white">
        <Bot size={15} />
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-2 w-2 rounded-full bg-[#7dd3c7]"
            style={{ animation: `bounceTyping 1s ${dot * 0.15}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, userInitial }) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#e8617a] text-white">
          <Bot size={15} />
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-lg px-4 py-3 text-[13px] leading-6 ${
            isUser
              ? "bg-[#e8617a] text-white"
              : "border border-white/10 bg-white/[0.05] text-[#e9deef]"
          }`}
        >
          {isUser ? message.text : renderMarkdown(message.text)}
        </div>
        <div
          className={`mt-1 px-1 text-[10px] text-[#8f819d] ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.time}
        </div>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[12px] font-semibold text-[#f0eaf8]">
          {userInitial}
        </div>
      )}
    </div>
  );
}

export default function ChatAssistantPanel({
  variant = "page",
  onClose,
  className = "",
}) {
  const {
    messages,
    input,
    setInput,
    loading,
    suggestionsVisible,
    grokActive,
    currentUserInitial,
    sendMessage,
    clearChat,
  } = useChatAssistant();

  const endRef = useRef(null);
  const isWidget = variant === "widget";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#16111f] shadow-[0_20px_60px_rgba(0,0,0,.25)] ${className}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#e8617a] text-white">
          <Bot size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold text-[#f0eaf8]">
            AI Health Assistant
          </h1>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#9acfc7]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7dd3c7]" />
            <span>{grokActive ? "Personalized response active" : "Ready"}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={clearChat}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-[#d8cce2] transition hover:bg-white/[0.08]"
          aria-label="Clear chat"
          title="Clear chat"
        >
          <Trash2 size={15} />
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-[#d8cce2] transition hover:bg-white/[0.08]"
            aria-label="Close assistant"
            title="Close assistant"
          >
            <X size={16} />
          </button>
        )}
      </header>

      <div
        className={`flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 ${
          isWidget ? "h-[320px]" : "min-h-[420px]"
        }`}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            userInitial={currentUserInitial}
          />
        ))}
        {loading && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {suggestionsVisible && (
        <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
          {QUICK_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => sendMessage(suggestion.text)}
              className="rounded-md border border-[#7dd3c7]/25 bg-[#7dd3c7]/10 px-3 py-1.5 text-[11px] font-medium text-[#9be3d9] transition hover:border-[#7dd3c7]/45 hover:bg-[#7dd3c7]/15"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-white/10 p-4">
        <div className="flex items-end gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            disabled={loading}
            placeholder="Ask about your cycle, symptoms, mood, or predictions"
            className="max-h-28 min-h-11 flex-1 resize-none rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-[13px] leading-5 text-[#f0eaf8] outline-none transition placeholder:text-[#8b7e96] focus:border-[#7dd3c7]/60 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border-0 bg-[#e8617a] text-white transition hover:bg-[#f07188] disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Send message"
            title="Send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
