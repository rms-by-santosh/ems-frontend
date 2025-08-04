import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Pcc.css";

export default function EditPCCRecord() {
  const { id } = useParams();
  const [form, setForm] = useState({
    applicant: "",
    process: "",
    issuedAt: "",
    registeredemail: "",
  });
  const [applicants, setApplicants] = useState([]);
  const [pccRecords, setPccRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [pccRes, applicantsRes, pccsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/pcc/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/applicants`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/pcc`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const pcc = pccRes.data;
        setForm({
          applicant: pcc.applicant?._id || pcc.applicant || "",
          process: pcc.process || "",
          issuedAt: pcc.issuedAt ? pcc.issuedAt.slice(0, 10) : "",
          registeredemail: pcc.registeredemail || "",
        });
        setApplicants(applicantsRes.data);
        setPccRecords(pccsRes.data);
        setLoading(false);
      } catch {
        setError("Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const pccApplicantIds = pccRecords.map((p) => p.applicant?._id || p.applicant);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/pcc/${id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/pcc");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update PCC record");
    }
  };

  if (loading) return <p className="loading-text">Loading PCC record...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="pcc-container">
      <h2 className="pcc-header">Edit PCC Record</h2>
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
              const alreadySelected = pccApplicantIds.includes(a._id) && a._id !== form.applicant;
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
        
        <button type="submit" className="btn btn-primary">Save Changes</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}