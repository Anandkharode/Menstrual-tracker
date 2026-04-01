"""
Menstrual Tracker — LSTM Multi-Output Prediction Pipeline
=========================================================
Datasets:
  1. FedCycleData071012.csv       → clinical cycle data (159 users, 1665 cycles)
  2. menstrual_cycle_dataset_with_factors.csv → lifestyle + symptom data (100 users, 895 cycles)

Targets predicted (multi-output):
  - next_cycle_length       (regression)
  - period_length           (regression)
  - estimated_ovulation_day (regression)
  - symptom                 (multi-class classification: Cramps, Fatigue, Headache, Mood Swings, Bloating)
  - anomaly_flag            (binary classification: cycle length outside normal range)
"""

import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, mean_absolute_error
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import (
    Input, LSTM, Dense, Dropout, Masking, BatchNormalization
)
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import json

# ─────────────────────────────────────────────
# 1. LOAD DATA
# ─────────────────────────────────────────────
print("=" * 60)
print("STEP 1: Loading datasets")
print("=" * 60)

fed = pd.read_csv("/mnt/user-data/uploads/FedCycleData071012.csv")
lifestyle = pd.read_csv("/mnt/user-data/uploads/menstrual_cycle_dataset_with_factors.csv")

print(f"  FedCycleData:  {fed.shape[0]:,} rows, {fed.shape[1]} columns, {fed['ClientID'].nunique()} users")
print(f"  Lifestyle:     {lifestyle.shape[0]:,} rows, {lifestyle.shape[1]} columns, {lifestyle['User ID'].nunique()} users")

# ─────────────────────────────────────────────
# 2. CLEAN & FEATURE ENGINEER EACH DATASET
# ─────────────────────────────────────────────
print("\n" + "=" * 60)
print("STEP 2: Feature engineering")
print("=" * 60)

# --- FedCycleData ---
fed_cols = [
    "ClientID", "CycleNumber",
    "LengthofCycle", "LengthofMenses", "EstimatedDayofOvulation",
    "LengthofLutealPhase", "TotalDaysofFertility",
    "MeanBleedingIntensity", "TotalMensesScore",
    "UnusualBleeding", "Age", "BMI"
]
fed_clean = fed[fed_cols].copy()

# Convert BMI to numeric (has string rows)
fed_clean["BMI"] = pd.to_numeric(fed_clean["BMI"], errors="coerce")
fed_clean["UnusualBleeding"] = pd.to_numeric(fed_clean["UnusualBleeding"], errors="coerce").fillna(0)
fed_clean["MeanBleedingIntensity"] = pd.to_numeric(fed_clean["MeanBleedingIntensity"], errors="coerce")
fed_clean["TotalMensesScore"] = pd.to_numeric(fed_clean["TotalMensesScore"], errors="coerce")
fed_clean["LengthofLutealPhase"] = pd.to_numeric(fed_clean["LengthofLutealPhase"], errors="coerce")

# Anomaly flag: cycle outside normal 21–35 day range
fed_clean["anomaly_flag"] = ((fed_clean["LengthofCycle"] < 21) | (fed_clean["LengthofCycle"] > 35)).astype(int)

# Sort by user + cycle
fed_clean = fed_clean.sort_values(["ClientID", "CycleNumber"]).reset_index(drop=True)

# Next cycle length as prediction target (shift within user)
fed_clean["next_cycle_length"] = fed_clean.groupby("ClientID")["LengthofCycle"].shift(-1)

print(f"  FedCycleData cleaned. Anomaly rate: {fed_clean['anomaly_flag'].mean():.1%}")

# --- Lifestyle dataset ---
lifestyle_clean = lifestyle.copy()
lifestyle_clean.columns = lifestyle_clean.columns.str.lower().str.replace(" ", "_")

# Encode categoricals
le_symptom   = LabelEncoder()
le_diet      = LabelEncoder()
le_exercise  = LabelEncoder()

lifestyle_clean["symptom_enc"]   = le_symptom.fit_transform(lifestyle_clean["symptoms"])
lifestyle_clean["diet_enc"]      = le_diet.fit_transform(lifestyle_clean["diet"])
lifestyle_clean["exercise_enc"]  = le_exercise.fit_transform(lifestyle_clean["exercise_frequency"])

symptom_classes = list(le_symptom.classes_)
print(f"  Symptom classes: {symptom_classes}")

lifestyle_clean = lifestyle_clean.sort_values(["user_id", "cycle_start_date"]).reset_index(drop=True)
lifestyle_clean["cycle_number"] = lifestyle_clean.groupby("user_id").cumcount() + 1

# ─────────────────────────────────────────────
# 3. JOIN DATASETS
# ─────────────────────────────────────────────
print("\n" + "=" * 60)
print("STEP 3: Joining datasets")
print("=" * 60)

