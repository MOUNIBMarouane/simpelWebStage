// AuthContext.js - Fixed version

// RefreshToken.js - Fixed version


// ProtectedRoute.js - Fixed version


// PublicRoute.js - Fixed version


// SignIn.js - Fixed version


// App.js - Fixed version
// AuthContext.jsx - Fixed version without useNavigate


// App.js - Fixed structure with proper Router context


// Layout.js - Wrap your Layout component with AuthProvider


// SignIn.js - Modified to work with the new AuthContext
import React, { useState, useContext } from "react";
import "./globales.css";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "../assets/icons/icons8-login-50.png";
import FormInput from "../components/FormInputs";
import { User, Lock } from "lucide-react";
import { AuthContext } from "../Auth/AuthContext";
import api from "../Auth/RefreshToken";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateAuth } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/Auth/login", {
        emailOrUsername: email,
        password: password,
      });

      if (response.status === 200) {
        // Pass the navigate function as a callback
        updateAuth(response.data, navigate);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
        "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same
};