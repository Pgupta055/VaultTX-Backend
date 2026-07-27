const express = require("express");

const {
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
} = require("../controllers/passwordResetController");

const router = express.Router();

/* ===========================
   Password Reset
=========================== */

router.post(
  "/send-otp",
  sendResetOTP
);

router.post(
  "/verify-otp",
  verifyResetOTP
);

router.post(
  "/reset",
  resetPassword
);

module.exports = router;