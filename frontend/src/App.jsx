import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";

/* Pages */
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import AppShell from "./pages/AppShell";
import Dashboard from "./pages/Dashboard";
import LogSymptoms from "./pages/LogSymptoms";
import AddCycle from "./pages/AddCycle";
import CycleHistory from "./pages/CycleHistory";
import Predictions from "./pages/Predictions";
import Insights from "./pages/Insights";
import Anomalies from "./pages/Anomalies";
import AIChat from "./pages/AIChat";
import ChatHistory from "./pages/ChatHistory";
import Reminders from "./pages/Reminders";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />

          {/* Protected Main Dashboard App Shell */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            {/* Nested Routes inside AppShell via <Outlet /> */}
            <Route index element={<Dashboard />} />
            <Route path="add-cycle" element={<AddCycle />} />
            <Route path="log" element={<LogSymptoms />} />
            <Route path="history" element={<CycleHistory />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="insights" element={<Insights />} />
            <Route path="anomalies" element={<Anomalies />} />
            <Route path="ai" element={<AIChat />} />
            <Route path="chat-history" element={<ChatHistory />} />
            <Route path="reminders" element={<Reminders />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
