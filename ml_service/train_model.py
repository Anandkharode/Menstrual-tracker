import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Input
from sklearn.preprocessing import MinMaxScaler

# -------------------------------
# 1. TRAINING DATA
# -------------------------------
X_raw = np.array([
    [28, 29, 27, 28, 28],
    [30, 31, 29, 30, 31],
    [27, 28, 27, 26, 28],
    [29, 30, 29, 30, 31],
    [28, 28, 29, 28, 29],
    [31, 32, 30, 31, 32]
])

y_raw = np.array([28, 32, 27, 31, 29, 33])

# -------------------------------
# 2. NORMALIZE
# -------------------------------
scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()

X_scaled = scaler_X.fit_transform(X_raw)
y_scaled = scaler_y.fit_transform(y_raw.reshape(-1, 1))

X = X_scaled.reshape(X_scaled.shape[0], 5, 1)
y = y_scaled

# -------------------------------
# 3. BUILD MODEL
# -------------------------------
model = Sequential([
    Input(shape=(5, 1)),
    LSTM(32),
    Dense(1)
])

model.compile(optimizer="adam", loss="mse")

# -------------------------------
# 4. TRAIN MODEL  ✅ ADD HERE
# -------------------------------
model.fit(X, y, epochs=300, verbose=1)

# -------------------------------
# 5. SAVE MODEL  ✅ ADD HERE
# -------------------------------
model.save("cycle_lstm_model.h5")

print("✅ Model trained and saved as cycle_lstm_model.h5")
