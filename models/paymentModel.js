const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: false,
    },
    amount: {   
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        default: "EGP",
    },
    method: {
        type: String,
        required: true,
        enum: ["wallet","instapay", "bank_transfer", "cash"],
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    transactionDate: {
        type: Date,
        default: Date.now,
    },
    fees: {
        type: Number,
        default: 500,
    },
    senderName: {
        type: String,
        required: true,
    },
    transactionReference: {
        type: String,
        required: true,
        unique: true,
    },
    imgProof: {
        type: String,
    },

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
