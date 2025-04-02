// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { getUserAccount } from "../services/authService";

/**
 * Authentication Context for managing user authentication state
 */
const AuthContext = createContext(undefined);

/**
 * Hook for using the auth context
 * @returns {Object} Auth context values
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Authentication Provider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Effect to check if user is already authenticated
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

  /**
   * Login function
   * @param {string} accessToken - JWT access token
   * @param {string} refreshToken - JWT refresh token
   * @param {Object} userData - User data
   */
  const login = (accessToken, refreshToken, userData) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    setUser(userData);
    setError(null);
  };

  /**
   * Logout function
   */
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

  /**
   * Update current user information
   * @param {Object} userData - Updated user data
   */
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
