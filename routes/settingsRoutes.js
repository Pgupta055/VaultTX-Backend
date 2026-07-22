const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getSettingsDashboard,
} = require("../controllers/settingsController");

router.use(protect);

router.get(
  "/dashboard",
  getSettingsDashboard
);

module.exports = router;