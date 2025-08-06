import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Applicant.css";

// ---- DATE UTILS ----
function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}
function isToday(date) {
  const d = new Date(date);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}
function isThisMonth(date) {
  const d = new Date(date);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() > now.getDate();
}
function isNextMonth(date) {
  const d = new Date(date);
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return d.getFullYear() === nextMonth.getFullYear() &&
    d.getMonth() === nextMonth.getMonth();
}

// ---- PRINT HELPER ----
function printTable(ref) {
  if (!ref.current) return;
  const content = ref.current.innerHTML;
  const printWindow = window.open("", "PRINT", "height=800,width=1100");
  printWindow.document.write(`
    <html>
      <head>
        <title>Appointments</title>
        <style>
          @media print {
            .no-print { display: none !important; }
            .print-table th.agent-col, .print-table td.agent-col { display: none !important; }
          }
          table { width: 100%; border-collapse: collapse; font-size: 16px; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background: #e3e3e3; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}

// ---- TABLE SECTION COMPONENT ----
function TableSection({
  title,
  rows,
  search,
  setSearch,
  searchPlaceholder,
  showAll,
  setShowAll,
  maxRows = 10,
  searchField = "appointment"
}) {
  const tableRef = useRef();

  const searchedRows = search
    ? rows.filter((row) => {
        if (searchField === "appointment") {
          return row.appointment
            ?.toLowerCase()
            .includes(search.toLowerCase());
        } else if (searchField === "name") {
          return row.applicant?.name?.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      })
    : rows;

  const displayRows =
    showAll || searchedRows.length <= maxRows
      ? searchedRows
      : searchedRows.slice(0, maxRows);

  return (
    <div className="appointments-section" style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button
          className="btn-print-table"
          style={{
            padding: "6px 16px",
            borderRadius: "6px",
            background: "#296cff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
          }}
          onClick={() => printTable(tableRef)}
        >
          Print
        </button>
      </div>
      <div className="search-container" style={{ marginBottom: "10px" }}>
        <input
          type="text"
          className="search-input"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="applicants-table-container" ref={tableRef}>
        <table className="applicants-table print-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Applicant</th>
              <th className="agent-col">Agent</th>
              <th>Contact</th>
              <th>Appointment Date</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No appointments found.
                </td>
              </tr>
            ) : (
              displayRows.map((row, idx) => (
                <tr key={row._id}>
                  <td>{idx + 1}</td>
                  <td>{row.applicant?.name || "-"}</td>
                  <td className="agent-col">{row.applicant?.agent?.name || "-"}</td>
                  <td>{row.applicant?.phone || row.applicant?.contact || "-"}</td>
                  <td>{formatDate(row.appointment)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {searchedRows.length > maxRows && !showAll && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button
              className="show-all-btn"
              onClick={() => setShowAll(true)}
              style={{
                padding: "6px 18px",
                borderRadius: "6px",
                background: "#1677ff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              Show All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- MAIN COMPONENT ----
export default function Appointments() {
  const [records, setRecords] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Section states
  const [searchToday, setSearchToday] = useState("");
  const [showAllToday, setShowAllToday] = useState(false);

  const [searchMonth, setSearchMonth] = useState("");
  const [showAllMonth, setShowAllMonth] = useState(false);

  const [searchNextMonth, setSearchNextMonth] = useState("");
  const [showAllNextMonth, setShowAllNextMonth] = useState(false);

  const [searchAll, setSearchAll] = useState("");
  const [showAllAll, setShowAllAll] = useState(false);

  // Fetch records and agents
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/records`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${import.meta.env.VITE_API_URL}/agents`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]).then(([recordsRes, agentsRes]) => {
      const allAgents = agentsRes.data || [];
      setAgents(allAgents);
      // Attach agent object to each record's applicant (if applicant exists)
      const recordsWithAgent = (recordsRes.data || [])
        .filter((rec) => !!rec.appointment && rec.applicant)
        .map((rec) => {
          // If applicant.agent is just an ID, replace it with full agent object
          if (
            rec.applicant &&
            rec.applicant.agent &&
            typeof rec.applicant.agent === "string"
          ) {
            const found = allAgents.find(
              (ag) => ag._id === rec.applicant.agent
            );
            rec.applicant.agent = found || null;
          }
          return rec;
        });
      setRecords(recordsWithAgent);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Sort appointments by earliest first
  const sortedApps = [...records].sort(
    (a, b) => new Date(a.appointment) - new Date(b.appointment)
  );

  const todayApps = sortedApps.filter((a) => isToday(a.appointment));
  const thisMonthApps = sortedApps.filter((a) => isThisMonth(a.appointment));
  const nextMonthApps = sortedApps.filter((a) => isNextMonth(a.appointment));

  return (
    <div className="appointments-container" style={{ maxWidth: 1100, margin: "auto" }}>
      <h2 style={{ marginBottom: "25px" }}>All Appointments</h2>
      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : (
        <>
          <TableSection
            title="Appointments Today"
            rows={todayApps}
            search={searchToday}
            setSearch={setSearchToday}
            searchPlaceholder="Search by appointment date"
            showAll={showAllToday}
            setShowAll={setShowAllToday}
            maxRows={10}
            searchField="appointment"
          />

          <TableSection
            title="Upcoming Appointments (This Month)"
            rows={thisMonthApps}
            search={searchMonth}
            setSearch={setSearchMonth}
            searchPlaceholder="Search by appointment date"
            showAll={showAllMonth}
            setShowAll={setShowAllMonth}
            maxRows={10}
            searchField="appointment"
          />

          <TableSection
            title="Next Month Appointments"
            rows={nextMonthApps}
            search={searchNextMonth}
            setSearch={setSearchNextMonth}
            searchPlaceholder="Search by appointment date"
            showAll={showAllNextMonth}
            setShowAll={setShowAllNextMonth}
            maxRows={10}
            searchField="appointment"
          />

          <TableSection
            title="All Appointments"
            rows={sortedApps}
            search={searchAll}
            setSearch={setSearchAll}
            searchPlaceholder="Search by applicant name"
            showAll={showAllAll}
            setShowAll={setShowAllAll}
            maxRows={10}
            searchField="name"
          />
        </>
      )}
    </div>
  );
}
