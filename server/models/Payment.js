import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    // ==============================
    // MEMBER
    // ==============================

    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    // ==============================
    // AMOUNT
    // ==============================

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    // ==============================
    // PAYMENT METHOD
    // ==============================

    paymentMethod: {
      type: String,
      enum: ["cash", "upi", "card", "bank"],
      required: true,
    },

    // ==============================
    // PAYMENT DATE
    // ==============================

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    // ==============================
    // PAYMENT STATUS
    // ==============================

    status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "paid",
    },

    // ==============================
    // TRANSACTION ID
    // ==============================

    transactionId: {
      type: String,
      default: null,
      trim: true,
    },

    // ==============================
    // CREATED BY
    // ==============================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
