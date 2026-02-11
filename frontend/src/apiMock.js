// frontend/src/apiMock.js
// A single default-exported object with all mock API functions.
// This file MUST be located at frontend/src/apiMock.js
// and you must import it using: import api from "../apiMock";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const api = {
  login: async (payload) => {
    await delay();
    return { token: "mock-token", name: payload?.email?.split("@")[0] || "Anand" };
  },

  register: async (payload) => {
    await delay();
    return { message: "Registered" };
  },

  getPredictions: async () => {
    await delay();
    return {
      predictedStart: "2025-11-20",
      ovulationWindow: { from: "2025-11-04", to: "2025-11-08" },
      confidence: 0.87,
      anomaly: false
    };
  },

  postCycle: async (payload) => {
    // simulate saving and return saved record id and echoed payload
    await delay();
    return { status: "saved", id: "mock123", saved: payload };
  },

  chatMessage: async ({ message }) => {
    await delay();
    const text = (message || "").toLowerCase();
    if (text.includes("next") || text.includes("when")) {
      return { reply: "Your next period is predicted on 20 Nov 2025 (confidence 87%)." };
    }
    if (text.includes("anomaly")) {
      return { reply: "No anomalies detected in recent cycles." };
    }
    return { reply: "I can show predictions, log cycles, or explain symptoms." };
  }
};

export default api;
