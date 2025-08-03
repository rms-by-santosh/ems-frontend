import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StatusBadge from "../../components/StatusBadge";
import "./Applicant.css";

export default function ApplicantsList() {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);  // Changed from 'loading' to 'isLoading'
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchApplicants();
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

  if (isLoading) return <div className="loading-state">Loading applicants...</div>;
  if (error) return <div className="error-state">{error}</div>;

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
            {filteredApplicants.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">No applicants found.</td>
              </tr>
            ) : (
              filteredApplicants.map(({ _id, name, passport, country, agent, pstatus, phone }) => (
                <tr key={_id} className="applicant-row">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}