import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatbotWidget from "../components/ChatbotWidget";
import OnboardingModal from "../components/OnboardingModal";
import api from "../api";

export default function AppShell() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await api.getProfile();
        if (!profile.onboardingCompleted) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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

      {/* Onboarding Modal */}
      {!loading && showOnboarding && (
        <OnboardingModal onComplete={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}
