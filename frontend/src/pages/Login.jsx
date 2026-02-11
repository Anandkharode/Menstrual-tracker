import React, { useState, useContext } from "react";
import api from "../api";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setToken, setName } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login(form);
      setToken(res.token);
      setName(res.name);
      localStorage.setItem("token", res.token);
      localStorage.setItem("name", res.name);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.cardWrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to continue your health journey</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.5 : 1,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <p style={styles.footer}>
            Don't have an account?{" "}
            <button onClick={() => navigate("/signup")} style={styles.link}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #e0e7ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  },
  cardWrapper: {
    width: "100%",
    maxWidth: "450px"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "40px"
  },
  header: {
    textAlign: "center",
    marginBottom: "32px"
  },
  iconWrapper: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "64px",
    height: "64px",
    background: "linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)",
    borderRadius: "50%",
    marginBottom: "16px"
  },
  icon: {
    width: "32px",
    height: "32px",
    color: "white"
  },
  title: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px"
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "14px"
  },
  errorBox: {
    marginBottom: "24px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "flex-start"
  },
  errorIcon: {
    width: "20px",
    height: "20px",
    marginRight: "8px",
    flexShrink: 0,
    marginTop: "2px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px"
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box"
  },
  submitButton: {
    width: "100%",
    background: "linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)",
    color: "white",
    fontWeight: "600",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px"
  },
  link: {
    color: "#9333ea",
    fontWeight: "600",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    padding: 0
  }
};