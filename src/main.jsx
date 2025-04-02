// src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Main entry point for the React application
 * This renders the App component into the DOM
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="w-full h-full">
      <App />
    </div>
  </StrictMode>
);
