// server/models/User.js
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now },
  dob: Date,
  lifestyle: String,
  workout: String,
  diet: String,
  weight: Number,
  height: Number,
  sleepHours: Number,
  lastPeriodDate: Date,
  onboardingCompleted: { type: Boolean, default: false }
});
module.exports = mongoose.model("User", UserSchema);

