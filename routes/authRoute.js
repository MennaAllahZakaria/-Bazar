const express = require("express");
const {
    register,
    verifyEmail,
    resendVerificationCode,
    login,
    forgotPassword,
    verifyForgotPasswordCode,
    resetPassword,
    
    changePassword,
    
} = require("../services/authService");

const {
    signupValidator,
    loginValidator,
    verifyEmailValidator,
    forgetPasswordValidator,
    verifyResetCodeValidator,
    resetPasswordValidator,
    changePasswordValidator
} = require("../utils/validators/authValidator");

const { protect, allowedTo } = require("../middleware/authMiddleware");


const router = express.Router();

// ================= AUTH =================

// 📌 Signup (send verification email)
router.post("/signup" ,signupValidator, register);

// 📌 Verify email (create account after code)
router.post("/verifyEmail", verifyEmailValidator, verifyEmail);

// 📌 Resend verification code
router.post("/resendVerificationCode", resendVerificationCode);

// 📌 Login
router.post("/login",loginValidator, login);

// ================= PASSWORD RESET =================

// 📌 Send reset code
router.post("/forgetPassword",forgetPasswordValidator, forgotPassword);

// 📌 Verify reset code
router.post("/verifyForgotPasswordCode",verifyResetCodeValidator, verifyForgotPasswordCode);

// 📌 Reset password
router.post("/resetPassword",resetPasswordValidator, resetPassword);


// ================= CHANGE PASSWORD =================
router.put("/changePassword",protect, changePasswordValidator, changePassword);
module.exports = router;
