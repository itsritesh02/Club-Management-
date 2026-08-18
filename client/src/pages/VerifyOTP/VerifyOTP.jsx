import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./VerifyOTP.css";

function VerifyOTP() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ==========================================
  // GET ADMIN EMAIL
  // ==========================================

  useEffect(() => {
    const adminEmail =
      sessionStorage.getItem("adminEmail");

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

    setError("");
    setSuccess("");

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
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

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "OTP verification failed"
        );

        return;
      }

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      // Remove temporary email
      sessionStorage.removeItem("adminEmail");

      setSuccess(
        "OTP verified successfully"
      );

      // Go to Dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      console.error(
        "VERIFY OTP ERROR:",
        error
      );

      setError(
        "Unable to connect to server"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BACK TO LOGIN
  // ==========================================

  const handleBack = () => {
    sessionStorage.removeItem(
      "adminEmail"
    );

    navigate("/login");
  };

  return (
    <div className="otp-page">

      {/* LEFT SIDE */}

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

      {/* RIGHT SIDE */}

      <div className="otp-right">

        <div className="otp-card">

          <button
            className="otp-back"
            onClick={handleBack}
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

          <form
            onSubmit={handleVerifyOTP}
          >

            {/* OTP */}

            <div className="otp-input-group">

              <label>
                Verification Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setOtp(value);
                }}
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="otp-error">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="otp-success">
                {success}
              </div>
            )}

            {/* BUTTON */}

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