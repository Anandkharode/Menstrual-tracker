import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.cardWrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Join us to track your health journey</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
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
                placeholder="Create a password"
                value={form.password}
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account?{" "}
            <button onClick={() => navigate("/")} style={styles.link}>
              Login
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