import "../globales.css";
import React, { useState } from "react";
import FormInput from "../../components/FormInputs";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // Success message state
  const [error, setError] = useState(""); // Error message state
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post(
        "http://192.168.1.94:5204/api/Account/forgot-password",
        { email }
      );

      if (response.status === 200) {
        setMessage("A reset password link has been sent to your email.");
        setError(""); // Clear any previous errors
      }
    } catch (err) {
      setError(
        "Failed to send request. Please check your email and try again."
      );
      setMessage(""); // Clear success message if there's an error
    }
  };

  return (
    <div className="signin-container bg-image w-full h-full flex justify-center place-items-center text-white">
      <div className="bg-black/60 w-4/12 backdrop-blur-md rounded-lg p-6">
        <div className="w-full flex-col place-items-center pb-3">
          <h2 className="text-bold text-[24px]">Reset your Password</h2>
          <br />
        </div>

        <div>
          <div className="w-full max-w-md mx-auto p-2">
            <FormInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              icon={User}
            />
          </div>

          {message && (
            <div className="text-green-400 text-sm text-center mt-3">
              {message}
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm text-center mt-3">{error}</div>
          )}

          <div className="w-full max-w-md mx-auto p-2 pt-4 flex justify-center place-items-center">
            <button type="submit" onClick={handleSubmit} className="btn">
              RESET
            </button>
          </div>

          {message && (
            <div className="flex justify-center mt-4">
              <button
                className="text-blue-400 underline"
                onClick={() => navigate("/")}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
