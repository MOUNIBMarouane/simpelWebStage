import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import VerificationP from "./pages/Verification";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./Auth/AuthContext";
// import PublicRoute from "./Auth/PublicRoute";
// import ProtectedRoute from "./Auth/ProtectedRoute";
import Layout from "./components/dashboard/layout/layout";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/RestPassword";
import Documents from "./pages/Document";
import EmployerList from "./pages/EmployerList";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <SignIn />,
      },
      {
        element: <Layout />,
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
            path: "/employer-list",
            element: (
              // <ProtectedRoute>
              <EmployerList />
              // </ProtectedRoute>
            ),
          },
        ],
      },
    ],
    errorElement: (
      <div className="font-bold border-l-4 h-screen bg-red-400 p-[50%]">
        404 Page Not Found
      </div>
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
    path: "/signin",
    element: (
      // <PublicRoute>
      <SignIn />
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
    path: "/update-password",
    element: (
      // <PublicRoute>
      <ResetPassword />
      // </PublicRoute>
    ),
  },
]);

function App() {
  return (
    <div className="w-[100vw] h-[100vh] bg-red-500">
      <AuthProvider>
        <ErrorBoundary fallback={<p>Something went wrong</p>}>
          {/* <Toaster /> */}
          <RouterProvider router={router} />
        </ErrorBoundary>
      </AuthProvider>
    </div>
  );
}

export default App;
