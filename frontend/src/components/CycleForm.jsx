import React, { useState } from "react";
import api from "../api";

const CycleForm = ({ onCycleAdded }) => {
  const [form, setForm] = useState({
    startDate: "",
    duration: "",
    flow: "",
    symptoms: ""
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const res = await api.postCycle(form);
      setStatus("success");
      setForm({ startDate: "", duration: "", flow: "", symptoms: "" });
      if (res.prediction && onCycleAdded) {
        onCycleAdded(res.prediction);
      }
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      setStatus("error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {status === "success" && (
        <div style={styles.successBox}>
          <svg style={styles.successIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Cycle saved successfully!
        </div>
      )}

      {status === "error" && (
        <div style={styles.errorBox}>
          <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Failed to save cycle. Please try again.
        </div>
      )}

      <form onSubmit={submit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="startDate" style={styles.label}>Start Date</label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="duration" style={styles.label}>Duration (days)</label>
          <input
            id="duration"
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
            min="1"
            max="20"
            placeholder="e.g., 5"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="flow" style={styles.label}>Flow Intensity</label>
          <select
            id="flow"
            name="flow"
            value={form.flow}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select intensity</option>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="symptoms" style={styles.label}>Symptoms (Optional)</label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={form.symptoms}
            onChange={handleChange}
            rows="3"
            placeholder="e.g., cramps, headache, fatigue..."
            style={styles.textarea}
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
          {loading ? (
            <span style={styles.buttonContent}>
              <span style={styles.loadingSpinner}></span>
              Saving...
            </span>
          ) : (
            <span style={styles.buttonContent}>
              <svg style={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Cycle
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

const styles = {
  successBox: {
    marginBottom: "16px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
    padding: "12px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center"
  },
  successIcon: {
    width: "20px",
    height: "20px",
    marginRight: "8px"
  },
  errorBox: {
    marginBottom: "16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center"
  },
  errorIcon: {
    width: "20px",
    height: "20px",
    marginRight: "8px"
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
  select: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
    backgroundColor: "white",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
    resize: "none",
    fontFamily: "inherit",
    boxSizing: "border-box"
  },
  submitButton: {
    width: "100%",
    background: "linear-gradient(135deg, #db2777 0%, #e11d48 100%)",
    color: "white",
    fontWeight: "600",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    transition: "all 0.2s"
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonIcon: {
    width: "20px",
    height: "20px",
    marginRight: "8px"
  },
  loadingSpinner: {
    display: "inline-block",
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "8px"
  }
};

export default CycleForm;