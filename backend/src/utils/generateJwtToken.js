const jwt = require("jsonwebtoken");

const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: true, // ✅ Render always serves HTTPS — secure cookie required
    sameSite: "None", // ✅ Allows cross-site cookies from frontend to backend
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie("token", token, cookieOptions);

  return token;
};

module.exports = generateToken;
