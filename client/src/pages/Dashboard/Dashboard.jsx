import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // API URL
  // ==========================================

  const API_URL = import.meta.env.VITE_API_URL;

  // ==========================================
  // LOAD ADMIN
  // ==========================================

  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");

    try {
      setAdmin(
        savedAdmin
          ? JSON.parse(savedAdmin)
          : null
      );
    } catch {
      setAdmin(null);
    }
  }, []);

  // ==========================================
  // FETCH MEMBERS
  // ==========================================

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token =
          localStorage.getItem("adminToken");

        if (!token) {
          navigate("/login");
          return;
        }

        if (!API_URL) {
          console.error(
            "VITE_API_URL is not configured"
          );

          await Swal.fire({
            icon: "error",
            title: "Configuration Error",
            text:
              "API URL is not configured. Please check Vercel environment variables.",
            confirmButtonText: "OK",
          });

          setLoading(false);
          return;
        }

        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/members`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ======================================
        // RESPONSE
        // ======================================

        const data =
          await response.json();

        // ======================================
        // TOKEN EXPIRED
        // ======================================

        if (response.status === 401) {
          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem("admin");

          await Swal.fire({
            icon: "warning",
            title: "Session Expired",
            text: "Please login again.",
            confirmButtonText: "Go to Login",
          });

          navigate("/login");

          return;
        }

        // ======================================
        // API ERROR
        // ======================================

        if (!response.ok) {
          await Swal.fire({
            icon: "error",
            title: "Unable to Load Data",
            text:
              data.message ||
              "Failed to fetch members.",
            confirmButtonText: "OK",
          });

          return;
        }

        // ======================================
        // SAVE MEMBERS
        // ======================================

        setMembers(
          Array.isArray(data.members)
            ? data.members
            : []
        );

      } catch (error) {
        console.error(
          "DASHBOARD MEMBERS ERROR:",
          error
        );

        Swal.fire({
          icon: "error",
          title: "Server Error",
          text:
            "Unable to connect to server.",
          confirmButtonText: "OK",
        });

      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [navigate, API_URL]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Logout?",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#374151",
    });

    if (!result.isConfirmed) {
      return;
    }

    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    await Swal.fire({
      icon: "success",
      title: "Logged Out",
      text:
        "You have been logged out successfully.",
      timer: 1200,
      showConfirmButton: false,
    });

    navigate("/");
  };

  // ==========================================
  // DATE HELPERS
  // ==========================================

  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const getDaysRemaining = (date) => {
    if (!date) {
      return null;
    }

    const endDate = new Date(date);

    if (Number.isNaN(endDate.getTime())) {
      return null;
    }

    endDate.setHours(
      0,
      0,
      0,
      0
    );

    return Math.ceil(
      (endDate - today) /
      (1000 * 60 * 60 * 24)
    );
  };

  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  const totalEntries =
    members.length;

  const activeEntries =
    members.filter((member) => {
      const days =
        getDaysRemaining(
          member.membershipEndDate
        );

      return (
        days !== null &&
        days >= 0
      );
    }).length;

  const expiringSoon =
    members.filter((member) => {
      const days =
        getDaysRemaining(
          member.membershipEndDate
        );

      return (
        days !== null &&
        days >= 0 &&
        days <= 30
      );
    }).length;

  const totalRevenue =
    members.reduce(
      (total, member) => {
        return (
          total +
          Number(
            member.totalAmount || 0
          )
        );
      },
      0
    );

  // ==========================================
  // RECENT ENTRIES
  // ==========================================

  const recentMembers =
    [...members]
      .sort((a, b) => {
        const dateA = new Date(
          a.createdAt ||
          a.entryTime ||
          0
        );

        const dateB = new Date(
          b.createdAt ||
          b.entryTime ||
          0
        );

        return dateB - dateA;
      })
      .slice(0, 5);

  // ==========================================
  // CATEGORY
  // ==========================================

  const getCategoryClass = (
    category
  ) => {
    const value =
      category?.toLowerCase();

    if (value === "vip") {
      return "category-vip";
    }

    if (value === "vvip") {
      return "category-vvip";
    }

    return "category-normal";
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-top">

          <div className="dashboard-logo">

            <div className="logo-icon">
              JC
            </div>

            <div className="logo-text">

              <strong>
                Jaguar Club
              </strong>

              <span>
                Mangement
              </span>

            </div>

          </div>

          <div className="sidebar-section-title">
            MENU
          </div>

          <nav className="dashboard-nav">

            <button
              className="nav-item active"
            >
              <span className="nav-icon">
                ⌂
              </span>

              <span>
                Dashboard
              </span>
            </button>

            <button
              className="nav-item"
              onClick={() =>
                navigate("/members")
              }
            >
              <span className="nav-icon">
                ♙
              </span>

              <span>
                Members
              </span>

            </button>

          </nav>

        </div>

        {/* ====================================
            SIDEBAR BOTTOM
        ==================================== */}

        <div className="sidebar-bottom">

          <div className="sidebar-admin">

            <div className="sidebar-avatar">
              A
            </div>

            <div className="sidebar-admin-info">

              <strong>
                Admin
              </strong>

              <span>
                {admin?.email ||
                  "Admin"}
              </span>

            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>
              ↪
            </span>

            Logout
          </button>

        </div>

      </aside>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="dashboard-main">

        {/* ====================================
            HEADER
        ==================================== */}

        <header className="dashboard-header">

          <div>

            <div className="breadcrumb">
              Admin / Dashboard
            </div>

            <h1>
              Dashboard
            </h1>

            <p>
              Overview of your club
              entries and revenue.
            </p>

          </div>

          <button
            className="header-entry-button"
            onClick={() =>
              navigate(
                "/members/add"
              )
            }
          >
            + New Entry
          </button>

        </header>

        {/* ====================================
            STATS
        ==================================== */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon members-icon">
                ♙
              </div>

              <span className="stat-label">
                TOTAL
              </span>

            </div>

            <div className="stat-content">

              <span>
                Total Entries
              </span>

              <h2>
                {totalEntries}
              </h2>

              <p>
                All club entries
              </p>

            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon active-icon">
                ✓
              </div>

              <span className="stat-label">
                ACTIVE
              </span>

            </div>

            <div className="stat-content">

              <span>
                Active Entries
              </span>

              <h2>
                {activeEntries}
              </h2>

              <p>
                Currently active
              </p>

            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon expiring-icon">
                ◷
              </div>

              <span className="stat-label warning-label">
                ATTENTION
              </span>

            </div>

            <div className="stat-content">

              <span>
                Expiring Soon
              </span>

              <h2>
                {expiringSoon}
              </h2>

              <p>
                Within 30 days
              </p>

            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon revenue-icon">
                ₹
              </div>

              <span className="stat-label">
                REVENUE
              </span>

            </div>

            <div className="stat-content">

              <span>
                Total Revenue
              </span>

              <h2>
                ₹
                {totalRevenue.toLocaleString(
                  "en-IN"
                )}
              </h2>

              <p>
                Total amount collected
              </p>

            </div>

          </div>

        </section>

        {/* ====================================
            CONTENT
        ==================================== */}

        <section className="dashboard-grid">

          {/* ==================================
              RECENT ENTRIES
          ================================== */}

          <div className="dashboard-card recent-members-card">

            <div className="card-header">

              <div>

                <h2>
                  Recent Entries
                </h2>

                <p>
                  Latest club entries
                </p>

              </div>

              <button
                className="outline-button"
                onClick={() =>
                  navigate(
                    "/members"
                  )
                }
              >
                View All →
              </button>

            </div>

            {loading ? (

              <div className="dashboard-loading">
                Loading entries...
              </div>

            ) : recentMembers.length ===
              0 ? (

              <div className="empty-members">

                <div className="empty-members-icon">
                  ♙
                </div>

                <h3>
                  No Entries Yet
                </h3>

                <p>
                  Add your first club
                  entry to get started.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    navigate(
                      "/members/add"
                    )
                  }
                >
                  + New Entry
                </button>

              </div>

            ) : (

              <div className="members-table-wrapper">

                <div className="members-table">

                  <div className="table-header">

                    <span>
                      MEMBER
                    </span>

                    <span>
                      CONTACT
                    </span>

                    <span>
                      CATEGORY
                    </span>

                    <span>
                      TABLE
                    </span>

                  </div>

                  {recentMembers.map(
                    (member) => (

                      <div
                        className="table-row"
                        key={
                          member._id
                        }
                      >

                        <div className="member-name">

                          <div className="member-avatar">

                            {(
                              member.name ||
                              "M"
                            )
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {
                                member.name
                              }{" "}
                              {
                                member.surname ||
                                ""
                              }
                            </strong>

                            <small>
                              {formatDate(
                                member.entryTime ||
                                member.createdAt
                              )}
                            </small>

                          </div>

                        </div>

                        <span className="member-contact">
                          {member.contact ||
                            member.phone ||
                            "-"}
                        </span>

                        <span>

                          <span
                            className={`category-badge ${getCategoryClass(
                              member.category
                            )}`}
                          >
                            {member.category ||
                              "Normal"}
                          </span>

                        </span>

                        <span className="table-number">
                          {member.tableNo ||
                            "-"}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </div>

          {/* ==================================
              QUICK ACTIONS
          ================================== */}

          <div className="dashboard-card quick-actions-card">

            <div className="card-header">

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Manage your club
                </p>

              </div>

            </div>

            <div className="quick-actions">

              <button
                className="quick-action"
                onClick={() =>
                  navigate(
                    "/members/add"
                  )
                }
              >

                <div className="quick-action-icon add-icon">
                  +
                </div>

                <div>

                  <strong>
                    New Entry
                  </strong>

                  <small>
                    Add a new club entry
                  </small>

                </div>

                <span className="action-arrow">
                  →
                </span>

              </button>

              <button
                className="quick-action"
                onClick={() =>
                  navigate(
                    "/members"
                  )
                }
              >

                <div className="quick-action-icon members-action-icon">
                  ♙
                </div>

                <div>

                  <strong>
                    Members
                  </strong>

                  <small>
                    View all club entries
                  </small>

                </div>

                <span className="action-arrow">
                  →
                </span>

              </button>

            </div>

            {/* ==================================
                CATEGORY SUMMARY
            ================================== */}

            <div className="category-summary">

              <h3>
                Entry Categories
              </h3>

              <div className="category-summary-list">

                <div>

                  <span className="dot normal-dot"></span>

                  Normal

                  <strong>
                    {
                      members.filter(
                        (m) =>
                          !m.category ||
                          m.category.toLowerCase() ===
                          "normal"
                      ).length
                    }
                  </strong>

                </div>

                <div>

                  <span className="dot vip-dot"></span>

                  VIP

                  <strong>
                    {
                      members.filter(
                        (m) =>
                          m.category?.toLowerCase() ===
                          "vip"
                      ).length
                    }
                  </strong>

                </div>

                <div>

                  <span className="dot vvip-dot"></span>

                  VVIP

                  <strong>
                    {
                      members.filter(
                        (m) =>
                          m.category?.toLowerCase() ===
                          "vvip"
                      ).length
                    }
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ====================================
            FOOTER
        ==================================== */}

        <footer className="dashboard-footer">

          <span>
            ClubManager Admin Panel
          </span>

          <span>
            © 2026
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;