import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,

    subject: "Club Management - OTP Verification",

    html: `
      <div style="font-family: Arial; padding: 20px;">

        <h2>Club Management System</h2>

        <p>Your OTP for email verification is:</p>

        <h1>${otp}</h1>

        <p>This OTP will expire in 5 minutes.</p>

        <p>
          If you did not request this OTP,
          please ignore this email.
        </p>

      </div>
    `,
  });
};
