"""
Random Forest Anomaly Detector — Menstrual Tracker
====================================================
Trains on flattened cycle features (no time sequences needed).
Detects anomalous cycles (length outside 21–35 days range + unusual patterns).

Saves:
  - rf_anomaly_model.pkl   : trained RandomForestClassifier
  - rf_scaler.pkl          : fitted StandardScaler for features
  - rf_metadata.json       : feature names, thresholds, metrics
"""

import warnings
warnings.filterwarnings("ignore")

import json
import os
import pickle

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score, f1_score
)

BASE_DIR = os.path.dirname(__file__)

# ─────────────────────────────────────────────
# FEATURE COLUMNS (same as LSTM for consistency)
# ─────────────────────────────────────────────
FEATURE_COLS = [
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

# Additional engineered features for RF (tabular model can use more derived feats)
ENGINEERED_COLS = [
    "cycle_deviation",       # |LengthofCycle - 28|
    "menses_ratio",          # LengthofMenses / LengthofCycle
    "luteal_ratio",          # LengthofLutealPhase / LengthofCycle
    "bleeding_stress_idx",   # MeanBleedingIntensity * stress_level
    "sleep_deficit",         # max(0, 8 - sleep_hours)
]

ALL_FEATURE_COLS = FEATURE_COLS + ENGINEERED_COLS


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add engineered features to the dataframe."""
    df = df.copy()

    df["LengthofCycle"] = pd.to_numeric(df["LengthofCycle"], errors="coerce").fillna(28)
    df["LengthofMenses"] = pd.to_numeric(df["LengthofMenses"], errors="coerce").fillna(5)
    df["LengthofLutealPhase"] = pd.to_numeric(df["LengthofLutealPhase"], errors="coerce").fillna(14)
    df["MeanBleedingIntensity"] = pd.to_numeric(df["MeanBleedingIntensity"], errors="coerce").fillna(3.0)
    df["stress_level"] = pd.to_numeric(df.get("stress_level", pd.Series(dtype=float)), errors="coerce").fillna(5)
    df["sleep_hours"] = pd.to_numeric(df.get("sleep_hours", pd.Series(dtype=float)), errors="coerce").fillna(7)

    df["cycle_deviation"] = (df["LengthofCycle"] - 28).abs()
    df["menses_ratio"] = df["LengthofMenses"] / df["LengthofCycle"].replace(0, 1)
    df["luteal_ratio"] = df["LengthofLutealPhase"] / df["LengthofCycle"].replace(0, 1)
    df["bleeding_stress_idx"] = df["MeanBleedingIntensity"] * df["stress_level"]
    df["sleep_deficit"] = (8 - df["sleep_hours"]).clip(lower=0)

    return df


def train_rf_anomaly_model(
    X: np.ndarray,
    y: np.ndarray,
    feature_names: list,
    save_dir: str = BASE_DIR,
) -> dict:
    """
    Train Random Forest classifier for anomaly detection.

    Parameters
    ----------
    X : np.ndarray, shape (n_samples, n_features)
    y : np.ndarray, shape (n_samples,) — binary labels (1=anomaly, 0=normal)
    feature_names : list of str
    save_dir : str

    Returns
    -------
    metrics : dict
    """
    print("=" * 60)
    print("Random Forest Anomaly Model — Training")
    print("=" * 60)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # Scale features for consistency
    scaler = StandardScaler()
    X_train_sc = scaler.fit_transform(X_train)
    X_test_sc = scaler.transform(X_test)

    # ── Isolation Forest for unsupervised anomaly score as extra feature ──
    iso = IsolationForest(n_estimators=200, contamination="auto", random_state=42)
    iso.fit(X_train_sc)
    iso_train_scores = -iso.score_samples(X_train_sc).reshape(-1, 1)  # positive = anomalous
    iso_test_scores = -iso.score_samples(X_test_sc).reshape(-1, 1)

    X_train_aug = np.hstack([X_train_sc, iso_train_scores])
    X_test_aug = np.hstack([X_test_sc, iso_test_scores])

    # ── Random Forest classifier ──
    anomaly_rate = y.mean()
    class_weight = {0: 1.0, 1: max(1.0, (1 - anomaly_rate) / max(anomaly_rate, 0.01))}

    rf = RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight=class_weight,
        random_state=42,
        n_jobs=-1,
    )
    rf.fit(X_train_aug, y_train)

    # ── Evaluate ──
    y_pred = rf.predict(X_test_aug)
    y_prob = rf.predict_proba(X_test_aug)[:, 1]

    f1 = f1_score(y_test, y_pred, zero_division=0)
    auc = roc_auc_score(y_test, y_prob) if len(np.unique(y_test)) > 1 else 0.5
    acc = (y_pred == y_test).mean()

    # Cross-val F1 on full dataset
    X_full_sc = scaler.transform(X)
    iso_full = -iso.score_samples(X_full_sc).reshape(-1, 1)
    X_full_aug = np.hstack([X_full_sc, iso_full])
    cv_f1 = cross_val_score(rf, X_full_aug, y, cv=5, scoring="f1", n_jobs=-1).mean()

    print(f"\n  Test Accuracy : {acc:.1%}")
    print(f"  Test F1 Score : {f1:.3f}")
    print(f"  AUC-ROC       : {auc:.3f}")
    print(f"  5-Fold CV F1  : {cv_f1:.3f}")
    print(f"\n  Classification Report:\n")
    print(classification_report(y_test, y_pred, target_names=["Normal", "Anomaly"], zero_division=0))

    print("\n  Top 10 Feature Importances:")
    feat_names_aug = feature_names + ["isolation_forest_score"]
    importances = rf.feature_importances_
    top_idx = np.argsort(importances)[::-1][:10]
    for rank, i in enumerate(top_idx, 1):
        print(f"    {rank:2d}. {feat_names_aug[i]:<35s} {importances[i]:.4f}")

    # ── Save ──
    model_path = os.path.join(save_dir, "rf_anomaly_model.pkl")
    scaler_path = os.path.join(save_dir, "rf_scaler.pkl")
    iso_path = os.path.join(save_dir, "rf_isolation_forest.pkl")
    meta_path = os.path.join(save_dir, "rf_metadata.json")

    with open(model_path, "wb") as f:
        pickle.dump(rf, f)
    with open(scaler_path, "wb") as f:
        pickle.dump(scaler, f)
    with open(iso_path, "wb") as f:
        pickle.dump(iso, f)

    feature_importances = {
        feat_names_aug[i]: float(importances[i]) for i in range(len(feat_names_aug))
    }

    metadata = {
        "model_type": "RandomForestClassifier",
        "feature_columns": feature_names,
        "engineered_features": ENGINEERED_COLS,
        "all_features": feat_names_aug,
        "n_estimators": 300,
        "anomaly_threshold": 0.5,
        "anomaly_rate_train": float(round(anomaly_rate, 4)),
        "metrics": {
            "test_accuracy": round(float(acc), 4),
            "test_f1": round(float(f1), 4),
            "auc_roc": round(float(auc), 4),
            "cv_f1_5fold": round(float(cv_f1), 4),
        },
        "feature_importances": feature_importances,
    }

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n  ✓ RF model saved    : {model_path}")
    print(f"  ✓ Scaler saved      : {scaler_path}")
    print(f"  ✓ IsoForest saved   : {iso_path}")
    print(f"  ✓ Metadata saved    : {meta_path}")

    return metadata["metrics"]


def build_training_data_from_cycles(cycles: list) -> tuple:
    """
    Build (X, y) from a list of cycle dicts.
    Used for incremental / online retraining from user-submitted data.

    Parameters
    ----------
    cycles : list of dict — each dict has the feature columns + optionally 'anomaly_flag'

    Returns
    -------
    X : np.ndarray
    y : np.ndarray (binary; inferred from cycle length if 'anomaly_flag' missing)
    """
    records = []
    labels = []
    for c in cycles:
        row = {}
        for col in FEATURE_COLS:
            row[col] = float(c.get(col, 0) or 0)
        records.append(row)

        # Label: explicit flag or rule-based
        if "anomaly_flag" in c:
            labels.append(int(c["anomaly_flag"]))
        else:
            cycle_len = row["LengthofCycle"]
            labels.append(1 if cycle_len < 21 or cycle_len > 35 else 0)

    df = pd.DataFrame(records)
    df = engineer_features(df)

    for col in ALL_FEATURE_COLS:
        if col not in df.columns:
            df[col] = 0.0
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    X = df[ALL_FEATURE_COLS].values.astype(np.float32)
    y = np.array(labels, dtype=np.int32)
    return X, y


if __name__ == "__main__":
    # ── Standalone execution: generate synthetic training data and train ──
    print("Generating synthetic training dataset for RF anomaly model...")

    rng = np.random.default_rng(42)
    n_normal = 1200
    n_anomaly = 200

    def make_cycles(n, anomalous=False):
        rows = []
        for _ in range(n):
            if anomalous:
                cycle_len = rng.choice([
                    rng.integers(10, 20),   # too short
                    rng.integers(36, 55),   # too long
                ])
                stress = rng.integers(7, 10)
                sleep_h = rng.uniform(4, 6)
                bleeding = rng.uniform(4.5, 6.0)
                unusual_bleed = 1
            else:
                cycle_len = rng.integers(21, 36)
                stress = rng.integers(1, 7)
                sleep_h = rng.uniform(6, 9)
                bleeding = rng.uniform(1.5, 4.0)
                unusual_bleed = 0

            menses = min(rng.integers(3, 8), cycle_len - 1)
            luteal = max(1, cycle_len - menses - rng.integers(5, 10))
            rows.append({
                "LengthofCycle": cycle_len,
                "LengthofMenses": menses,
                "LengthofLutealPhase": luteal,
                "TotalDaysofFertility": max(1, luteal - 2),
                "MeanBleedingIntensity": round(bleeding, 2),
                "TotalMensesScore": round(bleeding * menses, 1),
                "UnusualBleeding": unusual_bleed,
                "Age": rng.integers(18, 45),
                "BMI": round(rng.uniform(18, 35), 1),
                "stress_level": stress,
                "sleep_hours": round(sleep_h, 1),
                "diet_enc": rng.integers(0, 3),
                "exercise_enc": rng.integers(0, 4),
                "anomaly_flag": 1 if anomalous else 0,
            })
        return rows

    cycles_data = make_cycles(n_normal, anomalous=False) + make_cycles(n_anomaly, anomalous=True)
    rng.shuffle(cycles_data)

    X, y = build_training_data_from_cycles(cycles_data)
    print(f"  Dataset size : {len(X)} samples, {X.shape[1]} features")
    print(f"  Anomaly rate : {y.mean():.1%}")

    metrics = train_rf_anomaly_model(X, y, feature_names=ALL_FEATURE_COLS)

    print("\n✅ Random Forest anomaly model training complete!")
    print(f"   Metrics: {metrics}")
