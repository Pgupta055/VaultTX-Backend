const mongoose = require("mongoose");

const vaultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "📂",
    },

    color: {
      type: String,
      default: "#7C3AED",
    },

    // isDefault: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Vault",
  vaultSchema
);