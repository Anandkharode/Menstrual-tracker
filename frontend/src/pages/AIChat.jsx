import React from "react";
import ChatAssistantPanel from "../components/ChatAssistantPanel";

export default function AIChat() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Full width layout for the AI page */}
      <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column" }}>
        <ChatAssistantPanel pageMode />
      </div>
    </div>
  );
}
