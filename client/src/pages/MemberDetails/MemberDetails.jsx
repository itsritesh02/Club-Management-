import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import Swal from "sweetalert2";

import "./MemberDetails.css";

function MemberDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  // ==========================================
  // API URL
  // ==========================================

  const API_URL = import.meta.env.VITE_API_URL;

  // ==========================================
  // GET MEMBER
  // ==========================================

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/login");
          return;
        }

        if (!API_URL) {
          setError("API URL is not configured.");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/members/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        // ======================================
        // TOKEN EXPIRED
        // ======================================

        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");

          navigate("/login");
          return;
        }

        // ======================================
        // ERROR
        // ======================================

        if (!response.ok) {
          setError(
            data.message || "Failed to fetch member"
          );
          return;
        }

        setMember(data.member);

      } catch (error) {
        console.error("GET MEMBER ERROR:", error);

        setError(
          "Unable to connect to server. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id, navigate, API_URL]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // FORMAT DATE TIME
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const money = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const downloadPDF = () => {
    if (!member) return;

    try {
      setDownloading(true);

      const doc = new jsPDF();

      const pageWidth =
        doc.internal.pageSize.getWidth();

      let y = 20;

      // ========================================
      // HEADER
      // ========================================

      doc.setFillColor(17, 24, 39);

      doc.rect(
        0,
        0,
        pageWidth,
        38,
        "F"
      );

      doc.setTextColor(255, 255, 255);

      doc.setFontSize(20);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "CLUB MANAGEMENT",
        20,
        17
      );

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        "ENTRY / BOOKING CONFIRMATION",
        20,
        27
      );

      y = 50;

      // ========================================
      // BOOKING ID
      // ========================================

      doc.setTextColor(
        80,
        80,
        80
      );

      doc.setFontSize(9);

      doc.text(
        `Booking ID: ${member._id || id}`,
        20,
        y
      );

      doc.text(
        `Generated: ${formatDateTime(new Date())}`,
        pageWidth - 20,
        y,
        {
          align: "right",
        }
      );

      y += 14;

      // ========================================
      // GUEST DETAILS
      // ========================================

      drawSectionTitle(
        doc,
        "GUEST INFORMATION",
        y
      );

      y += 12;

      y = drawRow(
        doc,
        "Name",
        `${member.name || ""} ${member.surname || ""}`,
        y
      );

      y = drawRow(
        doc,
        "Contact",
        member.contact || "-",
        y
      );

      y = drawRow(
        doc,
        "Email",
        member.email || "-",
        y
      );

      y = drawRow(
        doc,
        "Date of Birth",
        formatDate(member.dob),
        y
      );

      y = drawRow(
        doc,
        "Referred By",
        member.reffBy || "-",
        y
      );

      y += 7;

      // ========================================
      // ENTRY DETAILS
      // ========================================

      drawSectionTitle(
        doc,
        "ENTRY INFORMATION",
        y
      );

      y += 12;

      y = drawRow(
        doc,
        "Entry Time",
        formatDateTime(member.entryTime),
        y
      );

      y = drawRow(
        doc,
        "Category",
        (
          member.category || "normal"
        ).toUpperCase(),
        y
      );

      y = drawRow(
        doc,
        "Pax",
        member.pax || "-",
        y
      );

      y = drawRow(
        doc,
        "Pax Count",
        member.paxCount ?? "-",
        y
      );

      y = drawRow(
        doc,
        "Couple",
        member.couple ? "Yes" : "No",
        y
      );

      y = drawRow(
        doc,
        "Table Number",
        member.tableNo || "-",
        y
      );

      y = drawRow(
        doc,
        "With Cover",
        member.withCover || 0,
        y
      );

      y = drawRow(
        doc,
        "Without Cover",
        member.withoutCover || 0,
        y
      );

      y += 7;

      // ========================================
      // PAYMENT
      // ========================================

      drawSectionTitle(
        doc,
        "PAYMENT INFORMATION",
        y
      );

      y += 12;

      y = drawRow(
        doc,
        "Cash",
        `Rs. ${money(member.cashAmount)}`,
        y
      );

      y = drawRow(
        doc,
        "UPI",
        `Rs. ${money(member.upiAmount)}`,
        y
      );

      y = drawRow(
        doc,
        "Card",
        `Rs. ${money(member.cardAmount)}`,
        y
      );

      y += 4;

      // ========================================
      // TOTAL
      // ========================================

      doc.setFillColor(
        239,
        246,
        255
      );

      doc.roundedRect(
        20,
        y,
        pageWidth - 40,
        18,
        3,
        3,
        "F"
      );

      doc.setTextColor(
        17,
        24,
        39
      );

      doc.setFontSize(13);

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "TOTAL AMOUNT",
        27,
        y + 12
      );

      doc.text(
        `Rs. ${money(member.totalAmount)}`,
        pageWidth - 27,
        y + 12,
        {
          align: "right",
        }
      );

      y += 32;

      // ========================================
      // EMAIL STATUS
      // ========================================

      doc.setFontSize(9);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(
        member.emailSent ? 4 : 180,
        member.emailSent ? 120 : 60,
        member.emailSent ? 87 : 60
      );

      doc.text(
        member.emailSent
          ? "Booking confirmation email sent successfully."
          : "Booking confirmation email was not sent.",
        20,
        y
      );

      y += 18;

      // ========================================
      // FOOTER
      // ========================================

      doc.setDrawColor(
        220,
        220,
        220
      );

      doc.line(
        20,
        y,
        pageWidth - 20,
        y
      );

      y += 9;

      doc.setTextColor(
        120,
        120,
        120
      );

      doc.setFontSize(8);

      doc.text(
        "Thank you for choosing our club.",
        pageWidth / 2,
        y,
        {
          align: "center",
        }
      );

      // ========================================
      // SAVE PDF
      // ========================================

      const guestName =
        `${member.name || "Guest"}_${member.surname || ""}`
          .trim()
          .replace(/\s+/g, "_");

      doc.save(
        `Club_Entry_${guestName}_${id}.pdf`
      );

      // ========================================
      // SUCCESS
      // ========================================

      Swal.fire({
        icon: "success",
        title: "PDF Downloaded",
        text: "Booking PDF has been generated successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error(
        "PDF DOWNLOAD ERROR:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "PDF Generation Failed",
        text: "Unable to generate PDF. Please try again.",
        confirmButtonText: "OK",
      });

    } finally {
      setDownloading(false);
    }
  };

  // ==========================================
  // PDF SECTION TITLE
  // ==========================================

  const drawSectionTitle = (
    doc,
    title,
    y
  ) => {
    doc.setFillColor(
      37,
      99,
      235
    );

    doc.rect(
      20,
      y - 5,
      3,
      10,
      "F"
    );

    doc.setTextColor(
      17,
      24,
      39
    );

    doc.setFontSize(11);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      title,
      29,
      y + 2
    );
  };

  // ==========================================
  // PDF ROW
  // ==========================================

  const drawRow = (
    doc,
    label,
    value,
    y
  ) => {
    const pageWidth =
      doc.internal.pageSize.getWidth();

    doc.setFontSize(9);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setTextColor(
      110,
      110,
      110
    );

    doc.text(
      label,
      25,
      y
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setTextColor(
      40,
      40,
      40
    );

    doc.text(
      String(value ?? "-"),
      pageWidth - 25,
      y,
      {
        align: "right",
      }
    );

    return y + 9;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="member-details-loading">
        <div className="details-spinner">
          ⟳
        </div>

        <p>
          Loading entry details...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="member-details-error">

        <h2>
          Something went wrong
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={() =>
            navigate("/members")
          }
        >
          ← Back to Members
        </button>

      </div>
    );
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!member) {
    return (
      <div className="member-details-error">

        <h2>
          Entry Not Found
        </h2>

        <button
          onClick={() =>
            navigate("/members")
          }
        >
          ← Back to Members
        </button>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="member-details-page">

      {/* HEADER */}

      <header className="member-details-header">

        <div>

          <div className="details-breadcrumb">
            Members
            <span>/</span>
            Entry Details
          </div>

          <h1>
            Entry Details
          </h1>

          <p>
            Complete information about this club entry.
          </p>

        </div>

        <div className="details-header-actions">

          <button
            className="download-pdf-button"
            onClick={downloadPDF}
            disabled={downloading}
          >
            {downloading
              ? "Generating..."
              : "📄 Download PDF"}
          </button>

          <button
            className="details-back-button"
            onClick={() =>
              navigate("/members")
            }
          >
            ← Back to Members
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="member-details-content">

        {/* PROFILE */}

        <section className="details-card profile-card">

          <div className="profile-avatar">
            {member.name
              ?.charAt(0)
              ?.toUpperCase() || "G"}
          </div>

          <div className="profile-info">

            <h2>
              {member.name}{" "}
              {member.surname}
            </h2>

            <p>
              {member.email}
            </p>

            <div className="profile-badges">

              <span
                className={`details-category ${member.category || "normal"
                  }`}
              >
                {(
                  member.category ||
                  "normal"
                ).toUpperCase()}
              </span>

              <span className="details-table">
                Table {member.tableNo || "-"}
              </span>

              {member.emailSent && (
                <span className="details-email-sent">
                  ✓ Email Sent
                </span>
              )}

            </div>

          </div>

        </section>

        {/* GUEST DETAILS */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>
              Guest Information
            </h2>

            <p>
              Personal details of the guest
            </p>

          </div>

          <div className="details-grid">

            <Detail
              label="Name"
              value={member.name}
            />

            <Detail
              label="Surname"
              value={member.surname}
            />

            <Detail
              label="Contact"
              value={member.contact}
            />

            <Detail
              label="Email"
              value={member.email}
            />

            <Detail
              label="Date of Birth"
              value={formatDate(member.dob)}
            />

            <Detail
              label="Referred By"
              value={member.reffBy || "-"}
            />

          </div>

        </section>

        {/* ENTRY DETAILS */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>
              Entry Information
            </h2>

            <p>
              Club entry and booking details
            </p>

          </div>

          <div className="details-grid">

            <Detail
              label="Entry Time"
              value={formatDateTime(
                member.entryTime
              )}
            />

            <Detail
              label="Category"
              value={
                member.category?.toUpperCase()
              }
            />

            <Detail
              label="Pax"
              value={
                member.pax || "-"
              }
            />

            <Detail
              label="Pax Count"
              value={
                member.paxCount
              }
            />

            <Detail
              label="Couple"
              value={
                member.couple
                  ? "Yes"
                  : "No"
              }
            />

            <Detail
              label="Table Number"
              value={
                member.tableNo
              }
            />

            <Detail
              label="With Cover"
              value={
                member.withCover || 0
              }
            />

            <Detail
              label="Without Cover"
              value={
                member.withoutCover || 0
              }
            />

          </div>

        </section>

        {/* PAYMENT */}

        <section className="details-card">

          <div className="details-section-title">

            <h2>
              Payment Information
            </h2>

            <p>
              Payment breakdown for this entry
            </p>

          </div>

          <div className="payment-grid">

            <div className="payment-box">

              <span>
                Cash
              </span>

              <strong>
                ₹
                {money(
                  member.cashAmount
                )}
              </strong>

            </div>

            <div className="payment-box">

              <span>
                UPI
              </span>

              <strong>
                ₹
                {money(
                  member.upiAmount
                )}
              </strong>

            </div>

            <div className="payment-box">

              <span>
                Card
              </span>

              <strong>
                ₹
                {money(
                  member.cardAmount
                )}
              </strong>

            </div>

          </div>

          <div className="total-payment">

            <span>
              Total Amount
            </span>

            <strong>
              ₹
              {money(
                member.totalAmount
              )}
            </strong>

          </div>

        </section>

        {/* BOTTOM ACTIONS */}

        <div className="bottom-actions">

          <button
            className="download-pdf-large"
            onClick={downloadPDF}
            disabled={downloading}
          >
            📄{" "}
            {downloading
              ? "Generating PDF..."
              : "Download Booking PDF"}
          </button>

          <button
            className="back-large-button"
            onClick={() =>
              navigate("/members")
            }
          >
            ← Back to Members
          </button>

        </div>

      </main>

    </div>
  );
}

// ==========================================
// DETAIL COMPONENT
// ==========================================

function Detail({
  label,
  value,
}) {
  return (
    <div className="detail-item">

      <span>
        {label}
      </span>

      <strong>
        {value || "-"}
      </strong>

    </div>
  );
}

export default MemberDetails;