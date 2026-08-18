import express from "express";

import {
  addPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// ADD PAYMENT
// ==========================================

router.post("/", authMiddleware, addPayment);

// ==========================================
// GET ALL PAYMENTS
// ==========================================

router.get("/", authMiddleware, getPayments);

// ==========================================
// GET SINGLE PAYMENT
// ==========================================

router.get("/:id", authMiddleware, getPaymentById);

// ==========================================
// UPDATE PAYMENT
// ==========================================

router.put("/:id", authMiddleware, updatePayment);

// ==========================================
// DELETE PAYMENT
// ==========================================

router.delete("/:id", authMiddleware, deletePayment);

export default router;
