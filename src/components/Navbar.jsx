import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Comp.css";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__link">
        Home
      </NavLink>
      
      <NavLink to="/countries" className="navbar__link">
        Countries
      </NavLink>
      
      <NavLink to="/applicants" className="navbar__link">
        Applicants
      </NavLink>
      
      <NavLink to="/agents" className="navbar__link">
        Agents
      </NavLink>
      
      <NavLink to="/records" className="navbar__link">
        Records
      </NavLink>
      
      {/* <NavLink to="/pcc" className="navbar__link">
        PCC Records
      </NavLink> */}

      {user?.role === "admin" && (
        <>
          <NavLink to="/admin" className="navbar__link navbar__link--admin">
            Admin Tools
          </NavLink>
          {/* <NavLink to="/admin/payments" className="navbar__link navbar__link--admin">
            Payments
          </NavLink>
          <NavLink to="/admin/users" className="navbar__link navbar__link--admin">
            Users
          </NavLink> */}
        </>
      )}
    </nav>
  );
}