// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserAccount } from "../service/authService";

// Create context
const AuthContext = createContext(undefined);

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          const userData = await getUserAccount();
          if (userData) {
            setUser(userData);
          } else {
            // Invalid token or session expired
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refresh_token");
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError("Failed to authenticate user");

        // Clean up invalid tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refresh_token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = (accessToken, refreshToken, userData) => {
    console.log("AuthContext.login called with:", { accessToken, userData });
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    setUser(userData);
    setError(null);
    console.log("User state updated:", userData);
  };

  // Logout function
  const logout = async () => {
    try {
      // Any logout API calls would go here
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refresh_token");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout");
    }
  };

  // Update current user information
  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  };

  const contextValue = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
