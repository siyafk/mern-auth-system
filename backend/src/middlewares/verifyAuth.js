const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const verifyAuth = catchAsync(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new AppError("Access denied. No token provided.", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid or expired token.", 401));
  }

  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new AppError("Not authorized . Login Again.", 404));
  }

  // Attach user to request object
  req.user = user;
  next();
});

module.exports = verifyAuth;
