import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPCCRecord() {
  const { id } = useParams();
  const [form, setForm] = useState({
    applicant: "",
    status: "pending",
    issuedAt: "",
    remarks: "",
  });
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pccRes, applicantsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/pcc/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/applicants`),
        ]);
        const pcc = pccRes.data;
        setForm({
          applicant: pcc.applicant || "",
          status: pcc.status || "pending",
          issuedAt: pcc.issuedAt ? pcc.issuedAt.slice(0, 10) : "",
          remarks: pcc.remarks || "",
        });
        setApplicants(applicantsRes.data);
        setLoading(false);
      } catch {
        setError("Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/pcc/${id}`, form);
      navigate("/pcc");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update PCC record");
    }
  };

  if (loading) return <p>Loading PCC record...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Edit PCC Record</h2>
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
        <button type="submit">Save Changes</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
