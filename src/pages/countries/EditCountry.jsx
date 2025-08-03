import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditCountry.css";

export default function EditCountry() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", code: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/countries/${id}`);
        setForm({ name: data.name, code: data.code });
        setLoading(false);
      } catch {
        setError("Failed to load country");
        setLoading(false);
      }
    };
    fetchCountry();
  }, [id]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/countries/${id}`, form);
      setSuccess(true);
      setTimeout(() => navigate("/countries"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update country");
    }
  };

  if (loading) return <div className="loading-spinner"></div>;
  
  return (
    <div className="edit-country-container">
      <div className="edit-country-card">
        <h2 className="edit-country-title">Edit Country</h2>
        
        {success && (
          <div className="success-message">
            Country updated successfully! Redirecting...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="edit-country-form">
          <div className="form-group">
            <label className="form-label">Country Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter country name"
            />
          </div>
          
        
          
          <button type="submit" className="submit-button">
            Save Changes
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}