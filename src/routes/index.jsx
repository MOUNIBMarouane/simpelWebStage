// src/routes/index.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout Components
import MainLayout from "../components/layout/MainLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Verification from "../pages/auth/Verification";
import VerificationWelcome from "../pages/auth/VerificationWelcome";
import UpdatePassword from "../pages/auth/UpdatePassword";
import Welcome from "../pages/auth/Welcome";
import ResetPassword from "../pages/auth/RestPassword";

// Dashboard Pages
import Dashboard from "../pages/Dashboard";
import SettingsPage from "../pages/UserManagment/SettingsPage";

// Document Pages
import Documents from "../pages/documents/index";
import DocumentDetail from "../pages/documents/DocumentDetail";
import DocumentTypes from "../pages/documents/DocumentTypes";

// Circuit Pages
import CircuitManagement from "../pages/CircuitManagement";
import CircuitDetail from "../pages/CircuitDetails";

// User Management Pages
import UsersList from "../pages/users/UsersList";
import UserDetails from "../pages/users/UserDetails";
import Profile from "../pages/users/Profile";
import UsersUpdate from "../pages/UserManagment/UsersUpdate";
import LineDetail from "../pages/LineDetail";

// Route Guards
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

/**
 * Main Router Component
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/verify/:email"
        element={
          <PublicRoute>
            <Verification />
          </PublicRoute>
        }
      />

      <Route
        path="/welcome-verify/:email"
        element={
          <PublicRoute>
            <VerificationWelcome />
          </PublicRoute>
        }
      />

      <Route
        path="/welcome/:email"
        element={
          <PublicRoute>
            <Welcome />
          </PublicRoute>
        }
      />

      <Route
        path="/welcome-end"
        element={
          <PublicRoute>
            <Welcome />
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      <Route
        path="/update-password/:email"
        element={
          <PublicRoute>
            <UpdatePassword />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Document Routes */}
        <Route path="/documents" element={<Documents />} />
        <Route path="/type-document" element={<DocumentTypes />} />
        <Route path="/DocumentDetail/:idDoc" element={<DocumentDetail />} />
        <Route path="/DocumentDetail/:idDoc/:idLine" element={<LineDetail />} />

        {/* Circuit Routes */}
        <Route path="/circuit" element={<CircuitManagement />} />
        <Route path="/circuit-details/:circuitId" element={<CircuitDetail />} />

        {/* User Management Routes */}
        <Route path="/users-list" element={<UsersList />} />
        <Route path="/user-profile" element={<Profile />} />
        <Route path="/user-details/:userId" element={<UserDetails />} />
        <Route path="/user-update/:userId" element={<UsersUpdate />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
