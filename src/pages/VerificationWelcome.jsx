import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const  VerificationWelcome = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [isLoadings, setIsLoadings] = useState(false);





  const handleResendCode = async () => {
    setError("");
    setIsLoadings(true);

    try {
      const response = await axios.post(
        "http://localhost:5204/api/Account/resend-code",
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
          <h2 className="text-2xl font-bold mb-4">Welcome</h2>
          <p className="text-center text-sm mb-6">
            The Authnetification complete and We sent a verification code to
            your email {email}. Please contenu the verification
          </p>
        </div>
        <div>

        </div>
        <div className="flex flex-col items-center gap-4">
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
      </div>
    </div>
  );
};

export default VerificationWelcome;
