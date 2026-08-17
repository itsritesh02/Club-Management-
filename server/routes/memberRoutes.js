import express from "express";

import {
  addMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ADD MEMBER
// ==========================================

router.post("/", authMiddleware, addMember);

// ==========================================
// GET ALL MEMBERS
// ==========================================

router.get("/", authMiddleware, getMembers);

// ==========================================
// GET SINGLE MEMBER
// ==========================================

router.get("/:id", authMiddleware, getMemberById);

// ==========================================
// UPDATE MEMBER
// ==========================================

router.put("/:id", authMiddleware, updateMember);

// ==========================================
// DELETE MEMBER
// ==========================================

router.delete("/:id", authMiddleware, deleteMember);

export default router;
