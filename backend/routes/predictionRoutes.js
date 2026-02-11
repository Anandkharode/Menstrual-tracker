// backend/routes/predictionRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getLatestPrediction } = require("../controllers/predictionController");

router.get("/me", auth, getLatestPrediction);

module.exports = router;
