import "../globales.css";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "../../assets/icons/icons8-login-50.png";
import React, { useState } from "react";
import FormInput from "../../components/common/Form/Input/index";
import { User, Lock } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.1.94:5204/api/Auth/login",
        {
          emailOrUsername: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Login successful:", response.data);

        // Use the login function from AuthContext
        // In Login.jsx handleSubmit function
        console.log("Before login call:", {
          accessToken: response.data.accessToken,
        });
        login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user || { username: email } // Pass user data if available
        );
        console.log("After login call, about to navigate");

        // Navigate to dashboard after login
        navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data || "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container bg-image w-full h-full flex justify-center place-items-center text-white">
      <div className="bg-black/60 w-full  md:w-4/12 backdrop-blur-md rounded-lg p-6">
        <div className="w-full flex-col place-items-center pb-3">
          <h2 className="text-bold text-[24px]">Sign In</h2>
          <br />
          <img
            width="50"
            height="50"
            src={Avatar}
            alt="user-male-circle"
            className="fill-white"
          />
        </div>
        <div>
          <div className="">
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                icon={User}
              />
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
                required
                icon={Lock}
              />
            </div>
          </div>
          {error && (
            <div className="w-full max-w-md mx-auto p-2 pt-4 text-red-500">
              {error}
            </div>
          )}
          <div className="w-full max-w-md mx-auto p-2 pt-4 flex justify-between place-items-center">
            <Link
              to="/forgot-password"
              className="text-[12px] text-blue-400 hover:text-blue-300"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="w-full max-w-md mx-auto p-2 pt-4 flex justify-between place-items-center">
            <label className="text-[12px]">
              I don't have an account.{" "}
              <Link to="/signup">
                <span>register</span>
              </Link>
            </label>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
