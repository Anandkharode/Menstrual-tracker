// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MongoDB connection error: MONGO_URI is not set.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 10000,
      family: 4 // Forces Mongoose to use IPv4 instead of IPv6 resolving issues
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.error(
      "Check your Atlas Network Access IP allowlist, database user credentials, and MONGO_URI."
    );
    process.exit(1);
  }
};

module.exports = connectDB;