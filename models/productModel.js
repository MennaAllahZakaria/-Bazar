const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    offer: {
        type: Number,
        default: 0,
    },



}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);