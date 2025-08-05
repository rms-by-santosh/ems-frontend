import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Passport.css";
function getStatus(expiryDate) {
  if (!expiryDate) return "No Info";
  const today = new Date();
  const expDate = new Date(expiryDate);
  const diff = (expDate - today) / (1000 * 60 * 60 * 24); // in days
  if (diff < 0) return "Expired";
  if (diff >= 0 && diff <= 315) return "Expiring Soon";
  return "Valid";
}

export default function PassportValidityCheck() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/applicants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplicants(res.data || []);
      } catch (err) {
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  const expiredList = applicants.filter(
    (a) => getStatus(a.dExp) === "Expired"
  );
  const expiringSoonList = applicants.filter(
    (a) => getStatus(a.dExp) === "Expiring Soon"
  );

  return (
    <div className="passport-validity-container">
      <header className="dashboard-header">
        <h1>Passport Validity Dashboard</h1>
      </header>

      <div className="status-cards">
        <div className="status-card expired">
          <h3>Expired Passports</h3>
          <div className="count">{expiredList.length}</div>
        </div>
        <div className="status-card expiring">
          <h3>Expiring Soon</h3>
          <div className="count">{expiringSoonList.length}</div>
        </div>
      </div>

      <div className="table-section">
        <h2 className="section-title">Passport Expired List</h2>
        <Table
          applicants={expiredList}
          statusLabel="Expired"
          statusType="expired"
        />

        <h2 className="section-title">Passport Expiring Soon</h2>
        <Table
          applicants={expiringSoonList}
          statusLabel="Expiring Soon"
          statusType="expiring"
        />
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading applicant data...</p>
        </div>
      )}
      {!loading && expiredList.length === 0 && expiringSoonList.length === 0 && (
        <div className="no-data">No applicants with passport validity issues found.</div>
      )}
    </div>
  );
}

function Table({ applicants, statusLabel, statusType }) {
  return (
    <div className="table-container">
      <table className="applicant-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Applicant</th>
            <th>Contact</th>
            <th>Agent</th>
            <th>Passport Status</th>
            <th>Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {applicants.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-records">
                No records found
              </td>
            </tr>
          ) : (
            applicants.map((a, idx) => (
              <tr key={a._id}>
                <td>{idx + 1}</td>
                <td>{a.name}</td>
                <td>{a.phone || a.email || "-"}</td>
                <td>{a.agent?.name || a.agentName || a.agent || "-"}</td>
                <td className={`status-cell ${statusType}`}>
                  {statusLabel}
                </td>
                <td>
                  {a.dExp
                    ? new Date(a.dExp).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}