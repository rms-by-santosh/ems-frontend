import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Records.css";

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showAll, setShowAll] = useState(false); // <-- NEW

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
      setRecords(data);
      setFilteredRecords(data);
      setIsLoading(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Failed to load records"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter((record) =>
        record.applicant?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  // Only allow delete if progressStatus is "Flight Done" or "Cancelled Self"
  const canDelete = (progressStatus) => {
    const status = progressStatus?.toLowerCase() || "";
    return status === "flight done" || status === "cancelled self";
  };

  const handleDelete = async (record, cannotDelete) => {
    if (cannotDelete) {
      alert("Cannot delete: Only records with 'Flight Done' or 'Cancelled Self' progress can be deleted.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setDeletingId(record._id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/records/${record._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecords((prev) => prev.filter((r) => r._id !== record._id));
      setFilteredRecords((prev) => prev.filter((r) => r._id !== record._id));
    } catch (err) {
      alert("Failed to delete record. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <div className="loading-state">Loading records...</div>;
  if (error) return <div className="error-state">{error}</div>;

  // PAGINATION LOGIC
  const recordsToShow =
    showAll || filteredRecords.length <= 10
      ? filteredRecords
      : filteredRecords.slice(0, 10);

  return (
    <div className="records-container">
      {/* PCC Records Button at Top */}
      <div style={{ marginBottom: "1rem", gap: "1rem", display: "flex", justifyContent: "flex-end" }}>
        
        <Link to="/statussearch" className="pcc-records-btn">
          <button type="button" style={{ padding: "8px 18px", borderRadius: "5px", background: "#2979ff", color: "#fff", border: "none", cursor: "pointer" }}>
            Search By Status
          </button>
        </Link>

        <Link to="/readycandidates" className="pcc-records-btn">
          <button type="button" style={{ padding: "8px 18px", borderRadius: "5px", background: "#2979ff", color: "#fff", border: "none", cursor: "pointer" }}>
           View Applicants To Process
          </button>
        </Link>
        <Link to="/printanalysis" className="pcc-records-btn">
          <button type="button" style={{ padding: "8px 18px", borderRadius: "5px", background: "#2979ff", color: "#fff", border: "none", cursor: "pointer" }}>
           Extra Toolkit
          </button>
        </Link>
      </div>

      <div className="records-header">
        <h2 className="records-title">Records</h2>
        <div className="records-controls">
          <input
            type="text"
            placeholder="Search by applicant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link to="/records/add" className="add-record-btn">
            Add Record
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="records-table">
          <thead className="table-header">
            <tr>
              <th>SN</th>
              <th className="col-applicant">Applicant</th>
              <th className="col-country">Country</th>
              <th className="col-type">Type</th>
              <th className="col-progress">Progress</th>
              <th className="col-submitted">Submitted Date</th>
              <th className="col-physical">Physical Date</th>
              <th className="col-appointment">Appointment</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {recordsToShow.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="9" className="empty-state">No records found.</td>
              </tr>
            ) : (
              recordsToShow.map((record, idx) => {
                const cannotDelete = !canDelete(record.progressStatus);
                return (
                  <tr key={record._id} className="record-row">
                    <td>{idx + 1}</td>
                    <td className="applicant-name">{record.applicant?.name || "-"}</td>
                    <td className="applicant-country">{record.applicant?.country?.name || "-"}</td>
                    <td className="record-type">{record.type}</td>
                    <td className="record-progress">
                      <span className={`status-badge ${record.progressStatus?.toLowerCase().replace(/\s+/g, '-') || ''}`}>
                        {record.progressStatus || "-"}
                      </span>
                    </td>
                    <td className="record-submitted">
                      {record.submittedAt ? new Date(record.submittedAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="record-physical">
                      {record.physical ? new Date(record.physical).toLocaleDateString() : "-"}
                    </td>
                    <td className="record-appointment">
                      {record.appointment ? new Date(record.appointment).toLocaleDateString() : "-"}
                    </td>
                    <td className="record-actions">
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <Link
                          to={`/records/edit/${record._id}`}
                          className="action-link edit-link"
                          style={{
                            color: "#1976d2",
                            textDecoration: "underline",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            font: "inherit"
                          }}
                        >
                          Edit
                        </Link>
                        <span style={{ color: "#bbb" }}>|</span>
                        <button
                          className="action-link delete-link"
                          onClick={() => handleDelete(record, cannotDelete)}
                          disabled={deletingId === record._id}
                          style={{
                            color: cannotDelete ? "gray" : "red",
                            background: "none",
                            border: "none",
                            cursor: cannotDelete
                              ? "not-allowed"
                              : deletingId === record._id
                              ? "not-allowed"
                              : "pointer",
                            padding: 0,
                            font: "inherit"
                          }}
                        >
                          {deletingId === record._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {/* --- Show All Button --- */}
        {filteredRecords.length > 10 && !showAll && (
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
