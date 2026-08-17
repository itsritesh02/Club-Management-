import express from "express";

import {
  register,
  login,
  getProfile,
  verifyOTP,
} from "../controllers/authController.js";

import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

router.post("/verify-otp", verifyOTP);

export default router;
