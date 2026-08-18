import jwt from "jsonwebtoken";

import OTP from "../models/OTP.js";

import generateOTP from "../utils/generateOTP.js";

import { sendOTPEmail } from "../services/emailService.js";

// ==========================================
// ADMIN LOGIN
// ==========================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check Admin email
    if (email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check Admin password
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    console.log("ADMIN OTP:", otp);

    // Delete previous OTP
    await OTP.deleteMany({
      email: process.env.ADMIN_EMAIL.toLowerCase(),
    });

    // Save OTP
    await OTP.create({
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send OTP
    await sendOTPEmail(process.env.ADMIN_EMAIL, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to admin email",
      email: process.env.ADMIN_EMAIL,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// VERIFY OTP
// ==========================================

export const verifyOTP = async (req, res) => {
  try {
    // Debug
    console.log("VERIFY BODY:", req.body);

    const { email, otp } = req.body;

    // Check fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Check Admin email
    if (email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp: otp.toString(),
    });

    console.log("OTP RECORD:", otpRecord);

    // OTP not found
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    // Success
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",

      token,

      admin: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ADMIN PROFILE
// ==========================================

export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,

      admin: {
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
