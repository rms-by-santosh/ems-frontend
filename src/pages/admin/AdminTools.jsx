import React from "react";
import { Link } from "react-router-dom";
import "./Admin.css"; // External CSS

export default function AdminTools() {
  return (
    <div className="admin-tools">
      <h2 className="admin-tools__title">Admin Dashboard</h2>
      
      <div className="admin-tools__grid">
        <Link to="/admin/payments" className="admin-card">
          <div className="admin-card__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h3 className="admin-card__title">Payment Management</h3>
          <p className="admin-card__desc">View and manage all transactions</p>
          <div className="admin-card__hover-effect"></div>
        </Link>

        <Link to="/admin/users" className="admin-card">
          <div className="admin-card__icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <h3 className="admin-card__title">User Management</h3>
          <p className="admin-card__desc">Manage user accounts and permissions</p>
          <div className="admin-card__hover-effect"></div>
        </Link>
      </div>
    </div>
  );
}