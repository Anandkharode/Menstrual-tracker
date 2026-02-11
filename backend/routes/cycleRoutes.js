// backend/routes/cycleRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createCycle, getCycles } = require("../controllers/cycleController");

router.post("/", auth, createCycle);
router.get("/", auth, getCycles);

module.exports = router;
