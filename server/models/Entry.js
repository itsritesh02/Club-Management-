import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
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
    // ENTRY DATE
    // ==============================

    entryDate: {
      type: Date,
      default: Date.now,
    },

    // ==============================
    // ENTRY TIME
    // ==============================

    entryTime: {
      type: Date,
      default: Date.now,
    },

    // ==============================
    // EXIT TIME
    // ==============================

    exitTime: {
      type: Date,
      default: null,
    },

    // ==============================
    // STATUS
    // ==============================

    status: {
      type: String,
      enum: ["inside", "exited"],
      default: "inside",
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

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;
