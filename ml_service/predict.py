"""
predict.py — Menstrual Tracker Prediction Engine
=================================================
Ensemble anomaly detection: LSTM + Random Forest
- LSTM predicts cycle lengths, period, ovulation day, symptom, AND anomaly
- Random Forest adds a tabular anomaly detector (with Isolation Forest augment)
- Final anomaly flag = weighted ensemble vote (LSTM 55% + RF 45%)
"""

import json
import os
import pickle
from functools import lru_cache
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf

try:
    import keras
except Exception:  # pragma: no cover
    keras = None

BASE_DIR = os.path.dirname(__file__)

# ── LSTM model paths ──────────────────────────────────────────────────────────
MODEL_PATH = os.path.join(BASE_DIR, "menstrual_lstm_model.keras")
MODEL_H5_PATH = os.path.join(BASE_DIR, "menstrual_lstm_model.h5")
SAVEDMODEL_DIR = os.path.join(BASE_DIR, "menstrual_lstm_model_savedmodel")
METADATA_PATH = os.path.join(BASE_DIR, "model_metadata.json")

# ── RF model paths ────────────────────────────────────────────────────────────
RF_MODEL_PATH = os.path.join(BASE_DIR, "rf_anomaly_model.pkl")
RF_SCALER_PATH = os.path.join(BASE_DIR, "rf_scaler.pkl")
RF_ISO_PATH = os.path.join(BASE_DIR, "rf_isolation_forest.pkl")
RF_METADATA_PATH = os.path.join(BASE_DIR, "rf_metadata.json")

# Ensemble weights
LSTM_ANOMALY_WEIGHT = 0.55
RF_ANOMALY_WEIGHT = 0.45


def _debug(message: str) -> None:
    if os.getenv("DEBUG_PREDICT") == "1":
        print(f"[predict] {message}")


# ─────────────────────────────────────────────────────────────────────────────
# DEFAULT CONSTANTS
# ─────────────────────────────────────────────────────────────────────────────

DEFAULT_FEATURE_COLUMNS = [
    "LengthofCycle",
    "LengthofMenses",
    "LengthofLutealPhase",
    "TotalDaysofFertility",
    "MeanBleedingIntensity",
    "TotalMensesScore",
    "UnusualBleeding",
    "Age",
    "BMI",
    "stress_level",
    "sleep_hours",
    "diet_enc",
    "exercise_enc",
]

DEFAULT_SYMPTOM_CLASSES = [
    "Bloating",
    "Cramps",
    "Fatigue",
    "Headache",
    "Mood Swings",
    "None",
]

DEFAULT_TARGET_NAMES = [
    "next_cycle_length",
    "period_length",
    "ovulation_day",
]

RF_ENGINEERED_COLS = [
    "cycle_deviation",
    "menses_ratio",
    "luteal_ratio",
    "bleeding_stress_idx",
    "sleep_deficit",
]


# ─────────────────────────────────────────────────────────────────────────────
# UTILITIES
# ─────────────────────────────────────────────────────────────────────────────

def _read_json(path: str) -> Dict[str, Any]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Missing required file: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _build_minmax_scaler(params: Dict[str, Any]) -> MinMaxScaler:
    if not params:
        raise ValueError("Scaler parameters are empty or missing.")

    feature_range = params.get("feature_range", (0, 1))
    scaler = MinMaxScaler(feature_range=tuple(feature_range))

    data_min = params.get("data_min_", params.get("data_min"))
    data_max = params.get("data_max_", params.get("data_max"))
    scale = params.get("scale_", params.get("scale"))
    min_ = params.get("min_", params.get("min"))

    if data_min is None and min_ is not None and scale is not None:
        data_min = (feature_range[0] - np.array(min_)) / np.array(scale)

    if data_min is None:
        raise ValueError("Scaler parameters must include data_min_ or min_ + scale_.")

    data_min = np.array(data_min, dtype=np.float32)

    if data_max is None and scale is not None:
        scale = np.array(scale, dtype=np.float32)
        data_range = (feature_range[1] - feature_range[0]) / np.where(
            scale == 0, 1, scale
        )
        data_max = data_min + data_range
    elif data_max is not None:
        data_max = np.array(data_max, dtype=np.float32)
        data_range = data_max - data_min
    else:
        raise ValueError("Scaler parameters must include data_max_ or scale_.")

    if scale is None:
        scale = (feature_range[1] - feature_range[0]) / np.where(
            data_range == 0, 1, data_range
        )
    if min_ is None:
        min_ = feature_range[0] - data_min * np.array(scale)

    scaler.data_min_ = np.array(data_min)
    scaler.data_max_ = np.array(data_max)
    scaler.data_range_ = np.array(data_range)
    scaler.scale_ = np.array(scale)
    scaler.min_ = np.array(min_)
    scaler.n_features_in_ = data_min.shape[0] if data_min.ndim else 1
    return scaler


