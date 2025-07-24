const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const generateOtp = require("../utils/generateOtp");
const generateToken = require("../utils/generateJwtToken");
const sendEmail = require("../utils/email");
const welcomeEmailTemplate = require("../utils/templates/welcomeEmail");
const otpTemplate = require("../utils/templates/otpTemplate");
const resetPassword = require("../utils/templates/resetPassword");

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Name, email, and password are required!", 400));
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // 🟡 Send OTP Email
  await sendEmail({
    to: email,
    subject: `🔥 Welcome Aboard, ${name}! Verify Your Email`,
    html: welcomeEmailTemplate(name),
  });

  const token = generateToken(user.id, res);

  res.status(201).json({
    status: "Success",
    message: "User registered successfully.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: token,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required!", 400));
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);
  if (!isMatchPassword) {
    return next(new AppError("Incorrect password", 401));
  }

  generateToken(user.id, res);

  res.status(200).json({
    status: "Success",
    message: "Logged in successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

exports.sendVerifyOtp = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const user = await userModel.findOne({ _id });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (user.isAccountVerified) {
    return next(new AppError("Account already verified", 401));
  }

  const otp = generateOtp();

  user.verifyOTP = otp;
  user.verifyOTPExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "🔐 Verify Your Email - OTP Inside",
    html: otpTemplate(user.name, otp),
  });

  res.status(200).json({
    status: "success",
    message: "OTP sent successfully to your email.",
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { otp } = req.body;

  // 🔒 Validate input
  if (!otp || otp.trim() === "") {
    return next(new AppError("OTP is required", 400));
  }

  // 🔍 Find user
  const user = await userModel.findById(_id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // 🧠 Check if already verified
  if (user.isAccountVerified) {
    return next(new AppError("Email is already verified", 400));
  }

  // ❌ Check OTP match
  if (user.verifyOTP !== otp) {
    return next(new AppError("Invalid OTP", 400));
  }

  // ⌛ Check expiry
  if (!user.verifyOTPExpiresAt || user.verifyOTPExpiresAt < Date.now()) {
    return next(new AppError("OTP expired. Please request a new one", 400));
  }

  // ✅ Set account as verified
  user.isAccountVerified = true;
  user.verifyOTP = undefined;
  user.verifyOTPExpiresAt = undefined;

  await user.save();

  // 🎉 Respond
  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
});

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "Success",
    message: "User Autheticated",
  });
});

exports.sendResetOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email || email.trim() === "") {
    return next(new AppError("Email is required", 400));
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with this email", 404));
  }

  const otp = generateOtp();
  user.resetOtp = otp;
  user.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

  await user.save();

  // 🔹 Optional: Send Email
  await sendEmail({
    to: email,
    subject: "🔐 Password Reset OTP",
    html: resetPassword(user.name, otp), // Customize template for password reset if needed
  });

  res.status(200).json({
    status: "success",
    message: "Reset OTP sent to your email.",
  });
});


exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return next(new AppError("Email, OTP, and new password are required", 400));
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("No user found with this email", 404));
  }

  if (user.resetOtp !== otp) {
    return next(new AppError("Invalid OTP", 400));
  }

  if (!user.resetOtpExpiresAt || user.resetOtpExpiresAt < Date.now()) {
    return next(new AppError("OTP expired. Please request a new one", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetOtp = undefined;
  user.resetOtpExpiresAt = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password reset successfully.",
  });
});
