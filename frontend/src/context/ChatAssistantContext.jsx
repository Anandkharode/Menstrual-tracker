import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import api from "../api";

const ChatAssistantContext = createContext(null);

export const QUICK_SUGGESTIONS = [
  { label: "Cycle history", text: "Tell me about my cycle history" },
  { label: "Analyze symptoms", text: "Analyze my symptoms" },
  { label: "Mood patterns", text: "How has my mood changed?" },
  { label: "Health summary", text: "Summarize my health" },
];

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createMessage(sender, text, extra = {}) {
  return {
    id: createId(),
    sender,
    text,
    time: extra.time || formatTime(),
    ...extra,
  };
}

function getUserName() {
  return localStorage.getItem("name") || "User";
}

function getWelcomeMessage() {
  return createMessage(
    "bot",
    "Hi, I am your AI health assistant. Ask me about your cycle, symptoms, mood, pain, or predictions.",
    { time: "Just now" }
  );
}

export function ChatAssistantProvider({ children }) {
  const [messages, setMessages] = useState(() => [getWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const [grokActive, setGrokActive] = useState(false);

  const currentUserName = getUserName();
  const currentUserInitial =
    currentUserName.trim().charAt(0).toUpperCase() || "U";

  const sendMessage = useCallback(
    async (presetText) => {
      const text = (presetText ?? input).trim();
      if (!text || loading) return;

      setSuggestionsVisible(false);
      setMessages((prev) => [
        ...prev,
        createMessage("user", text, { time: "Just now" }),
      ]);
      setInput("");
      setLoading(true);

      try {
        const res = await api.chatMessage({ message: text });
        setGrokActive(res.meta?.grokUsed === true);
        setMessages((prev) => [
          ...prev,
          createMessage("bot", res.reply || "I could not generate a response.", {
            meta: res.meta,
          }),
        ]);
      } catch (err) {
        setGrokActive(false);
        setMessages((prev) => [
          ...prev,
          createMessage(
            "bot",
            "Sorry, I am unavailable right now. Please try again later."
          ),
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading]
  );

  const clearChat = useCallback(() => {
    setMessages([
      createMessage(
        "bot",
        `Chat cleared. How can I help you today, ${getUserName()}?`,
        { time: "Just now" }
      ),
    ]);
    setInput("");
    setSuggestionsVisible(true);
    setGrokActive(false);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      input,
      setInput,
      loading,
      suggestionsVisible,
      grokActive,
      currentUserName,
      currentUserInitial,
      sendMessage,
      clearChat,
    }),
    [
      messages,
      input,
      loading,
      suggestionsVisible,
      grokActive,
      currentUserName,
      currentUserInitial,
      sendMessage,
      clearChat,
    ]
  );

  return (
    <ChatAssistantContext.Provider value={value}>
      {children}
    </ChatAssistantContext.Provider>
  );
}

export function useChatAssistant() {
  const context = useContext(ChatAssistantContext);
  if (!context) {
    throw new Error("useChatAssistant must be used inside ChatAssistantProvider");
  }
  return context;
}
