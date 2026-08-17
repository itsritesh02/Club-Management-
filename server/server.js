import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

connectDB();

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// MEMBER ROUTES
app.use("/api/members", memberRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Club Management API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
