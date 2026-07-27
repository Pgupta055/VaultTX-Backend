const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // NEW: Check if session still exists
      const session = await Session.findOne({ token });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again.",
        });
      }

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found.",
        });
      }

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. No Token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = protect;