const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/authRouter");
const userRouter = require("./src/routes/userRouter");
const connectDB = require("./src/config/connectDB");

// 🔧 Load environment variables BEFORE using them
dotenv.config();

const app = express();

// 🔌 Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 8000;

// 🛠️ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://mern-auth-system-1-cr5c.onrender.com",
    credentials: true,
  })
);

// 🚪 Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
