const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["cosmetics","clothing","hand_made","home","food", "electronics", "furniture", "sports", "other"],
        default: "other",
    },
    logo: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        required: true,
    },
    socialLinks: {
        facebook: {
            type: String,
            default: null,
        },
        instagram: {
            type: String,
            default: null,
        },
        twitter: {
            type: String,
            default: null,
        },
        website: {
            type: String,
            default: null,
        },
        tiktok: {
            type: String,
            default: null,
        },
    },
    tentNumber: {
        type: Number,
        default: null,
        min: 1,
        max: 30,
        unique: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    policy:{
        confirmRefundPolicy: {
            type: Boolean,
            default: false,
            required: true,
        },
        bazarRulesPolicy: {
            type: Boolean,
            default: false,
            required: true,
        },
        permissionForMarketing: {
            type: Boolean,
            default: false,
            required: true,
        },
        privacyPolicy: {
            type: Boolean,
            default: false,
            required: true,
        },

    },
    
}, { timestamps: true });

module.exports = mongoose.model("Brand", brandSchema);