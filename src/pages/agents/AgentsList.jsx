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
  const [deletingId, setDeletingId] = useState(null);

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

  // Helper: Get applicant count for an agent (handles both count and array forms)
  const getApplicantCount = (agent) => {
    if ("applicantCount" in agent) return agent.applicantCount;
    if (Array.isArray(agent.applicants)) return agent.applicants.length;
    return 0;
  };

  const handleDelete = async (agent) => {
    const applicantCount = getApplicantCount(agent);
    if (applicantCount > 0) {
      alert("Cannot delete: Agent has assigned applicants.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    setDeletingId(agent._id);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/agents/${agent._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAgents((prev) => prev.filter((a) => a._id !== agent._id));
      setFilteredAgents((prev) => prev.filter((a) => a._id !== agent._id));
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "Failed to delete agent. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

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
                    <span className="action-divider">|</span>
                    <button
                      className="action-link delete-link"
                      onClick={() => handleDelete(agent)}
                      disabled={deletingId === agent._id}
                      style={{
                        color: getApplicantCount(agent) > 0 ? "gray" : "red",
                        background: "none",
                        border: "none",
                        cursor: deletingId === agent._id || getApplicantCount(agent) > 0
                          ? "not-allowed"
                          : "pointer",
                        padding: 0,
                        font: "inherit",
                      }}
                    >
                      {deletingId === agent._id
                        ? "Deleting..."
                        : "Delete"}
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
