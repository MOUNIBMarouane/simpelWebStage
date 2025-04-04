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
          // Fetch complete user data from the server
          const userData = await getUserAccount();
          if (userData) {
            console.log("Retrieved user data on init:", userData);
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

  // Login function - now properly stores user data
  const login = async (accessToken, refreshToken, userData) => {
    console.log("AuthContext.login called with:", { accessToken, userData });

    // Store tokens
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    // Set the user data in state
    setUser(userData);
    setError(null);

    // If we only have minimal user data, fetch complete profile
    if (!userData.firstName || !userData.lastName || !userData.role) {
      try {
        console.log("Fetching complete user profile after login");
        const completeUserData = await getUserAccount();
        if (completeUserData) {
          console.log("Retrieved complete user data:", completeUserData);
          setUser(completeUserData);
        }
      } catch (err) {
        console.error("Error fetching complete user data:", err);
        // We continue with partial user data rather than failing
      }
    }

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
