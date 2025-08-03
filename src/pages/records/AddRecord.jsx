import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Records.css";

export default function AddRecord() {
  const [form, setForm] = useState({
    applicant: "",
    type: "",
    status: "pending",
    issuedAt: "",
    expiresAt: "",
    notes: "",
    progressStatus: "",
    submittedAt: "",
    physical: "",
    appointment: "",
  });
  const [applicants, setApplicants] = useState([]);
  const [existingApplicantIds, setExistingApplicantIds] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [applicantsData, recordsData] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/applicants`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/records`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setApplicants(applicantsData.data);
        const applicantIds = recordsData.data.map((record) =>
          typeof record.applicant === "object" && record.applicant !== null
            ? record.applicant._id
            : record.applicant
        );
        setExistingApplicantIds(applicantIds);
      } catch (err) {
        setError("Failed to fetch applicants or records");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_API_URL}/records`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/records");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add record");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Record</h2>
      <form onSubmit={handleSubmit} className="record-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Applicant:</label>
            <select
              className="form-select"
              name="applicant"
              value={form.applicant}
              onChange={handleChange}
              required
            >
              <option value="">Select Applicant</option>
              {applicants.map((a) => (
                <option
                  key={a._id}
                  value={a._id}
                  disabled={existingApplicantIds.includes(a._id)}
                >
                  {a.name}
                  {existingApplicantIds.includes(a._id) ? " (Already Added)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Type:</label>
            <select
              className="form-select"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Visa ST">Visa Stamping</option>
              <option value="DOC">Documentation</option>
              <option value="FULL">Full</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Progress:</label>
            <select
              className="form-select"
              name="progressStatus"
              value={form.progressStatus}
              onChange={handleChange}
            >
              <option value="">Select Progress</option>
              <option value="MEDICAL">MEDICAL</option>
              <option value="DOCS FORWARDED">FORWARDED</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="PERMIT DISPATCHED">PERMIT DISPATCH</option>
              <option value="PERMIT REJECTED">PERMIT REJECTED</option>
              <option value="EMBASSY SUBMITTED">EMBASSY SUBMITTED</option>
              <option value="APPOINTMENT CNF">APPOINTMENT CNF</option>
              <option value="INTERVIEW FACED">INTERVIEW FACED</option>
              <option value="VISA APPROVED">VISA APPROVED</option>
              <option value="VISA REJECTED">VISA REJECTED</option>
              <option value="LABOR PERMIT PROCESSED">LABOR PERMIT PROCESSED</option>
              <option value="LABOR PERMIT DISPATCHED">LABOR PERMIT DISPATCHED</option>
              <option value="FLIGHT DONE">FLIGHT DONE</option>
              <option value="CANCELLED SELF">SELF CANCEL</option>
              <option value="OFC CANCELLED">OFFICE CANCEL</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Submitted At:</label>
            <input
              type="date"
              className="form-input"
              name="submittedAt"
              value={form.submittedAt}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Physical Date:</label>
            <input
              type="date"
              className="form-input"
              name="physical"
              value={form.physical}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Appointment:</label>
            <input
              type="date"
              className="form-input"
              name="appointment"
              value={form.appointment}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Notes:</label>
            <textarea
              className="form-textarea"
              name="notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add Record
          </button>
          {error && <div className="form-error">{error}</div>}
        </div>
      </form>
    </div>
  );
}