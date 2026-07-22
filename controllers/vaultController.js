const Vault = require("../models/Vault");
const Password = require("../models/Password");
const Note = require("../models/Note");
const Identity = require("../models/Identity");
const createVault = async (req, res) => {
  try {
    const { name, icon, color } = req.body;

    const exists = await Vault.findOne({
      user: req.user.id,
      name,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Vault already exists.",
      });
    }

    const vault = await Vault.create({
      user: req.user.id,
      name,
      icon,
      color,
    });

    res.status(201).json({
      success: true,
      vault,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getVaults = async (req, res) => {
  try {

    const vaults = await Vault.find({
      user: req.user.id,
    }).sort({
      isDefault: -1,
      createdAt: 1,
    });

    res.json({
      success: true,
      vaults,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const updateVault = async (req, res) => {
  try {

    const vault = await Vault.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: "Vault not found.",
      });
    }

    vault.name = req.body.name;
    vault.icon = req.body.icon;
    vault.color = req.body.color;

    await vault.save();

    res.json({
      success: true,
      vault,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const deleteVault = async (req, res) => {
  try {

    const vault = await Vault.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: "Vault not found.",
      });
    }

    // if (vault.isDefault) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Default vault cannot be deleted.",
    //   });
    // }

    // Move all passwords to All Items
    await Password.updateMany(
      {
        user: req.user.id,
        vault: vault._id,
      },
      {
        $set: {
          vault: null,
        },
      }
    );

    // Move all notes to All Items
    await Note.updateMany(
      {
        user: req.user.id,
        vault: vault._id,
      },
      {
        $set: {
          vault: null,
        },
      }
    );

    // Move all identities to All Items
    await Identity.updateMany(
      {
        user: req.user.id,
        vault: vault._id,
      },
      {
        $set: {
          vault: null,
        },
      }
    );

    await vault.deleteOne();

    res.json({
      success: true,
      message: "Vault deleted successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createVault,
  getVaults,
  updateVault,
  deleteVault,
};