import React, { useState, useEffect } from "react";
import { playReminderChime, unlockAudio } from "../utils/sounds";

const REMINDER_TYPES = [
  { key: "period", label: "Period Start", icon: "🩸", color: "#e8617a" },
  { key: "pill", label: "Birth Control Pill", icon: "💊", color: "#9b7fe8" },
  { key: "water", label: "Hydration", icon: "💧", color: "#4ecdc4" },
  { key: "mood", label: "Mood Check-in", icon: "😊", color: "#f4a261" },
  { key: "ovulation", label: "Ovulation Window", icon: "🌸", color: "#e8617a" },
  { key: "custom", label: "Custom", icon: "⭐", color: "#9b7fe8" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const defaultReminders = [
  {
    id: 1,
    type: "pill",
    label: "Birth Control Pill",
    icon: "💊",
    color: "#9b7fe8",
    time: "08:00",
    days: [1, 2, 3, 4, 5, 6, 0],
    active: true,
    note: "Take with water",
  },
  {
    id: 2,
    type: "water",
    label: "Hydration",
    icon: "💧",
    color: "#4ecdc4",
    time: "10:00",
    days: [1, 2, 3, 4, 5],
    active: true,
    note: "Drink 2 glasses",
  },
  {
    id: 3,
    type: "mood",
    label: "Mood Check-in",
    icon: "😊",
    color: "#f4a261",
    time: "21:00",
    days: [1, 3, 5],
    active: false,
    note: "Track daily mood",
  },
];

function ReminderCard({ reminder, onToggle, onDelete, onEdit, onPreview }) {
  const activeDays = DAYS.filter((_, i) => reminder.days.includes(i));

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200"
      style={{
        background: reminder.active ? "#16111f" : "#13101a",
        border: `1px solid ${reminder.active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
        opacity: reminder.active ? 1 : 0.65,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: `${reminder.color}18` }}
        >
          {reminder.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[15px] font-semibold" style={{ color: "#f0eaf8" }}>
              {reminder.label}
            </span>
            {reminder.active && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${reminder.color}22`, color: reminder.color }}
              >
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[22px] font-bold" style={{ color: reminder.color }}>
              {reminder.time}
            </span>
            <div className="flex gap-1 flex-wrap">
              {DAYS.map((day, i) => (
                <span
                  key={day}
                  className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                  style={{
                    background: reminder.days.includes(i) ? `${reminder.color}22` : "rgba(255,255,255,0.04)",
                    color: reminder.days.includes(i) ? reminder.color : "rgba(240,234,248,0.25)",
                  }}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
          {reminder.note && (
            <p className="text-[12px] mt-1" style={{ color: "rgba(240,234,248,0.4)" }}>
              {reminder.note}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Preview sound */}
          <button
            onClick={() => onPreview()}
            title="Preview chime"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 border-none cursor-pointer"
            style={{ background: "rgba(155,127,232,0.1)", color: "#9b7fe8" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </button>

          {/* Toggle switch */}
          <button
            onClick={() => onToggle(reminder.id)}
            className="relative w-11 h-6 rounded-full transition-all duration-300 border-none cursor-pointer flex-shrink-0"
            style={{
              background: reminder.active
                ? `linear-gradient(135deg, ${reminder.color}, ${reminder.color}cc)`
                : "rgba(255,255,255,0.08)",
            }}
          >
            <span
              className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
              style={{ left: reminder.active ? "calc(100% - 20px)" : "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
            />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(reminder)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 border-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(240,234,248,0.45)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(reminder.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 border-none cursor-pointer"
            style={{ background: "rgba(232,97,122,0.08)", color: "rgba(232,97,122,0.6)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function AddReminderModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    type: "pill",
    label: "",
    time: "08:00",
    days: [1, 2, 3, 4, 5],
    note: "",
  });

  const selectedType = REMINDER_TYPES.find((t) => t.key === form.type) || REMINDER_TYPES[0];

  const toggleDay = (i) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(i) ? f.days.filter((d) => d !== i) : [...f.days, i],
    }));
  };

  const handleSave = () => {
    if (!form.days.length) return alert("Please select at least one day.");
    onSave({
      ...form,
      id: Date.now(),
      icon: selectedType.icon,
      color: selectedType.color,
      label: form.label || selectedType.label,
      active: true,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 w-[460px] max-w-[95vw] max-h-[90vh] overflow-y-auto"
        style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-semibold" style={{ color: "#f0eaf8" }}>
            New Reminder
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(240,234,248,0.5)" }}
          >
            ✕
          </button>
        </div>

        {/* Type picker */}
        <div className="mb-4">
          <label className="block text-[11px] uppercase tracking-wider mb-2" style={{ color: "rgba(240,234,248,0.35)" }}>
            Reminder Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {REMINDER_TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setForm((f) => ({ ...f, type: t.key }))}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border-none cursor-pointer transition-all duration-150"
                style={{
                  background: form.type === t.key ? `${t.color}18` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${form.type === t.key ? t.color + "44" : "rgba(255,255,255,0.06)"}`,
                  color: form.type === t.key ? t.color : "rgba(240,234,248,0.45)",
                }}
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-[11px] font-medium leading-tight text-center">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Label */}
        <div className="mb-4">
          <label className="block text-[11px] uppercase tracking-wider mb-2" style={{ color: "rgba(240,234,248,0.35)" }}>
            Label (optional)
          </label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            placeholder={selectedType.label}
            className="w-full px-4 py-3 rounded-xl text-[14px] border-none outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#f0eaf8",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {/* Time */}
        <div className="mb-4">
          <label className="block text-[11px] uppercase tracking-wider mb-2" style={{ color: "rgba(240,234,248,0.35)" }}>
            Time
          </label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl text-[14px] border-none outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#f0eaf8",
              border: "1px solid rgba(255,255,255,0.08)",
              colorScheme: "dark",
            }}
          />
        </div>

        {/* Days */}
        <div className="mb-4">
          <label className="block text-[11px] uppercase tracking-wider mb-2" style={{ color: "rgba(240,234,248,0.35)" }}>
            Repeat on
          </label>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day, i) => (
              <button
                key={day}
                onClick={() => toggleDay(i)}
                className="w-10 h-10 rounded-full text-[12px] font-medium border-none cursor-pointer transition-all duration-150"
                style={{
                  background: form.days.includes(i) ? `linear-gradient(135deg, ${selectedType.color}, ${selectedType.color}aa)` : "rgba(255,255,255,0.05)",
                  color: form.days.includes(i) ? "#fff" : "rgba(240,234,248,0.4)",
                }}
              >
                {day[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="block text-[11px] uppercase tracking-wider mb-2" style={{ color: "rgba(240,234,248,0.35)" }}>
            Note (optional)
          </label>
          <textarea
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="Add a note..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl text-[14px] border-none outline-none resize-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#f0eaf8",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-[14px] font-medium border-none cursor-pointer transition-all"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(240,234,248,0.7)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl text-[14px] font-medium text-white border-none cursor-pointer transition-all"
            style={{ background: `linear-gradient(135deg, ${selectedType.color}, ${selectedType.color}cc)` }}
          >
            Save Reminder
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reminders() {
  const [reminders, setReminders] = useState(defaultReminders);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Unlock AudioContext on first render (needs prior user interaction)
  useEffect(() => { unlockAudio(); }, []);

  const toggleReminder = (id) => {
    const target = reminders.find((r) => r.id === id);
    // Play chime only when turning ON
    if (target && !target.active) playReminderChime();
    setReminders((rs) => rs.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  const deleteReminder = (id) =>
    setReminders((rs) => rs.filter((r) => r.id !== id));

  const addReminder = (reminder) => {
    playReminderChime();
    setReminders((rs) => [...rs, reminder]);
  };

  const handleEdit = (reminder) => {
    setEditTarget(reminder);
    setShowModal(true);
  };

  const activeCount = reminders.filter((r) => r.active).length;

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[1.6rem] font-semibold mb-1" style={{ color: "#f0eaf8" }}>
            Reminders
          </h1>
          <p className="text-[13px]" style={{ color: "rgba(240,234,248,0.45)" }}>
            {activeCount} active · {reminders.length} total
          </p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white border-none cursor-pointer transition-all duration-150"
          style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Reminder
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Active", value: activeCount, color: "#4ecdc4" },
          { label: "Total", value: reminders.length, color: "#9b7fe8" },
          { label: "Paused", value: reminders.length - activeCount, color: "#f4a261" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4 text-center"
            style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="text-[24px] font-bold mb-1" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-[11px] uppercase tracking-wider" style={{ color: "rgba(240,234,248,0.35)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Reminder list */}
      {reminders.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-4xl mb-3">⏰</div>
          <p className="text-[15px] font-medium mb-1" style={{ color: "#f0eaf8" }}>
            No reminders yet
          </p>
          <p className="text-[13px]" style={{ color: "rgba(240,234,248,0.4)" }}>
            Add your first reminder to stay on track.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onToggle={toggleReminder}
              onDelete={deleteReminder}
              onEdit={handleEdit}
              onPreview={playReminderChime}
            />
          ))}
        </div>
      )}

      {/* Tip */}
      <div
        className="mt-6 rounded-xl p-4 flex items-start gap-3"
        style={{ background: "rgba(155,127,232,0.07)", border: "1px solid rgba(155,127,232,0.15)" }}
      >
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-[12px] leading-relaxed" style={{ color: "rgba(240,234,248,0.55)" }}>
          A soft 3-note chime plays when a reminder activates. Use the{" "}
          <svg viewBox="0 0 24 24" className="w-3 h-3 inline-block" fill="none" stroke="#9b7fe8" strokeWidth="1.8"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>{" "}
          button on any card to preview the sound.
        </p>
      </div>

      {showModal && (
        <AddReminderModal
          onClose={() => setShowModal(false)}
          onSave={addReminder}
          initial={editTarget}
        />
      )}
    </div>
  );
}
