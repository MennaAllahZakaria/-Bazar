const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  tentNumber: {
    type: Number,
    required: true,
    min: 1,
  },

  status: {
    type: String,
    enum: [
      "pending_payment",
      "payment_under_review",
      "approved",
      "rejected",
      "cancelled",
    ],
    default: "pending_payment",
  },
}, { timestamps: true });

bookingSchema.index(
  { eventId: 1, tentNumber: 1 },
  { unique: true }
);

bookingSchema.index(
  { brandId: 1, eventId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
