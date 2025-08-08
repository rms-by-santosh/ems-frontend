import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔸 NEW: public view bits (isolated — no impact to logged-in flow)
  const [publicEmail, setPublicEmail] = useState("");
  const [publicError, setPublicError] = useState("");
  const navigate = useNavigate();

  // 🔸 NEW: tiny email validator (kept local so it can’t affect anything else)
  const isValidEmail = (val) =>
    !!val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  // 🔸 NEW: single handler works for click or Enter (form submit)
  const handlePublicAccess = (e) => {
    e.preventDefault();
    const email = publicEmail.trim();
    if (!isValidEmail(email)) {
      setPublicError("Please enter a valid email.");
      return;
    }
    setPublicError("");
    navigate(`/publicagent?email=${encodeURIComponent(email)}`);
  };

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/activity/recent`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setActivity(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            err?.response?.statusText ||
            err?.message ||
            "Unknown error"
        );
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="home-container">
      <header className="header-section">
        <h1 className="home-title">Welcome to Everest Management System</h1>

        {user ? (
          <p className="welcome-message">
            Hello, <span className="user-name">{user.name}</span>! You are
            logged in as <span className="user-role">{user.role}</span>.
          </p>
        ) : (
          // 🔸 REPLACED ONLY THIS BLOCK (kept your text, added input+button with safe submit)
          <form
            className="login-prompt"
            onSubmit={handlePublicAccess}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
            noValidate
          >
            <div className="publicagentinput">
              
                <p style={{   }}>
                  Please log in to access the system features.
                </p>
              
              
              <h3>If you are agent Enter your Email </h3>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter agent email"
                  value={publicEmail}
                  onChange={(e) => {
                    setPublicEmail(e.target.value);
                    if (publicError) setPublicError("");
                  }}
                  style={{ padding: "8px 10px", minWidth: 260 }}
                  aria-label="Agent email"
                />
                <button
                  type="submit"
                  style={{ padding: "8px 14px", cursor: "pointer" }}
                  disabled={!publicEmail}
                  title={
                    !publicEmail ? "Enter email to continue" : "Get Access"
                  }
                >
                  Get Access
                </button>
              
            </div>

            {publicError && (
              <span style={{ color: "#c0392b", fontSize: 12 }}>
                {publicError}
              </span>
            )}
          </form>
        )}
      </header>

      {user && (
        <section className="activity-section">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-count">{activity.length} events</div>
          </div>

          {loading && (
            <div className="loading-animation">
              <div className="spinner"></div>
              <p>Loading recent activity...</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && activity.length === 0 && (
            <div className="no-activity">
              <div className="empty-state">
                <svg className="empty-icon" viewBox="0 0 24 24">
                  <path d="M19,13H5V11H19V13M12,5A2,2 0 0,1 14,7A2,2 0 0,1 12,9A2,2 0 0,1 10,7A2,2 0 0,1 12,5M12,15A2,2 0 0,1 14,17A2,2 0 0,1 12,19A2,2 0 0,1 10,17A2,2 0 0,1 12,15Z" />
                </svg>
                <p>No recent activity found</p>
              </div>
            </div>
          )}

          {activity.length > 0 && (
            <div className="activity-list">
              {activity.map((item) => (
                <div key={item._id} className="activity-item">
                  <div className="activity-timeline">
                    <div className="activity-dot"></div>
                    {item !== activity[activity.length - 1] && (
                      <div className="activity-line"></div>
                    )}
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-action">{item.action}</span>
                      {item.user?.name && (
                        <span className="activity-user">
                          By {item.user.name}
                        </span>
                      )}
                    </div>
                    <p className="activity-desc">{item.description}</p>
                    <div className="activity-footer">
                      {item.date && (
                        <time className="activity-date">
                          {new Date(item.date).toLocaleString()}
                        </time>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
