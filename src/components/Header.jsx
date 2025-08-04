import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaSignInAlt, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";
import "./Comp.css";

export default function Header() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = React.useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else if (prefersDark) {
      setDarkMode(true);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <header className="header">
        <div className="header__brand">
          <img src="/logo.png" alt="Everest Logo" className="header__logo" />
          <h1 className="header__title">Everest Management System</h1>
        </div>

        <div className="header__actions">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          
          {user ? (
            <>
              <span className="header__greeting">Hello, {user.name}</span>
              <button 
                onClick={logout} 
                title="Logout" 
                className="header__button"
                aria-label="Logout"
              >
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <a 
              href="/login" 
              title="Login" 
              className="header__button"
              aria-label="Login"
            >
              <FaSignInAlt />
            </a>
          )}
        </div>
      </header>

      
    </>
  );
}