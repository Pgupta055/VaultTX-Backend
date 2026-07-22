const LoginActivity = require("../models/LoginActivity");

const getLoginActivity = async (req, res) => {
  try {
    const activities = await LoginActivity.find({
      user: req.user.id,
    })
      .sort({ loginTime: -1 })
      .limit(20);

    res.json({
      success: true,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getLoginActivity,
};