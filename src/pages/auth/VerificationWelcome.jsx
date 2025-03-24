import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners";

const VerificationWelcome = () => {
  const { email } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleResendCode = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5204/api/Account/resend-code",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status !== 200)
        throw new Error(response.data?.message || "Resend failed");
      alert("Verification code has been resent to your email");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to resend code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-image w-full min-h-screen flex justify-center items-center text-white">
      <div className="relative w-full max-w-md mx-4">
        {/* Animated Checkmark */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            showContent ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="animate-checkmark bg-white rounded-full">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div
          className={`bg-black/60 backdrop-blur-md rounded-lg p-8 transition-opacity duration-1000 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-xl font-bold mb-4">
              Your account is registred succefully!
            </h2>
            <p className="text-center text-md mb-6">
              We've sent a verification code to
            </p>
            <p className="text-blue-300 break-all text-center mb-6">{email}</p>
            <p className="text-center text-lg">
              Please check your email to continue.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-4 w-full ">
            <Link to={`/verify/${email}`}>
              <div
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white  py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Go to verify
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add these styles to your CSS file or CSS-in-JS
const styles = `
@keyframes scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes draw {
  100% { stroke-dashoffset: 0; }
}

.animate-checkmark {
  animation: scale 1s ease-in-out;
}

.checkmark__circle {
  stroke: #4bb543;
  stroke-width: 2;
  animation: draw 1s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke: #4bb543;
  stroke-width: 2;
  animation: draw 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
}

.checkmark {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #4bb543;
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default VerificationWelcome;
