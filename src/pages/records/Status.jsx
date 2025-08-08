import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const progressOptions = [
  "MEDICAL",
  "DOCS FORWARDED",
  "SUBMITTED",
  "PERMIT DISPATCHED",
  "PERMIT REJECTED",
  "EMBASSY SUBMITTED",
  "APPOINTMENT CNF",
  "INTERVIEW FACED",
 "MAIL RECEIVED",
 
  "VISA APPROVED",
  "VISA REJECTED",
  "LABOR PERMIT PROCESSED",
  "LABOR PERMIT DISPATCHED",
  "FLIGHT DONE",
  "CANCELLED SELF",
];

export default function Status() {
  const [progress, setProgress] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState({});
  const [countries, setCountries] = useState({});
  const navigate = useNavigate();

  // Fetch agent/country lookups only once
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [agentsRes, countriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/agents`),
          axios.get(`${import.meta.env.VITE_API_URL}/countries`),
        ]);
        const agentsMap = {};
        agentsRes.data.forEach((a) => {
          agentsMap[a._id] = a.name;
        });
        setAgents(agentsMap);

        const countriesMap = {};
        countriesRes.data.forEach((c) => {
          countriesMap[c._id] = c.name;
        });
        setCountries(countriesMap);
      } catch {}
    };
    fetchMeta();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    try {
      // 1. Get all records (populated with applicant info)
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/records`);
      // 2. Filter records by progressStatus (case-insensitive)
      const filteredRecords = res.data.filter(
        (rec) =>
          rec.progressStatus &&
          rec.progressStatus.toLowerCase() === progress.toLowerCase()
      );
      // 3. Save filtered records
      setResults(filteredRecords);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  function getCountryName(record) {
    const applicant = record.applicant;
    if (!applicant) return "-";
    // If applicant.country is populated object
    if (typeof applicant.country === "object" && applicant.country !== null) {
      return applicant.country.name || "-";
    }
    // If applicant.country is string ID, lookup from countries dictionary
    if (typeof applicant.country === "string") {
      return countries[applicant.country] || "-";
    }
    return "-";
  }

  // Helper to get applicant details safely
  function getApplicantField(record, field) {
    if (!record.applicant) return "-";
    if (typeof record.applicant === "object") {
      return record.applicant[field] || "-";
    }
    return "-";
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "30px auto",
        background: "#fff",
        padding: 32,
        borderRadius: 8,
        boxShadow: "0 4px 24px #eee",
      }}
    >
      <h2>Search By Progress</h2>
      <form
        onSubmit={handleSearch}
        style={{
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <select
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          required
          style={{ minWidth: 250, padding: 8 }}
        >
          <option value="">-- Select Progress --</option>
          {progressOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button
          type="submit"
          style={{
            padding: "8px 24px",
            background: "#4895ef",
            color: "#fff",
            border: 0,
            borderRadius: 4,
          }}
        >
          View Results
        </button>
      </form>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#f8f9fa",
          }}
        >
          <thead>
            <tr style={{ background: "#4895ef", color: "#fff" }}>
              <th style={{ padding: 12 }}>SN</th>
              <th style={{ padding: 12 }}>Name</th>
              <th style={{ padding: 12 }}>Agent</th>
              <th style={{ padding: 12 }}>Country</th>
              <th style={{ padding: 12 }}>Contact</th>
              <th style={{ padding: 12 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 24 }}>
                  Loading...
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 24 }}>
                  No results found.
                </td>
              </tr>
            ) : (
              results.map((rec, i) => (
                <tr
                  key={rec._id || i}
                  style={{ background: i % 2 ? "#fff" : "#f3f6fa" }}
                >
                  <td style={{ padding: 10 }}>{i + 1}</td>
                  <td style={{ padding: 10 }}>
                    {getApplicantField(rec, "name")}
                  </td>
                  <td style={{ padding: 10 }}>
                    {agents[getApplicantField(rec, "agent")] || "-"}
                  </td>
                  <td style={{ padding: 10 }}>{getCountryName(rec)}</td>
                  <td style={{ padding: 10 }}>
                    {getApplicantField(rec, "phone") ||
                      getApplicantField(rec, "email") ||
                      "-"}
                  </td>
                  <td style={{ padding: 10 }}>
                    <button
                      style={{
                        background: "#4895ef",
                        color: "#fff",
                        border: 0,
                        padding: "6px 14px",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        // ✅ Edit the RECORD, not the applicant
                        navigate(`/records/edit/${rec._id}`);
                      }}
                    >
                      Edit Record
                    </button>
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