def _sigmoid(x: float) -> float:
    return 1.0 / (1.0 + np.exp(-x))


def _engineer_rf_features(cycle: Dict[str, Any]) -> Dict[str, float]:
    """Compute engineered features for a single cycle dict."""
    cycle_len = float(cycle.get("LengthofCycle", 28) or 28)
    menses_len = float(cycle.get("LengthofMenses", 5) or 5)
    luteal_len = float(cycle.get("LengthofLutealPhase", 14) or 14)
    bleeding = float(cycle.get("MeanBleedingIntensity", 3.0) or 3.0)
    stress = float(cycle.get("stress_level", 5) or 5)
    sleep_h = float(cycle.get("sleep_hours", 7) or 7)

    return {
        "cycle_deviation": abs(cycle_len - 28),
        "menses_ratio": menses_len / max(cycle_len, 1),
        "luteal_ratio": luteal_len / max(cycle_len, 1),
        "bleeding_stress_idx": bleeding * stress,
        "sleep_deficit": max(0.0, 8.0 - sleep_h),
    }


# ─────────────────────────────────────────────────────────────────────────────
# RESOURCE LOADERS
# ─────────────────────────────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def _load_lstm_resources() -> Tuple[Any, Dict[str, Any], MinMaxScaler, MinMaxScaler]:
    """Load LSTM model + scalers (cached)."""
    _debug(f"Loading LSTM metadata from: {METADATA_PATH}")
    metadata = _read_json(METADATA_PATH)
    model = None
    load_errors = []

    try:
        if os.path.exists(MODEL_H5_PATH):
            _debug("Trying tf.keras load_model on .h5 file")
            model = tf.keras.models.load_model(MODEL_H5_PATH, compile=False)
    except Exception as exc:
        load_errors.append(f"tf.keras load_model (.h5) failed: {exc}")

    if model is None and os.path.isdir(SAVEDMODEL_DIR):
        keras_metadata = os.path.join(SAVEDMODEL_DIR, "keras_metadata.pb")
        if os.path.exists(keras_metadata):
            try:
                _debug("Trying tf.keras load_model on SavedModel directory")
                model = tf.keras.models.load_model(SAVEDMODEL_DIR, compile=False)
            except Exception as exc:
                load_errors.append(f"tf.keras load_model (SavedModel) failed: {exc}")

    try:
        if model is None:
            _debug("Trying tf.keras load_model on .keras file")
            model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    except Exception as exc:
        load_errors.append(f"tf.keras load_model (.keras) failed: {exc}")

    if model is None and keras is not None:
        try:
            _debug("Trying keras.saving.load_model on .keras file")
            model = keras.saving.load_model(MODEL_PATH, safe_mode=False)
        except Exception as exc:
            load_errors.append(f"keras.saving.load_model failed: {exc}")

    if model is None:
        raise RuntimeError(
            "Unable to load Keras/LSTM model. " + " | ".join(load_errors)
        )

    scaler_cfg = metadata.get("scalers", {})
    feature_scaler_cfg = (
        scaler_cfg.get("feature_scaler")
        or metadata.get("feature_scaler")
        or metadata.get("x_scaler")
    )
    target_scaler_cfg = (
        scaler_cfg.get("target_scaler")
        or metadata.get("target_scaler")
        or metadata.get("y_scaler")
    )

    if not feature_scaler_cfg and "scaler_min" in metadata:
        feature_scaler_cfg = {
            "data_min_": metadata.get("scaler_min"),
            "scale_": metadata.get("scaler_scale"),
            "feature_range": (0, 1),
        }
    if not target_scaler_cfg and "reg_scaler_min" in metadata:
        target_scaler_cfg = {
            "data_min_": metadata.get("reg_scaler_min"),
            "scale_": metadata.get("reg_scaler_scale"),
            "feature_range": (0, 1),
        }

    if not feature_scaler_cfg or not target_scaler_cfg:
        raise ValueError("model_metadata.json is missing scaler parameters.")

    feature_scaler = _build_minmax_scaler(feature_scaler_cfg)
    target_scaler = _build_minmax_scaler(target_scaler_cfg)
    return model, metadata, feature_scaler, target_scaler


