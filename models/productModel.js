const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },

  title: { type: String, required: true },
  description: { type: String, required: true },

  priceInPiasters: {
    type: Number,
    required: true,
    min: 0,
  },

  category: {
    type: String,
    enum: ["food", "clothing", "accessories", "handmade", "other"],
    required: true,
  },

  stock: {
    type: Number,
    min: 0,
    default: 0,
  },

  images: [String],

  discount: {
    type: {
      type: String,
      enum: ["percent", "fixed"],
    },
    value: Number,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
