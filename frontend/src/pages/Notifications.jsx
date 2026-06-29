import React, { useState, useEffect, useRef } from "react";
import { playNotificationPing, unlockAudio } from "../utils/sounds";

const initialNotifications = [
  {
    id: 1,
    type: "period",
    title: "Period Due in 3 Days",
    message: "Based on your cycle history, your next period is predicted to start on July 3rd.",
    time: "2 hours ago",
    read: false,
    icon: "🩸",
    color: "#e8617a",
  },
  {
    id: 2,
    type: "reminder",
    title: "Pill Reminder",
    message: "Don't forget to take your birth control pill today at 8:00 AM.",
    time: "5 hours ago",
    read: false,
    icon: "💊",
    color: "#9b7fe8",
  },
  {
    id: 3,
    type: "insight",
    title: "New Insight Available",
    message: "Your cycle has been consistently 28 days for the past 3 months. Great consistency!",
    time: "Yesterday",
    read: true,
    icon: "✨",
    color: "#4ecdc4",
  },
  {
    id: 4,
    type: "anomaly",
    title: "Cycle Anomaly Detected",
    message: "Your last cycle was 5 days shorter than usual. This could be due to stress or dietary changes.",
    time: "2 days ago",
    read: true,
    icon: "⚠️",
    color: "#f4a261",
  },
  {
    id: 5,
    type: "reminder",
    title: "Ovulation Window Approaching",
    message: "Your estimated ovulation window starts in 2 days. Stay hydrated and track any symptoms.",
    time: "3 days ago",
    read: true,
    icon: "🌸",
    color: "#e8617a",
  },
  {
    id: 6,
    type: "system",
    title: "Profile Updated",
    message: "Your health profile has been successfully updated with new cycle data.",
    time: "5 days ago",
    read: true,
    icon: "✅",
    color: "#4ecdc4",
  },
];

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "period", label: "Period" },
  { key: "reminder", label: "Reminders" },
  { key: "insight", label: "Insights" },
  { key: "anomaly", label: "Anomalies" },
];

const NOTIFICATION_PREFS = [
  { key: "period_alerts", label: "Period Alerts", desc: "Notify when period is approaching", icon: "🩸", enabled: true },
  { key: "pill_reminders", label: "Pill Reminders", desc: "Daily medication reminders", icon: "💊", enabled: true },
  { key: "ovulation", label: "Ovulation Alerts", desc: "Fertile window notifications", icon: "🌸", enabled: true },
  { key: "insights", label: "Health Insights", desc: "Weekly pattern summaries", icon: "✨", enabled: false },
  { key: "anomalies", label: "Anomaly Alerts", desc: "Unusual cycle pattern alerts", icon: "⚠️", enabled: true },
  { key: "system", label: "System Updates", desc: "App updates and account activity", icon: "🔔", enabled: false },
];

