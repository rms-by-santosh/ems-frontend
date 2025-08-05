import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { format, parse } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "./Applicant.css";

// Helper to safely format as DD/MM/YYYY
function formatForDisplay(dateObj) {
  if (!dateObj) return "";
  return format(dateObj, "dd/MM/yyyy");
}

export default function CreateApplicant() {
  const [form, setForm] = useState({
    name: "",
    passport: "",
    dob: null,
    phone: "",
    email: "",
    country: "",
    agent: "",
    remarks: "",
    maritalstatus: "",
    dExp: null
  });
  const [countries, setCountries] = useState([]);
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [countriesRes, agentsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/countries`),
          axios.get(`${import.meta.env.VITE_API_URL}/agents`)
        ]);
        setCountries(countriesRes.data);
        setAgents(agentsRes.data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (name, date) => {
    setForm((f) => ({ ...f, [name]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Check for exact duplicate name (case-insensitive, trimmed)
      const checkRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/applicants?name=${encodeURIComponent(form.name.trim())}`
      );
      const inputName = form.name.trim().toLowerCase();
      const exactMatch = Array.isArray(checkRes.data)
        ? checkRes.data.find(
            (app) =>
              (app.name || "").trim().toLowerCase() === inputName
          )
        : null;
      if (exactMatch) {
        setError("Name already exists");
        return;
      }

      // Format dates as YYYY-MM-DD before saving
      const dobIso =
        form.dob instanceof Date
          ? format(form.dob, "yyyy-MM-dd")
          : "";
      const dExpIso =
        form.dExp instanceof Date
          ? format(form.dExp, "yyyy-MM-dd")
          : "";

      await axios.post(`${import.meta.env.VITE_API_URL}/applicants`, {
        ...form,
        dob: dobIso,
        dExp: dExpIso
      });
      setSuccess(true);
      setTimeout(() => navigate("/applicants"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add applicant");
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="applicant-container">
      <div className="applicant-card">
        <h2 className="applicant-title">Add New Applicant</h2>
        
        {success && (
          <div className="success-message">
            Applicant created successfully! Redirecting...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="applicant-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name*</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter full name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Passport Number*</label>
              <input
                name="passport"
                value={form.passport}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter passport number"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date of Birth*</label>
              <DatePicker
                selected={form.dob}
                onChange={(date) => handleDateChange("dob", date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                className="form-input"
                required
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
                autoComplete="off"
                name="dob"
              />
              {form.dob && (
                <div style={{ color: "#2c3e50", fontSize: "0.98em", marginTop: 2 }}>
                  Selected: <b>{formatForDisplay(form.dob)}</b>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label className="form-label">Marital Status*</label>
              <select
                name="maritalstatus"
                value={form.maritalstatus}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">-- Select --</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email*</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter email address"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Passport Expiry*</label>
              <DatePicker
                selected={form.dExp}
                onChange={(date) => handleDateChange("dExp", date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                className="form-input"
                required
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                autoComplete="off"
                name="dExp"
              />
              {form.dExp && (
                <div style={{ color: "#2c3e50", fontSize: "0.98em", marginTop: 2 }}>
                  Selected: <b>{formatForDisplay(form.dExp)}</b>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label className="form-label">Country*</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">-- Select Country --</option>
                {countries.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Agent</label>
              <select
                name="agent"
                value={form.agent}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">-- Select Agent --</option>
                {agents.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group full-width">
              <label className="form-label">Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                className="form-input"
                rows="3"
                placeholder="Additional notes..."
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Add Applicant
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
