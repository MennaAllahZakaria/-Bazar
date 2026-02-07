const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },

  amountInPiasters: {
    type: Number,
    required: true,
    min: 1,
  },

  currency: {
    type: String,
    default: "EGP",
  },

  method: {
    type: String,
    enum: ["wallet", "instapay", "bank_transfer"],
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "under_review", "approved", "rejected", "refunded"],
    default: "pending",
  },

  senderName: {
    type: String,
    required: true,
  },

  transactionReference: {
    type: String,
  },

  proofImages: {
    type: [String],
    required: true,
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  reviewedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
