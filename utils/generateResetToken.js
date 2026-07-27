const jwt = require("jsonwebtoken");

const generateResetToken = (email) => {
  return jwt.sign(
    {
      email,
      type: "password-reset",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10m",
    }
  );
};

module.exports = generateResetToken;