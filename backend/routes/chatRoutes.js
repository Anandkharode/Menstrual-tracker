// backend/routes/chatRoutes.js
const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");

const {
  getHistory,
  sendMessage,
  mlHealth,
  getHealthProfile,
} = require("../controllers/chatController");

router.get("/history",        auth, getHistory);
router.post("/message",       auth, sendMessage);
router.get("/health",         auth, mlHealth);          // probe ML service status
router.get("/health-profile", auth, getHealthProfile);  // get user's computed health profile

module.exports = router;
