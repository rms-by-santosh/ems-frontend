import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CountriesList.css";

export default function CountriesList() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/countries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCountries(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load countries");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div className="countries-container">
      <div className="countries-header">
        <h2 className="countries-title">Countries</h2>
        <div className="header-actions">
          <Link to="/countries/add" className="add-country-btn">
            Add Country
          </Link>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading countries...</p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="countries-table-container">
          <table className="countries-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {countries.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="2">
                    <div className="empty-state">
                      <svg className="empty-icon" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                        <path d="M12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                      </svg>
                      <p>No countries found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                countries.map(({ _id, name }) => (
                  <tr key={_id} className="country-row">
                    <td>{name}</td>
                    <td className="actions-cell">
                      <Link to={`/countries/view/${_id}`} className="action-link view-link">View</Link>
                      <Link to={`/countries/edit/${_id}`} className="action-link edit-link">Edit</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}