@lru_cache(maxsize=1)
def _load_rf_resources() -> Optional[Tuple[Any, Any, Any, Dict[str, Any]]]:
    """Load RF model + scaler + isolation forest (cached). Returns None if not found."""
    if not all(os.path.exists(p) for p in [RF_MODEL_PATH, RF_SCALER_PATH, RF_ISO_PATH]):
        _debug("RF model files not found — RF anomaly detection will be skipped.")
        return None

    _debug("Loading Random Forest anomaly model...")
    with open(RF_MODEL_PATH, "rb") as f:
        rf = pickle.load(f)
    with open(RF_SCALER_PATH, "rb") as f:
        rf_scaler = pickle.load(f)
    with open(RF_ISO_PATH, "rb") as f:
        iso = pickle.load(f)

    rf_meta = {}
    if os.path.exists(RF_METADATA_PATH):
        with open(RF_METADATA_PATH, "r", encoding="utf-8") as f:
            rf_meta = json.load(f)

    _debug("RF model loaded successfully.")
    return rf, rf_scaler, iso, rf_meta


def clear_model_cache() -> None:
    """Clear all cached resources (call after retraining)."""
    _load_lstm_resources.cache_clear()
    _load_rf_resources.cache_clear()


# ─────────────────────────────────────────────────────────────────────────────
# DATA PREPARATION
# ─────────────────────────────────────────────────────────────────────────────

