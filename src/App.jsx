import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { AuthProvider } from "./Auth/AuthContext";
// import ProtectedRoute from "./Auth/ProtectedRoute";
// import PublicRoute from "./Auth/PublicRoute";
import SignIn from "./pages/Signin";
import SignUp from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import VerificationP from "./pages/Verification";
import ResetPassword from "./pages/RestPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Layout from "./components/dashboard/layout/layout";
import Documents from "./pages/Document";
import UsersList from "./pages/UsersList";
import ProfileEdit from "./pages/editProfile";

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
          // </ProtectedRoute>
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
