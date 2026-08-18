import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./AddMember.css";

function AddMember() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    membershipType: "monthly",
    membershipStartDate: "",
    membershipEndDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD MEMBER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.membershipStartDate ||
      !formData.membershipEndDate
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/members",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(formData),
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
          data.message || "Failed to add member"
        );

        return;
      }

      setSuccess("Member added successfully");

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        membershipType: "monthly",
        membershipStartDate: "",
        membershipEndDate: "",
      });

      // Go back to members
      setTimeout(() => {
        navigate("/members");
      }, 700);

    } catch (error) {
      console.error(
        "ADD MEMBER ERROR:",
        error
      );

      setError(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-member-page">

      {/* HEADER */}

      <header className="add-member-header">

        <div>
          <h1>Add Member</h1>

          <p>
            Add a new member to your club
          </p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/members")}
        >
          ← Back to Members
        </button>

      </header>

      {/* FORM CARD */}

      <div className="add-member-card">

        <div className="form-title">
          <h2>Member Information</h2>

          <p>
            Fields marked with * are required.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className="form-group">

            <label>
              Full Name *
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter member name"
              value={formData.name}
              onChange={handleChange}
            />

          </div>

          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email *
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          {/* PHONE */}

          <div className="form-group">

            <label>
              Phone *
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

          </div>

          {/* ADDRESS */}

          <div className="form-group full-width">

            <label>
              Address
            </label>

            <textarea
              name="address"
              placeholder="Enter member address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />

          </div>

          {/* MEMBERSHIP TYPE */}

          <div className="form-group">

            <label>
              Membership Type
            </label>

            <select
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
            >
              <option value="monthly">
                Monthly
              </option>

              <option value="quarterly">
                Quarterly
              </option>

              <option value="half-yearly">
                Half Yearly
              </option>

              <option value="yearly">
                Yearly
              </option>
            </select>

          </div>

          {/* START DATE */}

          <div className="form-group">

            <label>
              Membership Start Date *
            </label>

            <input
              type="date"
              name="membershipStartDate"
              value={
                formData.membershipStartDate
              }
              onChange={handleChange}
            />

          </div>

          {/* END DATE */}

          <div className="form-group">

            <label>
              Membership End Date *
            </label>

            <input
              type="date"
              name="membershipEndDate"
              value={
                formData.membershipEndDate
              }
              onChange={handleChange}
            />

          </div>

          {/* ERROR */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="form-success">
              {success}
            </div>
          )}

          {/* BUTTONS */}

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/members")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Adding..."
                : "Add Member"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddMember;