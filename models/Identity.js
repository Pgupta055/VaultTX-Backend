const mongoose = require("mongoose");

const identitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    streetAddress: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    socialAccount: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    requireMasterPassword: {
      type: Boolean,
      default: false,
    },
    vault: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Vault",
  default: null,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Identity",
  identitySchema
);