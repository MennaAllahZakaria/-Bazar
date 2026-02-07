const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  totalTents: { type: Number, required: true, min: 1 },

  tentPriceInPiasters: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["upcoming", "ongoing", "finished", "cancelled"],
    default: "upcoming",
  },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
