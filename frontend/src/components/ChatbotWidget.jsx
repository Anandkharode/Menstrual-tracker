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
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.chatMessage({ message: input });
      setMessages(prev => [...prev, { sender: "bot", text: res.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "Sorry, I'm unavailable right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      {/* Chat Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={styles.toggleButton}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <svg style={styles.toggleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerContent}>
              <div style={styles.iconWrapper}>
                <svg style={styles.headerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 style={styles.headerTitle}>AI Health Assistant</h3>
                <p style={styles.headerSubtitle}>Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={styles.closeButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <svg style={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div style={styles.messagesArea}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: m.sender === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(m.sender === "user" ? styles.userBubble : styles.botBubble)
                  }}
                >
                  <p style={styles.messageText}>{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ ...styles.messageWrapper, justifyContent: "flex-start" }}>
                <div style={{ ...styles.messageBubble, ...styles.botBubble }}>
                  <div style={styles.typingIndicator}>
                    <div style={{ ...styles.dot, animationDelay: "0s" }}></div>
                    <div style={{ ...styles.dot, animationDelay: "0.2s" }}></div>
                    <div style={{ ...styles.dot, animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={styles.inputArea}>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading}
                style={{
                  ...styles.input,
                  backgroundColor: loading ? "#f3f4f6" : "white",
                  cursor: loading ? "not-allowed" : "text"
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  ...styles.sendButton,
                  opacity: (loading || !input.trim()) ? 0.5 : 1,
                  cursor: (loading || !input.trim()) ? "not-allowed" : "pointer"
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg style={styles.sendIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 1000
  },
  toggleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "64px",
    height: "64px",
    background: "linear-gradient(135deg, #db2777 0%, #e11d48 100%)",
    color: "white",
    borderRadius: "50%",
    border: "none",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    cursor: "pointer",
    transition: "all 0.3s",
    outline: "none"
  },
  toggleIcon: {
    width: "32px",
    height: "32px"
  },
  chatWindow: {
    width: "380px",
    height: "550px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },
  header: {
    background: "linear-gradient(135deg, #db2777 0%, #e11d48 100%)",
    color: "white",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerContent: {
    display: "flex",
    alignItems: "center"
  },
  iconWrapper: {
    width: "40px",
    height: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px"
  },
  headerIcon: {
    width: "24px",
    height: "24px"
  },
  headerTitle: {
    fontWeight: "600",
    fontSize: "18px",
    margin: 0
  },
  headerSubtitle: {
    fontSize: "12px",
    opacity: 0.8,
    margin: "2px 0 0 0"
  },
  closeButton: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    transition: "background-color 0.2s",
    color: "white",
    outline: "none"
  },
  closeIcon: {
    width: "20px",
    height: "20px"
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    backgroundColor: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  messageWrapper: {
    display: "flex"
  },
  messageBubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "16px",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  },
  userBubble: {
    background: "linear-gradient(135deg, #db2777 0%, #e11d48 100%)",
    color: "white",
    borderBottomRightRadius: "4px"
  },
  botBubble: {
    backgroundColor: "white",
    color: "#1f2937",
    border: "1px solid #e5e7eb",
    borderBottomLeftRadius: "4px"
  },
  messageText: {
    fontSize: "14px",
    lineHeight: "1.5",
    margin: 0
  },
  typingIndicator: {
    display: "flex",
    gap: "8px"
  },
  dot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#9ca3af",
    borderRadius: "50%",
    animation: "bounce 1s infinite"
  },
  inputArea: {
    padding: "16px",
    backgroundColor: "white",
    borderTop: "1px solid #e5e7eb"
  },
  inputWrapper: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px"
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "24px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit"
  },
  sendButton: {
    width: "48px",
    height: "48px",
    background: "linear-gradient(135deg, #db2777 0%, #e11d48 100%)",
    color: "white",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
    outline: "none"
  },
  sendIcon: {
    width: "20px",
    height: "20px"
  }
};

export default ChatbotWidget;