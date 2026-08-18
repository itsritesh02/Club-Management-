import express from "express";

import {
  addEntry,
  getEntries,
  getEntryById,
  exitMember,
  deleteEntry,
} from "../controllers/entryController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ADD ENTRY
// ==========================================

router.post("/", authMiddleware, addEntry);

// ==========================================
// GET ALL ENTRIES
// ==========================================

router.get("/", authMiddleware, getEntries);

// ==========================================
// GET SINGLE ENTRY
// ==========================================

router.get("/:id", authMiddleware, getEntryById);

// ==========================================
// EXIT MEMBER
// ==========================================

router.put("/:id/exit", authMiddleware, exitMember);

// ==========================================
// DELETE ENTRY
// ==========================================

router.delete("/:id", authMiddleware, deleteEntry);

export default router;
