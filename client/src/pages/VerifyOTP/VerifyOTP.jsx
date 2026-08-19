import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "./VerifyOTP.css";

function VerifyOTP() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET ADMIN EMAIL
  // ==========================================

  useEffect(() => {
    const adminEmail = sessionStorage.getItem("adminEmail");

    if (!adminEmail) {
      navigate("/login");
      return;
    }

    setEmail(adminEmail);
  }, [navigate]);

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!otp) {
      Swal.fire({
        icon: "warning",
        title: "OTP Required",
        text: "Please enter the OTP.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    if (otp.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "Invalid OTP",
        text: "OTP must be 6 digits.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // API URL FROM VERCEL / .ENV
      // ==========================================

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      // ==========================================
      // RESPONSE
      // ==========================================

      const data = await response.json();

      // ==========================================
      // API ERROR
      // ==========================================

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: data.message || "OTP verification failed.",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#dc2626",
        });

        return;
      }

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      localStorage.setItem("adminToken", data.token);

      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      // ==========================================
      // REMOVE TEMP EMAIL
      // ==========================================

      sessionStorage.removeItem("adminEmail");

      // ==========================================
      // SUCCESS
      // ==========================================

      await Swal.fire({
        icon: "success",
        title: "Verification Successful!",
        text: "You have been successfully logged in.",
        confirmButtonText: "Go to Dashboard",
        confirmButtonColor: "#2563eb",
        timer: 1800,
        timerProgressBar: true,
      });

      // ==========================================
      // GO TO DASHBOARD
      // ==========================================

      navigate("/dashboard");

    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BACK TO LOGIN
  // ==========================================

  const handleBack = () => {
    sessionStorage.removeItem("adminEmail");

    navigate("/login");
  };

  return (
    <div className="otp-page">

      {/* ==========================================
          LEFT SIDE
      ========================================== */}

      <div className="otp-left">

        <div className="otp-brand">
          Club<span>Manager</span>
        </div>

        <div className="otp-intro">

          <p className="otp-small-title">
            SECURITY VERIFICATION
          </p>

          <h1>
            One More
            <br />
            Step
          </h1>

          <p>
            We have sent a verification code
            to your registered admin email.
          </p>

        </div>

      </div>

      {/* ==========================================
          RIGHT SIDE
      ========================================== */}

      <div className="otp-right">

        <div className="otp-card">

          {/* BACK BUTTON */}

          <button
            type="button"
            className="otp-back"
            onClick={handleBack}
            disabled={loading}
          >
            ← Back to Login
          </button>

          <div className="otp-icon">
            ✉
          </div>

          <h2>
            Verify OTP
          </h2>

          <p className="otp-subtitle">
            Enter the 6-digit OTP sent to
          </p>

          <p className="otp-email">
            {email}
          </p>

          <form onSubmit={handleVerifyOTP}>

            {/* ==========================================
                OTP INPUT
            ========================================== */}

            <div className="otp-input-group">

              <label htmlFor="otp">
                Verification Code
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(
                    /\D/g,
                    ""
                  );

                  setOtp(value);
                }}
                disabled={loading}
                autoComplete="one-time-code"
              />

            </div>

            {/* ==========================================
                VERIFY BUTTON
            ========================================== */}

            <button
              type="submit"
              className="otp-submit"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

          </form>

          <p className="otp-expiry">
            OTP is valid for 5 minutes.
          </p>

        </div>

      </div>

    </div>
  );
}

export default VerifyOTP;