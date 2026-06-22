import React from "react";
import ChatAssistantPanel from "../components/ChatAssistantPanel";

export default function AIChat() {
  return (
    <div
      className="mx-auto flex h-full max-w-[900px] flex-col p-6 lg:p-8"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mb-5">
        <h1 className="mb-1 text-[1.5rem] font-semibold text-[#f0eaf8]">
          AI Health Assistant
        </h1>
        <p className="text-[13px] text-[#8f819d]">
          The same assistant you use from the floating chat.
        </p>
      </div>

      <ChatAssistantPanel variant="page" className="flex-1" />
    </div>
  );
}
