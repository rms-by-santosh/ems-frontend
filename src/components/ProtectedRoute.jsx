import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protects a route based on login and optionally user role.
 * @param {React.ReactNode} children - The component(s) to render if allowed.
 * @param {string[]} roles - Array of allowed roles (optional).
 */
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
