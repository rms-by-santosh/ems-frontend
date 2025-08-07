import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Depth.css"; // Import the CSS file

const getDayDiff = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  if (target >= today) return null;
  return Math.floor((today - target) / (1000 * 60 * 60 * 24));
};

const printTable = (ref) => {
  const printContents = ref.current.innerHTML;
  const win = window.open("", "", "width=900,height=600");
  win.document.write(`
    <html>
      <head>
        <title>Print Table</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 6px; }
          @media print {
            th:nth-child(3), td:nth-child(3) { display: none !important; }
          }
        </style>
      </head>
      <body>${printContents}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
  win.close();
};

const Depth = () => {
  const [records, setRecords] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [showAllSoon, setShowAllSoon] = useState(false);
  const [showAllDelays, setShowAllDelays] = useState(false);
  const [loading, setLoading] = useState(true);

  const soonRef = useRef();
  const delayRef = useRef();

  // Additions for "Print All Office Applicants"
  const allApplicantsRef = useRef();
  const [showAllApplicants, setShowAllApplicants] = useState(false);
  // ---

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [applicantRes, recordRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/applicants`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/records`, config),
        ]);
        setApplicants(applicantRes.data);
        setRecords(recordRes.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        alert("Failed to fetch data: " + (err.response?.data?.message || err.message));
      }
    };
    fetchAll();
  }, []);

  const applicantMap = {};
  applicants.forEach((a) => {
    applicantMap[String(a._id)] = a;
  });

  const submittedRecords = records.filter(
    (rec) => rec.progressStatus === "SUBMITTED" && rec.physical
  );

  const releasingSoon = [];
  const delays = [];

  submittedRecords.forEach((rec) => {
    const diff = getDayDiff(rec.physical);
    if (diff === null) return;

    const applicant = applicantMap[String(rec.applicant?._id || rec.applicant)];
    const agent =
      applicant && applicant.agent
        ? applicant.agent.name || applicant.agent
        : "-";
    const row = {
      name: applicant ? applicant.name : "-",
      agent: agent,
      submitted: rec.submittedAt ? new Date(rec.submittedAt).toLocaleDateString() : "-",
      physical: rec.physical ? new Date(rec.physical).toLocaleDateString() : "-",
    };

    if (diff >= 20 && diff <= 45) {
      releasingSoon.push(row);
    }
    else if (diff >= 46) {
      delays.push(row);
    }
  });

  const soonTable = showAllSoon ? releasingSoon : releasingSoon.slice(0, 10);
  const delayTable = showAllDelays ? delays : delays.slice(0, 10);

  // ----- NEW: For Print All Office Applicants -----
  // Helper to get latest progress for an applicant
  const getLatestProgress = (applicantId) => {
    // Find latest record for this applicant
    const recordsForApplicant = records
      .filter(r => String(r.applicant?._id || r.applicant) === String(applicantId));
    if (!recordsForApplicant.length) return "-";
    // Sort by latest date (physical, submittedAt, createdAt)
    recordsForApplicant.sort((a, b) => {
      const aDate = new Date(a.physical || a.submittedAt || a.createdAt);
      const bDate = new Date(b.physical || b.submittedAt || b.createdAt);
      return bDate - aDate;
    });
    return recordsForApplicant[0].progressStatus || "-";
  };

  // Filter applicants: Exclude those whose agent is "AMRIT POKHREL"
  const filteredApplicants = applicants.filter(a => {
    const agentName = a.agent?.name || a.agent || "";
    return agentName.trim().toLowerCase() !== "amrit pokhrel";
  });

  const allApplicantsTable = showAllApplicants
    ? filteredApplicants
    : filteredApplicants.slice(0, 10);

  // ----- END NEW -----

  return (
    <div className="depth-container">
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        <>
          <div className="table-section">
            <h2>Permit Releasing Soon</h2>
            <button className="print-btn" onClick={() => printTable(soonRef)}>
              Print
            </button>
            <div className="table-responsive">
              <div ref={soonRef}>
                <table className="depth-table">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Name</th>
                      <th>Agent</th>
                      <th>Submitted Date</th>
                      <th>Physical Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {soonTable.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="no-data">
                          No data found
                        </td>
                      </tr>
                    ) : (
                      soonTable.map((row, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{row.name}</td>
                          <td>{row.agent}</td>
                          <td>{row.submitted}</td>
                          <td>{row.physical}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {releasingSoon.length > 0 && (
              <button
                className="toggle-btn"
                onClick={() => setShowAllSoon((s) => !s)}
              >
                {showAllSoon
                  ? (releasingSoon.length > 10 ? "Show Less" : "Show All")
                  : (releasingSoon.length > 10 ? "Show All" : "Show All")}
              </button>
            )}
          </div>

          <div className="table-section">
            <h2>Permit Delays</h2>
            <button className="print-btn" onClick={() => printTable(delayRef)}>
              Print
            </button>
            <div className="table-responsive">
              <div ref={delayRef}>
                <table className="depth-table">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Name</th>
                      <th>Agent</th>
                      <th>Submitted Date</th>
                      <th>Physical Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {delayTable.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="no-data">
                          No data found
                        </td>
                      </tr>
                    ) : (
                      delayTable.map((row, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{row.name}</td>
                          <td>{row.agent}</td>
                          <td>{row.submitted}</td>
                          <td>{row.physical}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {delays.length > 0 && (
              <button
                className="toggle-btn"
                onClick={() => setShowAllDelays((s) => !s)}
              >
                {showAllDelays
                  ? (delays.length > 10 ? "Show Less" : "Show All")
                  : (delays.length > 10 ? "Show All" : "Show All")}
              </button>
            )}
          </div>

          {/* ---- NEW SECTION: Print All Office Applicants ---- */}
          <div className="table-section">
            <h2>Print All Office Applicants</h2>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <button className="toggle-btn" onClick={() => setShowAllApplicants(s => !s)}>
                {showAllApplicants
                  ? (filteredApplicants.length > 10 ? "Show Less" : "View All")
                  : (filteredApplicants.length > 10 ? "View All" : "View All")}
              </button>
              <button className="print-btn" onClick={() => printTable(allApplicantsRef)}>
                Print All
              </button>
            </div>
            <div className="table-responsive">
              <div ref={allApplicantsRef}>
                <table className="depth-table">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Name</th>
                      <th>Country</th>
                      <th>Agent</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allApplicantsTable.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="no-data">No data found</td>
                      </tr>
                    ) : (
                      allApplicantsTable.map((a, i) => (
                        <tr key={a._id}>
                          <td>{i + 1}</td>
                          <td>{a.name || "-"}</td>
                          <td>{a.country?.name || a.country || "-"}</td>
                          <td>{a.agent?.name || a.agent || "-"}</td>
                          <td>{getLatestProgress(a._id)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* ---- END NEW SECTION ---- */}

        </>
      )}
    </div>
  );
};

export default Depth;
