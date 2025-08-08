import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Records.css";

export default function EditRecord() {
  const { id } = useParams();
  const [form, setForm] = useState({
    applicant: "",
    type: "",
    status: "pending",
    progressStatus: "",
    submittedAt: "",
    physical: "",
    appointment: "",
    notes: "",
  });
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [recordRes, applicantsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/records/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/applicants`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const record = recordRes.data;
        setForm({
          applicant: record.applicant?._id || "",
          type: record.type || "",
          status: record.status || "pending",
          progressStatus: record.progressStatus || "",
          submittedAt: record.submittedAt ? record.submittedAt.slice(0, 10) : "",
          physical: record.physical ? record.physical.slice(0, 10) : "",
          appointment: record.appointment ? record.appointment.slice(0, 10) : "",
          notes: record.notes || "",
        });
        setApplicants(applicantsRes.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL}/records/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/records");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update record");
    }
  };

  if (isLoading) return <div className="loading-state">Loading record...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Record</h2>
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
                <option key={a._id} value={a._id}>
                  {a.name}
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
            <label className="form-label">Status:</label>
            <select
              className="form-select"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
              <option value="MAIL RECEIVED"> MAIL RECEIVED </option>
              <option value="VISA APPROVED"> APPROVED </option>
              <option value="VISA REJECTED">REJECTED </option>
         
              <option value="LABOR PERMIT PROCESSED">LABOR PERMIT PROCESSED</option>
              <option value="LABOR PERMIT DISPATCHED">LABOR PERMIT DISPATCHED</option>
              <option value="CANCELLED SELF">SELF CANCEL</option>
              <option value="FLIGHT DONE">FLIGHT DONE</option>
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
            Save Changes
          </button>
          {error && <div className="form-error">{error}</div>}
        </div>
      </form>
    </div>
  );
}