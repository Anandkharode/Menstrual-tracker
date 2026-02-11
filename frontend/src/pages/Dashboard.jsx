import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import AuthContext from "../context/AuthContext";
import CycleForm from "../components/CycleForm";
import ChatbotWidget from "../components/ChatbotWidget";

export default function Dashboard() {
  const { name } = useContext(AuthContext);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPred() {
      try {
        const res = await api.getPredictions();
        setPrediction(res);
      } catch (err) {
        console.error("Failed to fetch prediction", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPred();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back, {name || "User"}! 👋</h1>
          <p style={styles.subtitle}>Track your cycle and get personalized insights</p>
        </div>

        {/* Main Content */}
        <div style={styles.grid}>
          {/* Cycle Form Section */}
          <div style={styles.formSection}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                <svg style={styles.titleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Log Your Cycle
              </h2>
              <CycleForm onCycleAdded={(newPred) => setPrediction(newPred)} />
            </div>
          </div>

          {/* Prediction Section */}
          <div style={styles.predictionSection}>
            <div style={styles.card}>
              <h3 style={styles.cardSubtitle}>
                <svg style={styles.subtitleIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Your Predictions
              </h3>

              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.spinner}></div>
                </div>
              ) : prediction ? (
                <div style={styles.predictionContent}>
                  {prediction.anomaly && (
                    <div style={styles.anomalyBox}>
                      <svg style={styles.anomalyIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span style={styles.anomalyText}>Cycle anomaly detected</span>
                    </div>
                  )}

                  <div style={styles.nextPeriodBox}>
                    <p style={styles.predictionLabel}>Next Period</p>
                    <p style={styles.predictionDate}>
                      {new Date(prediction.predictedStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div style={styles.ovulationBox}>
                    <p style={styles.predictionLabel}>Ovulation Window</p>
                    <div style={styles.dateRange}>
                      <span style={styles.dateRangeText}>
                        {new Date(prediction.ovulationWindow.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <svg style={styles.arrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span style={styles.dateRangeText}>
                        {new Date(prediction.ovulationWindow.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div style={styles.confidenceBox}>
                    <span style={styles.confidenceLabel}>Confidence Level</span>
                    <span style={styles.confidenceValue}>{prediction.confidence}</span>
                  </div>
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p style={styles.emptyTitle}>No predictions yet</p>
                  <p style={styles.emptySubtitle}>Add a cycle to get started with predictions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #e0e7ff 100%)"
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "32px 20px"
  },
  header: {
    marginBottom: "32px"
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px"
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "16px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px"
  },
  formSection: {
    gridColumn: "1 / -1"
  },
  predictionSection: {
    gridColumn: "1 / -1"
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "24px"
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center"
  },
  titleIcon: {
    width: "24px",
    height: "24px",
    marginRight: "8px",
    color: "#9333ea"
  },
  cardSubtitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center"
  },
  subtitleIcon: {
    width: "20px",
    height: "20px",
    marginRight: "8px",
    color: "#4f46e5"
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px"
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #9333ea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  predictionContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  anomalyBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "flex-start"
  },
  anomalyIcon: {
    width: "20px",
    height: "20px",
    marginRight: "8px",
    flexShrink: 0,
    marginTop: "2px"
  },
  anomalyText: {
    fontSize: "14px",
    fontWeight: "500"
  },
  nextPeriodBox: {
    background: "linear-gradient(135deg, #faf5ff 0%, #e0e7ff 100%)",
    borderRadius: "8px",
    padding: "16px"
  },
  predictionLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px"
  },
  predictionDate: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937"
  },
  ovulationBox: {
    background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
    borderRadius: "8px",
    padding: "16px"
  },
  dateRange: {
    display: "flex",
    alignItems: "center",
    color: "#1f2937"
  },
  dateRangeText: {
    fontWeight: "600"
  },
  arrow: {
    width: "16px",
    height: "16px",
    margin: "0 8px"
  },
  confidenceBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "16px"
  },
  confidenceLabel: {
    fontSize: "14px",
    color: "#6b7280"
  },
  confidenceValue: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#4f46e5"
  },
  emptyState: {
    textAlign: "center",
    padding: "32px"
  },
  emptyIcon: {
    width: "64px",
    height: "64px",
    margin: "0 auto 16px",
    color: "#d1d5db"
  },
  emptyTitle: {
    color: "#6b7280",
    marginBottom: "8px",
    fontSize: "16px"
  },
  emptySubtitle: {
    fontSize: "14px",
    color: "#9ca3af"
  }
};

// Add this style tag to your HTML or in a global CSS file for the spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @media (min-width: 1024px) {
    .dashboard-grid {
      grid-template-columns: 2fr 1fr;
    }
    .form-section {
      grid-column: span 1;
    }
    .prediction-section {
      grid-column: span 1;
    }
  }
`;
document.head.appendChild(styleSheet);