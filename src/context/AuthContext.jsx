import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set axios Authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Save user data to localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Login function: sends credentials to backend and stores token & user
  const login = async (username, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        username,
        password,
      });
      setUser(response.data.user);
      setToken(response.data.token);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
      return false;
    }
  };

  // Logout function: clear user and token from state and storage
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
