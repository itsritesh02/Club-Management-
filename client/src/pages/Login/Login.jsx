import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    // =========================
    // VALIDATION
    // =========================

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter email and password.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2563eb",
      });

      return;
    }

    try {
      setLoading(true);

      // =========================
      // API URL FROM .ENV
      // =========================

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // =========================
      // RESPONSE
      // =========================

      const data = await response.json();

      // =========================
      // LOGIN ERROR
      // =========================

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid email or password.",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#dc2626",
        });

        return;
      }

      // =========================
      // SAVE EMAIL
      // =========================

      sessionStorage.setItem("adminEmail", email);

      // =========================
      // SUCCESS
      // =========================

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "OTP has been sent to your email.",
        confirmButtonText: "Verify OTP",
        confirmButtonColor: "#2563eb",
        timer: 2000,
        timerProgressBar: true,
      });

      // =========================
      // GO TO OTP
      // =========================

      navigate("/verify-otp");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

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

  return (
    <div className="login-page">

      {/* ==========================================
          LEFT SIDE
      ========================================== */}

      <div className="login-left">

        <div className="login-brand">
          Club<span>Manager</span>
        </div>

        <div className="login-intro">

          <p className="login-small-title">
            CLUB MANAGEMENT SYSTEM
          </p>

          <h1>
            Welcome Back,
            <br />
            Admin
          </h1>

          <p>
            Login to manage your club,
            members, payments and reports.
          </p>

        </div>

      </div>

      {/* ==========================================
          RIGHT SIDE
      ========================================== */}

      <div className="login-right">

        <div className="login-card">

          {/* BACK BUTTON */}

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>

          <h2>Admin Login</h2>

          <p className="login-subtitle">
            Enter your admin credentials
          </p>

          <form onSubmit={handleLogin}>

            {/* ==========================================
                EMAIL
            ========================================== */}

            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

            </div>

            {/* ==========================================
                PASSWORD
            ========================================== */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

            </div>

            {/* ==========================================
                LOGIN BUTTON
            ========================================== */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Login"}
            </button>

          </form>

          {/* OTP INFO */}

          <p className="otp-info">
            After login, an OTP will be sent
            to the admin email.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;