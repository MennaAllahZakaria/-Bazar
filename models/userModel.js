const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
        type: String,
        required: true, 
        },
    email: {
        type: String,
        required: true,
        unique: true,   
        lowercase: true,
        trim: true, 
    },
    phone: {
        type: String,
        required: true,
        unique: true,   
    },
    whatssapNumber: {
        type: String,
        default: null,
    },
    password: {
      type: String,
      required: true,
        minlength: 8,
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    role: { 
        type: String,
        enum: ["brand_owner", "user", "admin"],
        default: "user",
    },
    profileImage: {
        type: String,
        default: null,
    },
    fcmToken: {
        type: String,
        default: null,
    },

    preferredLang: {
        type: String,
        enum: ["en", "ar"],
        default: "en",
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive", "banned"],
    },

    


},{ timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User; 