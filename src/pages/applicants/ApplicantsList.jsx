import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StatusBadge from "../../components/StatusBadge";
import "./Applicant.css";

export default function ApplicantsList() {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [recordApplicantIds, setRecordApplicantIds] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Fetch all applicants
  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/applicants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplicants(data);
      setFilteredApplicants(data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load applicants");
      setIsLoading(false);
    }
  };

  // Fetch all records to get applicants who are in records
  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const ids = data
        .map((rec) => (typeof rec.applicant === "string" ? rec.applicant : rec.applicant?._id))
        .filter(Boolean);
      setRecordApplicantIds(ids);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchApplicants();
    fetchRecords();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredApplicants(applicants);
    } else {
      const filtered = applicants.filter((applicant) =>
        applicant.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );
      setFilteredApplicants(filtered);
    }
  }, [searchTerm, applicants]);

  const isInRecords = (applicantId) => recordApplicantIds.includes(applicantId);

  const handleDelete = async (id, cannotDelete) => {
    if (cannotDelete) {
      alert("Cannot delete: Applicant has a record.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this applicant?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/applicants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplicants((prev) => prev.filter((app) => app._id !== id));
      setFilteredApplicants((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      alert("Failed to delete applicant. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <div className="loading-state">Loading applicants...</div>;
  if (error) return <div className="error-state">{error}</div>;

  const applicantsToShow =
    showAll || filteredApplicants.length <= 15
      ? filteredApplicants
      : filteredApplicants.slice(0, 15);

  return (
    <div className="applicants-container">
      <div className="applicants-header">
        <h2 className="applicants-title">Applicants</h2>
        <div className="applicants-controls">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link to="/applicants/create" className="add-applicant-btn">
            Add Applicant
          </Link>
        </div>
      </div>

      <div className="applicants-table-container">
        <table className="applicants-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Passport</th>
              <th>Country</th>
              <th>Contact</th>
              <th>Agent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicantsToShow.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">No applicants found.</td>
              </tr>
            ) : (
              applicantsToShow.map(({ _id, name, passport, country, agent, pstatus, phone }, idx) => {
                const cannotDelete = isInRecords(_id);
                return (
                  <tr key={_id} className="applicant-row">
                    <td>{idx + 1}</td>
                    <td>{name || '-'}</td>
                    <td>{passport || '-'}</td>
                    <td>{country?.name || '-'}</td>
                    <td>{phone || '-'}</td>
                    <td>{agent?.name || '-'}</td>
                    <td className="status-cell">
                      <StatusBadge status={pstatus} />
                    </td>
                    <td className="action-links">
                      <Link to={`/applicants/view/${_id}`} className="action-link view-link">View</Link>
                      <span className="action-divider">|</span>
                      <Link to={`/applicants/edit/${_id}`} className="action-link edit-link">Edit</Link>
                      <span className="action-divider">|</span>
                      <button
                        className="action-link delete-link"
                        onClick={() => handleDelete(_id, cannotDelete)}
                        disabled={deletingId === _id}
                        style={{
                          color: cannotDelete ? "gray" : "red",
                          background: "none",
                          border: "none",
                          cursor: cannotDelete ? "not-allowed" : deletingId === _id ? "not-allowed" : "pointer",
                          padding: 0,
                          font: "inherit",
                        }}
                      >
                        {cannotDelete
                          ? "Delete"
                          : deletingId === _id
                            ? "Deleting..."
                            : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {/* ---- SHOW "All" BUTTON IF NEEDED ---- */}
        {filteredApplicants.length > 15 && !showAll && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button
              className="show-all-btn"
              onClick={() => setShowAll(true)}
              style={{
                padding: "6px 18px",
                borderRadius: "6px",
                background: "#1677ff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Show All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
