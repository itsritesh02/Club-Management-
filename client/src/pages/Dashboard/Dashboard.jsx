
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET ADMIN
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const savedAdmin = localStorage.getItem("admin");

    if (!token) {
      navigate("/login");
      return;
    }

    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error("ADMIN PARSE ERROR:", error);
      }
    }

    fetchMembers(token);
  }, [navigate]);

  // ==========================================
  // GET MEMBERS
  // ==========================================

  const fetchMembers = async (token) => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/members",
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ token } `,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/login");
        return;
      }

      if (!response.ok) {
        console.error(
          data.message || "Failed to fetch members"
        );

        return;
      }

      setMembers(data.members || []);
    } catch (error) {
      console.error("GET MEMBERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/");
  };

  // ==========================================
  // ADMIN
  // ==========================================

  const adminEmail = admin?.email || "admin";

  const adminName = adminEmail.split("@")[0];

  const adminInitial =
    adminName.charAt(0).toUpperCase();

  // ==========================================
  // STATS
  // ==========================================

  const totalMembers = members.length;

  const activeMembers = members.filter(
    (member) =>
      !member.status ||
      member.status.toLowerCase() === "active"
  ).length;

  const expiringMembers = members.filter(
    (member) => {
      if (!member.membershipEndDate) {
        return false;
      }

      const endDate = new Date(
        member.membershipEndDate
      );

      const today = new Date();

      const difference =
        endDate.getTime() -
        today.getTime();

      const days =
        difference /
        (1000 * 60 * 60 * 24);

      return days >= 0 && days <= 30;
    }
  ).length;

  // ==========================================
  // RECENT MEMBERS
  // ==========================================

  const recentMembers = [...members]
    .reverse()
    .slice(0, 5);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="dashboard-sidebar">

        

        {/* SECTION TITLE */}

        <div className="sidebar-section-title">
          MENU
        </div>

        {/* NAVIGATION */}

        <nav className="dashboard-nav">

          <button
            className="nav-item active"
            onClick={() => goTo("/dashboard")}
          >
            <span className="nav-icon">
              ▦
            </span>

            <span>
              Dashboard
            </span>
          </button>

          <button
            className="nav-item"
            onClick={() => goTo("/members/add")}
          >
            <span className="nav-icon">
              +
            </span>

            <span>
              Add Members
            </span>
          </button>

          <button
            className="nav-item"
            onClick={() => goTo("/members")}
          >
            <span className="nav-icon">
              ♧
            </span>

            <span>
              All Members
            </span>
          </button>

        </nav>

        {/* =================================================
            DESKTOP SIDEBAR BOTTOM
        ================================================= */}

        <div className="sidebar-bottom">

          <div className="sidebar-admin">

            <div className="sidebar-avatar">
              {adminInitial}
            </div>

            <div className="sidebar-admin-info">

              <strong>
                {adminName}
              </strong>

              <span>
                Administrator
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

        {/* =================================================
            MOBILE LOGOUT
        ================================================= */}

        <button
          className="mobile-logout-button"
          onClick={handleLogout}
        >
          <span>
            ↪
          </span>

          Logout
        </button>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <div className="breadcrumb">
              HOME / DASHBOARD
            </div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back, {adminName}
            </p>

          </div>

          <button
            className="header-entry-button"
            onClick={() =>
              goTo("/members/add")
            }
          >
            + Add Member
          </button>

        </header>


        {/* =================================================
            STATS
        ================================================= */}

        <section className="dashboard-stats">

          {/* TOTAL */}

          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon members-icon">
                ♧
              </div>

              <span className="stat-label">
                MEMBERS
              </span>

            </div>

            <div className="stat-content">

              <span>
                Total Members
              </span>

              <h2>
                {totalMembers}
              </h2>

              <p>
                All registered members
              </p>

            </div>

          </div>


          {/* ACTIVE */}

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
                Active Members
              </span>

              <h2>
                {activeMembers}
              </h2>

              <p>
                Currently active
              </p>

            </div>

          </div>


          {/* EXPIRING */}

          <div className="dashboard-stat-card">

            <div className="stat-card-top">

              <div className="stat-icon expiring-icon">
                !
              </div>

              <span className="stat-label warning-label">
                EXPIRING
              </span>

            </div>

            <div className="stat-content">

              <span>
                Expiring Soon
              </span>

              <h2>
                {expiringMembers}
              </h2>

              <p>
                Within 30 days
              </p>

            </div>

          </div>


          {/* REVENUE */}

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
                ₹0
              </h2>

              <p>
                Payment module coming soon
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            RECENT MEMBERS
        ================================================= */}

        <section className="dashboard-grid">

          <div className="dashboard-card">

            <div className="card-header">

              <div>

                <h2>
                  Recent Members
                </h2>

                <p>
                  Latest members added
                </p>

              </div>

              <button
                className="outline-button"
                onClick={() =>
                  goTo("/members")
                }
              >
                View All
              </button>

            </div>


            {loading ? (

              <div className="dashboard-loading">
                Loading members...
              </div>

            ) : recentMembers.length === 0 ? (

              <div className="empty-members">

                <div className="empty-members-icon">
                  ♧
                </div>

                <h3>
                  No Members Yet
                </h3>

                <p>
                  Add your first member to
                  start managing your club.
                </p>

                <button
                  className="primary-button"
                  onClick={() =>
                    goTo("/members/add")
                  }
                >
                  + Add Member
                </button>

              </div>

            ) : (

              <div className="members-table-wrapper">

                <div className="members-table">

                  {/* TABLE HEADER */}

                  <div className="table-header">

                    <span>
                      MEMBER
                    </span>

                    <span>
                      CONTACT
                    </span>

                    <span>
                      MEMBERSHIP
                    </span>

                    <span>
                      ID
                    </span>

                  </div>


                  {/* TABLE ROWS */}

                  {recentMembers.map(
                    (member, index) => {

                      const name =
                        member.name ||
                        "Unknown";

                      const initial =
                        name
                          .charAt(0)
                          .toUpperCase();

                      return (

                        <div
                          className="table-row"
                          key={
                            member._id ||
                            index
                          }
                        >

                          <div className="member-name">

                            <div className="member-avatar">
                              {initial}
                            </div>

                            <div>

                              <strong>
                                {name}
                              </strong>

                              <small>
                                {member.email ||
                                  "No email"}
                              </small>

                            </div>

                          </div>


                          <div className="member-contact">
                            {member.phone || "-"}
                          </div>


                          <div>

                            <span className="category-badge category-normal">
                              {member.membershipType ||
                                "Regular"}
                            </span>

                          </div>


                          <div className="table-number">
                            #{index + 1}
                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

              </div>

            )}

          </div>


          

        </section>


        {/* FOOTER */}

        <footer className="dashboard-footer">

          <span>
            Club Management System
          </span>

          <span>
            Admin Panel
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
