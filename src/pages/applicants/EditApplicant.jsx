import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Applicant.css";

export default function EditApplicant() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    passport: "",
    dob: "",
    phone: "",
    email: "",
    country: "",
    agent: "",
    remarks: "",
    pstatus: "Processing",
    maritalStatus: "",
    dExp: ""
  });
  const [countries, setCountries] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [appRes, countriesRes, agentsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/applicants/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/countries`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/agents`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setForm({
          name: appRes.data.name || "",
          passport: appRes.data.passport || "",
          dob: appRes.data.dob?.slice(0, 10) || "",
          phone: appRes.data.phone || "",
          email: appRes.data.email || "",
          country: appRes.data.country?._id || "",
          agent: appRes.data.agent?._id || "",
          remarks: appRes.data.remarks || "",
          pstatus: appRes.data.pstatus || "Processing",
          maritalStatus: appRes.data.maritalStatus || "",
          dExp: appRes.data.dExp?.slice(0, 10) || ""
        });

        setCountries(countriesRes.data);
        setAgents(agentsRes.data);
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
      await axios.put(`${import.meta.env.VITE_API_URL}/applicants/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/applicants");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update applicant");
    }
  };

  if (isLoading) return <div className="loading-state">Loading applicant...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Applicant</h2>
      <form onSubmit={handleSubmit} className="applicant-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Name:</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Passport:</label>
            <input
              className="form-input"
              name="passport"
              value={form.passport}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Marital Status:</label>
            <select
              className="form-select"
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth:</label>
            <input
              type="date"
              className="form-input"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone:</label>
            <input
              className="form-input"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-input"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">PP Expiry:</label>
            <input
              type="date"
              className="form-input"
              name="dExp"
              value={form.dExp}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Country:</label>
            <select
              className="form-select"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Agent:</label>
            <select
              className="form-select"
              name="agent"
              value={form.agent}
              onChange={handleChange}
            >
              <option value="">Select Agent</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status:</label>
            <select
              className="form-select"
              name="pstatus"
              value={form.pstatus}
              onChange={handleChange}
              required
            >
              <option value="Processing">Processing</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Remarks:</label>
            <textarea
              className="form-textarea"
              name="remarks"
              value={form.remarks}
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