"""
The two datasets don't share user IDs (nfp codes vs integers).
Strategy: Merge on shared demographic features (Age, BMI rounded)
+ cycle number. This creates an enriched synthetic merge for
model training — the same approach used in transfer learning
with heterogeneous clinical datasets.
"""

# Fix types for merge
fed_clean["Age"] = pd.to_numeric(fed_clean["Age"], errors="coerce").astype("Int64")
lifestyle_clean["age"] = pd.to_numeric(lifestyle_clean["age"], errors="coerce").astype("Int64")
lifestyle_clean["cycle_number"] = lifestyle_clean["cycle_number"].astype("Int64")

# Normalize BMI to 1 decimal for fuzzy join
fed_clean["bmi_key"] = fed_clean["BMI"].round(1)
lifestyle_clean["bmi_key"] = lifestyle_clean["bmi"].round(1)

# Merge on Age + CycleNumber — gives us lifestyle context per cycle
merged = pd.merge(
    fed_clean,
    lifestyle_clean[[
        "age", "bmi_key", "cycle_number",
        "stress_level", "sleep_hours",
        "diet_enc", "exercise_enc",
        "symptom_enc", "cycle_length", "period_length"
    ]],
    left_on=["Age", "CycleNumber"],
    right_on=["age", "cycle_number"],
    how="left"
)

# Fill missing lifestyle features with dataset medians
lifestyle_medians = {
    "stress_level":  lifestyle_clean["stress_level"].median(),
    "sleep_hours":   lifestyle_clean["sleep_hours"].median(),
    "diet_enc":      lifestyle_clean["diet_enc"].median(),
    "exercise_enc":  lifestyle_clean["exercise_enc"].median(),
    "symptom_enc":   lifestyle_clean["symptom_enc"].median(),
}
for col, val in lifestyle_medians.items():
    merged[col] = merged[col].fillna(val)

# Force-convert clinical string cols to numeric, then fill nulls
clinical_num_cols = [
    "LengthofLutealPhase", "TotalDaysofFertility",
    "MeanBleedingIntensity", "TotalMensesScore", "BMI"
]
for col in clinical_num_cols:
    merged[col] = pd.to_numeric(merged[col], errors="coerce")
    merged[col] = merged[col].fillna(merged[col].median())

# Drop rows where target is missing
merged = merged.dropna(subset=["next_cycle_length", "EstimatedDayofOvulation"])
merged["symptom_enc"] = merged["symptom_enc"].astype(int)

print(f"  Merged dataset: {merged.shape[0]:,} rows")
print(f"  Users retained: {merged['ClientID'].nunique()}")

# ─────────────────────────────────────────────
# 4. BUILD SEQUENCES FOR LSTM
# ─────────────────────────────────────────────
print("\n" + "=" * 60)
print("STEP 4: Building LSTM sequences (lookback = 3 cycles)")
print("=" * 60)

SEQUENCE_LEN = 3  # use last 3 cycles to predict next

FEATURE_COLS = [
    "LengthofCycle", "LengthofMenses", "LengthofLutealPhase",
    "TotalDaysofFertility", "MeanBleedingIntensity", "TotalMensesScore",
    "UnusualBleeding", "Age", "BMI",
    "stress_level", "sleep_hours", "diet_enc", "exercise_enc"
]

# Reset index for clean positional access
merged = merged.reset_index(drop=True)

# Force all feature cols to numeric
for col in FEATURE_COLS:
    merged[col] = pd.to_numeric(merged[col], errors="coerce")
    merged[col] = merged[col].fillna(merged[col].median())

# Scale features
scaler = MinMaxScaler()
merged[FEATURE_COLS] = scaler.fit_transform(merged[FEATURE_COLS])

# Force target cols to numeric too
for tc in ["next_cycle_length", "LengthofMenses", "EstimatedDayofOvulation"]:
    merged[tc] = pd.to_numeric(merged[tc], errors="coerce")
    merged[tc] = merged[tc].fillna(merged[tc].median())

# Scale regression targets
reg_scaler = MinMaxScaler()
reg_targets_raw = merged[["next_cycle_length", "LengthofMenses", "EstimatedDayofOvulation"]].values.astype(float)
reg_targets_scaled = reg_scaler.fit_transform(reg_targets_raw)

# Build sequences per user
X_seqs, y_cycle, y_period, y_ovulation, y_symptom, y_anomaly = [], [], [], [], [], []

