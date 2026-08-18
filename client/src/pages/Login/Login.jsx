
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
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

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save email for OTP page
      sessionStorage.setItem(
        "adminEmail",
        email
      );

      // Go to OTP page
      navigate("/verify-otp");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}

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

      {/* RIGHT SIDE */}

      <div className="login-right">

        <div className="login-card">

          <button
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

            {/* EMAIL */}

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Login"}
            </button>

          </form>

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