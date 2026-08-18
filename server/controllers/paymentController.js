import Payment from "../models/Payment.js";
import Member from "../models/Member.js";

// ==========================================
// ADD PAYMENT
// ==========================================

export const addPayment = async (req, res) => {
  try {
    const {
      memberId,
      amount,
      paymentMethod,
      paymentDate,
      status,
      transactionId,
    } = req.body;

    // Check required fields
    if (!memberId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Member ID, amount and payment method are required",
      });
    }

    // Check member
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Create payment
    const payment = await Payment.create({
      member: memberId,
      amount,
      paymentMethod,
      paymentDate: paymentDate || new Date(),
      status: status || "paid",
      transactionId: transactionId || null,
      createdBy: req.user.userId,
    });

    // Populate response
    const populatedPayment = await Payment.findById(payment._id)
      .populate("member", "name email phone")
      .populate("createdBy", "name email role");

    res.status(201).json({
      success: true,
      message: "Payment added successfully",
      payment: populatedPayment,
    });
  } catch (error) {
    console.error("ADD PAYMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL PAYMENTS
// ==========================================

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("member", "name email phone")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("GET PAYMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PAYMENT
// ==========================================

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("member", "name email phone")
      .populate("createdBy", "name email role");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("GET PAYMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE PAYMENT
// ==========================================

export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const { amount, paymentMethod, paymentDate, status, transactionId } =
      req.body;

    payment.amount = amount ?? payment.amount;
    payment.paymentMethod = paymentMethod ?? payment.paymentMethod;
    payment.paymentDate = paymentDate ?? payment.paymentDate;
    payment.status = status ?? payment.status;
    payment.transactionId = transactionId ?? payment.transactionId;

    await payment.save();

    const updatedPayment = await Payment.findById(payment._id)
      .populate("member", "name email phone")
      .populate("createdBy", "name email role");

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("UPDATE PAYMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE PAYMENT
// ==========================================

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    await Payment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PAYMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
