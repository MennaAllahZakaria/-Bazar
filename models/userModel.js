const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },

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
    unique: true, // بعد normalization فقط
  },

  whatsappNumber: String,

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

  roles: {
    type: [String],
    enum: ["user", "brand_owner", "admin", "super_admin"],
    default: ["user"],
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  profileImage: String,

  preferredLang: {
    type: String,
    enum: ["en", "ar"],
    default: "ar",
  },

  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active",
  },

  lastLoginAt: Date,
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
