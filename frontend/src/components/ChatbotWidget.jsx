import React, { useState, useEffect, useRef } from "react";
import api from "../api";

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your Health Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.chatMessage({ message: input });
      setMessages((prev) => [...prev, { sender: "bot", text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, I'm unavailable right now. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition transform flex items-center justify-center"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="absolute bottom-0 right-0 w-96 h-screen max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Health Assistant</h3>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-rose-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask anything..."
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition disabled:bg-gray-100"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`w-10 h-10 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full flex items-center justify-center transition hover:scale-105 ${
                  loading || !input.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">Powered by Health Assistant AI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
