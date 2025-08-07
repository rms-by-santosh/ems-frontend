import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Ready.css"; // Import the CSS file

const Ready = () => {
  const [applicants, setApplicants] = useState([]);
  const [records, setRecords] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [appRes, recRes, payRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/applicants`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/records`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/payments`, config),
        ]);
        setApplicants(appRes.data);
        setRecords(recRes.data);
        setPayments(payRes.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        alert("Failed to fetch data: " + (err.response?.data?.message || err.message));
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const paymentMap = {};
  payments.forEach((p) => {
    const id = String(p.applicant?._id || p.applicant);
    paymentMap[id] = (paymentMap[id] || 0) + Number(p.amount || 0);
  });

  const recordMap = {};
  records.forEach((r) => {
    const id = String(r.applicant?._id || r.applicant);
    recordMap[id] = r;
  });

  const tableData = applicants
    .map((applicant) => {
      const id = String(applicant._id);
      const totalPaid = paymentMap[id] || 0;
      const record = recordMap[id];
      const progressStatus = record ? record.progressStatus : undefined;

      if (
        totalPaid >= 25000 &&
        (!record || progressStatus === "MEDICAL")
      ) {
        return {
          id: applicant._id,
          name: applicant.name,
          country: applicant.country?.name || applicant.country || "-",
          contact: applicant.phone || "-",
          agent: applicant.agent?.name || applicant.agent || "-",
          totalPaid,
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="ready-list-container">
      <h2>Ready To Apply List</h2>
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="ready-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Applicant</th>
                <th>Country</th>
                <th>Contact</th>
                <th>Agent</th>
                <th>Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-applicants">No applicants found</td>
                </tr>
              ) : (
                tableData.map((row, i) => (
                  <tr key={row.id}>
                    <td>{i + 1}</td>
                    <td>{row.name}</td>
                    <td>{row.country}</td>
                    <td>{row.contact}</td>
                    <td>{row.agent}</td>
                    <td>₹{row.totalPaid.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Ready;