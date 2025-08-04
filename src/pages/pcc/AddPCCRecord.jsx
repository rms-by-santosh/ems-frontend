import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Pcc.css";

export default function AddPCCRecord() {
  const [form, setForm] = useState({
    applicant: "",
    process: "",
    issuedAt: "",
    registeredemail: "",
  });
  const [applicants, setApplicants] = useState([]);
  const [pccRecords, setPccRecords] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [applicantsRes, pccRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/applicants`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/pcc`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setApplicants(applicantsRes.data);
        setPccRecords(pccRes.data);
      } catch {
        setError("Failed to load applicants or PCC records.");
      }
    };
    fetchData();
  }, []);

  const pccApplicantIds = pccRecords.map((p) => p.applicant?._id || p.applicant);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/pcc`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/pcc");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add PCC record");
    }
  };

  return (
    <div className="pcc-container">
      <h2 className="pcc-header">Add PCC Record</h2>
      <form onSubmit={handleSubmit} className="pcc-form">
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
            {applicants.map((a) => {
              const alreadySelected = pccApplicantIds.includes(a._id);
              return (
                <option
                  key={a._id}
                  value={a._id}
                  disabled={alreadySelected}
                >
                  {a.name}
                  {alreadySelected ? " (Already Has PCC)" : ""}
                </option>
              );
            })}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Status:</label>
          <select 
            className="form-select"
            name="process" 
            value={form.process} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Status</option>
            <option value="applied">Applied</option>
            <option value="approved">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="dispatched">Dispatched</option>
            <option value="reapplied">Re Applied</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Issued At:</label>
          <input
            type="date"
            className="form-control"
            name="issuedAt"
            value={form.issuedAt}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <textarea
            className="form-control form-textarea"
            name="registeredemail"
            value={form.registeredemail}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Add PCC Record</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}