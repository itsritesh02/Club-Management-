import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "./Members.css";

function Members() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteLoading, setDeleteLoading] = useState(null);

  // ==========================================
  // API BASE URL
  // ==========================================

  const API_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");

  // ==========================================
  // GET MEMBERS
  // ==========================================

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/members`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

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
          data.message || "Failed to fetch entries"
        );

        return;
      }

      setMembers(data.members || []);
    } catch (error) {
      console.error("GET MEMBERS ERROR:", error);

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD MEMBERS
  // ==========================================

  useEffect(() => {
    fetchMembers();
  }, []);

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
    });

    if (!result.isConfirmed) {
      return;
    }

    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    await Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been logged out successfully.",
      timer: 1200,
      showConfirmButton: false,
    });

    navigate("/");
  };

  // ==========================================
  // ADD ENTRY
  // ==========================================

  const handleAddMember = () => {
    navigate("/members/add");
  };

  // ==========================================
  // VIEW MEMBER
  // ==========================================

  const handleViewMember = (id) => {
    navigate(`/members/${id}`);
  };

  // ==========================================
  // DELETE MEMBER
  // ==========================================

  const handleDeleteMember = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Entry?",
      text:
        "Are you sure you want to delete this entry? This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeleteLoading(id);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/login");
        return;
      }

      // ======================================
      // IMPORTANT:
      // DO NOT USE localhost HERE
      // ======================================

      const response = await fetch(
        `${API_URL}/api/members/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

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
      // DELETE ERROR
      // ======================================

      if (!response.ok) {
        const message =
          data.message || "Failed to delete entry";

        setError(message);

        await Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: message,
          confirmButtonText: "OK",
        });

        return;
      }

      // ======================================
      // REMOVE FROM UI
      // ======================================

      setMembers((prev) =>
        prev.filter(
          (member) => member._id !== id
        )
      );

      // ======================================
      // SUCCESS
      // ======================================

      await Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        text: "The entry has been deleted successfully.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "DELETE MEMBER ERROR:",
        error
      );

      setError(
        "Unable to delete entry. Please try again."
      );

      await Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          "Unable to delete entry. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // FORMAT DATE TIME
  // ==========================================

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

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
  // CATEGORY CLASS
  // ==========================================

  const getCategoryClass = (category) => {
    return (
      category
        ?.toLowerCase()
        .replace(/\s+/g, "-") || "normal"
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="members-page">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="members-sidebar">

        <div className="members-logo">
          Club<span>Manager</span>
        </div>

        <nav className="members-nav">

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className="active"
          >
            <span>👥</span>
            <span>Members</span>
          </button>

        </nav>

        <button
          type="button"
          className="members-logout"
          onClick={handleLogout}
        >
          <span>🚪</span>
          Logout
        </button>

      </aside>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="members-main">

        {/* HEADER */}

        <header className="members-header">

          <div>

            <div className="page-breadcrumb">
              Club Management
              <span>/</span>
              Members
            </div>

            <h1>
              Members & Entries
            </h1>

            <p>
              Manage all club guest
              entries and bookings.
            </p>

          </div>

        </header>

        {/* ERROR */}

        {error && (
          <div className="members-error">

            <span>⚠️</span>

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>

          </div>
        )}

        {/* ====================================
            STATS
        ==================================== */}

        {!loading && (
          <section className="members-stats">

            <div className="member-stat-card">

              <div className="member-stat-icon">
                👥
              </div>

              <div>

                <span>
                  Total Entries
                </span>

                <strong>
                  {members.length}
                </strong>

              </div>

            </div>

            <div className="member-stat-card">

              <div className="member-stat-icon">
                🎟️
              </div>

              <div>

                <span>
                  Total Pax
                </span>

                <strong>
                  {members.reduce(
                    (total, member) =>
                      total +
                      (Number(
                        member.paxCount
                      ) || 0),
                    0
                  )}
                </strong>

              </div>

            </div>

            <div className="member-stat-card">

              <div className="member-stat-icon">
                💰
              </div>

              <div>

                <span>
                  Total Revenue
                </span>

                <strong>
                  ₹
                  {members
                    .reduce(
                      (total, member) =>
                        total +
                        (Number(
                          member.totalAmount
                        ) || 0),
                      0
                    )
                    .toLocaleString("en-IN")}
                </strong>

              </div>

            </div>

            <div className="member-stat-card">

              <div className="member-stat-icon">
                ✉️
              </div>

              <div>

                <span>
                  Emails Sent
                </span>

                <strong>
                  {
                    members.filter(
                      (member) =>
                        member.emailSent
                    ).length
                  }
                </strong>

              </div>

            </div>

          </section>
        )}

        {/* ====================================
            MEMBERS CARD
        ==================================== */}

        {loading ? (

          <div className="members-loading">

            <div className="loading-spinner">
              ⟳
            </div>

            <p>
              Loading entries...
            </p>

          </div>

        ) : (

          <section className="members-card">

            {/* CARD HEADER */}

            <div className="members-card-header">

              <div>

                <h2>
                  All Entries
                </h2>

                <p>
                  {members.length === 0
                    ? "No entries available"
                    : `${members.length} ${members.length === 1
                      ? "entry"
                      : "entries"
                    } registered`}
                </p>

              </div>

              <div className="members-card-actions">

                <button
                  type="button"
                  onClick={fetchMembers}
                  className="refresh-button"
                  disabled={loading}
                >
                  ↻
                  <span>
                    Refresh
                  </span>
                </button>

                <button
                  type="button"
                  className="card-add-button"
                  onClick={handleAddMember}
                >
                  + Add Entry
                </button>

              </div>

            </div>

            {/* ==================================
                EMPTY
            ================================== */}

            {members.length === 0 ? (

              <div className="members-empty">

                <div className="members-empty-icon">
                  👥
                </div>

                <h3>
                  No Entries Yet
                </h3>

                <p>
                  Start by adding your
                  first club entry.
                </p>

                <button
                  type="button"
                  className="add-member-button"
                  onClick={handleAddMember}
                >
                  + Create First Entry
                </button>

              </div>

            ) : (

              /* ==================================
                 TABLE
              ================================== */

              <div className="members-table-wrapper">

                <table className="members-table">

                  <thead>

                    <tr>

                      <th>
                        Guest
                      </th>

                      <th>
                        Contact
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Pax
                      </th>

                      <th>
                        Table
                      </th>

                      <th>
                        Entry Time
                      </th>

                      <th>
                        Cover
                      </th>

                      <th>
                        Total
                      </th>

                      <th>
                        Email
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {members.map(
                      (member) => (

                        <tr
                          key={member._id}
                        >

                          {/* GUEST */}

                          <td>

                            <div className="guest-info">

                              <div className="guest-avatar">

                                {member.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "G"}

                              </div>

                              <div>

                                <strong>
                                  {member.name}{" "}
                                  {member.surname}
                                </strong>

                                <small>
                                  {member.email}
                                </small>

                              </div>

                            </div>

                          </td>

                          {/* CONTACT */}

                          <td>
                            {member.contact || "-"}
                          </td>

                          {/* CATEGORY */}

                          <td>

                            <span
                              className={`category-badge ${getCategoryClass(
                                member.category
                              )}`}
                            >
                              {(
                                member.category ||
                                "normal"
                              ).toUpperCase()}
                            </span>

                          </td>

                          {/* PAX */}

                          <td>

                            <strong>
                              {member.paxCount || 0}
                            </strong>

                            {member.couple && (
                              <small className="couple-label">
                                Couple
                              </small>
                            )}

                          </td>

                          {/* TABLE */}

                          <td>

                            <span className="table-badge">
                              {member.tableNo || "-"}
                            </span>

                          </td>

                          {/* ENTRY TIME */}

                          <td>

                            <span className="entry-time">
                              {formatDateTime(
                                member.entryTime
                              )}
                            </span>

                          </td>

                          {/* COVER */}

                          <td>

                            <div className="cover-info">

                              <span>
                                W:{" "}
                                {member.withCover || 0}
                              </span>

                              <span>
                                WO:{" "}
                                {member.withoutCover || 0}
                              </span>

                            </div>

                          </td>

                          {/* TOTAL */}

                          <td>

                            <strong className="total-amount">

                              ₹
                              {(
                                Number(
                                  member.totalAmount
                                ) || 0
                              ).toLocaleString(
                                "en-IN"
                              )}

                            </strong>

                          </td>

                          {/* EMAIL */}

                          <td>

                            {member.emailSent ? (

                              <span className="email-status sent">
                                ✓ Sent
                              </span>

                            ) : (

                              <span className="email-status failed">
                                ✕ Not Sent
                              </span>

                            )}

                          </td>

                          {/* ACTIONS */}

                          <td>

                            <div className="member-actions">

                              <button
                                type="button"
                                className="view-button"
                                title="View Entry"
                                onClick={() =>
                                  handleViewMember(
                                    member._id
                                  )
                                }
                              >
                                👁
                              </button>

                              <button
                                type="button"
                                className="delete-button"
                                title="Delete Entry"
                                disabled={
                                  deleteLoading ===
                                  member._id
                                }
                                onClick={() =>
                                  handleDeleteMember(
                                    member._id
                                  )
                                }
                              >
                                {deleteLoading ===
                                  member._id
                                  ? "..."
                                  : "🗑"}
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default Members;