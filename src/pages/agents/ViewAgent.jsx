import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./Agent.css";

export default function ViewAgent() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingAgent, setLoadingAgent] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(true);
  const [errorAgent, setErrorAgent] = useState("");
  const [errorApplicants, setErrorApplicants] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingAgent(true);
        setLoadingApplicants(true);
        
        const [agentRes, applicantsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/agents/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/applicants?agent=${id}`)
        ]);
        
        setAgent(agentRes.data);
        setApplicants(applicantsRes.data);
      } catch (err) {
        setErrorAgent("Failed to load agent data");
        setErrorApplicants("Failed to load applicants data");
      } finally {
        setLoadingAgent(false);
        setLoadingApplicants(false);
      }
    };

    fetchData();
  }, [id]);

  if (loadingAgent) return <div className="loading-spinner"></div>;
  if (errorAgent) return <div className="error-message">{errorAgent}</div>;

  return (
    <div className="agent-container">
      <div className="agent-card">
        <div className="agent-header">
          <h2 className="agent-title">Agent Details</h2>
          <Link to="/agents" className="back-button">
            &larr; Back to Agents
          </Link>
        </div>

        <div className="agent-details-grid">
          <div className="detail-card">
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <span className="detail-value">{agent.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{agent.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{agent.phone || "-"}</span>
            </div>
          </div>
        </div>

        <div className="section-title">
          <h3>Applicants Managed</h3>
          <span className="badge">{applicants.length}</span>
        </div>

        {loadingApplicants ? (
          <div className="loading-spinner small"></div>
        ) : errorApplicants ? (
          <div className="error-message">{errorApplicants}</div>
        ) : applicants.length === 0 ? (
          <div className="empty-state">
            <p>No applicants assigned to this agent</p>
            <Link to="/applicants/create" className="action-link">
              Assign New Applicant
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(({ _id, name, email, phone }) => (
                  <tr key={_id}>
                    <td>{name}</td>
                    <td>{email || "-"}</td>
                    <td>{phone || "-"}</td>
                    <td className="actions-cell">
                      <Link 
                        to={`/applicants/view/${_id}`} 
                        className="action-link view"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/applicants/edit/${_id}`} 
                        className="action-link edit"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}