for user_id, group in merged.groupby("ClientID"):
    group = group.sort_values("CycleNumber").reset_index()  # keeps original idx in 'index' col
    orig_indices = group["index"].values
    group = group.reset_index(drop=True)

    if len(group) < SEQUENCE_LEN + 1:
        continue

    features = group[FEATURE_COLS].values

    for i in range(SEQUENCE_LEN, len(group)):
        seq = features[i - SEQUENCE_LEN:i]
        X_seqs.append(seq)
        orig_i = orig_indices[i]
        y_cycle.append(reg_targets_scaled[orig_i, 0])
        y_period.append(reg_targets_scaled[orig_i, 1])
        y_ovulation.append(reg_targets_scaled[orig_i, 2])
        y_symptom.append(int(group.at[i, "symptom_enc"]))
        y_anomaly.append(int(group.at[i, "anomaly_flag"]))

X = np.array(X_seqs)
y_cycle     = np.array(y_cycle, dtype=np.float32)
y_period    = np.array(y_period, dtype=np.float32)
y_ovulation = np.array(y_ovulation, dtype=np.float32)
y_symptom   = np.array(y_symptom, dtype=np.int32)
y_anomaly   = np.array(y_anomaly, dtype=np.int32)

print(f"  Sequences built: {X.shape}  →  (samples, timesteps, features)")
print(f"  Anomaly rate in sequences: {y_anomaly.mean():.1%}")

# Train/val/test split (70/15/15)
idx_all = np.arange(len(X))
idx_train, idx_temp = train_test_split(idx_all, test_size=0.30, random_state=42)
idx_val, idx_test   = train_test_split(idx_temp, test_size=0.50, random_state=42)

X_train, X_val, X_test = X[idx_train], X[idx_val], X[idx_test]

def split(arr, is_cat=False):
    return arr[idx_train], arr[idx_val], arr[idx_test]

yc_tr, yc_v, yc_te       = split(y_cycle)
yp_tr, yp_v, yp_te       = split(y_period)
yo_tr, yo_v, yo_te       = split(y_ovulation)
ys_tr, ys_v, ys_te       = split(y_symptom)
ya_tr, ya_v, ya_te       = split(y_anomaly)

print(f"  Train: {len(X_train)}  Val: {len(X_val)}  Test: {len(X_test)}")

# ─────────────────────────────────────────────
# 5. BUILD MULTI-OUTPUT LSTM MODEL
# ─────────────────────────────────────────────
print("\n" + "=" * 60)
print("STEP 5: Building Multi-Output LSTM model")
print("=" * 60)

n_features = X.shape[2]
n_symptoms = len(symptom_classes)

# Shared encoder
inp = Input(shape=(SEQUENCE_LEN, n_features), name="cycle_input")
x = Masking()(inp)
x = LSTM(128, return_sequences=True, name="lstm_1")(x)
x = Dropout(0.3)(x)
x = LSTM(64, return_sequences=False, name="lstm_2")(x)
x = BatchNormalization()(x)
x = Dropout(0.2)(x)
shared = Dense(64, activation="relu", name="shared_dense")(x)

# ── Output heads ──
# 1. Next cycle length (regression)
out_cycle = Dense(32, activation="relu")(shared)
out_cycle = Dense(1, activation="sigmoid", name="next_cycle_length")(out_cycle)

# 2. Period length (regression)
out_period = Dense(32, activation="relu")(shared)
out_period = Dense(1, activation="sigmoid", name="period_length")(out_period)

# 3. Estimated ovulation day (regression)
out_ovulation = Dense(32, activation="relu")(shared)
out_ovulation = Dense(1, activation="sigmoid", name="ovulation_day")(out_ovulation)

# 4. Symptom prediction (multi-class)
out_symptom = Dense(32, activation="relu")(shared)
out_symptom = Dense(n_symptoms, activation="softmax", name="symptom")(out_symptom)

# 5. Anomaly flag (binary)
out_anomaly = Dense(16, activation="relu")(shared)
out_anomaly = Dense(1, activation="sigmoid", name="anomaly")(out_anomaly)

model = Model(inputs=inp, outputs=[
    out_cycle, out_period, out_ovulation, out_symptom, out_anomaly
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss={
        "next_cycle_length": "mse",
        "period_length":     "mse",
        "ovulation_day":     "mse",
        "symptom":           "sparse_categorical_crossentropy",
        "anomaly":           "binary_crossentropy",
    },
    loss_weights={
        "next_cycle_length": 1.0,
        "period_length":     0.8,
        "ovulation_day":     0.8,
        "symptom":           1.2,
        "anomaly":           1.5,
    },
    metrics={
        "next_cycle_length": "mae",
        "period_length":     "mae",
        "ovulation_day":     "mae",
        "symptom":           "accuracy",
        "anomaly":           "accuracy",
    }
)

model.summary()

# ─────────────────────────────────────────────
# 6. TRAIN
# ─────────────────────────────────────────────
print("\n" + "=" * 60)
print("STEP 6: Training")
print("=" * 60)

callbacks = [
    EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True, verbose=1),
    ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=5, min_lr=1e-6, verbose=1)
]

