import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import "./Applicant.css"; // Reusing the same CSS file

export default function ViewApplicant() {
  const { id } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/applicants/${id}`
        );
        setApplicant(data);
        setLoading(false);
      } catch {
        setError("Failed to load applicant");
        setLoading(false);
      }
    };
    fetchApplicant();
  }, [id]);

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="applicant-container">
      <div className="applicant-card">
        <div className="applicant-header">
          <h2 className="applicant-title">Applicant Details</h2>
          <Link to="/applicants" className="back-button">
            &larr; Back to Applicants
          </Link>
        </div>

        <div className="applicant-details-grid">
          <div className="detail-card">
            <h3 className="detail-section-title">Personal Information</h3>
            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{applicant.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date of Birth</span>
              <span className="detail-value">
                {new Date(applicant.dob).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Marital Status</span>
              <span className="detail-value">
                {applicant.maritalstatus || "-"}
              </span>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-section-title">Passport Information</h3>
            <div className="detail-item">
              <span className="detail-label">Passport Number</span>
              <span className="detail-value">{applicant.passport}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Expiry Date</span>
              <span className="detail-value">
                {new Date(applicant.dExp).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-section-title">Contact Information</h3>
            <div className="detail-item">
              <span className="detail-label">Phone Number</span>
              <span className="detail-value">{applicant.phone || "-"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{applicant.email || "-"}</span>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="detail-section-title">Application Details</h3>
            <div className="detail-item">
              <span className="detail-label">Country</span>
              <span className="detail-value">
                {applicant.country?.name || "-"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Agent</span>
              <span className="detail-value">
                {applicant.agent?.name || "-"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value">
                <StatusBadge status={applicant.pstatus} />
              </span>
            </div>
          </div>

          {applicant.remarks && (
            <div className="detail-card full-width">
              <h3 className="detail-section-title">Remarks</h3>
              <div className="remarks-content">{applicant.remarks}</div>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <Link
            to={`/applicants/edit/${id}`}
            className="edit-button"
          >
            Edit Applicant
          </Link>
        </div>
      </div>
    </div>
  );
}