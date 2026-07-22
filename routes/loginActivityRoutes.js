const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  getLoginActivity,
} = require("../controllers/loginActivityController");

router.get("/", protect, getLoginActivity);

module.exports = router;