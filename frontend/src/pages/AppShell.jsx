import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatbotWidget from "../components/ChatbotWidget";

export default function AppShell() {
  return (
    <div className="flex h-screen" style={{ background: "#0d0a14" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto"
        style={{ background: "#0d0a14" }}
      >
        <Outlet />
      </main>

      {/* Floating Chatbot */}
      <ChatbotWidget />
    </div>
  );
}
