import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import SignIn from "./pages/Signin";
import SignUp from "./pages/signup";
import VerificationP from "./pages/Verification";
// import ErrorBoundary from "./components/ErrorBoundary";
// import { AuthProvider } from "./Auth/AuthContext";
// import ProtectedRoute from "./Auth/ProtectedRoute"; // ✅ Import ProtectedRoute
import Layout from "./components/dashboard/layout/layout";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/RestPassword";
import Documents from "./pages/Document";
import UsersList from "./pages/UsersList";
import UpdatePassword from "./pages/UpdatePassword";
// import PublicRoute from "./Auth/PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    element: <Layout />, // ✅ Protect everything inside Layout
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
        path: "/users-list", // ✅ Lowercase path
        element: (
          // <ProtectedRoute>
          <UsersList />
          // </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/verify/:email",
    element: <VerificationP />,
  },
  {
    path: "/forgot-password",
    element: <ResetPassword />,
  },
  {
    path: "/update-password/:email",
    element: <UpdatePassword />,
  },
]);

function App() {
  return (
    <div className="w-[100vw] h-[100vh]">
      {/* <AuthProvider> */}
      {/* <ErrorBoundary fallback={<p>Something went wrong</p>}> */}
      <RouterProvider router={router} />
      {/* </ErrorBoundary> */}
      {/* </AuthProvider> */}
    </div>
  );
}

export default App;
