const express = require("express");
const {
  login,
  logout,
  signup,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  resetPassword,
  sendResetOtp,
 
} = require("../controllers/authController");
const verifyAuth = require("../middlewares/verifyAuth");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login); // ❌ Removed verifyAuth
router.post("/logout", verifyAuth, logout); // ✅ Protected route
router.post("/send-verify-otp", verifyAuth, sendVerifyOtp);
router.post("/verify-email", verifyAuth, verifyEmail);
router.get("/is-auth", verifyAuth, isAuthenticated);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);


module.exports = router;
