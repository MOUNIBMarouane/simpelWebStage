// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Private Route component - protects routes that require authentication
 *
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components
 * @returns {JSX.Element} Protected route
 */
const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return children;
};

export default PrivateRoute;
