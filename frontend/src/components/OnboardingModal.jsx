import React, { useState } from "react";
import api from "../api";

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dob: "",
    height: "",
    weight: "",
    lifestyle: "",
    workout: "",
    diet: "",
    sleepHours: "",
    lastPeriodDate: ""
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.updateProfile(formData);
      onComplete();
    } catch (err) {
      console.error("Error saving onboarding details", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1: return !formData.dob;
      case 2: return !formData.height || !formData.weight;
      case 3: return !formData.lifestyle || !formData.workout;
      case 4: return !formData.diet || !formData.sleepHours;
      case 5: return !formData.lastPeriodDate;
      default: return false;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div 
        className="rounded-3xl p-8 max-w-[420px] w-full relative overflow-hidden"
        style={{ 
          background: "#16111f", 
          border: "1px solid rgba(255,255,255,0.08)", 
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 h-1 bg-white/10 w-full">
          <div 
            className="h-full transition-all duration-500" 
            style={{ 
              width: `${(step / 5) * 100}%`,
              background: "linear-gradient(90deg, #e8617a, #9b7fe8)"
            }}
          />
        </div>

        <div className="text-center mb-8 mt-2">
          <h2 className="text-[22px] font-semibold mb-2" style={{ color: "#f0eaf8" }}>
            Let's personalize your experience ✨
          </h2>
          <p className="text-[13px]" style={{ color: "rgba(240,234,248,0.5)" }}>
            Step {step} of 5
          </p>
        </div>

        <div className="min-h-[160px] flex flex-col justify-center">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <label className="block text-[14px] font-medium text-center" style={{ color: "rgba(240,234,248,0.8)" }}>
                When is your birthday? 🎂
              </label>
              <input 
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl outline-none text-[15px] text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0eaf8", colorScheme: "dark" }}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium mb-2 text-center" style={{ color: "rgba(240,234,248,0.8)" }}>Height (cm) 📏</label>
                  <input 
                    type="number" placeholder="e.g. 165"
                    value={formData.height} onChange={(e) => handleChange("height", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none text-[14px] text-center"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0eaf8" }}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium mb-2 text-center" style={{ color: "rgba(240,234,248,0.8)" }}>Weight (kg) ⚖️</label>
                  <input 
                    type="number" placeholder="e.g. 60"
                    value={formData.weight} onChange={(e) => handleChange("weight", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none text-[14px] text-center"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0eaf8" }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-[13px] font-medium mb-3 text-center" style={{ color: "rgba(240,234,248,0.8)" }}>Your Lifestyle 🌿</label>
                <div className="flex gap-2">
                  {["Sedentary", "Active", "Very Active"].map(opt => (
                    <button key={opt} onClick={() => handleChange("lifestyle", opt)} className="flex-1 py-2.5 rounded-xl text-[12px] transition-all border-none" style={{ background: formData.lifestyle === opt ? "rgba(155,127,232,0.2)" : "rgba(255,255,255,0.04)", border: formData.lifestyle === opt ? "1px solid #9b7fe8" : "1px solid transparent", color: formData.lifestyle === opt ? "#9b7fe8" : "rgba(240,234,248,0.5)" }}>{opt}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium mb-3 text-center" style={{ color: "rgba(240,234,248,0.8)" }}>Do you workout? 🏃‍♀️</label>
                <div className="flex gap-2">
                  {["Yes", "No", "Sometimes"].map(opt => (
                    <button key={opt} onClick={() => handleChange("workout", opt)} className="flex-1 py-2.5 rounded-xl text-[12px] transition-all border-none" style={{ background: formData.workout === opt ? "rgba(232,97,122,0.2)" : "rgba(255,255,255,0.04)", border: formData.workout === opt ? "1px solid #e8617a" : "1px solid transparent", color: formData.workout === opt ? "#e8617a" : "rgba(240,234,248,0.5)" }}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-[13px] font-medium mb-3 text-center" style={{ color: "rgba(240,234,248,0.8)" }}>Primary Diet 🥗</label>
                <div className="flex gap-2 flex-wrap justify-center">
                  {["Vegan", "Vegetarian", "Omnivore", "Pescatarian"].map(opt => (
                    <button key={opt} onClick={() => handleChange("diet", opt)} className="px-4 py-2.5 rounded-xl text-[12px] transition-all border-none" style={{ background: formData.diet === opt ? "rgba(78,205,196,0.2)" : "rgba(255,255,255,0.04)", border: formData.diet === opt ? "1px solid #4ecdc4" : "1px solid transparent", color: formData.diet === opt ? "#4ecdc4" : "rgba(240,234,248,0.5)" }}>{opt}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium mb-2 text-center" style={{ color: "rgba(240,234,248,0.8)" }}>Sleep Cycle (Hours/Night) 😴</label>
                <input 
                  type="number" placeholder="e.g. 7"
                  value={formData.sleepHours} onChange={(e) => handleChange("sleepHours", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl outline-none text-[14px] text-center"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0eaf8" }}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <label className="block text-[14px] font-medium text-center" style={{ color: "rgba(240,234,248,0.8)" }}>
                When did your last period start? 🩸
              </label>
              <input 
                type="date"
                value={formData.lastPeriodDate}
                onChange={(e) => handleChange("lastPeriodDate", e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl outline-none text-[15px] text-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0eaf8", colorScheme: "dark" }}
              />
            </div>
          )}
        </div>

        <div className="mt-10 flex gap-3">
          {step > 1 && (
            <button 
              onClick={handlePrev}
              className="flex-1 py-3.5 rounded-xl text-[14px] font-medium transition-all border-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", color: "#f0eaf8" }}
            >
              Back
            </button>
          )}
          {step < 5 ? (
            <button 
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="flex-[2] py-3.5 rounded-xl text-[14px] font-semibold text-white border-none cursor-pointer transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isNextDisabled() || loading}
              className="flex-[2] py-3.5 rounded-xl text-[14px] font-semibold text-white border-none cursor-pointer transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #e8617a, #9b7fe8)" }}
            >
              {loading ? "Saving..." : "Let's Go! 🚀"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
