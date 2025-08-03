import React from "react";
import { useAuth } from "../context/AuthContext";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import "./Comp.css";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__brand">
        <img src="/logo.png" alt="Everest Logo" className="header__logo" />
        <h1 className="header__title">Everest Management System</h1>
      </div>

      <div className="header__actions">
        {user ? (
          <>
            <span className="header__greeting">Hello, {user.name}</span>
            <button onClick={logout} title="Logout" className="header__button">
              <FaSignOutAlt />
            </button>
          </>
        ) : (
          <a href="/login" title="Login" className="header__button">
            <FaSignInAlt />
          </a>
        )}
      </div>
    </header>
  );
}