const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const User = require("../models/userModel");
const Verification = require("../models/verificationModel");

const { hash, compare } = require("../utils/hash");
const { signToken } = require("../utils/createToken");
const ApiError = require("../utils/apiError");
const sendEmail  = require("../utils/sendEmail");


// ========================
// REGISTER
// ========================
exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email exists" });

  

  try{
      const code = crypto.randomInt(100000, 999999).toString();

      const message = `
                    Hi ${req.body.firstName || ""} ${req.body.lastName || ""},
                    Your verification code is:
                    ${code}
                    (valid for 10 minutes)
                    `;

    await sendEmail({
      Email: email,
      subject: "Email Verification Code",
      message,    
    });

    const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: await hash(password),
    roles: ["user"], // server only
  });


  await Verification.findOneAndUpdate(
    { email, type: "emailVerification" },
    {
      userId: user._id,
      code: await hash(code),
      expiresAt: Date.now() + 10 * 60 * 1000,
    },
    { upsert: true }
  );

  }catch(err){
    console.error("Error sending email:", err);
    return res.status(500).json({ message: "Failed to send verification email" });
  }



  res.status(201).json({
    status: "success",
    message: "Check your email",
  });
});


// ========================
// VERIFY EMAIL
// ========================
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const record = await Verification.findOne({
    email,
    type: "emailVerification",
  });

  if (!record || record.expiresAt < Date.now())
    return res.status(400).json({ message: "Expired code" });

  const ok = await compare(code, record.code);
  if (!ok) return res.status(400).json({ message: "Wrong code" });

  await User.updateOne({ email }, { emailVerified: true });

  await record.deleteOne();

  res.status(200).json({ 
    status: "success" ,
    message: "Email verified, you can now login"

  });
});


// ========================
// RESEND VERIFICATION
// ========================
exports.resendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.emailVerified)
    return res.json({ message: "If exists, email sent" });

  const code = crypto.randomInt(100000, 999999).toString();

  await Verification.findOneAndUpdate(
    { email, type: "emailVerification" },
    {
      code: await hash(code),
      expiresAt: Date.now() + 10 * 60 * 1000,
    },
    { upsert: true }
  );

  try{
  const message = `
                    Hi ${user.firstName || ""} ${user.lastName || ""},
                    Your verification code is:
                    ${code}
                    (valid for 10 minutes)
                    `;

  await sendEmail({
      Email: email,
      subject: "Email Verification Code",
      message,    
    });
  }catch(err){
    console.error("Error sending email:", err);
    return res.status(500).json({ message: "Failed to send verification email" });
  }

  res.json({ status: "success" });
});


// ========================
// LOGIN
// ========================
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Email and password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  if (!user.emailVerified) {
    return next(new ApiError("Please verify your email before logging in", 403));
  }


  if (user.status === "inactive") {
    return next(new ApiError("Your account is inactive", 403));
  }



  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  user.lastLoginAt = Date.now();
  await user.save();
  user.password = undefined;
  

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});



// ========================
// FORGOT PASSWORD
// ========================
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "If exists, email sent" });

  const code = crypto.randomInt(100000, 999999).toString();

  await Verification.findOneAndUpdate(
    { email, type: "passwordReset" },
    {
      userId: user._id,
      code: await hash(code),
      expiresAt: Date.now() + 10 * 60 * 1000,
      verified: false,
      resetTokenHash: null,
    },
    { upsert: true }
  );

  try{
  const message = `
                    Hi ${user.firstName || ""} ${user.lastName || ""},
                    Your password reset code is:
                    ${code}
                    (valid for 10 minutes)
                    `;

  await sendEmail({
      Email: email,
      subject: "Password Reset Code",
      message,    
    });
  }catch(err){
    console.error("Error sending email:", err);
    return res.status(500).json({ message: "Failed to send password reset email" });
  }

  res.status(201).json({ 
    status: "success",
    message: "If exists, email sent"
   });
});


// ========================
// VERIFY RESET CODE
// ========================
exports.verifyForgotPasswordCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const record = await Verification.findOne({
    email,
    type: "passwordReset",
  });

  if (!record || record.expiresAt < Date.now())
    return res.status(400).json({ message: "Expired" });

  const ok = await compare(code, record.code);
  if (!ok) return res.status(400).json({ message: "Wrong code" });

  const resetToken = crypto.randomBytes(32).toString("hex");

  record.resetTokenHash = await hash(resetToken);
  record.verified = true;

  await record.save();

  res.json({ resetToken });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  const record = await Verification.findOne({
    email,
    type: "passwordReset",
    verified: true,
  });

  if (!record)
    return res.status(400).json({ message: "Invalid request" });

  const ok = await compare(resetToken, record.resetTokenHash);
  if (!ok) return res.status(400).json({ message: "Invalid token" });
  
  await User.updateOne(
    { email },
    {
      password: await hash(newPassword),
      passwordChangedAt: Date.now(),
    }
  );
  
  await record.deleteOne();

  res.status(200).json({ 
    status: "success",
    message: "Password reset successful"
   });
});

// ========================
// CHANGE PASSWORD
// ========================
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  const isMatch = await compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new ApiError("Current password is incorrect", 401));
  }
  user.password = await hash(newPassword);
  user.passwordChangedAt = Date.now();
  await user.save();

    const message = `
      Your password has been changed successfully.
      If you did not perform this action, please contact support immediately.
      BAZAR Team
      `;
  try {
    await sendEmail({
      Email: user.email,
      subject: "Password Changed Successfully",
      message,
    });
  } catch (err) {
    console.error("Error sending password change notification email:", err.message);
  }


  res.status(200).json({
    status: "success",
    message: "Password changed successfully.",
  });
});

