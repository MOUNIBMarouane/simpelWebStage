import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Verification = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadings, setIsLoadings] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const inputRefs = Array(6)
    .fill(null)
    .map(() => useRef());

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError(""); // Clear any previous errors

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setError("Please enter a complete 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.59:5204/api/Auth/verify-email",
        {
          email: email,
          verificationCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = response.data;

      if (response.status !== 200) {
        throw new Error(
          data.message || `Verification failed (${response.status})`
        );
      }

      console.log("Verification successful:", data);
      navigate("/welcome");
    } catch (error) {
      console.error("Verification error:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred during verification. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setIsLoadings(true);

    try {
      const response = await axios.post(
        "http://192.168.1.59:5204/api/Account/resend-code",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = response.data;

      if (response.status !== 200) {
        throw new Error(
          data.message || `Failed to resend code (${response.status})`
        );
      }

      setCode(["", "", "", "", "", ""]);
      alert("Verification code has been resent to your email");
    } catch (error) {
      console.error("Resend error:", error);
      setError(
        error.response?.data?.message ||
          "Failed to resend verification code. Please try again."
      );
    } finally {
      setIsLoadings(false);
    }
  };

  return (
    <div className="bg-image w-full h-full flex justify-center place-items-center text-white">
      <div className="bg-black/60 w-full max-w-md backdrop-blur-md rounded-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Verify Your Account</h2>
          <p className="text-center text-sm mb-6">
            We sent a verification code to your email {email}. Please enter the
            6-digit code below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-white text-xl font-bold rounded-lg border-2 focus:border-blue-500 focus:outline-none bg-transparent"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4 p-2 bg-red-500/10 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={code.join("").length !== 6 || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>

            <div className="text-sm flex flex-col items-center gap-1">
              <div>Didn't receive the code?</div>
              <div
                type="button"
                className="text-blue-400 text-xl hover:text-blue-500 p-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleResendCode}
                disabled={isLoadings}
              >
                {isLoadings ? "Sending..." : "Resend Code"}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verification;
