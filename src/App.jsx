// src/App.jsx

import React, { Suspense } from "react";
import AppRouter from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

/**
 * Main App Component
 * This is the root component of the application that sets up the router
 * and global context providers
 */
const App = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AppRouter />
    </Suspense>
  );
};

export default App;
