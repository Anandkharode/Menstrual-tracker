// backend/routes/symptomRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { logSymptoms } = require("../controllers/symptomController");

router.post("/", auth, logSymptoms);

module.exports = router;
