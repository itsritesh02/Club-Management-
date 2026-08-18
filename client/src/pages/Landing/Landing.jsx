import { useNavigate } from "react-router-dom";

import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <nav className="landing-navbar">

        <div className="landing-logo">
          Club<span>Manager</span>
        </div>

        <button
          className="nav-login-btn"
          onClick={handleLogin}
        >
          Admin Login
        </button>

      </nav>

      {/* HERO */}
      <section className="landing-hero">

        <div className="hero-content">

          <p className="hero-small-title">
            CLUB MANAGEMENT SYSTEM
          </p>

          <h1>
            Manage Your Club
            <br />
            <span>Smarter & Easier</span>
          </h1>

          <p className="hero-description">
            Manage members, memberships, entries,
            payments and reports from one simple
            dashboard.
          </p>

          <button
            className="hero-login-btn"
            onClick={handleLogin}
          >
            Admin Login →
          </button>

        </div>

        <div className="hero-card">

          <div className="card-header">
            <span>Dashboard</span>
            <span className="online-dot">●</span>
          </div>

          <div className="dashboard-stats">

            <div className="stat-box">
              <h3>1,250</h3>
              <p>Members</p>
            </div>

            <div className="stat-box">
              <h3>856</h3>
              <p>Active</p>
            </div>

            <div className="stat-box">
              <h3>₹45K</h3>
              <p>Revenue</p>
            </div>

          </div>

          <div className="activity-box">

            <div className="activity-title">
              Recent Activity
            </div>

            <div className="activity-row">
              <span>New Member</span>
              <span>Today</span>
            </div>

            <div className="activity-row">
              <span>Payment Received</span>
              <span>Today</span>
            </div>

            <div className="activity-row">
              <span>Membership Renewed</span>
              <span>Yesterday</span>
            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="features-section">

        <div className="feature">
          <div className="feature-icon">👥</div>
          <h3>Member Management</h3>
          <p>
            Easily manage club members and
            membership details.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">💳</div>
          <h3>Payment Tracking</h3>
          <p>
            Keep track of memberships and
            payments.
          </p>
        </div>

        <div className="feature">
          <div className="feature-icon">📊</div>
          <h3>Reports</h3>
          <p>
            View useful reports and club
            performance.
          </p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <p>
          © 2026 Club Management System
        </p>
      </footer>

    </div>
  );
}

export default Landing;