const crypto = require("crypto");

const generateOTP = () => {
  const length = Number(process.env.OTP_LENGTH) || 6;

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return crypto.randomInt(min, max + 1).toString();
};

module.exports = generateOTP;