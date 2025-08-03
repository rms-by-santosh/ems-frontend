import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Records.css";

export default function RecordsList() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRecords(data);
      setFilteredRecords(data);
      setIsLoading(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Failed to load records"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter((record) =>
        record.applicant?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, records]);

  if (isLoading) return <div className="loading-state">Loading records...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="records-container">
      <div className="records-header">
        <h2 className="records-title">Records</h2>
        <div className="records-controls">
          <input
            type="text"
            placeholder="Search by applicant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link to="/records/add" className="add-record-btn">
            Add Record
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="records-table">
          <thead className="table-header">
            <tr>
              <th className="col-applicant">Applicant</th>
              <th className="col-country">Country</th>
              <th className="col-type">Type</th>
              <th className="col-progress">Progress</th>
              <th className="col-submitted">Submitted Date</th>
              <th className="col-physical">Physical Date</th>
              <th className="col-appointment">Appointment</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredRecords.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="8" className="empty-state">No records found.</td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record._id} className="record-row">
                  <td className="applicant-name">{record.applicant?.name || "-"}</td>
                  <td className="applicant-country">{record.applicant?.country?.name || "-"}</td>
                  <td className="record-type">{record.type}</td>
                  <td className="record-progress">
                    <span className={`status-badge ${record.progressStatus?.toLowerCase().replace(/\s+/g, '-') || ''}`}>
                      {record.progressStatus || "-"}
                    </span>
                  </td>
                  <td className="record-submitted">
                    {record.submittedAt ? new Date(record.submittedAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="record-physical">
                    {record.physical ? new Date(record.physical).toLocaleDateString() : "-"}
                  </td>
                  <td className="record-appointment">
                    {record.appointment ? new Date(record.appointment).toLocaleDateString() : "-"}
                  </td>
                  <td className="record-actions">
                    <Link to={`/records/edit/${record._id}`} className="action-link edit-link">Edit</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}