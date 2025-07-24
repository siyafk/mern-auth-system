const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getUserData = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const user = await userModel.findById(_id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "Success",
    data: {
      user: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      }
    }
  });
});
