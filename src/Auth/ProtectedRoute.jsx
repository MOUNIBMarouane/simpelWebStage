import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Adjust if needed

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Get user authentication status

  if (!user) {
    return <Navigate to="/signin" replace />; // Redirect if not logged in
  }

  return children;
};

export default ProtectedRoute;
