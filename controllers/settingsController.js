const User = require("../models/User");
const Password = require("../models/Password");
const Note = require("../models/Note");
const Identity = require("../models/Identity");
const Vault = require("../models/Vault");

const getSettingsDashboard = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password -masterPassword");

    const [
      passwordCount,
      noteCount,
      identityCount,
      vaultCount,
    ] = await Promise.all([
      Password.countDocuments({ user: req.user.id }),
      Note.countDocuments({ user: req.user.id }),
      Identity.countDocuments({ user: req.user.id }),
      Vault.countDocuments({ user: req.user.id }),
    ]);

    res.json({
      success: true,
      user,
      stats: {
        passwords: passwordCount,
        notes: noteCount,
        identities: identityCount,
        vaults: vaultCount,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getSettingsDashboard,
};