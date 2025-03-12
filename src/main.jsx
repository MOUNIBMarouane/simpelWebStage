import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
// import { AuthProvider } from "./Auth/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="w-full h-full">
      <App />
    </div>
  </StrictMode>
);