function NotificationItem({ notif, onRead, onDelete }) {
  return (
    <div
      className="rounded-2xl p-4 transition-all duration-200 cursor-pointer"
      style={{
        background: notif.read ? "#16111f" : "#1a1326",
        border: `1px solid ${notif.read ? "rgba(255,255,255,0.06)" : "rgba(155,127,232,0.2)"}`,
      }}
      onClick={() => onRead(notif.id)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${notif.color}18` }}
        >
          {notif.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="text-[14px] font-semibold"
                style={{ color: notif.read ? "rgba(240,234,248,0.75)" : "#f0eaf8" }}
              >
                {notif.title}
              </span>
              {!notif.read && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "#9b7fe8" }}
                />
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center border-none cursor-pointer flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(232,97,122,0.1)", color: "rgba(232,97,122,0.6)" }}
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "rgba(240,234,248,0.5)" }}>
            {notif.message}
          </p>
          <span className="text-[11px] mt-2 block" style={{ color: "rgba(240,234,248,0.3)" }}>
            {notif.time}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("all");
  const [prefs, setPrefs] = useState(NOTIFICATION_PREFS);
  const [showPrefs, setShowPrefs] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasPlayedRef = useRef(false);

  // Unlock audio and play ping once on mount if there are unread notifications
  useEffect(() => {
    unlockAudio();
    if (unreadCount > 0 && !hasPlayedRef.current) {
      const t = setTimeout(() => {
        playNotificationPing();
        hasPlayedRef.current = true;
      }, 600);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line

  const markRead = (id) => {
    const target = notifications.find((n) => n.id === id);
    // Ping only when opening an unread notification
    if (target && !target.read) playNotificationPing();
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotif = (id) =>
    setNotifications((ns) => ns.filter((n) => n.id !== id));

  const markAllRead = () =>
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  const togglePref = (key) =>
    setPrefs((ps) => ps.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p)));

  const filtered = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    return n.type === activeFilter;
  });

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[1.6rem] font-semibold" style={{ color: "#f0eaf8" }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span
                className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)", color: "#fff" }}
              >
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-[13px]" style={{ color: "rgba(240,234,248,0.45)" }}>
            Stay up to date with your cycle and health
          </p>
        </div>

        <div className="flex gap-2">
          {/* Preview ping */}
          <button
            onClick={playNotificationPing}
            title="Preview notification sound"
            className="w-9 h-9 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all"
            style={{ background: "rgba(232,97,122,0.1)", color: "#e8617a" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-3 py-2 rounded-xl text-[12px] font-medium border-none cursor-pointer transition-all"
              style={{ background: "rgba(155,127,232,0.12)", color: "#9b7fe8" }}
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowPrefs(!showPrefs)}
            className="w-9 h-9 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all"
            style={{
              background: showPrefs ? "rgba(155,127,232,0.15)" : "rgba(255,255,255,0.05)",
              color: showPrefs ? "#9b7fe8" : "rgba(240,234,248,0.5)",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Notification Preferences Panel */}
      {showPrefs && (
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h3 className="text-[14px] font-semibold mb-4" style={{ color: "#f0eaf8" }}>
            Notification Preferences
          </h3>
          <div className="space-y-3">
            {prefs.map((p) => (
              <div key={p.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <p className="text-[13px] font-medium" style={{ color: "#f0eaf8" }}>
                      {p.label}
                    </p>
                    <p className="text-[11px]" style={{ color: "rgba(240,234,248,0.4)" }}>
                      {p.desc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => togglePref(p.key)}
                  className="relative w-11 h-6 rounded-full transition-all duration-300 border-none cursor-pointer flex-shrink-0"
                  style={{
                    background: p.enabled
                      ? "linear-gradient(135deg, #9b7fe8, #e8617a)"
                      : "rgba(255,255,255,0.08)",
                  }}
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                    style={{ left: p.enabled ? "calc(100% - 20px)" : "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className="px-3.5 py-2 rounded-xl text-[12px] font-medium border-none cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: activeFilter === tab.key
                ? "linear-gradient(135deg, rgba(232,97,122,0.2), rgba(155,127,232,0.15))"
                : "rgba(255,255,255,0.04)",
              color: activeFilter === tab.key ? "#e8617a" : "rgba(240,234,248,0.45)",
              border: `1px solid ${activeFilter === tab.key ? "rgba(232,97,122,0.3)" : "transparent"}`,
            }}
          >
            {tab.label}
            {tab.key === "unread" && unreadCount > 0 && (
              <span
                className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full"
                style={{ background: "#e8617a", color: "#fff" }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-4xl mb-3">🔔</div>
          <p className="text-[15px] font-medium mb-1" style={{ color: "#f0eaf8" }}>
            No notifications
          </p>
          <p className="text-[13px]" style={{ color: "rgba(240,234,248,0.4)" }}>
            {activeFilter === "unread" ? "You're all caught up!" : "Nothing here yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filtered.map((n) => (
              <div key={n.id} className="group">
                <NotificationItem notif={n} onRead={markRead} onDelete={deleteNotif} />
              </div>
            ))}
          </div>

          {notifications.length > 0 && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={clearAll}
                className="px-4 py-2 rounded-xl text-[12px] border-none cursor-pointer transition-all"
                style={{ background: "rgba(232,97,122,0.08)", color: "rgba(232,97,122,0.65)" }}
              >
                Clear all notifications
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
