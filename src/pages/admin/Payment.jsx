import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Admin.css";

export default function Payment() {
  const [search, setSearch] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [payments, setPayments] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ date: "", reference: "", amount: "", method: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ reference: "", amount: "", method: "" });
  const [showAll, setShowAll] = useState(false); // --- NEW

  const printRef = useRef(null);
  const token = localStorage.getItem("token");

  function getErrorMsg(err) {
    return (
      err?.response?.data?.message ||
      err?.response?.statusText ||
      err?.message ||
      "Unknown error"
    );
  }

  // 1. Get applicants
  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/applicants`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => {
        setApplicants(Array.isArray(res.data) ? res.data : []);
        if (!res.data || res.data.length === 0) setError("No applicants found.");
        setLoading(false);
      })
      .catch(err => {
        setApplicants([]);
        setError("Error: " + getErrorMsg(err));
        setLoading(false);
      });
  }, [token]);

  const filteredApplicants = applicants.filter(app =>
    app.name?.toLowerCase().includes(search.toLowerCase()) ||
    (typeof app.agent === "object"
      ? app.agent.name?.toLowerCase().includes(search.toLowerCase())
      : (app.agent || "").toLowerCase().includes(search.toLowerCase())) ||
    app.contact?.toLowerCase().includes(search.toLowerCase()) ||
    (typeof app.country === "object"
      ? app.country.name?.toLowerCase().includes(search.toLowerCase())
      : (app.country || "").toLowerCase().includes(search.toLowerCase()))
  );

  // --- PAGINATION LOGIC: Only 10 applicants by default ---
  const applicantsToShow =
    showAll || filteredApplicants.length <= 10
      ? filteredApplicants
      : filteredApplicants.slice(0, 10);

  // 2. Fetch payments for applicant
  const fetchPayments = async (applicantId) => {
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/payments?applicant=${encodeURIComponent(applicantId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayments(prev => ({
        ...prev,
        [applicantId]: Array.isArray(res.data) ? res.data : []
      }));
    } catch (err) {
      setError("Error: " + getErrorMsg(err));
      setPayments(prev => ({
        ...prev,
        [applicantId]: []
      }));
    }
  };

  const handleView = (app) => {
    setSelectedApplicant(app);
    setShowAdd(false);
    setEditId(null);
    if (!payments[app._id]) {
      fetchPayments(app._id);
    }
  };

  

 

  

  
  

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "Print", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Payment Statement</title>
          <style>
            body { font-family: sans-serif; padding: 30px; }
            h3, h4 { margin-top: 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #aaa; padding: 6px; text-align: left; }
            @media print {
              button, .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  function displayNameOrDash(val) {
    if (!val) return "-";
    if (typeof val === "string") return val;
    if (typeof val === "object" && val.name) return val.name;
    return "-";
  }

  const currentPayments = selectedApplicant ? payments[selectedApplicant._id] || [] : [];

  return (
    <div className="admin-container">
      <h2 className="admin-title">Payment Management</h2>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search applicant by name, agent, etc."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <div className="loading-spinner"></div>}
      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Applicant</th>
              <th>Agent</th>
              
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicantsToShow.length === 0 ? (
              <tr><td colSpan="5" className="no-data">No applicants found.</td></tr>
            ) : (
              applicantsToShow.map((app, idx) => (
                <tr key={app._id || idx}>
                  <td>{idx + 1}</td>
                  <td>{app.name}</td>
                  <td>{displayNameOrDash(app.agent)}</td>
                  
                  <td>{displayNameOrDash(app.country)}</td>
                  <td className="actions">
                    <button className="btn-view" onClick={() => handleView(app)}>View</button>
                  
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* --- Show All Button --- */}
        {filteredApplicants.length > 10 && !showAll && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
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

      {/* --- rest of your code stays same --- */}

      {selectedApplicant && !showAdd && (
        <div ref={printRef} className="payment-card">
          <h3>Applicant Card</h3>
          <div className="applicant-info">
            <div><span className="info-label">Name:</span> {selectedApplicant.name}</div>
            <div><span className="info-label">Agent:</span> {displayNameOrDash(selectedApplicant.agent)}</div>
            <div><span className="info-label">Contact:</span> {selectedApplicant.contact || "-"}</div>
            <div><span className="info-label">Country:</span> {displayNameOrDash(selectedApplicant.country)}</div>
          </div>
          
          <h4 className="payment-title">Payment Statement</h4>
          <div className="table-responsive">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Date</th>
                  <th>Purpose</th>
                  <th>Amount</th>
                  <th>Method | Receiver</th>
                  <th className="no-print">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.length === 0 ? (
                  <tr><td colSpan="6" className="no-data">No payments found.</td></tr>
                ) : (
                  currentPayments.map((pay, i) => (
                    <tr key={pay._id || i}>
                      <td>{i + 1}</td>
                      <td>{pay.date ? pay.date.substr(0,10) : ""}</td>
                      <td>{pay.reference}</td>
                      <td>{pay.amount}</td>
                      <td>{pay.method}</td>
                      <td className="no-print actions">
                        <button className="btn-edit" onClick={() => handleEditPayment(pay)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeletePayment(pay._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="payment-total">
            Total: {currentPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0)}
          </div>
          <div className="payment-actions">
            <button className="btn-print" onClick={handlePrint}>Print</button>
            <button className="btn-close" onClick={() => setSelectedApplicant(null)}>Close</button>
          </div>
        </div>
      )}

      {showAdd && selectedApplicant && (
        <form onSubmit={handleAddPayment} className="payment-form">
          <h4>Add Payment for {selectedApplicant.name}</h4>
          <div className="form-group">
            <label>Date:</label>
            <input type="date" value={addForm.date} required onChange={e => setAddForm({ ...addForm, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Purpose:</label>
            <input type="text" value={addForm.reference} onChange={e => setAddForm({ ...addForm, reference: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Method | Receiver:</label>
            <input type="text" value={addForm.method} onChange={e => setAddForm({ ...addForm, method: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input type="number" value={addForm.amount} required onChange={e => setAddForm({ ...addForm, amount: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">Add Payment</button>
            <button type="button" className="btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </form>
      )}

      {editId && (
        <form onSubmit={handleEditSubmit} className="payment-form edit-form">
          <h4>Edit Payment</h4>
          <div className="form-group">
            <label>Purpose:</label>
            <input type="text" value={editForm.reference} onChange={e => setEditForm({ ...editForm, reference: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Method | Receiver:</label>
            <input type="text" value={editForm.method} onChange={e => setEditForm({ ...editForm, method: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input type="number" value={editForm.amount} required onChange={e => setEditForm({ ...editForm, amount: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">Update</button>
            <button type="button" className="btn-cancel" onClick={() => setEditId(null)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
