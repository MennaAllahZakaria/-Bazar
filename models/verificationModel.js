const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  email: {
    type: String,
    lowercase: true,
    required: true,
  },

  codeHash: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  type: {
    type: String,
    enum: ["emailVerification", "passwordReset"],
    required: true,
  },

  verified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
  },
  verifiedBy: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Verification", verificationSchema);
