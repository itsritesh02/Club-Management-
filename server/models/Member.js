import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    surname: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    entryTime: {
      type: Date,
      required: true,
    },

    reffBy: {
      type: String,
      default: "",
      trim: true,
    },

    pax: {
      type: String,
      default: "",
      trim: true,
    },

    paxCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    couple: {
      type: Boolean,
      default: false,
    },

    cashAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    upiAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    cardAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    withCover: {
      type: Number,
      default: 0,
      min: 0,
    },

    withoutCover: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      enum: ["normal", "vip", "vvip"],
      default: "normal",
    },

    tableNo: {
      type: String,
      required: true,
      trim: true,
    },

    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Member = mongoose.model("Member", memberSchema);

export default Member;
