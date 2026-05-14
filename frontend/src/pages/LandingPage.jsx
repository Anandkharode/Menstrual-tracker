import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ── Bubble colours ── */
const BUBBLE_COLORS = ["#f9a8d4", "#c4b5fd", "#fbcfe8", "#ddd6fe", "#fda4af"];

/* ── Feature cards data ── */
const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#ec4899" strokeWidth="1.5" />
        <path d="M11 7v4l3 2" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    bg: "#fdf2f8",
    title: "Cycle prediction",
    desc: "ML-powered forecasting of your next period and ovulation window with high accuracy.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#8b5cf6" strokeWidth="1.5" />
        <path d="M7 11h8M11 7v8" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    bg: "#f5f3ff",
    title: "Anomaly detection",
    desc: "Identifies irregular cycles, missed periods, and abnormal patterns using Isolation Forest.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 16l4-4 3 3 4-5 3 3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: "#ecfdf5",
    title: "Fertile window",
    desc: "Calculates your ovulation date and 6-day fertile window so you can plan ahead.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M6 8h10M6 12h7" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="3" y="4" width="16" height="14" rx="3" stroke="#f97316" strokeWidth="1.5" />
      </svg>
    ),
    bg: "#fff7ed",
    title: "AI health chatbot",
    desc: "NLP-powered assistant answers health queries, sends reminders, and provides tips 24/7.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#ec4899" strokeWidth="1.5" />
        <rect x="12" y="3" width="7" height="7" rx="1.5" stroke="#ec4899" strokeWidth="1.5" />
        <rect x="3" y="12" width="7" height="7" rx="1.5" stroke="#ec4899" strokeWidth="1.5" />
        <rect x="12" y="12" width="7" height="7" rx="1.5" stroke="#ec4899" strokeWidth="1.5" />
      </svg>
    ),
    bg: "#fdf2f8",
    title: "Dashboard & graphs",
    desc: "Visual calendar, trend graphs, and symptom tracking to understand health over time.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="4" y="3" width="14" height="16" rx="3" stroke="#8b5cf6" strokeWidth="1.5" />
        <path d="M8 8h6M8 12h4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    bg: "#f5f3ff",
    title: "Private & secure",
    desc: "End-to-end encrypted storage. Your sensitive health data stays yours, always.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const featureRefs = useRef([]);
  const ctaRef = useRef(null);

  /* ── Intersection Observer for scroll animations ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("vis");
        });
      },
      { threshold: 0.15 }
    );

    featureRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });
    if (ctaRef.current) obs.observe(ctaRef.current);

    return () => obs.disconnect();
  }, []);

  const scrollToFeatures = () => {
    document.getElementById("ln-features")?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Generate background bubbles ── */
  const bubbles = useRef(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      size: 50 + Math.random() * 130,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: BUBBLE_COLORS[i % 5],
      duration: 5 + Math.random() * 7,
      delay: Math.random() * 5,
    }))
  ).current;

  return (
    <div
      className="overflow-x-hidden"
      style={{ background: "#fdf6f0", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ══ NAVBAR ══ */}
      <nav
        className="flex items-center justify-between px-12 py-[1.1rem] sticky top-0 z-[100]"
        style={{
          background: "rgba(253,246,240,0.96)",
          borderBottom: "1px solid rgba(244,168,212,0.2)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[16px]"
            style={{ background: "linear-gradient(135deg, #f9a8d4, #c4b5fd)" }}
          >
            🌙
          </div>
          <span
            className="text-[18px] font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", color: "#4a1c6e" }}
          >
            Health Assistant
          </span>
        </div>

        <div className="flex items-center gap-8">
          <a
            onClick={scrollToFeatures}
            className="text-sm text-[#7c5c8a] no-underline cursor-pointer transition-colors hover:text-[#a78bfa]"
          >
            Features
          </a>
          <a
            onClick={scrollToFeatures}
            className="text-sm text-[#7c5c8a] no-underline cursor-pointer transition-colors hover:text-[#a78bfa]"
          >
            About
          </a>
          <a
            onClick={scrollToFeatures}
            className="text-sm text-[#7c5c8a] no-underline cursor-pointer transition-colors hover:text-[#a78bfa]"
          >
            Research
          </a>
          <button
            onClick={() => navigate("/login")}
            className="py-[9px] px-6 text-white border-none rounded-full text-[13px] font-medium cursor-pointer
                       transition-all duration-200
                       hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #f472b6, #a78bfa)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 14px rgba(167,139,250,0.4)",
            }}
          >
            Login / Sign up
          </button>
        </div>
      </nav>

      {/* ══ HERO SECTION ══ */}
      <section className="flex flex-col items-center text-center pt-[5.5rem] pb-12 px-8 relative overflow-hidden">
        {/* Bubbles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {bubbles.map((b) => (
            <div
              key={b.id}
              className="absolute rounded-full opacity-[0.13]"
              style={{
                width: `${b.size}px`,
                height: `${b.size}px`,
                left: `${b.left}%`,
                top: `${b.top}%`,
                background: b.color,
                animation: `lnFloat ${b.duration}s ease-in-out infinite`,
                animationDelay: `${b.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Badge */}
        <div
          className="relative z-[1] inline-flex items-center gap-2 text-[12px] font-medium py-[7px] px-5
                     rounded-full mb-6"
          style={{
            background: "rgba(196,181,253,0.22)",
            border: "1.5px solid rgba(196,181,253,0.5)",
            color: "#7c3aed",
            animation: "lnUp 0.8s ease both",
          }}
        >
          <div
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: "#a78bfa", animation: "lnBlink 1.5s infinite" }}
          />
          AI-Powered Women's Health
        </div>

        {/* Heading */}
        <h1
          className="relative z-[1] leading-[1.15] mb-5"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
            color: "#3b0764",
            animation: "lnUp 0.8s 0.15s ease both",
            opacity: 0,
          }}
        >
          Track Your Cycle,
          <br />
          <em
            className="not-italic"
            style={{
              background: "linear-gradient(90deg, #ec4899, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Understand Your Body
          </em>
        </h1>

        {/* Subtitle */}
        <p
          className="relative z-[1] text-[16px] max-w-[540px] leading-[1.75] font-light mb-11"
          style={{
            color: "#7c5c8a",
            animation: "lnUp 0.8s 0.3s ease both",
            opacity: 0,
          }}
        >
          An intelligent menstrual health platform combining machine learning, anomaly detection,
          and a 24/7 AI assistant — built for every body.
        </p>

        {/* CTA Buttons */}
        <div
          className="relative z-[1] flex gap-[18px] justify-center flex-wrap"
          style={{ animation: "lnUp 0.8s 0.45s ease both", opacity: 0 }}
        >
          <button
            onClick={() => navigate("/signup")}
            className="py-4 px-11 text-white border-none rounded-full text-[16px] font-medium cursor-pointer
                       transition-transform duration-200
                       hover:-translate-y-1 hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #f472b6, #a78bfa)",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 10px 30px rgba(167,139,250,0.5)",
              animation: "lnPulse 2.5s ease-in-out infinite",
            }}
          >
            ✦ Get Started Free
          </button>
          <button
            onClick={scrollToFeatures}
            className="py-[15px] px-10 bg-white border-2 border-[#a78bfa] rounded-full text-[16px] font-medium cursor-pointer
                       transition-all duration-[250ms]
                       hover:border-[#8b5cf6] hover:-translate-y-[3px]"
            style={{
              color: "#7c3aed",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            See Features ↓
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="relative z-[1] mt-10 flex flex-col items-center gap-1.5"
          style={{ animation: "lnUp 0.8s 0.9s ease both", opacity: 0 }}
        >
          <span className="text-[11px] text-[#c4b5fd] tracking-[0.1em] uppercase">
            Scroll to explore
          </span>
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            style={{ animation: "lnBounce 1.6s ease-in-out infinite" }}
          >
            <path
              d="M10 4v12M4 10l6 6 6-6"
              stroke="#a78bfa"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <div
        className="flex justify-center gap-12 pt-10 pb-4 px-8 flex-wrap"
        style={{ animation: "lnUp 0.8s 0.6s ease both", opacity: 0 }}
      >
        {[
          ["91%", "Prediction accuracy"],
          ["24/7", "AI assistant"],
          ["5+", "Health insights"],
          ["100%", "Private & encrypted"],
        ].map(([num, label]) => (
          <div key={label} className="text-center">
            <div
              className="text-[2rem] font-semibold"
              style={{ fontFamily: "'Playfair Display', serif", color: "#7c3aed" }}
            >
              {num}
            </div>
            <div className="text-[12px] text-[#9c7bb5] mt-[3px]">{label}</div>
          </div>
        ))}
      </div>

      {/* ══ FEATURES ══ */}
      <section className="py-12 pb-16 px-8 max-w-[1100px] mx-auto w-full" id="ln-features">
        <div className="text-center mb-10">
          <h2
            className="text-[1.9rem] mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: "#3b0764" }}
          >
            Everything you need
          </h2>
          <p className="text-sm text-[#9c7bb5] font-light">
            Powered by ML, NLP & anomaly detection
          </p>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              ref={(el) => (featureRefs.current[i] = el)}
              className="bg-white rounded-2xl p-6 opacity-0 translate-y-[30px]
                         transition-all duration-500 cursor-pointer
                         hover:-translate-y-[5px]"
              style={{
                border: "1px solid #f3e8ff",
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div
                className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center mb-4"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <div className="text-[15px] font-medium text-[#4a1c6e] mb-1.5">{f.title}</div>
              <div className="text-[13px] text-[#9c7bb5] leading-[1.6] font-light">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <div className="px-8 pb-12">
        <div
          ref={ctaRef}
          className="text-center py-14 px-8 rounded-3xl
                     opacity-0 translate-y-[30px] transition-all duration-[600ms]"
          style={{ background: "linear-gradient(135deg, #f9a8d4, #c4b5fd)" }}
        >
          <h2
            className="text-[2rem] text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to know your body better?
          </h2>
          <p className="text-sm text-white/[0.88] mb-8 font-light">
            Join thousands who trust Health Assistant for personalized menstrual health insights.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="py-[15px] px-[42px] bg-white border-none rounded-full text-[15px] font-medium cursor-pointer
                       transition-all duration-200
                       hover:-translate-y-[3px]"
            style={{
              color: "#7c3aed",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
            }}
          >
            Start tracking today →
          </button>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer
        className="text-center py-6 text-[12px]"
        style={{ color: "#b39ddb", borderTop: "1px solid #f3e8ff" }}
      >
        Made with care — Anand Kharode, Sejal Rathod, Krushita Lambhate &nbsp;|&nbsp; Guided by
        Prof. T. B. Faruki
      </footer>

      {/* CSS for .vis class (scroll reveal) */}
      <style>{`
        .vis {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}
