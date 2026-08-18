import express from "express";

import {
  getDashboardReport,
  getPaymentReport,
  getEntryReport,
  getMemberReport,
} from "../controllers/reportController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// DASHBOARD REPORT
// ==========================================

router.get("/dashboard", authMiddleware, getDashboardReport);

// ==========================================
// PAYMENT REPORT
// ==========================================

router.get("/payments", authMiddleware, getPaymentReport);

// ==========================================
// ENTRY REPORT
// ==========================================

router.get("/entries", authMiddleware, getEntryReport);

// ==========================================
// MEMBER REPORT
// ==========================================

router.get("/members", authMiddleware, getMemberReport);

export default router;
