import Member from "../models/Member.js";

import { sendBookingEmail } from "../services/emailService.js";

// ==========================================
// ADD MEMBER / CONFIRM ENTRY
// ==========================================

export const addMember = async (req, res) => {
  try {
    const {
      name,
      surname,
      contact,
      email,
      dob,
      entryTime,
      reffBy,
      pax,
      paxCount,
      couple,
      cashAmount,
      upiAmount,
      cardAmount,
      withCover,
      withoutCover,
      category,
      tableNo,
    } = req.body;

    // ======================================
    // REQUIRED FIELD CHECK
    // ======================================

    if (
      !name ||
      !surname ||
      !contact ||
      !email ||
      !dob ||
      !entryTime ||
      !tableNo
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, surname, contact, email, DOB, entry time and table number are required",
      });
    }

    // ======================================
    // PAYMENT
    // ======================================

    const cash = Number(cashAmount) || 0;

    const upi = Number(upiAmount) || 0;

    const card = Number(cardAmount) || 0;

    // Automatic total
    const totalAmount = cash + upi + card;

    // ======================================
    // CREATE MEMBER
    // ======================================

    const member = await Member.create({
      name,
      surname,
      contact,

      email: email.toLowerCase().trim(),

      dob,
      entryTime,

      reffBy: reffBy || "",

      pax: pax || "",

      paxCount: Number(paxCount) || 1,

      couple: Boolean(couple),

      cashAmount: cash,

      upiAmount: upi,

      cardAmount: card,

      totalAmount,

      withCover: Number(withCover) || 0,

      withoutCover: Number(withoutCover) || 0,

      category: category || "normal",

      tableNo,

      emailSent: false,
    });

    // ======================================
    // SEND BOOKING EMAIL
    // ======================================

    let emailSent = false;

    try {
      await sendBookingEmail(member);

      emailSent = true;

      member.emailSent = true;

      await member.save();
    } catch (emailError) {
      console.error("BOOKING EMAIL ERROR:", emailError.message);
    }

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(201).json({
      success: true,

      message: emailSent
        ? "Entry confirmed and booking email sent"
        : "Entry confirmed but email could not be sent",

      emailSent,

      member,
    });
  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to confirm entry",
    });
  }
};

// ==========================================
// GET ALL MEMBERS
// ==========================================

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      members,
    });
  } catch (error) {
    console.error("GET MEMBERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch members",
    });
  }
};

// ==========================================
// GET SINGLE MEMBER
// ==========================================

export const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (error) {
    console.error("GET MEMBER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch member",
    });
  }
};

// ==========================================
// DELETE MEMBER
// ==========================================

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MEMBER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete member",
    });
  }
};
