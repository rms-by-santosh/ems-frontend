import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Agent.css";

export default function EditAgent() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    status: "active",
  });
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [agentRes, countriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/agents/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/countries`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setForm({
          name: agentRes.data.name || "",
          email: agentRes.data.email || "",
          phone: agentRes.data.phone || "",
          country: agentRes.data.country?._id || "",
          status: agentRes.data.status || "active",
        });
        setCountries(countriesRes.data);
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
      await axios.put(`${import.meta.env.VITE_API_URL}/agents/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/agents");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update agent");
    }
  };

  if (isLoading) return <div className="loading-state">Loading agent...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Agent</h2>
      <form onSubmit={handleSubmit} className="agent-form">
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
            <label className="form-label">Phone:</label>
            <input
              className="form-input"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
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