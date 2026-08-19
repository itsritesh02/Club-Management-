import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "./AddMember.css";

function AddMember() {
  const navigate = useNavigate();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    contact: "",
    email: "",
    dob: "",
    entryTime: "",
    reffBy: "",

    pax: "",
    paxCount: 1,
    couple: false,

    cashAmount: 0,
    upiAmount: 0,
    cardAmount: 0,
    totalAmount: 0,

    withCover: 0,
    withoutCover: 0,

    category: "normal",
    tableNo: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // API BASE URL
  // ==========================================

  const API_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // ==========================================
      // AUTOMATIC TOTAL CALCULATION
      // ==========================================

      if (
        name === "cashAmount" ||
        name === "upiAmount" ||
        name === "cardAmount"
      ) {
        const cash =
          name === "cashAmount"
            ? Number(value) || 0
            : Number(prev.cashAmount) || 0;

        const upi =
          name === "upiAmount"
            ? Number(value) || 0
            : Number(prev.upiAmount) || 0;

        const card =
          name === "cardAmount"
            ? Number(value) || 0
            : Number(prev.cardAmount) || 0;

        updatedData.totalAmount =
          cash + upi + card;
      }

      return updatedData;
    });
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      surname: "",
      contact: "",
      email: "",
      dob: "",
      entryTime: "",
      reffBy: "",

      pax: "",
      paxCount: 1,
      couple: false,

      cashAmount: 0,
      upiAmount: 0,
      cardAmount: 0,
      totalAmount: 0,

      withCover: 0,
      withoutCover: 0,

      category: "normal",
      tableNo: "",
    });
  };

  // ==========================================
  // SWEET ALERT VALIDATION
  // ==========================================

  const showValidationAlert = (title, text) => {
    Swal.fire({
      icon: "warning",
      title,
      text,
      confirmButtonText: "OK",
      confirmButtonColor: "#2563eb",
    });
  };

  // ==========================================
  // SUBMIT / CONFIRM ENTRY
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // CHECK LOGIN
    // ==========================================

    const token = localStorage.getItem("adminToken");

    if (!token) {
      await Swal.fire({
        icon: "warning",
        title: "Login Required",
        text:
          "Your session has expired. Please login again.",
        confirmButtonText: "Login",
        confirmButtonColor: "#2563eb",
      });

      navigate("/login");
      return;
    }

    // ==========================================
    // REQUIRED VALIDATION
    // ==========================================

    if (!formData.name.trim()) {
      showValidationAlert(
        "Name Required",
        "Please enter guest name."
      );
      return;
    }

    if (!formData.surname.trim()) {
      showValidationAlert(
        "Surname Required",
        "Please enter guest surname."
      );
      return;
    }

    if (!formData.contact.trim()) {
      showValidationAlert(
        "Contact Required",
        "Please enter contact number."
      );
      return;
    }

    if (!formData.email.trim()) {
      showValidationAlert(
        "Email Required",
        "Please enter email address."
      );
      return;
    }

    if (!formData.dob) {
      showValidationAlert(
        "Date of Birth Required",
        "Please select date of birth."
      );
      return;
    }

    if (!formData.entryTime) {
      showValidationAlert(
        "Entry Time Required",
        "Please select entry time."
      );
      return;
    }

    if (!formData.category) {
      showValidationAlert(
        "Category Required",
        "Please select category."
      );
      return;
    }

    if (!formData.tableNo.trim()) {
      showValidationAlert(
        "Table Number Required",
        "Please enter table number."
      );
      return;
    }

    // ==========================================
    // PAYMENT TOTAL
    // ==========================================

    const cash =
      Number(formData.cashAmount) || 0;

    const upi =
      Number(formData.upiAmount) || 0;

    const card =
      Number(formData.cardAmount) || 0;

    const calculatedTotal =
      cash + upi + card;

    // ==========================================
    // CONFIRM ENTRY
    // ==========================================

    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirm Entry?",
      html: `
        <div style="text-align: left; font-size: 15px;">
          <p>
            <strong>Guest:</strong>
            ${formData.name} ${formData.surname}
          </p>

          <p>
            <strong>Contact:</strong>
            ${formData.contact}
          </p>

          <p>
            <strong>Table:</strong>
            ${formData.tableNo}
          </p>

          <p>
            <strong>Category:</strong>
            ${formData.category.toUpperCase()}
          </p>

          <p>
            <strong>Pax:</strong>
            ${formData.paxCount}
          </p>

          <p>
            <strong>Total Amount:</strong>
            ₹${calculatedTotal.toLocaleString("en-IN")}
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Confirm Entry",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    // ==========================================
    // API REQUEST
    // ==========================================

    try {
      setLoading(true);

      const bookingData = {
        name: formData.name.trim(),

        surname: formData.surname.trim(),

        contact: formData.contact.trim(),

        email: formData.email.trim(),

        dob: formData.dob,

        entryTime: formData.entryTime,

        reffBy: formData.reffBy.trim(),

        pax: formData.pax.trim(),

        paxCount:
          Number(formData.paxCount) || 1,

        couple:
          Boolean(formData.couple),

        cashAmount: cash,

        upiAmount: upi,

        cardAmount: card,

        totalAmount: calculatedTotal,

        withCover:
          Number(formData.withCover) || 0,

        withoutCover:
          Number(formData.withoutCover) || 0,

        category:
          formData.category,

        tableNo:
          formData.tableNo.trim(),
      };

      // ==========================================
      // POST MEMBER
      // ==========================================

      const response = await fetch(
        `${API_URL}/api/members`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify(bookingData),
        }
      );

      // ==========================================
      // SAFE JSON RESPONSE
      // ==========================================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // ==========================================
      // TOKEN EXPIRED
      // ==========================================

      if (response.status === 401) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "admin"
        );

        await Swal.fire({
          icon: "warning",
          title: "Session Expired",
          text:
            "Your session has expired. Please login again.",
          confirmButtonText: "Login",
          confirmButtonColor: "#2563eb",
        });

        navigate("/login");
        return;
      }

      // ==========================================
      // API ERROR
      // ==========================================

      if (!response.ok) {
        await Swal.fire({
          icon: "error",
          title: "Entry Failed",
          text:
            data.message ||
            "Failed to confirm entry.",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#dc2626",
        });

        return;
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      if (data.emailSent === false) {
        await Swal.fire({
          icon: "warning",
          title: "Entry Confirmed",
          text:
            "Entry was confirmed successfully, but booking email could not be sent.",
          confirmButtonText: "Continue",
          confirmButtonColor: "#2563eb",
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "Entry Confirmed!",
          text:
            "Booking details have been sent to the customer's email.",
          confirmButtonText: "View Members",
          confirmButtonColor: "#2563eb",
        });
      }

      // ==========================================
      // RESET FORM
      // ==========================================

      resetForm();

      // ==========================================
      // REDIRECT
      // ==========================================

      navigate("/members");

    } catch (error) {
      console.error(
        "CONFIRM ENTRY ERROR:",
        error
      );

      await Swal.fire({
        icon: "error",
        title: "Server Error",
        text:
          "Unable to connect to server. Please check your backend.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // JSX
  // ==========================================

  return (
    <div className="add-member-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="add-member-header">

        <div>

          <span className="page-badge">
            CLUB ENTRY
          </span>

          <h1>
            New Entry
          </h1>

          <p>
            Register a guest and confirm their
            club booking.
          </p>

        </div>

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/members")
          }
          disabled={loading}
        >
          ← Back to Members
        </button>

      </header>

      {/* ========================================
          FORM CARD
      ======================================== */}

      <div className="add-member-card">

        {/* FORM HEADER */}

        <div className="form-title">

          <div>

            <h2>
              Guest Information
            </h2>

            <p>
              Enter guest and booking details.
            </p>

          </div>

          <span className="required-info">
            * Required
          </span>

        </div>

        <form onSubmit={handleSubmit}>

          {/* ====================================
              PERSONAL DETAILS
          ==================================== */}

          <div className="form-section">

            <div className="section-heading">

              <span>
                01
              </span>

              <div>

                <h3>
                  Personal Details
                </h3>

                <p>
                  Guest contact information
                </p>

              </div>

            </div>

            <div className="form-grid">

              {/* NAME */}

              <div className="form-group">

                <label>
                  Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter first name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* SURNAME */}

              <div className="form-group">

                <label>
                  Surname <span>*</span>
                </label>

                <input
                  type="text"
                  name="surname"
                  placeholder="Enter surname"
                  value={formData.surname}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* CONTACT */}

              <div className="form-group">

                <label>
                  Contact <span>*</span>
                </label>

                <input
                  type="tel"
                  name="contact"
                  placeholder="Enter contact number"
                  value={formData.contact}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email <span>*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="guest@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* DOB */}

              <div className="form-group">

                <label>
                  Date of Birth <span>*</span>
                </label>

                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* REFF BY */}

              <div className="form-group">

                <label>
                  Reff By
                </label>

                <input
                  type="text"
                  name="reffBy"
                  placeholder="Referred by"
                  value={formData.reffBy}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

            </div>

          </div>

          {/* ====================================
              ENTRY DETAILS
          ==================================== */}

          <div className="form-section">

            <div className="section-heading">

              <span>
                02
              </span>

              <div>

                <h3>
                  Entry Details
                </h3>

                <p>
                  Entry, guest and table details
                </p>

              </div>

            </div>

            <div className="form-grid">

              {/* ENTRY TIME */}

              <div className="form-group">

                <label>
                  Entry Time <span>*</span>
                </label>

                <input
                  type="datetime-local"
                  name="entryTime"
                  value={formData.entryTime}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category <span>*</span>
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="normal">
                    Normal
                  </option>

                  <option value="vip">
                    VIP
                  </option>

                  <option value="vvip">
                    VVIP
                  </option>

                </select>

              </div>

              {/* TABLE */}

              <div className="form-group">

                <label>
                  Table No <span>*</span>
                </label>

                <input
                  type="text"
                  name="tableNo"
                  placeholder="e.g. T-12"
                  value={formData.tableNo}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* PAX */}

              <div className="form-group">

                <label>
                  Pax
                </label>

                <input
                  type="text"
                  name="pax"
                  placeholder="e.g. Adult / Guest"
                  value={formData.pax}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* PAX COUNT */}

              <div className="form-group">

                <label>
                  Pax Count
                </label>

                <input
                  type="number"
                  name="paxCount"
                  min="1"
                  value={formData.paxCount}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* COUPLE */}

              <div className="form-group">

                <label>
                  Couple
                </label>

                <label className="checkbox-label">

                  <input
                    type="checkbox"
                    name="couple"
                    checked={
                      formData.couple
                    }
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <span>
                    Couple Entry
                  </span>

                </label>

              </div>

            </div>

          </div>

          {/* ====================================
              COVER DETAILS
          ==================================== */}

          <div className="form-section">

            <div className="section-heading">

              <span>
                03
              </span>

              <div>

                <h3>
                  Cover Details
                </h3>

                <p>
                  Guest cover information
                </p>

              </div>

            </div>

            <div className="form-grid">

              {/* WITH COVER */}

              <div className="form-group">

                <label>
                  With Cover
                </label>

                <input
                  type="number"
                  name="withCover"
                  min="0"
                  placeholder="0"
                  value={formData.withCover}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

              {/* WITHOUT COVER */}

              <div className="form-group">

                <label>
                  Without Cover
                </label>

                <input
                  type="number"
                  name="withoutCover"
                  min="0"
                  placeholder="0"
                  value={
                    formData.withoutCover
                  }
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>

            </div>

          </div>

          {/* ====================================
              PAYMENT DETAILS
          ==================================== */}

          <div className="form-section">

            <div className="section-heading">

              <span>
                04
              </span>

              <div>

                <h3>
                  Payment Details
                </h3>

                <p>
                  Enter payment breakdown
                </p>

              </div>

            </div>

            <div className="form-grid">

              {/* CASH */}

              <div className="form-group">

                <label>
                  Cash Amount
                </label>

                <div className="amount-input">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    name="cashAmount"
                    min="0"
                    placeholder="0"
                    value={
                      formData.cashAmount
                    }
                    onChange={handleChange}
                    disabled={loading}
                  />

                </div>

              </div>

              {/* UPI */}

              <div className="form-group">

                <label>
                  UPI Amount
                </label>

                <div className="amount-input">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    name="upiAmount"
                    min="0"
                    placeholder="0"
                    value={
                      formData.upiAmount
                    }
                    onChange={handleChange}
                    disabled={loading}
                  />

                </div>

              </div>

              {/* CARD */}

              <div className="form-group">

                <label>
                  Card Amount
                </label>

                <div className="amount-input">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    name="cardAmount"
                    min="0"
                    placeholder="0"
                    value={
                      formData.cardAmount
                    }
                    onChange={handleChange}
                    disabled={loading}
                  />

                </div>

              </div>

              {/* TOTAL */}

              <div className="form-group total-field">

                <label>
                  Total Amount
                </label>

                <div className="amount-input total-input">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    name="totalAmount"
                    value={
                      formData.totalAmount
                    }
                    readOnly
                  />

                </div>

                <small className="total-help">
                  Cash + UPI + Card
                </small>

              </div>

            </div>

          </div>

          {/* ====================================
              BUTTONS
          ==================================== */}

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/members")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Confirming Entry...
                </>
              ) : (
                <>
                  ✓ Confirm Entry
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddMember;