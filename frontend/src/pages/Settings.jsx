import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

/* ─── Section wrapper ─── */
function Section({ title, children }) {
  return (
    <div
      className="rounded-2xl p-5 mb-4"
      style={{ background: "#16111f", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <h3
        className="text-[11px] uppercase tracking-widest font-semibold mb-4"
        style={{ color: "rgba(240,234,248,0.35)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ─── Select row ─── */
function SelectRow({ label, desc, value, options, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-[13px] font-medium" style={{ color: "#f0eaf8" }}>{label}</p>
        {desc && <p className="text-[11px] mt-0.5" style={{ color: "rgba(240,234,248,0.4)" }}>{desc}</p>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg text-[12px] border-none outline-none cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "#f0eaf8",
          colorScheme: "dark",
          minWidth: "120px",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ─── Input row ─── */
function InputRow({ label, desc, value, onChange, type = "text", placeholder }) {
  return (
    <div className="py-3 border-b last:border-b-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <p className="text-[13px] font-medium mb-1" style={{ color: "#f0eaf8" }}>{label}</p>
      {desc && <p className="text-[11px] mb-2" style={{ color: "rgba(240,234,248,0.4)" }}>{desc}</p>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl text-[13px] border-none outline-none"
        style={{
          background: "rgba(255,255,255,0.05)",
          color: "#f0eaf8",
          border: "1px solid rgba(255,255,255,0.08)",
          colorScheme: "dark",
        }}
      />
    </div>
  );
}

export default function Settings() {
  const { name, setName, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  /* Profile */
  const [displayName, setDisplayName] = useState(name || "");
  const [email, setEmail] = useState("user@example.com");
  const [dob, setDob] = useState("");

  /* Cycle prefs */
  const [avgCycleLength, setAvgCycleLength] = useState("28");
  const [avgPeriodLength, setAvgPeriodLength] = useState("5");
  const [startOfWeek, setStartOfWeek] = useState("mon");

  /* Toast */
  const [toast, setToast] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const saveProfile = () => {
    if (displayName.trim()) setName(displayName.trim());
    showToast("Profile updated successfully!");
  };

  const handleLogout = () => {
    setToken(null);
    setName(null);
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-[9999] px-5 py-3 rounded-xl text-[13px] font-medium shadow-xl"
          style={{ background: "rgba(78,205,196,0.9)", color: "#fff", backdropFilter: "blur(8px)" }}
        >
          ✅ {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[1.6rem] font-semibold mb-1" style={{ color: "#f0eaf8" }}>
          Settings
        </h1>
        <p className="text-[13px]" style={{ color: "rgba(240,234,248,0.45)" }}>
          Manage your profile and cycle preferences
        </p>
      </div>

      {/* Profile card */}
      <div
        className="rounded-2xl p-5 mb-4 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(232,97,122,0.08), rgba(155,127,232,0.08))",
          border: "1px solid rgba(155,127,232,0.15)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-[26px] font-semibold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
        >
          {(displayName || name || "U").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold truncate" style={{ color: "#f0eaf8" }}>
            {displayName || name || "User"}
          </p>
          <p className="text-[12px]" style={{ color: "rgba(240,234,248,0.45)" }}>
            {email}
          </p>
          <span
            className="inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(155,127,232,0.2)", color: "#9b7fe8" }}
          >
            Free Plan
          </span>
        </div>
      </div>

      {/* Profile Section */}
      <Section title="Profile">
        <InputRow
          label="Display Name"
          value={displayName}
          onChange={setDisplayName}
          placeholder="Your name"
        />
        <InputRow
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <InputRow
          label="Date of Birth"
          type="date"
          value={dob}
          onChange={setDob}
        />
        <div className="pt-3">
          <button
            onClick={saveProfile}
            className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-white border-none cursor-pointer transition-all"
            style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
          >
            Update Profile
          </button>
        </div>
      </Section>

      {/* Cycle Preferences */}
      <Section title="Cycle Preferences">
        <SelectRow
          label="Average Cycle Length"
          desc="Used for period predictions"
          value={avgCycleLength}
          onChange={setAvgCycleLength}
          options={Array.from({ length: 20 }, (_, i) => ({ value: String(i + 21), label: `${i + 21} days` }))}
        />
        <SelectRow
          label="Average Period Length"
          desc="Duration of your menstrual period"
          value={avgPeriodLength}
          onChange={setAvgPeriodLength}
          options={Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: `${i + 1} day${i !== 0 ? "s" : ""}` }))}
        />
        <SelectRow
          label="Week Starts On"
          value={startOfWeek}
          onChange={setStartOfWeek}
          options={[
            { value: "sun", label: "Sunday" },
            { value: "mon", label: "Monday" },
          ]}
        />
      </Section>

      {/* Log Out */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-[14px] font-medium border-none cursor-pointer transition-all duration-150"
        style={{
          background: "rgba(232,97,122,0.08)",
          color: "#e8617a",
          border: "1px solid rgba(232,97,122,0.15)",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Log Out
      </button>

      <div className="h-8" />

      {/* Logout Confirm Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowLogoutConfirm(false)}
        >
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
                onClick={() => setShowLogoutConfirm(false)}
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
    </div>
  );
}
