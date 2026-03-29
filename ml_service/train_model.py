import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# -------------------------------
# LOAD DATA
# -------------------------------
data = pd.read_csv("data_with_factors/menstrual_cycle_dataset_with_factors.csv")

# -------------------------------
# DROP USELESS COLUMNS
# -------------------------------
data = data.drop(columns=['User ID', 'Cycle Start Date', 'Next Cycle Start Date'])

# DEBUG PRINT
print("Before encoding:")
print(data.head())

# -------------------------------
# CONVERT ALL TEXT TO NUMBERS
# -------------------------------
for col in data.columns:
    try:
        data[col] = pd.to_numeric(data[col])
    except:
        le = LabelEncoder()
        data[col] = le.fit_transform(data[col])

# DEBUG PRINT
print("After encoding:")
print(data.head())

# -------------------------------
# FEATURES & TARGET
# -------------------------------
X = data.drop("Cycle Length", axis=1)
y = data["Cycle Length"]

# -------------------------------
# ✅ ANOMALY LABEL BANANA
# Agar cycle < 21 ya > 35 days → anomaly = 1
# -------------------------------
anomaly_y = ((y < 21) | (y > 35)).astype(int)
print(f"\n🔍 Anomaly cases: {anomaly_y.sum()} / {len(anomaly_y)}")

# -------------------------------
# TRAIN — Cycle Length Model
# -------------------------------
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)
joblib.dump(model, "cycle_model.pkl")
print("✅ cycle_model.pkl saved!")

# -------------------------------
# TRAIN — Anomaly Detection Model
# -------------------------------
anomaly_model = RandomForestClassifier(n_estimators=100, random_state=42)
anomaly_model.fit(X, anomaly_y)
joblib.dump(anomaly_model, "anomaly_model.pkl")
print("✅ anomaly_model.pkl saved!")

print("\n🚀 Done! Ab python app.py run karo")
