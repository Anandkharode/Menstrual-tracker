import React, { useState, useContext, useEffect, useRef } from "react";
import api from "../api";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ── Petal colours from the HTML ── */
const PETAL_COLORS = [
  "#f9a8c9", "#f48fb1", "#fce4ec", "#f8bbd0",
  "#f06292", "#ff80ab", "#ffd6e7", "#ffb3c6",
];

/* ── Floating Petal component ── */
function Petal({ color, style }) {
  return (
    <div
      className="absolute opacity-0"
      style={{
        borderRadius: "60% 40% 60% 40% / 70% 30% 70% 30%",
        background: color,
        animation: `authFall ${5 + Math.random() * 9}s linear infinite`,
        animationDelay: `${-(Math.random() * 14)}s`,
        ...style,
      }}
    />
  );
}

/* ── Social icon SVGs (exact from HTML) ── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[18px] h-[18px]">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[18px] h-[18px]">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[18px] h-[18px]">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[18px] h-[18px]">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ── Input with icon overlay ── */
function AuthInput({ type, placeholder, required, value, onChange, icon }) {
  return (
    <div className="relative my-4">
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full py-3 pl-4 pr-11 bg-[#fde8f0] rounded-[10px] border-[1.5px] border-[#f9b8d0]
                   outline-none text-sm text-[#5a2035] italic
                   transition-all duration-200
                   focus:border-[#e75480] focus:bg-[#fff0f5]
                   placeholder:text-[#c48fa0]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      />
      <span className="absolute right-[13px] top-1/2 -translate-y-1/2 pointer-events-none">
        {icon}
      </span>
    </div>
  );
}

/* ── Social links row ── */
function SocialLinks() {
  return (
    <div className="flex justify-center">
      {[GoogleIcon, FacebookIcon, GithubIcon, LinkedInIcon].map((Icon, i) => (
        <a
          key={i}
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex p-[7px] border-[1.5px] border-[#f4b8cc] rounded-lg text-[#c2537a] mx-1
                     transition-all duration-200
                     hover:bg-[#fde8f0] hover:border-[#e75480]"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN AUTH PAGE
══════════════════════════════════════ */
export default function AuthPage({ initialMode = "login" }) {
  const { setToken, setName } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(initialMode === "signup");

  // Login form
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Generate petals
  const petals = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      color: PETAL_COLORS[i % 8],
      size: 11 + Math.random() * 14,
      left: Math.random() * 100,
      duration: 5 + Math.random() * 9,
      delay: -(Math.random() * 14),
    }))
  ).current;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await api.login(loginForm);
      setToken(res.token);
      setName(res.name);
      localStorage.setItem("token", res.token);
      localStorage.setItem("name", res.name);
      navigate("/dashboard");
    } catch (err) {
      setLoginError(
        err.response?.data?.msg || "Login failed. Please check your credentials."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");
    try {
      await api.register(regForm);
      // After successful registration, switch to login
      setIsRegister(false);
      setLoginForm({ email: regForm.email, password: "" });
    } catch (err) {
      setRegError(err.response?.data?.msg || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  /* User icon SVG */
  const userIcon = (
    <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" stroke="#d4789a" fill="none" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );

  /* Lock icon SVG */
  const lockIcon = (
    <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" stroke="#d4789a" fill="none" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  /* Email icon SVG */
  const emailIcon = (
    <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" stroke="#d4789a" fill="none" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );

  return (
    <div
      id="auth-page"
      className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #fde8f0, #ffc2d4, #ffb3c6)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Petal background ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {petals.map((p) => (
          <Petal
            key={p.id}
            color={p.color}
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.5}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Back to home button ── */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-7 z-[100]
                   bg-white/55 border-[1.5px] border-[rgba(220,80,120,0.25)] text-[#a03060]
                   py-2 px-[18px] rounded-[30px] text-[13px] cursor-pointer
                   transition-all duration-200 flex items-center gap-1.5
                   hover:bg-white/80 hover:-translate-x-0.5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        ← Back to home
      </button>

      {/* ══ AUTH BOX ══ */}
      <div
        className={`relative z-[1] w-full max-w-[820px] h-[540px] bg-white/[0.92] rounded-[30px]
                    shadow-[0_8px_40px_rgba(220,80,120,0.2)] overflow-hidden mx-4
                    ${isRegister ? "auth-active" : ""}`}
        id="auth-container"
      >
        {/* ── LOGIN FORM PANEL ── */}
        <div
          className="absolute w-1/2 h-full flex items-center text-center p-9 z-[1]
                     transition-all duration-[600ms] ease-in-out"
          style={{
            right: isRegister ? "-50%" : "0",
            left: "auto",
            transitionDelay: "1.2s",
          }}
        >
          <form onSubmit={handleLogin} className="w-full">
            <h1
              className="text-[32px] mb-1.5 text-[#7d2248] tracking-[-0.5px]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}
            >
              Login
            </h1>

            {loginError && (
              <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2 italic">
                {loginError}
              </div>
            )}

            <AuthInput
              type="text"
              placeholder="Username or Email"
              required
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              icon={userIcon}
            />
            <AuthInput
              type="password"
              placeholder="Password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              icon={lockIcon}
            />

            <div className="-mt-1 mb-2.5 text-right">
              <a href="#" onClick={(e) => e.preventDefault()} className="text-[12px] text-[#c2537a] italic no-underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-[44px] rounded-[10px] border-none cursor-pointer
                         text-white text-[16px] font-medium
                         shadow-[0_4px_14px_rgba(231,84,128,0.3)]
                         transition-all duration-200
                         hover:opacity-[0.88] hover:-translate-y-px
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #f06292, #e75480)",
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
              }}
            >
              {loginLoading ? "Signing in..." : "Login"}
            </button>

            <p className="text-[12px] text-[#b06080] my-2.5 italic font-light">
              or login with social platforms
            </p>
            <SocialLinks />
          </form>
        </div>

        {/* ── REGISTER FORM PANEL ── */}
        <div
          className="absolute w-1/2 h-full flex items-center text-center p-9 z-[1]
                     transition-all duration-[600ms] ease-in-out"
          style={{
            left: isRegister ? "0" : "-50%",
            right: "auto",
            transitionDelay: "1.2s",
          }}
        >
          <form onSubmit={handleRegister} className="w-full">
            <h1
              className="text-[32px] mb-1.5 text-[#7d2248] tracking-[-0.5px]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}
            >
              Registration
            </h1>

            {regError && (
              <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-2 italic">
                {regError}
              </div>
            )}

            <AuthInput
              type="text"
              placeholder="Username"
              required
              value={regForm.name}
              onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
              icon={userIcon}
            />
            <AuthInput
              type="email"
              placeholder="Email"
              required
              value={regForm.email}
              onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
              icon={emailIcon}
            />
            <AuthInput
              type="password"
              placeholder="Password"
              required
              value={regForm.password}
              onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
              icon={lockIcon}
            />

            <button
              type="submit"
              disabled={regLoading}
              className="w-full h-[44px] rounded-[10px] border-none cursor-pointer
                         text-white text-[16px] font-medium
                         shadow-[0_4px_14px_rgba(231,84,128,0.3)]
                         transition-all duration-200
                         hover:opacity-[0.88] hover:-translate-y-px
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #f06292, #e75480)",
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
              }}
            >
              {regLoading ? "Creating Account..." : "Register"}
            </button>

            <p className="text-[12px] text-[#b06080] my-2.5 italic font-light">
              or register with social platforms
            </p>
            <SocialLinks />
          </form>
        </div>

        {/* ══ TOGGLE BLOB ══ */}
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
          <div
            className="absolute w-[300%] h-full rounded-[150px] z-[2] pointer-events-auto
                       transition-all duration-[1800ms] ease-in-out"
            style={{
              background: "linear-gradient(145deg, #f48fb1, #e75480, #f06292)",
              left: isRegister ? "50%" : "-250%",
            }}
          />

          {/* ── Left toggle panel: "Hello, Welcome! → Register" ── */}
          <div
            className="absolute w-1/2 h-full text-white flex flex-col justify-center items-center z-[2]
                       transition-all duration-[600ms] ease-in-out pointer-events-auto"
            style={{
              left: isRegister ? "-50%" : "0",
              transitionDelay: isRegister ? "0.6s" : "1.2s",
            }}
          >
            <h1
              className="text-[26px] mb-2 text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              Hello, Welcome!
            </h1>
            <p className="italic text-[13px] text-white/[0.88] mb-5 font-light">
              Don't have an account?
            </p>
            <button
              onClick={() => setIsRegister(true)}
              className="w-[148px] h-[42px] bg-transparent border-2 border-white/85
                         rounded-[10px] cursor-pointer text-white text-[15px]
                         shadow-none transition-all duration-200
                         hover:bg-white/10"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              Register
            </button>
          </div>

          {/* ── Right toggle panel: "Welcome Back! → Login" ── */}
          <div
            className="absolute w-1/2 h-full text-white flex flex-col justify-center items-center z-[2]
                       transition-all duration-[600ms] ease-in-out pointer-events-auto"
            style={{
              right: isRegister ? "0" : "-50%",
              transitionDelay: isRegister ? "1.2s" : "0.6s",
            }}
          >
            <h1
              className="text-[26px] mb-2 text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              Welcome Back!
            </h1>
            <p className="italic text-[13px] text-white/[0.88] mb-5 font-light">
              Already have an account?
            </p>
            <button
              onClick={() => setIsRegister(false)}
              className="w-[148px] h-[42px] bg-transparent border-2 border-white/85
                         rounded-[10px] cursor-pointer text-white text-[15px]
                         shadow-none transition-all duration-200
                         hover:bg-white/10"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
