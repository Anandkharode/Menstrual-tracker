// backend/controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "Please fill all fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash: hash });
    await user.save();
    res.status(201).json({ msg: "User registered" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, name: user.name, onboardingCompleted: user.onboardingCompleted });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    updates.onboardingCompleted = true; // Mark as completed when updated
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-passwordHash");
    res.json({ msg: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
