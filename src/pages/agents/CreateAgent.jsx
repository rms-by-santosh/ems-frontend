import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Agent.css";

export default function CreateAgent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/agents`, form);
      setSuccess(true);
      setTimeout(() => navigate("/agents"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-container">
      <div className="agent-card">
        <h2 className="agent-title">Add New Agent</h2>
        
        {success && (
          <div className="success-message">
            Agent created successfully! Redirecting...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="agent-form">
          <div className="form-group">
            <label className="form-label">Full Name*</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter agent's full name"
              disabled={loading}
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
              placeholder="Enter agent's email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone*</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter agent's phone number"
              disabled={loading}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <span className="button-loader"></span>
              ) : (
                "Add Agent"
              )}
            </button>
            
            {error && <div className="error-message">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}