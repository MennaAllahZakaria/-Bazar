const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  type: {
    type: String,
    enum: [
      "cosmetics",
      "clothing",
      "hand_made",
      "home",
      "food",
      "electronics",
      "furniture",
      "sports",
      "other",
    ],
    default: "other",
  },

  logo: String,

  description: {
    type: String,
    required: true,
  },

  socialLinks: {
    facebook: { type: String, match: /^https?:\/\// },
    instagram: { type: String, match: /^https?:\/\// },
    tiktok: { type: String, match: /^https?:\/\// },
    website: { type: String, match: /^https?:\/\// },
  },

  policiesAccepted: {
    refundPolicy: { type: Boolean, default: false },
    bazarRules: { type: Boolean, default: false },
    marketingPermission: { type: Boolean, default: false },
    privacyPolicy: { type: Boolean, default: false },
  },

  status: {
    type: String,
    enum: ["draft", "pending_payment", "under_review", "approved", "rejected"],
    default: "draft",
  },
}, { timestamps: true });

brandSchema.index({ name: 1, ownerId: 1 }, { unique: true });

module.exports = mongoose.model("Brand", brandSchema);
