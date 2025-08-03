import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function PCCRecords() {
  const [pccRecords, setPccRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPCCRecords = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/pcc`);
      setPccRecords(data);
      setLoading(false);
    } catch {
      setError("Failed to load PCC records");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPCCRecords();
  }, []);

  if (loading) return <p>Loading PCC records...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>PCC Records</h2>
      <Link to="/pcc/add" style={{ marginBottom: "1rem", display: "inline-block" }}>
        Add PCC Record
      </Link>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Status</th>
            <th>Issued At</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pccRecords.length === 0 ? (
            <tr>
              <td colSpan="5">No PCC records found.</td>
            </tr>
          ) : (
            pccRecords.map(({ _id, applicant, status, issuedAt, remarks }) => (
              <tr key={_id}>
                <td>{applicant?.name || "-"}</td>
                <td>{status}</td>
                <td>{issuedAt ? new Date(issuedAt).toLocaleDateString() : "-"}</td>
                <td>{remarks || "-"}</td>
                <td>
                  <Link to={`/pcc/edit/${_id}`}>Edit</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
