import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./ViewCountry.css";

export default function ViewCountry() {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(true);
  const [errorCountry, setErrorCountry] = useState("");
  const [errorApplicants, setErrorApplicants] = useState("");

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/countries/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setCountry(data);
        setLoadingCountry(false);
      } catch (err) {
        setErrorCountry(
          err?.response?.data?.message ||
          err?.response?.statusText ||
          err?.message ||
          "Failed to load country"
        );
        setLoadingCountry(false);
      }
    };

    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/applicants?country=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setApplicants(Array.isArray(data) ? data : []);
        setFilteredApplicants(Array.isArray(data) ? data : []);
        setLoadingApplicants(false);
      } catch (err) {
        setErrorApplicants(
          err?.response?.data?.message ||
          err?.response?.statusText ||
          err?.message ||
          "Failed to load applicants"
        );
        setLoadingApplicants(false);
      }
    };

    fetchCountry();
    fetchApplicants();
  }, [id]);

  useEffect(() => {
    const filtered = applicants.filter(applicant => 
      applicant?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );
    setFilteredApplicants(filtered);
  }, [searchTerm, applicants]);

  if (loadingCountry) return <div className="loading-spinner">Loading country...</div>;
  if (errorCountry) return <div className="error-message">{errorCountry}</div>;
  if (!country) return <div className="error-message">Country not found</div>;

  return (
    <div className="view-country-container">
      <div className="country-header">
        <h2 className="section-title">Country Details</h2>
        <Link to="/countries" className="back-link">← Back to Countries</Link>
      </div>
      
      <div className="country-details-card">
        <p className="country-name"><span className="detail-label">Name:</span> {country.name}</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search applicants by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <h3 className="applicants-title">Applicants from {country.name}</h3>
      
      {loadingApplicants ? (
        <div className="loading-spinner">Loading applicants...</div>
      ) : errorApplicants ? (
        <div className="error-message">{errorApplicants}</div>
      ) : filteredApplicants.length === 0 ? (
        <div className="empty-state">
          <p>No applicants found for this country.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="applicants-table">
            <thead className="table-header">
              <tr>
                <th className="col-name">Name</th>
                <th className="col-email">Email</th>
                <th className="col-phone">Phone</th>
                <th className="col-status">Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredApplicants.map((applicant) => (
                <tr key={applicant._id} className="applicant-row">
                  <td className="applicant-name">{applicant.name || 'N/A'}</td>
                  <td className="applicant-email">{applicant.email || 'N/A'}</td>
                  <td className="applicant-phone">{applicant.phone || 'N/A'}</td>
                  <td className="applicant-status">
                    <span className={`status-badge ${applicant.status?.toLowerCase() || 'unknown'}`}>
                      {applicant.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="applicant-actions">
                    <Link to={`/applicants/view/${applicant._id}`} className="action-link view-link">View</Link>
                    <span className="action-divider">|</span>
                    <Link to={`/applicants/edit/${applicant._id}`} className="action-link edit-link">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}