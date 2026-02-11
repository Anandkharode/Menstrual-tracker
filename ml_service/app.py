from flask import Flask, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta

app = Flask(__name__)

# Load trained model (no compile needed for prediction)
model = load_model("cycle_lstm_model.h5", compile=False)

# Dummy scaler fitting (for demo; real project saves scalers)
scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()

X_dummy = np.array([
    [28, 29, 27, 28, 28],
    [30, 31, 29, 30, 31],
    [27, 28, 27, 26, 28],
    [29, 30, 29, 30, 31],
    [28, 28, 29, 28, 29],
    [31, 32, 30, 31, 32]
])
y_dummy = np.array([28, 32, 27, 31, 29, 33])

scaler_X.fit(X_dummy)
scaler_y.fit(y_dummy.reshape(-1, 1))


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    cycles = data.get("cycles", [])

    if len(cycles) == 0:
        return jsonify({ "error": "No cycles provided" }), 400

    # Extract available durations
    durations = [c["duration"] for c in cycles]
    
    # Pad if less than 5
    if len(durations) < 5:
        # Simple padding strategy: repeat the last clear pattern or mean
        # Let's repeat the sequence until we have at least 5
        while len(durations) < 5:
            durations = [durations[i % len(durations)] for i in range(len(durations) * 2)]
            
    # Take the last 5
    durations = durations[-5:]

    X_input = np.array([durations])
    X_scaled = scaler_X.transform(X_input).reshape(1, 5, 1)

    # Predict
    pred_scaled = model.predict(X_scaled)
    predicted_length = scaler_y.inverse_transform(pred_scaled)[0][0]

    # Calculate next period date
    last_start = datetime.fromisoformat(cycles[-1]["startDate"])
    next_start = last_start + timedelta(days=int(round(predicted_length)))

    return jsonify({
        "predictedCycleLength": int(round(predicted_length, 2)),
        "predictedStart": next_start.isoformat(),
        "confidence": float(0.85),
        "anomaly": bool(False)
    })


@app.route("/nlp/query", methods=["POST"])
def nlp_query():
    data = request.get_json()
    message = data.get("message", "").lower()
    
    if "period" in message or "cycle" in message:
        return jsonify({ "reply": "Your cycle data helps us predict your next period. Check the dashboard!" })
    elif "symptom" in message or "pain" in message:
        return jsonify({ "reply": "Tracking symptoms is key to understanding your health pattern." })
    else:
        return jsonify({ "reply": "I'm here to help with your menstrual health tracking." })


if __name__ == "__main__":
    app.run(port=8000, debug=True)
