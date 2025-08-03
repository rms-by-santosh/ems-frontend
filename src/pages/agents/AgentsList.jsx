import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Agent.css";

export default function AgentsList() {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/agents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAgents(data);
      setFilteredAgents(data);
      setIsLoading(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Failed to load agents"
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter((agent) =>
        agent.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );
      setFilteredAgents(filtered);
    }
  }, [searchTerm, agents]);

  if (isLoading) return <div className="loading-spinner">Loading agents...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="agents-container">
      <div className="agents-header">
        <h2 className="section-title">Agents</h2>
        <div className="agents-controls">
          <input
            type="text"
            placeholder="Search by agent name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link to="/agents/create" className="add-agent-btn">
            Add Agent
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="agents-table">
          <thead className="table-header">
            <tr>
              <th className="col-name">Name</th>
              <th className="col-email">Email</th>
              <th className="col-phone">Phone</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredAgents.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="4" className="empty-state">No agents found.</td>
              </tr>
            ) : (
              filteredAgents.map((agent) => (
                <tr key={agent._id} className="agent-row">
                  <td className="agent-name">{agent.name || '-'}</td>
                  <td className="agent-email">{agent.email || '-'}</td>
                  <td className="agent-phone">{agent.phone || '-'}</td>
                  <td className="agent-actions">
                    <Link to={`/agents/view/${agent._id}`} className="action-link view-link">View</Link>
                    <span className="action-divider">|</span>
                    <Link to={`/agents/edit/${agent._id}`} className="action-link edit-link">Edit</Link>
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