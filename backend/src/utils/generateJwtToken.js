const jwt = require("jsonwebtoken");

const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensures HTTPS in production
    sameSite: 'Lax', // Can be 'Strict', 'Lax', or 'None' depending on frontend/backend setup
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  };

  res.cookie('token', token, cookieOptions); // Set JWT as cookie

  return token; // Optional: you can return it if needed in the response body
};

module.exports = generateToken;
