import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { AuthProvider } from "./Auth/AuthContext";
// import ProtectedRoute from "./Auth/ProtectedRoute";
// import PublicRoute from "./Auth/PublicRoute";
import SignIn from "./pages/auth/Signin";
import SignUp from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import VerificationP from "./pages/auth/Verification";
import ResetPassword from "./pages/auth/RestPassword";
import UpdatePassword from "./pages/auth/UpdatePassword";
import Layout from "./components/dashboard/layout/layout";
import Documents from "./pages/Document";
import UsersList from "./pages/UserManagment/UsersList";
import ProfileEdit from "./pages/editProfile";
import DocumentDetail from "./pages/DocumentDetail";
import LineDetail from "./pages/LineDetail";
import VerificationWelcome from "./pages/auth/VerificationWelcome";
import Welcome from "./pages/auth/Welcome";
import WelcomeEmd from "./pages/auth/Welcome";
import UserDetails from "./pages/UserManagment/UserDetails";

// Define the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <PublicRoute>
      <SignIn />
      // </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      // <PublicRoute>
      <SignUp />
      // </PublicRoute>
    ),
  },
  {
    path: "/verify/:email",
    element: (
      // <PublicRoute>
      <VerificationP />
      // </PublicRoute>
    ),
  },
  {
    path: "/welcome-verify/:email",
    element: (
      // <PublicRoute>
      <VerificationWelcome />
      // </PublicRoute>
    ),
  },
  {
    path: "/welcome/:email",
    element: (
      // <PublicRoute>
      <Welcome />
      // </PublicRoute>
    ),
  },
  {
    path: "/welcome-end",
    element: (
      // <PublicRoute>
      <WelcomeEmd />
      // </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      // <PublicRoute>
      <ResetPassword />
      // </PublicRoute>
    ),
  },
  {
    path: "/update-password/:email",
    element: (
      // <PublicRoute>
      <UpdatePassword />
      // </PublicRoute>
    ),
  },
  {
    element: <Layout />, // Layout for protected routes
    children: [
      {
        path: "/dashboard",
        element: (
          // <ProtectedRoute>
          <Dashboard />
          // </ProtectedRoute>vbrf
        ),
      },
      {
        path: "/documents",
        element: (
          // <ProtectedRoute>
          <Documents />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/DocumentDetail/:idDoc",
        element: (
          // <ProtectedRoute>
          <DocumentDetail />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/DocumentDetail/:idDoc/:idLine",
        element: (
          // <ProtectedRoute>
          <LineDetail />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/users-list",
        element: (
          // <ProtectedRoute>
          <UsersList />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/users-profile",
        element: (
          // <ProtectedRoute>
          <ProfileEdit />
          // </ProtectedRoute>
        ),
      },
      {
        path: "/user-details/:userId",
        element: (
          // <ProtectedRoute>
          <UserDetails />
          // </ProtectedRoute>
        ),
      },
    ],
  },
]);

// App component
function App() {
  return (
    // <AuthProvider>
    <RouterProvider router={router} />
    // </AuthProvider>
  );
}

export default App;
