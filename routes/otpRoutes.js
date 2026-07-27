const express = require("express");

const router = express.Router();

const {
  sendRegistrationOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,
} = require("../controllers/otpController");

router.post(
  "/send-registration-otp",
  sendRegistrationOTP
);

router.post(
  "/verify-registration-otp",
  verifyRegistrationOTP
);

router.post(
  "/resend-registration-otp",
  resendRegistrationOTP
);

module.exports = router;