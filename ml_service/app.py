from flask import Flask, request, jsonify
import numpy as np
import joblib
from datetime import datetime, timedelta
import os
import time
import itertools
from functools import lru_cache
from groq import Groq
from dotenv import load_dotenv  

# Load .env file
load_dotenv()  

# -------------------------------
# INIT APP
# -------------------------------
app = Flask(__name__)

# -------------------------------
# LOAD ML MODELS
# -------------------------------
model         = joblib.load("cycle_model.pkl")
anomaly_model = joblib.load("anomaly_model.pkl")

# -------------------------------
# GROQ CLIENT SETUP (key rotation)
# -------------------------------
GROQ_KEYS = [k for k in [
    os.environ.get("GROQ_KEY_1"),
    os.environ.get("GROQ_KEY_2"),
] if k]

print(f"🔑 Groq keys loaded: {len(GROQ_KEYS)}")  

groq_key_pool = itertools.cycle(GROQ_KEYS) if GROQ_KEYS else None  

def get_groq_client():
    if not GROQ_KEYS:
        raise ValueError("No Groq API keys configured! Check your .env file.")
    return Groq(api_key=next(groq_key_pool))

# -------------------------------
# SYSTEM PROMPT
# -------------------------------
SYSTEM_PROMPT = """You are a compassionate menstrual health assistant.
Help users understand their cycle, symptoms, and reproductive health.
Be warm, supportive, and medically accurate.
Keep answers concise. If something seems serious, recommend a doctor."""

# -------------------------------
# AI CALL WITH RETRY LOGIC
# -------------------------------
def call_ai(message: str, retries: int = 3) -> str:
    for attempt in range(retries):
        try:
            client = get_groq_client()
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": message}
                ],
                max_tokens=500,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            err = str(e)
            print(f"[AI] Attempt {attempt+1} failed: {err}")
            if "rate_limit" in err.lower() or "429" in err:
                wait = 60 * (attempt + 1)
                print(f"[AI] Waiting {wait}s...")
                time.sleep(wait)
            else:
                break
    return "AI not working right now, please try again in a minute! 💙"

@lru_cache(maxsize=200)
def get_cached_reply(message: str) -> str:
    return call_ai(message)


# -------------------------------
# 🔮 PREDICT API
# -------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    try:
        last_period_date = datetime.strptime(data["last_period_date"], "%Y-%m-%d")

        input_data = [[
            data["age"],
            data["bmi"],
            data["stress"],
            data["exercise"],
            data["sleep"],
            data["period_length"],
            data["diet"],
            data["symptoms"]
        ]]

        prediction   = model.predict(input_data)
        cycle_days   = int(round(prediction[0]))

        next_period_date = last_period_date + timedelta(days=cycle_days)
        ovulation_date   = last_period_date + timedelta(days=cycle_days - 14)
        fertile_start    = ovulation_date - timedelta(days=5)
        fertile_end      = ovulation_date + timedelta(days=1)

        anomaly_pred = anomaly_model.predict(input_data)[0]
        anomaly_prob = anomaly_model.predict_proba(input_data)[0][1]

        return jsonify({
            "predictedCycleLength" : cycle_days,
            "predictedStart"       : next_period_date.strftime("%Y-%m-%d"),
            "ovulationDate"        : ovulation_date.strftime("%Y-%m-%d"),
            "fertileWindowStart"   : fertile_start.strftime("%Y-%m-%d"),
            "fertileWindowEnd"     : fertile_end.strftime("%Y-%m-%d"),
            "anomaly"              : bool(anomaly_pred),
            "anomalyRisk"          : round(float(anomaly_prob) * 100, 1),
            "confidence"           : 0.9
        })

    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# 🤖 CHAT API (GROQ)
# -------------------------------
@app.route("/nlp/query", methods=["POST"])
def nlp_query():
    data    = request.get_json()
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"reply": "Please type a message 💙"}), 400

    shortcuts = [
        (["period", "cycle", "late", "prediction", "next period"],
         "Based on your data, your next cycle prediction is available on the dashboard 💙"),
        (["cramp", "pain", "hurt"],
         "Cramps are common during menstruation. Try a heating pad, stay hydrated, and ibuprofen can help. If pain is severe, see a doctor 💙"),
        (["ovulation", "fertile", "fertility"],
         "Your ovulation and fertile window are calculated on your dashboard based on your cycle data 💙"),
        (["pregnant", "pregnancy"],
         "If you think you might be pregnant, take a home test first. Please consult your doctor for proper guidance 💙"),
        (["irregular", "missed", "skip"],
         "Irregular cycles can happen due to stress, diet changes, or hormonal shifts. If it keeps happening, consult a gynecologist 💙"),
    ]

    msg_lower = message.lower()
    for keywords, reply in shortcuts:
        if any(word in msg_lower for word in keywords):
            return jsonify({"reply": reply})

    reply = get_cached_reply(message)
    return jsonify({"reply": reply})


# -------------------------------
# ❤️ HEALTH CHECK
# -------------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status" : "ok",
        "ai"     : "groq",
        "models" : ["cycle_model", "anomaly_model"],
        "keys"   : len(GROQ_KEYS)  
    })


# -------------------------------
# RUN SERVER
# -------------------------------
if __name__ == "__main__":
    print("🚀 Server starting...")
    app.run(port=8000, debug=True)
