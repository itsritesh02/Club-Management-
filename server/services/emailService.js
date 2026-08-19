import nodemailer from "nodemailer";

// ==========================================
// NODEMAILER TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// VERIFY EMAIL CONNECTION
// ==========================================

transporter.verify((error) => {
  if (error) {
    console.error("EMAIL CONFIGURATION ERROR:", error.message);
  } else {
    console.log("Email service is ready");
  }
});

// ==========================================
// ADMIN OTP EMAIL
// ==========================================

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Club Management" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "Club Management - Admin OTP",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        padding: 30px;
        background: #f5f7fb;
      ">

        <div style="
          max-width: 600px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 12px;
        ">

          <h2>
            Club Management System
          </h2>

          <p>
            Your Admin login OTP is:
          </p>

          <h1 style="
            letter-spacing: 8px;
            color: #2563eb;
          ">
            ${otp}
          </h1>

          <p>
            This OTP will expire in
            <strong>5 minutes</strong>.
          </p>

          <p style="color:#6b7280;">
            If you did not request this OTP,
            please ignore this email.
          </p>

        </div>

      </div>
    `,
  });
};

// ==========================================
// MEMBER BOOKING CONFIRMATION EMAIL
// ==========================================

export const sendBookingEmail = async (member) => {
  const fullName = `${member.name} ${member.surname}`;

  const entryTime = new Date(member.entryTime).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const dob = new Date(member.dob).toLocaleDateString("en-IN");

  await transporter.sendMail({
    from: `"Club Management" <${process.env.EMAIL_USER}>`,

    to: member.email,

    subject: "Club Management - Entry Confirmation",

    html: `
      <div style="
        margin:0;
        padding:30px 15px;
        background:#f4f6f9;
        font-family:Arial, sans-serif;
      ">

        <div style="
          max-width:650px;
          margin:auto;
          background:#ffffff;
          border-radius:14px;
          overflow:hidden;
          box-shadow:0 5px 25px rgba(0,0,0,0.08);
        ">

          <!-- HEADER -->

          <div style="
            background:#111827;
            color:white;
            padding:28px;
          ">

            <h1 style="
              margin:0;
              font-size:25px;
            ">
              Club Management
            </h1>

            <p style="
              margin:8px 0 0;
              color:#d1d5db;
            ">
              Entry Confirmation
            </p>

          </div>

          <!-- SUCCESS -->

          <div style="
            margin:25px;
            padding:16px;
            background:#ecfdf5;
            border:1px solid #a7f3d0;
            color:#047857;
            border-radius:9px;
          ">

            <strong>
              ✓ Entry Confirmed Successfully
            </strong>

            <p style="margin-bottom:0;">
              Your booking has been
              successfully registered.
            </p>

          </div>

          <div style="
            padding:0 25px 25px;
          ">

            <!-- GUEST DETAILS -->

            <h3>
              Guest Details
            </h3>

            <table
              width="100%"
              cellpadding="8"
              style="
                border-collapse:collapse;
              "
            >

              <tr>
                <td>
                  <strong>Name</strong>
                </td>

                <td>
                  ${fullName}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Contact</strong>
                </td>

                <td>
                  ${member.contact}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Email</strong>
                </td>

                <td>
                  ${member.email}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Date of Birth</strong>
                </td>

                <td>
                  ${dob}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Referred By</strong>
                </td>

                <td>
                  ${member.reffBy || "-"}
                </td>
              </tr>

            </table>

            <!-- ENTRY DETAILS -->

            <h3 style="
              margin-top:25px;
            ">
              Entry Details
            </h3>

            <table
              width="100%"
              cellpadding="8"
              style="
                border-collapse:collapse;
              "
            >

              <tr>
                <td>
                  <strong>Entry Time</strong>
                </td>

                <td>
                  ${entryTime}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Category</strong>
                </td>

                <td>
                  ${member.category.toUpperCase()}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Table No</strong>
                </td>

                <td>
                  ${member.tableNo}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Pax</strong>
                </td>

                <td>
                  ${member.pax || "-"}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Pax Count</strong>
                </td>

                <td>
                  ${member.paxCount}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Couple</strong>
                </td>

                <td>
                  ${member.couple ? "Yes" : "No"}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>With Cover</strong>
                </td>

                <td>
                  ${member.withCover}
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Without Cover</strong>
                </td>

                <td>
                  ${member.withoutCover}
                </td>
              </tr>

            </table>

            <!-- PAYMENT -->

            <h3 style="
              margin-top:25px;
            ">
              Payment Details
            </h3>

            <table
              width="100%"
              cellpadding="8"
              style="
                border-collapse:collapse;
              "
            >

              <tr>
                <td>
                  Cash Amount
                </td>

                <td>
                  ₹${member.cashAmount}
                </td>
              </tr>

              <tr>
                <td>
                  UPI Amount
                </td>

                <td>
                  ₹${member.upiAmount}
                </td>
              </tr>

              <tr>
                <td>
                  Card Amount
                </td>

                <td>
                  ₹${member.cardAmount}
                </td>
              </tr>

            </table>

            <!-- TOTAL -->

            <div style="
              margin-top:20px;
              padding:18px;
              background:#eff6ff;
              border:1px solid #bfdbfe;
              border-radius:10px;
            ">

              <table width="100%">

                <tr>

                  <td>
                    <strong>
                      Total Amount
                    </strong>
                  </td>

                  <td style="
                    text-align:right;
                    color:#2563eb;
                    font-size:20px;
                  ">

                    <strong>
                      ₹${member.totalAmount}
                    </strong>

                  </td>

                </tr>

              </table>

            </div>

          </div>

          <!-- FOOTER -->

          <div style="
            padding:20px;
            background:#f9fafb;
            text-align:center;
            color:#6b7280;
            font-size:13px;
          ">

            Thank you for choosing
            Club Management.

          </div>

        </div>

      </div>
    `,
  });
};
