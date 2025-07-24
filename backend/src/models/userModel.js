const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verifyOTP: {
    type: String,
    default: null
  },
  verifyOTPExpiresAt: {
    type: Date,
    default: null
  },
  isAccountVerified: {
    type: Boolean,
    default: false
  },
  resetOtp: {
    type: String,
    default: null
  },
  resetOtpExpiresAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("User", userSchema);
