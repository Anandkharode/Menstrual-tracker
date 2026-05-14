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
      {/* Success Message */}
      {status === "success" && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Cycle saved successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {status === "error" && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Failed to save cycle. Please try again.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={submit} className="space-y-5">
        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
            Duration (days)
          </label>
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
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        {/* Flow Intensity */}
        <div>
          <label htmlFor="flow" className="block text-sm font-medium text-gray-300 mb-2">
            Flow Intensity
          </label>
          <select
            id="flow"
            name="flow"
            value={form.flow}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          >
            <option value="">Select intensity</option>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        {/* Symptoms */}
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-300 mb-2">
            Symptoms (Optional)
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={form.symptoms}
            onChange={handleChange}
            rows="3"
            placeholder="e.g., cramps, headache, fatigue..."
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:from-purple-500 hover:to-purple-600 active:scale-95"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Save Cycle</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CycleForm;