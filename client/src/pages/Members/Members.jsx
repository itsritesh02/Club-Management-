
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Members.css";

function Members() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH MEMBERS
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
        throw new Error(
          data.message || "Failed to fetch members"
        );
      }

      setMembers(data.members || []);
    } catch (err) {
      console.error("GET MEMBERS ERROR:", err);

      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ==========================================
  // DELETE MEMBER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `http://localhost:5000/api/members/${id}`,
{
  method: "DELETE",

    headers: {
    "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
          },
}
      );

const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.message || "Failed to delete member"
  );
}

setMembers((prev) =>
  prev.filter(
    (member) => member._id !== id
  )
);
    } catch (err) {
  console.error(
    "DELETE MEMBER ERROR:",
    err
  );

  alert(
    err.message ||
    "Failed to delete member"
  );
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
// HELPERS
// ==========================================

const getInitial = (name) => {
  if (!name) return "M";

  return name
    .charAt(0)
    .toUpperCase();
};

const formatDate = (date) => {
  if (!date) return "-";

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
// STATS
// ==========================================

const totalMembers = members.length;

const activeMembers = members.filter(
  (member) =>
    !member.status ||
    member.status.toLowerCase() ===
    "active"
).length;

const vipMembers = members.filter(
  (member) =>
    member.membershipType?.toLowerCase() ===
    "vip"
).length;

const vvipMembers = members.filter(
  (member) =>
    member.membershipType?.toLowerCase() ===
    "vvip"
).length;

// ==========================================
// LOADING
// ==========================================

if (loading) {
  return (
    <div className="members-page">

      <aside className="members-sidebar">

        <div className="members-brand">
          <div className="members-brand-logo">
            JC
          </div>

          <div>
            <strong>
              Jaguar Club
            </strong>

            <span>
              Management
            </span>
          </div>
        </div>

      </aside>

      <main className="members-main">

        <div className="members-loading">
          <div className="loading-spinner">
            ⟳
          </div>

          <p>
            Loading members...
          </p>
        </div>

      </main>

    </div>
  );
}

return (
  <div className="members-page">

    {/* ==========================================
          SIDEBAR
      ========================================== */}

    <aside className="members-sidebar">

      


      {/* NAVIGATION */}

      <nav className="members-nav">

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <span className="nav-icon">
            ▦
          </span>

          <span>
            Dashboard
          </span>
        </button>


        <button
          type="button"
          onClick={() =>
            navigate("/members/add")
          }
        >
          <span className="nav-icon">
            +
          </span>

          <span>
            Add Members
          </span>
        </button>


        <button
          type="button"
          className="active"
          onClick={() =>
            navigate("/members")
          }
        >
          <span className="nav-icon">
            ♧
          </span>

          <span>
            All Members
          </span>
        </button>

      </nav>


      {/* LOGOUT */}

      <button
        type="button"
        className="members-logout"
        onClick={handleLogout}
      >
        <span>
          ↪
        </span>

        <span>
          Logout
        </span>
      </button>

    </aside>


    {/* ==========================================
          MAIN
      ========================================== */}

    <main className="members-main">

      {/* ==========================================
            HEADER
        ========================================== */}

      <header className="members-header">

        <div>

          <div className="page-breadcrumb">
            DASHBOARD
            <span>/</span>
            MEMBERS
          </div>

          <h1>
            All Members
          </h1>

          <p>
            Manage all registered club members
          </p>

        </div>


        <button
          type="button"
          className="add-member-button"
          onClick={() =>
            navigate("/members/add")
          }
        >
          <span>+</span>
          Add Member
        </button>

      </header>


      {/* ==========================================
            ERROR
        ========================================== */}

      {error && (
        <div className="members-error">

          <span>
            ⚠
          </span>

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


      {/* ==========================================
            STATS
        ========================================== */}

      <section className="members-stats">

        <div className="member-stat-card">

          <div className="member-stat-icon">
            ♧
          </div>

          <div>
            <span>
              Total Members
            </span>

            <strong>
              {totalMembers}
            </strong>
          </div>

        </div>


        <div className="member-stat-card">

          <div className="member-stat-icon">
            ✓
          </div>

          <div>
            <span>
              Active Members
            </span>

            <strong>
              {activeMembers}
            </strong>
          </div>

        </div>


        <div className="member-stat-card">

          <div className="member-stat-icon">
            ★
          </div>

          <div>
            <span>
              VIP Members
            </span>

            <strong>
              {vipMembers}
            </strong>
          </div>

        </div>


        <div className="member-stat-card">

          <div className="member-stat-icon">
            ◆
          </div>

          <div>
            <span>
              VVIP Members
            </span>

            <strong>
              {vvipMembers}
            </strong>
          </div>

        </div>

      </section>


      {/* ==========================================
            MEMBERS CARD
        ========================================== */}

      <section className="members-card">

        <div className="members-card-header">

          <div>

            <h2>
              Members List
            </h2>

            <p>
              All registered club members
            </p>

          </div>


          <div className="members-card-actions">

            <button
              type="button"
              className="refresh-button"
              onClick={fetchMembers}
            >
              ↻
              Refresh
            </button>

            <button
              type="button"
              className="card-add-button"
              onClick={() =>
                navigate("/members/add")
              }
            >
              + Add Member
            </button>

          </div>

        </div>


        {/* ==========================================
              EMPTY STATE
          ========================================== */}

        {members.length === 0 ? (

          <div className="members-empty">

            <div className="members-empty-icon">
              ♧
            </div>

            <h3>
              No Members Found
            </h3>

            <p>
              Add your first member to
              start managing the club.
            </p>

            <button
              type="button"
              className="add-member-button"
              onClick={() =>
                navigate("/members/add")
              }
            >
              + Add Member
            </button>

          </div>

        ) : (

          <div className="members-table-wrapper">

            <table className="members-table">

              <thead>

                <tr>
                  <th>Member</th>
                  <th>Phone</th>
                  <th>Category</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {members.map(
                  (member) => (

                    <tr
                      key={member._id}
                    >

                      {/* MEMBER */}

                      <td>

                        <div className="guest-info">

                          <div className="guest-avatar">
                            {getInitial(
                              member.name
                            )}
                          </div>

                          <div>

                            <strong>
                              {member.name ||
                                "Unknown"}
                            </strong>

                            <small>
                              {member.email ||
                                "No email"}
                            </small>

                          </div>

                        </div>

                      </td>


                      {/* PHONE */}

                      <td>
                        {member.phone || "-"}
                      </td>


                      {/* CATEGORY */}

                      <td>

                        <span
                          className={`category-badge ${member.membershipType?.toLowerCase() ===
                              "vip"
                              ? "vip"
                              : member.membershipType?.toLowerCase() ===
                                "vvip"
                                ? "vvip"
                                : "normal"
                            }`}
                        >
                          {member.membershipType ||
                            "Normal"}
                        </span>

                      </td>


                      {/* JOINED */}

                      <td>
                        <span className="entry-time">
                          {formatDate(
                            member.createdAt
                          )}
                        </span>
                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`status-badge ${member.status?.toLowerCase() ===
                              "inactive"
                              ? "inactive"
                              : "active"
                            }`}
                        >
                          {member.status ||
                            "Active"}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="member-actions">

                          <button
                            type="button"
                            className="view-button"
                            title="View Member"
                            onClick={() =>
                              navigate(
                                `/members/${member._id}`
                              )
                            }
                          >
                            👁
                          </button>


                          <button
                            type="button"
                            className="edit-button"
                            title="Edit Member"
                            onClick={() =>
                              navigate(
                                `/members/edit/${member._id}`
                              )
                            }
                          >
                            ✎
                          </button>


                          <button
                            type="button"
                            className="delete-button"
                            title="Delete Member"
                            onClick={() =>
                              handleDelete(
                                member._id
                              )
                            }
                          >
                            ×
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

    </main>

  </div>
);
}

export default Members;
