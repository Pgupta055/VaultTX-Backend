const User = require("../models/User");
const Vault = require("../models/Vault");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const UAParser = require("ua-parser-js");
const LoginActivity = require("../models/LoginActivity");
const Password = require("../models/Password");
const Note = require("../models/Note");
const Identity = require("../models/Identity");
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const register = async (req, res) => {
  try {

   const {
  fullName,
  email,
  password,
  masterPassword,
} = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedMasterPassword = await bcrypt.hash(
  masterPassword,
  10
);
    // Create user
    const user = await User.create({
  fullName,
  email,
  password: hashedPassword,
  masterPassword: hashedMasterPassword,
});
// await Vault.create({
//   user: user._id,
//   name: "Personal",
//   icon: "🏠",
//   color: "#7C3AED",
//   isDefault: true,
// });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    await Promise.all([
      Password.deleteMany({ user: req.user.id }),
      Note.deleteMany({ user: req.user.id }),
      Identity.deleteMany({ user: req.user.id }),
      Vault.deleteMany({ user: req.user.id }),
      LoginActivity.deleteMany({ user: req.user.id }),
    ]);

    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: "Account deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });

    }

    const token = generateToken(user._id);
    const parser = new UAParser(req.headers["user-agent"]);
const result = parser.getResult();

await LoginActivity.create({
  user: user._id,

  browser: result.browser.name || "Unknown",

  os: result.os.name || "Unknown",

  device:
    result.device.type === "mobile"
      ? "Mobile"
      : result.device.type === "tablet"
      ? "Tablet"
      : "Desktop",

  ipAddress:
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.ip,

  userAgent: req.headers["user-agent"],
});

    res.status(200).json({

      success: true,

      token,

      user: {

        id: user._id,
        fullName: user.fullName,
        email: user.email,

      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,
      message: "Server Error",

    });

  }

};
const changePassword = async (req, res) => {
  try {

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const changeMasterPassword = async (req, res) => {
  try {

    const {
      currentMasterPassword,
      newMasterPassword,
    } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      currentMasterPassword,
      user.masterPassword
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current Master Password is incorrect.",
      });
    }

    user.masterPassword =
      await bcrypt.hash(
        newMasterPassword,
        10
      );

    await user.save();

    res.json({
      success: true,
      message:
        "Master Password updated successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const verifyMasterPassword = async (req, res) => {
  try {
    const { masterPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      masterPassword,
      user.masterPassword
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect master password.",
      });
    }

    res.json({
      success: true,
      message: "Master password verified.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
module.exports = {
  register,
  login,
  verifyMasterPassword,
  getProfile,
  deleteAccount,
  changePassword,
  changeMasterPassword,
};