def _sorted_cycles(user_history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not isinstance(user_history, list):
        raise ValueError("user_history must be a list of cycle records.")
    if not user_history:
        raise ValueError("user_history cannot be empty.")

    if all("CycleNumber" in c for c in user_history):
        return sorted(user_history, key=lambda c: c["CycleNumber"])
    if all("cycle_number" in c for c in user_history):
        return sorted(user_history, key=lambda c: c["cycle_number"])
    return user_history


def _build_sequence(
    cycles: List[Dict[str, Any]],
    feature_columns: List[str],
    sequence_length: int,
) -> np.ndarray:
    if len(cycles) < sequence_length:
        raise ValueError(
            f"Need at least {sequence_length} cycles to predict. "
            f"Received {len(cycles)}."
        )

    recent_cycles = cycles[-sequence_length:]
    rows = []
    for idx, cycle in enumerate(recent_cycles, start=1):
        missing = [f for f in feature_columns if f not in cycle]
        if missing:
            raise ValueError(
                f"Cycle {idx} is missing required features: {', '.join(missing)}"
            )
        rows.append([cycle[f] for f in feature_columns])

    return np.array(rows, dtype=np.float32)


def _build_rf_feature_vector(cycles: List[Dict[str, Any]], all_feature_cols: List[str]) -> np.ndarray:
    """
    Build a flat feature vector for RF by aggregating recent cycles.
    Uses the LAST cycle primarily.

    Note: 'isolation_forest_score' is computed at inference time and appended
    AFTER scaling — it must NOT be included in all_feature_cols here.
    """
    last_cycle = cycles[-1]

    # Strip the IsolationForest score column — it's appended separately at inference
    INFERENCE_ONLY = {"isolation_forest_score"}
    base_feature_cols = [
        c for c in all_feature_cols
        if c not in RF_ENGINEERED_COLS and c not in INFERENCE_ONLY
    ]
    engineered_cols = [c for c in RF_ENGINEERED_COLS if c in all_feature_cols]

    row = {}
    for col in base_feature_cols:
        row[col] = float(last_cycle.get(col, 0) or 0)

    # Engineered features on the most-recent cycle
    eng = _engineer_rf_features(last_cycle)
    row.update(eng)

    # Build ordered vector (base + engineered, no isolation_forest_score)
    ordered_cols = base_feature_cols + engineered_cols
    result = [row.get(col, 0.0) for col in ordered_cols]

    return np.array(result, dtype=np.float32).reshape(1, -1)


# ─────────────────────────────────────────────────────────────────────────────
# OUTPUT PARSER (LSTM)
# ─────────────────────────────────────────────────────────────────────────────

def _parse_lstm_outputs(
    outputs: Any,
    target_scaler: MinMaxScaler,
    symptom_classes: List[str],
    anomaly_threshold: float,
) -> Tuple[Dict[str, Any], float]:
    """
    Parse LSTM model outputs.
    Returns (result_dict, lstm_anomaly_probability).
    """
    if isinstance(outputs, (list, tuple)):
        outs = list(outputs)
    else:
        outs = [outputs]

    if len(outs) == 1:
        arr = np.array(outs[0]).reshape(-1)
        expected = 3 + len(symptom_classes) + 1
        if arr.size < expected:
            raise ValueError(
                "Model output shape does not match expected multi-output layout."
            )
        reg_scaled = arr[:3]
        symptom_scores = arr[3: 3 + len(symptom_classes)]
        anomaly_score = float(arr[3 + len(symptom_classes)])
    elif len(outs) >= 5:
        reg_scaled = np.array(
            [np.array(outs[0]).reshape(-1)[0],
             np.array(outs[1]).reshape(-1)[0],
             np.array(outs[2]).reshape(-1)[0]]
        )
        symptom_scores = np.array(outs[3]).reshape(-1)
        anomaly_score = float(np.array(outs[4]).reshape(-1)[0])
    else:
        raise ValueError("Unsupported model output format for multi-output prediction.")

    reg_values = target_scaler.inverse_transform(reg_scaled.reshape(1, -1))[0]

    if symptom_scores.size == 1:
        raw_idx = symptom_scores[0]
        idx = int(round(raw_idx))
        symptom = symptom_classes[idx] if 0 <= idx < len(symptom_classes) else "Unknown"
    else:
        idx = int(np.argmax(symptom_scores))
        symptom = symptom_classes[idx] if idx < len(symptom_classes) else "Unknown"

    if 0.0 <= anomaly_score <= 1.0:
        lstm_anomaly_prob = anomaly_score
    else:
        lstm_anomaly_prob = _sigmoid(anomaly_score)

    result = {
        "next_cycle_length_days": int(round(reg_values[0])),
        "period_length_days": int(round(reg_values[1])),
        "ovulation_day": int(round(reg_values[2])),
        "symptom": symptom,
    }
    return result, lstm_anomaly_prob


# ─────────────────────────────────────────────────────────────────────────────
# PUBLIC API
# ─────────────────────────────────────────────────────────────────────────────

def predict(user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Predict next cycle length, period length, ovulation day, symptom, and anomaly flag.
    Anomaly detection uses an ensemble of LSTM + Random Forest.
    """
    _debug("Starting prediction")

    # ── 1. Load resources ──────────────────────────────────────────────────
    model, metadata, feature_scaler, target_scaler = _load_lstm_resources()
    rf_resources = _load_rf_resources()

    # ── 2. Resolve config from metadata ───────────────────────────────────
    feature_columns = (
        metadata.get("feature_columns")
        or metadata.get("features")
        or metadata.get("feature_cols")
        or DEFAULT_FEATURE_COLUMNS
    )

    sequence_length = int(metadata.get("sequence_length", metadata.get("sequence_len", 3)))
    symptom_classes = (
        metadata.get("symptom_classes")
        or metadata.get("symptom_class_names")
        or DEFAULT_SYMPTOM_CLASSES
    )
    anomaly_threshold = float(metadata.get("anomaly_threshold", 0.5))

    # ── 3. Sort & validate cycles ─────────────────────────────────────────
    cycles = _sorted_cycles(user_history)
    _debug(f"Using sequence_length={sequence_length} with {len(feature_columns)} features")

    # ── 4. LSTM prediction ────────────────────────────────────────────────
    X = _build_sequence(cycles, feature_columns, sequence_length)
    X_scaled = feature_scaler.transform(X)
    X_scaled = X_scaled.reshape(1, sequence_length, len(feature_columns))

    _debug(f"LSTM input shape: {X_scaled.shape}")
    lstm_outputs = model.predict(X_scaled, verbose=0)
    _debug("LSTM prediction completed")

    result, lstm_anomaly_prob = _parse_lstm_outputs(
        lstm_outputs, target_scaler, symptom_classes, anomaly_threshold
    )

    # ── 5. RF anomaly prediction ──────────────────────────────────────────
    rf_anomaly_prob = None
    rf_anomaly_flag = None
    rf_confidence = None

    if rf_resources is not None:
        try:
            rf, rf_scaler_obj, iso, rf_meta = rf_resources
            all_rf_features = rf_meta.get("all_features", DEFAULT_FEATURE_COLUMNS + RF_ENGINEERED_COLS)
            rf_threshold = float(rf_meta.get("anomaly_threshold", 0.5))

            X_rf = _build_rf_feature_vector(cycles, all_rf_features)
            X_rf_scaled = rf_scaler_obj.transform(X_rf)
            iso_score = -iso.score_samples(X_rf_scaled).reshape(-1, 1)
            X_rf_aug = np.hstack([X_rf_scaled, iso_score])

            rf_prob = rf.predict_proba(X_rf_aug)[0, 1]
            rf_anomaly_prob = float(rf_prob)
            rf_anomaly_flag = bool(rf_anomaly_prob >= rf_threshold)
            rf_confidence = float(max(rf_prob, 1 - rf_prob))

            _debug(f"RF anomaly prob: {rf_anomaly_prob:.3f} => {rf_anomaly_flag}")
        except Exception as exc:
            _debug(f"RF prediction failed (falling back to LSTM only): {exc}")

    # ── 6. Ensemble anomaly score ─────────────────────────────────────────
    if rf_anomaly_prob is not None:
        ensemble_prob = (
            LSTM_ANOMALY_WEIGHT * lstm_anomaly_prob
            + RF_ANOMALY_WEIGHT * rf_anomaly_prob
        )
        _debug(
            f"Ensemble: LSTM={lstm_anomaly_prob:.3f} * {LSTM_ANOMALY_WEIGHT} "
            f"+ RF={rf_anomaly_prob:.3f} * {RF_ANOMALY_WEIGHT} "
            f"= {ensemble_prob:.3f}"
        )
    else:
        ensemble_prob = lstm_anomaly_prob
        _debug(f"Using LSTM-only anomaly prob: {ensemble_prob:.3f}")

    anomaly_flag = bool(ensemble_prob >= anomaly_threshold)

    # ── 7. Build full response ────────────────────────────────────────────
    result["anomaly"] = anomaly_flag
    result["anomaly_details"] = {
        "ensemble_probability": round(ensemble_prob, 4),
        "lstm_probability": round(lstm_anomaly_prob, 4),
        "rf_probability": round(rf_anomaly_prob, 4) if rf_anomaly_prob is not None else None,
        "rf_available": rf_resources is not None,
        "rf_confidence": round(rf_confidence, 4) if rf_confidence is not None else None,
        "threshold": anomaly_threshold,
        "method": "LSTM+RF ensemble" if rf_anomaly_prob is not None else "LSTM only",
    }

    return result


def predict_anomaly_only(user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Standalone RF-based anomaly detection (no LSTM needed).
    Faster — useful for anomaly-only checks from the /anomaly/detect endpoint.
    """
    _debug("Starting RF-only anomaly detection")

    rf_resources = _load_rf_resources()
    if rf_resources is None:
        raise RuntimeError(
            "Random Forest anomaly model not found. "
            "Please run: python rf_anomaly_model.py"
        )

    rf, rf_scaler_obj, iso, rf_meta = rf_resources
    all_rf_features = rf_meta.get("all_features", DEFAULT_FEATURE_COLUMNS + RF_ENGINEERED_COLS)
    rf_threshold = float(rf_meta.get("anomaly_threshold", 0.5))

    cycles = _sorted_cycles(user_history)

    results = []
    for cycle in cycles:
        X_rf = _build_rf_feature_vector([cycle], all_rf_features)
        X_rf_scaled = rf_scaler_obj.transform(X_rf)
        iso_score = -iso.score_samples(X_rf_scaled).reshape(-1, 1)
        X_rf_aug = np.hstack([X_rf_scaled, iso_score])

        prob = float(rf.predict_proba(X_rf_aug)[0, 1])
        iso_raw = float(iso_score[0, 0])

        cycle_len = float(cycle.get("LengthofCycle", 28) or 28)
        rule_based = cycle_len < 21 or cycle_len > 35

        results.append({
            "anomaly": bool(prob >= rf_threshold),
            "rf_probability": round(prob, 4),
            "isolation_score": round(iso_raw, 4),
            "cycle_length": cycle_len,
            "rule_based_flag": rule_based,
        })

    overall_prob = float(np.mean([r["rf_probability"] for r in results]))

    return {
        "anomaly": bool(overall_prob >= rf_threshold),
        "overall_rf_probability": round(overall_prob, 4),
        "per_cycle": results,
        "num_cycles_analyzed": len(results),
        "model": "RandomForest + IsolationForest",
    }
