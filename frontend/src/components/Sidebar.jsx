import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

/* ── SVG icon components matching the HTML sidebar ── */
const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  log: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  history: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  predictions: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  insights: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  anomalies: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  reminders: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  notifications: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <circle cx="18" cy="4" r="3" fill="#e8617a" stroke="none" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  addCycle: (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="12" y1="14" x2="12" y2="18" />
      <line x1="10" y1="16" x2="14" y2="16" />
    </svg>
  ),
};

const NAV_SECTIONS = [
  {
    title: "Main",
    items: [
      { icon: "dashboard", label: "Dashboard", path: "/dashboard" },
      { icon: "addCycle", label: "Add Cycle", path: "/dashboard/add-cycle" },
      { icon: "log", label: "Log Symptoms", path: "/dashboard/log" },
      { icon: "history", label: "Cycle History", path: "/dashboard/history" },
      { icon: "predictions", label: "Predictions", path: "/dashboard/predictions" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { icon: "insights", label: "Insights", path: "/dashboard/insights" },
      { icon: "anomalies", label: "Anomalies", path: "/dashboard/anomalies" },
    ],
  },
  {
    title: "Tools",
    items: [
      { icon: "ai", label: "AI Assistant", path: "/dashboard/ai" },
      { icon: "history", label: "Chat History", path: "/dashboard/chat-history" },
      { icon: "reminders", label: "Reminders", path: "/dashboard/reminders" },
      { icon: "notifications", label: "Notifications", path: "/dashboard/notifications" },
      { icon: "settings", label: "Settings", path: "/dashboard/settings" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, setToken, setName } = useContext(AuthContext);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setToken(null);
    setName(null);
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <aside
        className="w-[220px] h-screen flex flex-col flex-shrink-0 border-r"
        style={{
          background: "#0d0a14",
          borderColor: "rgba(255,255,255,0.06)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-[22px] pt-6 pb-4">
          <div
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[15px]"
            style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
          >
            🌙
          </div>
          <span
            className="text-[16px] font-semibold"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(90deg, #e8617a, #9b7fe8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Health Assistant
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pt-3 space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.12em] px-[10px] mb-2"
                style={{ color: "rgba(240,234,248,0.35)" }}
              >
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-2.5 px-[10px] py-[9px] rounded-[10px] text-[13px]
                               transition-all duration-150 text-left border-none cursor-pointer
                               ${
                                 isActive(item.path)
                                   ? ""
                                   : "hover:bg-white/[0.04]"
                               }`}
                    style={{
                      background: isActive(item.path)
                        ? "linear-gradient(135deg, rgba(232,97,122,0.15), rgba(155,127,232,0.12))"
                        : "transparent",
                      color: isActive(item.path) ? "#e8617a" : "rgba(240,234,248,0.55)",
                      fontWeight: isActive(item.path) ? 500 : 400,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <span style={{ color: isActive(item.path) ? "#e8617a" : "rgba(240,234,248,0.4)" }}>
                      {icons[item.icon]}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div
          className="px-4 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-medium text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
            >
              {name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] font-medium truncate"
                style={{ color: "#f0eaf8" }}
              >
                {name || "User"}
              </p>
              <p className="text-[11px]" style={{ color: "rgba(240,234,248,0.35)" }}>
                Free plan
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-2.5 px-[10px] py-[8px] rounded-[10px] text-[13px]
                       transition-all duration-150 border-none cursor-pointer
                       hover:bg-[rgba(232,97,122,0.1)]"
            style={{
              background: "transparent",
              color: "rgba(240,234,248,0.45)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span style={{ color: "rgba(240,234,248,0.35)" }}>{icons.logout}</span>
            Log out
          </button>
        </div>
      </aside>

      {/* Logout Confirm Modal */}
      {showLogout && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" onClick={() => setShowLogout(false)}>
          <div
            className="rounded-2xl p-7 w-[340px] text-center"
            style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(232,97,122,0.12)" }}
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#e8617a" strokeWidth="1.8" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3 className="text-[18px] font-semibold mb-1" style={{ color: "#f0eaf8" }}>
              Log out?
            </h3>
            <p className="text-[13px] mb-6" style={{ color: "rgba(240,234,248,0.5)" }}>
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-[10px] rounded-xl text-[13px] font-medium border-none cursor-pointer transition-all"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(240,234,248,0.7)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-[10px] rounded-xl text-[13px] font-medium text-white border-none cursor-pointer transition-all"
                style={{ background: "linear-gradient(135deg, #e8617a, #d4506c)" }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
