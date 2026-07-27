const bcrypt = require("bcryptjs");

const User = require("../models/User");

const {
  createPendingUser,
  getPendingUser,
  deletePendingUser,
} = require("../services/pendingUserService");

const {
  createOTP,
  verifyOTP,
} = require("../services/otpService");

const sendEmail = require("../services/emailService");
const otpTemplate = require("../utils/otpTemplate");
const generateToken = require("../utils/generateToken");

const {
  successResponse,
  errorResponse,
} = require("../utils/apiResponse");

const sendOTP = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      masterPassword,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !masterPassword
    ) {
      return errorResponse(
        res,
        400,
        "All fields are required."
      );
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return errorResponse(
        res,
        400,
        "Email already registered."
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const hashedMasterPassword =
      await bcrypt.hash(masterPassword, 10);

    await createPendingUser({
      fullName,
      email,
      password: hashedPassword,
      masterPassword: hashedMasterPassword,
    });

    const otp = await createOTP(
      email,
      "registration"
    );

    await sendEmail({
      to: email,
      subject:
        "SecureVault Email Verification",
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

const verifyRegistration = async (
  req,
  res
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return errorResponse(
        res,
        400,
        "Email and OTP are required."
      );
    }

    const result = await verifyOTP(
      email,
      otp,
      "registration"
    );

    if (!result.success) {
      return errorResponse(
        res,
        400,
        result.message
      );
    }

    const pending =
      await getPendingUser(email);

    if (!pending) {
      return errorResponse(
        res,
        404,
        "Registration expired."
      );
    }

    const user = await User.create({
      fullName: pending.fullName,
      email: pending.email,
      password: pending.password,
      masterPassword:
        pending.masterPassword,
    });

    await deletePendingUser(email);

    return successResponse(
      res,
      200,
      "Registration completed.",
      {
        token: generateToken(user._id),
        user,
      }
    );
  } catch (error) {
    console.error(error);

    return errorResponse(
      res,
      500,
      "Registration failed."
    );
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const pending =
      await getPendingUser(email);

    if (!pending) {
      return errorResponse(
        res,
        404,
        "Registration expired."
      );
    }

    const otp = await createOTP(
    email,
    "registration"
);

    await sendEmail({
      to: email,
      subject:
        "SecureVault Email Verification",
      html: otpTemplate(otp),
    });

    return successResponse(
      res,
      200,
      "OTP resent successfully."
    );
  } catch (error) {
    console.error(error);

    return errorResponse(
      res,
      500,
      "Unable to resend OTP."
    );
  }
};

module.exports = {
  sendOTP,
  verifyRegistration,
  resendOTP,
};