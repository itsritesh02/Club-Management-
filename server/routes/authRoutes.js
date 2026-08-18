import express from "express";

import { login, verifyOTP, getProfile } from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ADMIN LOGIN
// ==========================================

router.post("/login", login);

// ==========================================
// VERIFY OTP
// ==========================================

router.post("/verify-otp", verifyOTP);

// ==========================================
// ADMIN PROFILE
// ==========================================

router.get("/profile", authMiddleware, getProfile);

export default router;
