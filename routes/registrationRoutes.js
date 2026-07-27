const express = require("express");

const router = express.Router();

const {
  sendOTP,
  verifyRegistration,
  resendOTP,
} = require("../controllers/registrationController");

router.post("/send-otp", sendOTP);

router.post("/verify-otp", verifyRegistration);

router.post("/resend-otp", resendOTP);

module.exports = router;