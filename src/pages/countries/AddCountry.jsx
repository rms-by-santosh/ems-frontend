import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddCountry() {
  const [form, setForm] = useState({ name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/countries`, form);
      navigate("/countries");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add country");
    }
  };

  return (
    <div>
      <h2>Add Country</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <button type="submit">Add Country</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
