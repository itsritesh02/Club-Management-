import express from "express";

import {
  addMember,
  getMembers,
  getMember,
  deleteMember,
} from "../controllers/memberController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ALL MEMBER ROUTES REQUIRE ADMIN LOGIN
// ==========================================

router.use(authMiddleware);

// ==========================================
// ADD MEMBER
// ==========================================

router.post("/", addMember);

// ==========================================
// GET ALL MEMBERS
// ==========================================

router.get("/", getMembers);

// ==========================================
// GET SINGLE MEMBER
// ==========================================

router.get("/:id", getMember);

// ==========================================
// DELETE MEMBER
// ==========================================

router.delete("/:id", deleteMember);

export default router;
