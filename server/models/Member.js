import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    // ==============================
    // MEMBER NAME
    // ==============================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // EMAIL
    // ==============================

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // ==============================
    // PHONE
    // ==============================

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // ADDRESS
    // ==============================

    address: {
      type: String,
      trim: true,
    },

    // ==============================
    // MEMBERSHIP TYPE
    // ==============================

    membershipType: {
      type: String,
      enum: ["monthly", "quarterly", "yearly"],
      default: "monthly",
    },

    // ==============================
    // MEMBERSHIP START DATE
    // ==============================

    membershipStartDate: {
      type: Date,
      required: true,
    },

    // ==============================
    // MEMBERSHIP END DATE
    // ==============================

    membershipEndDate: {
      type: Date,
      required: true,
    },

    // ==============================
    // MEMBERSHIP STATUS
    // ==============================

    status: {
      type: String,
      enum: ["active", "expired", "inactive"],
      default: "active",
    },

    // ==============================
    // CREATED BY USER
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

const Member = mongoose.model("Member", memberSchema);

export default Member;
