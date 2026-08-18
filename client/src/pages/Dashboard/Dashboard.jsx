import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [admin] = useState(() => {
    const savedAdmin = localStorage.getItem("admin");

    return savedAdmin
      ? JSON.parse(savedAdmin)
      : null;
  });

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/");
  };

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          Club<span>Manager</span>
        </div>

        <nav className="dashboard-nav">

          <button className="nav-item active">
            <span>📊</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/members")}
          >
            <span>👥</span>
            Members
          </button>

          <button className="nav-item">
            <span>💳</span>
            Payments
          </button>

          <button className="nav-item">
            <span>📋</span>
            Memberships
          </button>

          <button className="nav-item">
            <span>📈</span>
            Reports
          </button>

        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back, Admin
            </p>
          </div>

          <div className="admin-info">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Admin</strong>

              <span>
                {admin?.email || "Admin"}
              </span>
            </div>

          </div>

        </header>

        {/* STATS */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>
              <p>Total Members</p>
              <h2>0</h2>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>
              <p>Active Members</p>
              <h2>0</h2>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>
              <p>Expiring Soon</p>
              <h2>0</h2>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>
              <p>Total Revenue</p>
              <h2>₹0</h2>
            </div>

          </div>

        </section>

        {/* CONTENT */}

        <section className="dashboard-content">

          <div className="dashboard-card">

            <div className="card-heading">

              <div>
                <h2>Recent Members</h2>

                <p>
                  Latest members added to the club
                </p>
              </div>

              <button
                onClick={() => navigate("/members")}
              >
                View All
              </button>

            </div>

            <div className="empty-state">

              <div className="empty-icon">
                👥
              </div>

              <h3>No Members Yet</h3>

              <p>
                Add your first club member
                to see them here.
              </p>

              <button
                onClick={() => navigate("/members")}
              >
                Add Member
              </button>

            </div>

          </div>

          <div className="dashboard-card">

            <div className="card-heading">

              <div>
                <h2>Quick Actions</h2>

                <p>
                  Manage your club quickly
                </p>
              </div>

            </div>

            <div className="quick-actions">

              <button
                onClick={() => navigate("/members")}
              >
                <span>➕</span>
                <div>
                  <strong>Add Member</strong>
                  <small>
                    Add a new club member
                  </small>
                </div>
              </button>

              <button>
                <span>💳</span>
                <div>
                  <strong>Record Payment</strong>
                  <small>
                    Add a member payment
                  </small>
                </div>
              </button>

              <button>
                <span>📊</span>
                <div>
                  <strong>View Reports</strong>
                  <small>
                    Check club reports
                  </small>
                </div>
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;