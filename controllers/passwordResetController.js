const User = require("../models/User");
const bcrypt = require("bcryptjs");

const {
  createOTP,
  verifyOTP,
} = require("../services/otpService");

const sendEmail = require("../services/emailService");
const otpTemplate = require("../utils/otpTemplate");

const generateResetToken = require("../utils/generateResetToken");

const {
  successResponse,
  errorResponse,
} = require("../utils/apiResponse");

/* ===========================
   Send Reset OTP
=========================== */

const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(
        res,
        400,
        "Email is required."
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(
        res,
        404,
        "No account found with this email."
      );
    }

    const otp = await createOTP(
      email,
      "password-reset"
    );

    await sendEmail({
      to: email,
      subject: "SecureVault Password Reset OTP",
      html: otpTemplate(otp),
    });

    return successResponse(
      res,
      200,
      "OTP sent successfully."
    );

  } catch (error) {

    console.error(error);

    return errorResponse(
      res,
      500,
      "Unable to send OTP."
    );

  }
};

/* ===========================
   Verify Reset OTP
=========================== */

const verifyResetOTP = async (req, res) => {
  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(
        res,
        400,
        "Email and OTP are required."
      );
    }

    const valid = await verifyOTP(
      email,
      otp,
      "password-reset"
    );

    if (!valid) {
      return errorResponse(
        res,
        400,
        "Invalid or expired OTP."
      );
    }

    const resetToken =
      generateResetToken(email);

    return successResponse(
      res,
      200,
      "OTP verified successfully.",
      {
        resetToken,
      }
    );

  } catch (error) {

    console.error(error);

    return errorResponse(
      res,
      500,
      "OTP verification failed."
    );

  }
};

/* ===========================
   Reset Password
=========================== */

const jwt = require("jsonwebtoken");

const resetPassword = async (req, res) => {

  try {

    const {
      resetToken,
      newPassword,
    } = req.body;

    if (!resetToken || !newPassword) {

      return errorResponse(
        res,
        400,
        "Reset token and new password are required."
      );

    }

    const decoded = jwt.verify(
      resetToken,
      process.env.JWT_SECRET
    );

    if (
      decoded.type !==
      "password-reset"
    ) {
      return errorResponse(
        res,
        401,
        "Invalid reset token."
      );
    }

    const user =
      await User.findOne({
        email: decoded.email,
      });

    if (!user) {

      return errorResponse(
        res,
        404,
        "User not found."
      );

    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await user.save();

    return successResponse(
      res,
      200,
      "Password reset successfully."
    );

  } catch (error) {

    console.error(error);

    return errorResponse(
      res,
      500,
      "Unable to reset password."
    );

  }
};

module.exports = {
  sendResetOTP,
  verifyResetOTP,
  resetPassword,
};