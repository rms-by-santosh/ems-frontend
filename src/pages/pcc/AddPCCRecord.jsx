import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddPCCRecord() {
  const [form, setForm] = useState({
    applicant: "",
    status: "pending",
    issuedAt: "",
    remarks: "",
  });
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/applicants`);
      setApplicants(data);
    };
    fetchApplicants();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/pcc`, form);
      navigate("/pcc");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add PCC record");
    }
  };

  return (
    <div>
      <h2>Add PCC Record</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Applicant:</label>
          <select name="applicant" value={form.applicant} onChange={handleChange} required>
            <option value="">Select Applicant</option>
            {applicants.map((a) => (
              <option key={a._id} value={a._id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label>Issued At:</label>
          <input type="date" name="issuedAt" value={form.issuedAt} onChange={handleChange} />
        </div>
        <div>
          <label>Remarks:</label>
          <textarea name="remarks" value={form.remarks} onChange={handleChange} />
        </div>
        <button type="submit">Add PCC Record</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
