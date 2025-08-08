// src/pages/PublicAgent.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function PublicAgent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const emailParam = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("email") || "").trim().toLowerCase();
  }, [location.search]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL;

    const load = async () => {
      setLoading(true);
      setError("");
      setAgent(null);
      setApplicants([]);

      try {
        if (!emailParam) {
          setError("Please provide an agent email.");
          return;
        }

        // Public-safe endpoint (no JWT required):
        // GET /public/agent?email=<email>
        const { data } = await axios.get(`${API}/public/agent`, {
          params: { email: emailParam },
        });

        // Expected shape:
        // { agent: {_id,name,email,contact}, applicants: [{_id,name,contact,countryName,progress}] }
        setAgent(data.agent || null);
        const list = Array.isArray(data.applicants) ? data.applicants : [];
        // Normalize for rendering (keep keys consistent)
        setApplicants(
          list.map((a) => ({
            _id: a._id,
            name: a.name || "-",
            country: a.countryName || "-",
            progress: a.progress || "-",
            contact: a.contact || "-",
          }))
        );
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Failed to load";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [emailParam]);

  return (
    <div style={{ maxWidth: 1000, margin: "30px auto", padding: 24 }}>
      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => navigate(-1)} style={{ padding: "6px 10px", cursor: "pointer" }}>
          ← Back
        </button>
        <button onClick={() => navigate("/")} style={{ padding: "6px 10px", cursor: "pointer" }}>
          Home
        </button>
      </div>

      {!emailParam && (
        <p style={{ color: "#b00" }}>
          No email provided. Append <code>?email=someone@example.com</code> to the URL.
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div
          style={{
            background: "#ffe8e8",
            border: "1px solid #f5b5b5",
            color: "#9c2b2b",
            padding: 14,
            borderRadius: 6,
          }}
        >
          {error}
        </div>
      ) : (
        <>
          {/* Agent header */}
          <div
            style={{
              background: "#f6f8fb",
              border: "1px solid #e5e9f2",
              padding: 20,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <h2 style={{ margin: "0 0 6px" }}>{agent?.name || "Agent"}</h2>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <div>
                <strong>Contact:</strong> {agent?.contact || "-"}
              </div>
              <div>
                <strong>Email:</strong> {agent?.email || "-"}
              </div>
            </div>
          </div>

          {/* Applicants table */}
          <h3 style={{ margin: "12px 0" }}>All Applicants</h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                border: "1px solid #eee",
              }}
            >
              <thead>
                <tr style={{ background: "#4895ef", color: "#fff" }}>
                  <th style={{ padding: 10, textAlign: "left" }}>SN</th>
                  <th style={{ padding: 10, textAlign: "left" }}>Applicant</th>
                  <th style={{ padding: 10, textAlign: "left" }}>Country</th>
                  <th style={{ padding: 10, textAlign: "left" }}>Progress</th>
                  <th style={{ padding: 10, textAlign: "left" }}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {applicants.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 16, textAlign: "center" }}>
                      No applicants found for this agent.
                    </td>
                  </tr>
                ) : (
                  applicants.map((ap, idx) => (
                    <tr key={ap._id} style={{ background: idx % 2 ? "#f8fbff" : "#fff" }}>
                      <td style={{ padding: 10 }}>{idx + 1}</td>
                      <td style={{ padding: 10 }}>{ap.name}</td>
                      <td style={{ padding: 10 }}>{ap.country}</td>
                      <td style={{ padding: 10 }}>{ap.progress}</td>
                      <td style={{ padding: 10 }}>{ap.contact}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
