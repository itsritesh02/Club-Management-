import express from "express";

import { register, login, getProfile } from "../controllers/authController.js";

import {authMiddleware,authorizeRoles} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

router.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

export default router;
