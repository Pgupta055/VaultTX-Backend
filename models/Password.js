const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    website: {
      type: String,
      required: true,
    },

    url: {
      type: String,
    },

    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "General",
    },
    vault: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Vault",
  default: null,
},

    favorite: {
      type: Boolean,
      default: false,
    },
    requireMasterPassword: {
  type: Boolean,
  default: false,
},

    strength: {
      type: String,
      default: "Weak",
    },

    score: {
      type: Number,
      default: 0,
    },

    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Password", passwordSchema);