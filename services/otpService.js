const crypto = require("crypto");
const Otp = require("../models/Otp");
const generateOTP = require("../utils/generateOTP");

const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

const createOTP = async (email, purpose) => {
  await Otp.deleteMany({
    email,
    purpose,
  });

  const otp = generateOTP();

  const otpHash = hashOTP(otp);

  const expiresAt = new Date(
    Date.now() +
      Number(process.env.OTP_EXPIRE_MINUTES) *
        60 *
        1000
  );

  await Otp.create({
    email,
    otpHash,
    purpose,
    expiresAt,
  });

  return otp;
};

const verifyOTP = async (email, otp, purpose) => {
  const otpRecord = await Otp.findOne({
    email,
    purpose,
  });

  if (!otpRecord) {
    return {
      success: false,
      message: "OTP not found.",
    };
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    return {
      success: false,
      message: "OTP has expired.",
    };
  }

  if (otpRecord.attempts >= 5) {
    await Otp.deleteOne({
      _id: otpRecord._id,
    });

    return {
      success: false,
      message: "Maximum OTP attempts exceeded.",
    };
  }

  const hashedOTP = hashOTP(otp);

  if (hashedOTP !== otpRecord.otpHash) {
    otpRecord.attempts += 1;
    await otpRecord.save();

    return {
      success: false,
      message: "Invalid OTP.",
    };
  }

  await Otp.deleteOne({
    _id: otpRecord._id,
  });

  return {
    success: true,
    message: "OTP verified successfully.",
  };
};

module.exports = {
  createOTP,
  verifyOTP,
  hashOTP,
};