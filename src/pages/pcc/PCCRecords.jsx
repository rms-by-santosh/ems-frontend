import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Pcc.css";

// Calculate validity for each record
function getValidity(issuedAt) {
  if (!issuedAt) return "";
  const dispatch = new Date(issuedAt);
  const today = new Date();
  const diff = Math.floor((today - dispatch) / (1000 * 60 * 60 * 24));
  if (diff >= 0 && diff <= 90) return "Valid";
  if (diff >= 91 && diff <= 165) return "Reapply";
  if (diff >= 166) return "Expired";
  return "";
}

// Get validity CSS class
function getValidityClass(validity) {
  switch (validity) {
    case "Valid": return "validity-valid";
    case "Reapply": return "validity-reapply";
    case "Expired": return "validity-expired";
    default: return "";
  }
}

// Table component
function PCCRecordsTable({ title, records, search, setSearch, onDelete, deletingId }) {
  return (
    <div className="table-section">
      <h3 className="section-title">{title}</h3>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search records..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className="pcc-table">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Status</th>
            <th>Issued At</th>
            <th>Validity</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="6">No PCC records found.</td>
            </tr>
          ) : (
            records.map(({ _id, applicant, process, issuedAt, registeredemail }) => {
              const validity = getValidity(issuedAt);
              return (
                <tr key={_id}>
                  <td>{applicant?.name || "-"}</td>
                  <td className={`status-${process}`}>{process || "-"}</td>
                  <td>{issuedAt ? new Date(issuedAt).toLocaleDateString() : "-"}</td>
                  <td className={getValidityClass(validity)}>{validity}</td>
                  <td>{registeredemail || "-"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Link to={`/pcc/edit/${_id}`} className="action-link">Edit</Link>
                      <span style={{ color: "#bbb" }}>|</span>
                      <button
                        className="action-link"
                        onClick={() => onDelete(_id)}
                        disabled={deletingId === _id}
                        style={{
                          color: "red",
                          background: "none",
                          border: "none",
                          cursor: deletingId === _id ? "not-allowed" : "pointer",
                          padding: 0,
                          font: "inherit",
                          textDecoration: "underline",
                        }}
                      >
                        {deletingId === _id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function PCCRecords() {
  const [pccRecords, setPccRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Search states for each table
  const [searchAll, setSearchAll] = useState("");
  const [searchExpired, setSearchExpired] = useState("");
  const [searchReapply, setSearchReapply] = useState("");

  const fetchPCCRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/pcc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPccRecords(data);
      setLoading(false);
    } catch {
      setError("Failed to load PCC records");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPCCRecords();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PCC record?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/pcc/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPccRecords((prev) => prev.filter((rec) => rec._id !== id));
    } catch (err) {
      alert("Failed to delete PCC record.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="loading-text">Loading PCC records...</p>;
  if (error) return <p className="error-message">{error}</p>;

  // Filter records
  const allRecords = pccRecords;
  const expiredRecords = pccRecords.filter(
    rec => getValidity(rec.issuedAt) === "Expired"
  );
  const reapplyRecords = pccRecords.filter(
    rec => getValidity(rec.issuedAt) === "Reapply"
  );

  // Search filter function
  const filterBySearch = (records, search) => {
    if (!search) return records;
    return records.filter(rec =>
      [
        rec.applicant?.name || "",
        rec.process || "",
        rec.registeredemail || ""
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  };

  return (
    <div className="pcc-container">
      <div className="header-container">
        <h2 className="pcc-header">PCC Records</h2>
        <Link to="/pcc/add" className="btn btn-primary">
          Add PCC Record
        </Link>
      </div>

      {/* All Records Table */}
      <PCCRecordsTable
        title="All Records"
        records={filterBySearch(allRecords, searchAll)}
        search={searchAll}
        setSearch={setSearchAll}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* Expired List Table */}
      <PCCRecordsTable
        title="Expired List"
        records={filterBySearch(expiredRecords, searchExpired)}
        search={searchExpired}
        setSearch={setSearchExpired}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      {/* Reapply List Table */}
      <PCCRecordsTable
        title="Reapply List"
        records={filterBySearch(reapplyRecords, searchReapply)}
        search={searchReapply}
        setSearch={setSearchReapply}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
}
