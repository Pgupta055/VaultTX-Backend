const Identity = require("../models/Identity");

// Add Identity
const addIdentity = async (req, res) => {
  try {
    const identity = await Identity.create({
      user: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      identity,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Identities
const getIdentities = async (req, res) => {
  try {

    const identities = await Identity.find({
      user: req.user.id,
    })
      .populate("vault")
      .sort({
        createdAt: -1,
      });

    const formattedIdentities = identities.map((item) => {
      const obj = item.toObject();

      return {
        ...obj,
        vault: obj.vault?._id || null,
      };
    });

    res.json({
      success: true,
      identities: formattedIdentities,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Update Identity
const updateIdentity = async (req, res) => {
  try {
    const identity = await Identity.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      identity,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Identity
const deleteIdentity = async (req, res) => {
  try {
    await Identity.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({
      success: true,
      message: "Identity deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Favorite
const toggleFavoriteIdentity = async (req, res) => {
  try {
    const identity = await Identity.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!identity) {
      return res.json({
        success: false,
        message: "Identity not found.",
      });
    }

    identity.favorite = !identity.favorite;

    await identity.save();

    res.json({
      success: true,
      favorite: identity.favorite,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addIdentity,
  getIdentities,
  updateIdentity,
  deleteIdentity,
  toggleFavoriteIdentity,
};