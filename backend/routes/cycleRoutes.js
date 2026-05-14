// backend/routes/cycleRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createCycle, getCycles, deleteCycle } = require("../controllers/cycleController");

router.post("/", auth, createCycle);
router.get("/", auth, getCycles);
router.delete("/:id", auth, deleteCycle);

module.exports = router;
