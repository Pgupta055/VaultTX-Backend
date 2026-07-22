const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      required: true,
    },

    favorite: {
      type: Boolean,
      default: false,
    },
    vault: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Vault",
  default: null,
},
    requireMasterPassword: {
  type: Boolean,
  default: false,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Note",
  noteSchema
);