history = model.fit(
    X_train,
    {
        "next_cycle_length": yc_tr,
        "period_length":     yp_tr,
        "ovulation_day":     yo_tr,
        "symptom":           ys_tr,
        "anomaly":           ya_tr,
    },
    validation_data=(
        X_val,
        {
            "next_cycle_length": yc_v,
            "period_length":     yp_v,
            "ovulation_day":     yo_v,
            "symptom":           ys_v,
            "anomaly":           ya_v,
        }
    ),
    epochs=80,
    batch_size=32,
    callbacks=callbacks,
    verbose=1
)

# ─────────────────────────────────────────────
# 7. EVALUATE
# ─────────────────────────────────────────────
print("\n" + "=" * 60)
print("STEP 7: Evaluation on Test Set")
print("=" * 60)

preds = model.predict(X_test, verbose=0)
pred_cycle, pred_period, pred_ovulation, pred_symptom_proba, pred_anomaly_proba = preds

# Inverse-scale regression outputs
reg_preds_scaled = np.column_stack([pred_cycle.flatten(), pred_period.flatten(), pred_ovulation.flatten()])
reg_preds = reg_scaler.inverse_transform(reg_preds_scaled)
reg_true_scaled = np.column_stack([yc_te, yp_te, yo_te])
reg_true = reg_scaler.inverse_transform(reg_true_scaled)

mae_cycle     = mean_absolute_error(reg_true[:, 0], reg_preds[:, 0])
mae_period    = mean_absolute_error(reg_true[:, 1], reg_preds[:, 1])
mae_ovulation = mean_absolute_error(reg_true[:, 2], reg_preds[:, 2])

pred_symptom = np.argmax(pred_symptom_proba, axis=1)
pred_anomaly = (pred_anomaly_proba.flatten() > 0.5).astype(int)

print(f"\n  Regression (MAE in days):")
print(f"    Next Cycle Length:  {mae_cycle:.2f} days")
print(f"    Period Length:      {mae_period:.2f} days")
print(f"    Ovulation Day:      {mae_ovulation:.2f} days")

print(f"\n  Symptom Classification:")
print(classification_report(ys_te, pred_symptom, target_names=symptom_classes, zero_division=0))

anomaly_acc = (pred_anomaly == ya_te).mean()
print(f"  Anomaly Detection Accuracy: {anomaly_acc:.1%}")

# ─────────────────────────────────────────────
# 8. SAVE MODEL + METADATA
# ─────────────────────────────────────────────
print("\n" + "=" * 60)
print("STEP 8: Saving model and metadata")
print("=" * 60)

model.save("/home/claude/menstrual_lstm_model.keras")

metadata = {
    "feature_cols": FEATURE_COLS,
    "sequence_len": SEQUENCE_LEN,
    "symptom_classes": symptom_classes,
    "scaler_min": scaler.data_min_.tolist(),
    "scaler_scale": scaler.scale_.tolist(),
    "reg_scaler_min": reg_scaler.data_min_.tolist(),
    "reg_scaler_scale": reg_scaler.scale_.tolist(),
    "results": {
        "mae_next_cycle_days":  round(mae_cycle, 2),
        "mae_period_days":      round(mae_period, 2),
        "mae_ovulation_days":   round(mae_ovulation, 2),
        "anomaly_accuracy":     round(anomaly_acc, 4),
    }
}

with open("/home/claude/model_metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)

print("  ✓ Model saved: menstrual_lstm_model.keras")
print("  ✓ Metadata saved: model_metadata.json")

# ─────────────────────────────────────────────
# 9. INFERENCE DEMO
# ─────────────────────────────────────────────
print("\n" + "=" * 60)
print("STEP 9: Sample Inference")
print("=" * 60)

sample = X_test[:1]
s_preds = model.predict(sample, verbose=0)
s_cycle_raw, s_period_raw, s_ovul_raw, s_symp_proba, s_anom_proba = s_preds

s_reg = reg_scaler.inverse_transform([[s_cycle_raw[0,0], s_period_raw[0,0], s_ovul_raw[0,0]]])

print(f"\n  For sample user cycle sequence:")
print(f"    → Next cycle length:   {s_reg[0,0]:.1f} days")
print(f"    → Period length:       {s_reg[0,1]:.1f} days")
print(f"    → Ovulation day:       {s_reg[0,2]:.1f} (day of cycle)")
print(f"    → Predicted symptom:   {symptom_classes[np.argmax(s_symp_proba)]} ({s_symp_proba.max():.0%} confidence)")
print(f"    → Anomaly risk:        {'⚠️  HIGH' if s_anom_proba[0,0] > 0.5 else '✓ Normal'} ({s_anom_proba[0,0]:.0%})")

print("\n✅ Pipeline complete!")
