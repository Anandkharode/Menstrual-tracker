import os
import subprocess
import sys
import traceback
from flask import Flask, jsonify, request

app = Flask(__name__)

from predict import clear_model_cache, predict as predict_cycle, predict_anomaly_only


# ─────────────────────────────────────────────────────────────────────────────
# /predict — Full LSTM + RF ensemble prediction
# ─────────────────────────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    cycles = data.get("cycles") or data.get("user_history") or []

    try:
        result = predict_cycle(cycles)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:
        print("[predict] Unhandled exception")
        traceback.print_exc()
        return jsonify({"error": f"Prediction failed: {exc}"}), 500

    return jsonify(result)


# ─────────────────────────────────────────────────────────────────────────────
# /anomaly/detect — RF-only fast anomaly detection (no LSTM needed)
# ─────────────────────────────────────────────────────────────────────────────
@app.route("/anomaly/detect", methods=["POST"])
def anomaly_detect():
    """
    Standalone Random Forest anomaly detection endpoint.
    Faster than /predict — only detects anomalies, no cycle/symptom predictions.

    Request body:
      {
        "cycles": [ { "LengthofCycle": 28, "LengthofMenses": 5, ... }, ... ]
      }

    Response:
      {
        "anomaly": true|false,
        "overall_rf_probability": 0.73,
        "per_cycle": [...],
        "num_cycles_analyzed": 3,
        "model": "RandomForest + IsolationForest"
      }
    """
    data = request.get_json(silent=True) or {}
    cycles = data.get("cycles") or data.get("user_history") or []

    if not cycles:
        return jsonify({"error": "No cycle data provided."}), 400

    try:
        result = predict_anomaly_only(cycles)
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 503
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        print("[anomaly_detect] Unhandled exception")
        traceback.print_exc()
        return jsonify({"error": f"Anomaly detection failed: {exc}"}), 500

    return jsonify(result)


# ─────────────────────────────────────────────────────────────────────────────
# /retrain — Retrain LSTM (and optionally RF)
# ─────────────────────────────────────────────────────────────────────────────
@app.route("/retrain", methods=["POST"])
def retrain():
    data = request.get_json(silent=True) or {}
    model_type = data.get("model", "lstm").lower()  # "lstm", "rf", or "all"

    results = {}
    errors = {}

    # ── Retrain LSTM ──
    if model_type in ("lstm", "all"):
        lstm_script = os.path.join(os.path.dirname(__file__), "train_model.py")
        if not os.path.exists(lstm_script):
            errors["lstm"] = "train_model.py not found."
        else:
            try:
                res = subprocess.run(
                    [sys.executable, lstm_script],
                    capture_output=True,
                    text=True,
                    check=True,
                    cwd=os.path.dirname(__file__),
                )
                results["lstm"] = {"status": "retrained", "stdout": res.stdout.strip()}
            except subprocess.CalledProcessError as exc:
                errors["lstm"] = exc.stderr.strip()
            except Exception as exc:
                errors["lstm"] = str(exc)

    # ── Retrain RF ──
    if model_type in ("rf", "all"):
        rf_script = os.path.join(os.path.dirname(__file__), "rf_anomaly_model.py")
        if not os.path.exists(rf_script):
            errors["rf"] = "rf_anomaly_model.py not found."
        else:
            try:
                res = subprocess.run(
                    [sys.executable, rf_script],
                    capture_output=True,
                    text=True,
                    check=True,
                    cwd=os.path.dirname(__file__),
                )
                results["rf"] = {"status": "retrained", "stdout": res.stdout.strip()}
            except subprocess.CalledProcessError as exc:
                errors["rf"] = exc.stderr.strip()
            except Exception as exc:
                errors["rf"] = str(exc)

    # Clear caches after any retraining
    clear_model_cache()

    if errors and not results:
        return jsonify({"error": "Retraining failed.", "details": errors}), 500

    return jsonify({
        "status": "done",
        "results": results,
        "errors": errors if errors else None,
    })


# ─────────────────────────────────────────────────────────────────────────────
# /nlp/query — Simple NLP chatbot
# ─────────────────────────────────────────────────────────────────────────────
@app.route("/nlp/query", methods=["POST"])
def nlp_query():
    data = request.get_json()
    message = data.get("message", "").lower()

    if "anomaly" in message or "irregular" in message or "unusual" in message:
        return jsonify({
            "reply": "I can detect cycle anomalies using both LSTM and Random Forest models. "
                     "Submit your cycle data to /anomaly/detect for a quick RF check!"
        })
    elif "period" in message or "cycle" in message:
        return jsonify({"reply": "Your cycle data helps us predict your next period. Check the dashboard!"})
    elif "symptom" in message or "pain" in message:
        return jsonify({"reply": "Tracking symptoms is key to understanding your health pattern."})
    else:
        return jsonify({"reply": "I'm here to help with your menstrual health tracking."})


# ─────────────────────────────────────────────────────────────────────────────
# /health — Model status endpoint
# ─────────────────────────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    base_dir = os.path.dirname(__file__)
    lstm_ok = any(
        os.path.exists(os.path.join(base_dir, p))
        for p in ["menstrual_lstm_model.h5", "menstrual_lstm_model.keras"]
    )
    rf_ok = all(
        os.path.exists(os.path.join(base_dir, p))
        for p in ["rf_anomaly_model.pkl", "rf_scaler.pkl", "rf_isolation_forest.pkl"]
    )
    return jsonify({
        "status": "ok",
        "models": {
            "lstm": "available" if lstm_ok else "missing",
            "random_forest": "available" if rf_ok else "not trained yet — run rf_anomaly_model.py",
        },
        "anomaly_detection": "LSTM+RF ensemble" if (lstm_ok and rf_ok) else (
            "LSTM only" if lstm_ok else "unavailable"
        ),
    })


if __name__ == "__main__":
    app.run(port=8000, debug=True)
