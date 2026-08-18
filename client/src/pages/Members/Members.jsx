import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Members.css";

function Members() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        "http://localhost:5000/api/members",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
        setError(
          data.message || "Failed to fetch members"
        );
        return;
      }

      setMembers(data.members || []);
    } catch (error) {
      console.error(
        "GET MEMBERS ERROR:",
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
  // LOAD MEMBERS
  // ==========================================

  useEffect(() => {
    fetchMembers();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/");
  };

  return (
    <div className="members-page">

      {/* SIDEBAR */}

      <aside className="members-sidebar">

        <div className="members-logo">
          Club<span>Manager</span>
        </div>

        <nav className="members-nav">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            📊
            <span>Dashboard</span>
          </button>

          <button className="active">
            👥
            <span>Members</span>
          </button>

          <button>
            💳
            <span>Payments</span>
          </button>

          <button>
            📋
            <span>Memberships</span>
          </button>

          <button>
            📈
            <span>Reports</span>
          </button>

        </nav>

        <button
          className="members-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="members-main">

        {/* HEADER */}

        <div className="members-header">

          <div>
            <h1>Members</h1>

            <p>
              Manage all club members
            </p>
          </div>

          <button className="add-member-button">
            + Add Member
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="members-error">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="members-loading">
            Loading members...
          </div>
        ) : (

          <div className="members-card">

            <div className="members-card-header">

              <div>
                <h2>
                  All Members
                </h2>

                <p>
                  Total: {members.length}
                </p>
              </div>

              <button
                onClick={fetchMembers}
                className="refresh-button"
              >
                ↻ Refresh
              </button>

            </div>

            {/* EMPTY */}

            {members.length === 0 ? (

              <div className="members-empty">

                <div className="members-empty-icon">
                  👥
                </div>

                <h3>
                  No Members Found
                </h3>

                <p>
                  Add your first member to
                  get started.
                </p>

                <button className="add-member-button">
                  + Add Member
                </button>

              </div>

            ) : (

              /* TABLE */

              <div className="members-table-wrapper">

                <table className="members-table">

                  <thead>

                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Membership</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>

                  </thead>

                  <tbody>

                    {members.map((member) => (

                      <tr key={member._id}>

                        <td>
                          <strong>
                            {member.name}
                          </strong>
                        </td>

                        <td>
                          {member.email}
                        </td>

                        <td>
                          {member.phone}
                        </td>

                        <td>
                          {member.membershipType}
                        </td>

                        <td>

                          <span
                            className={`member-status ${member.status ||
                              "active"
                              }`}
                          >
                            {member.status ||
                              "active"}
                          </span>

                        </td>

                        <td>
                          {member.membershipStartDate
                            ? new Date(
                              member.membershipStartDate
                            ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          {member.membershipEndDate
                            ? new Date(
                              member.membershipEndDate
                            ).toLocaleDateString()
                            : "-"}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default Members;