import "../globales.css";
import React, { useState } from "react";
import FormInput from "../../components/FormInputs";
import { Lock, Eye, EyeClosed } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    cpassword: "",
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { email } = useParams();

  const validatePassword = (password = "") => {
    const errors = [];
    if (password.length < 8)
      errors.push("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password))
      errors.push("Must include at least one uppercase letter.");
    if (!/[a-z]/.test(password))
      errors.push("Must include at least one lowercase letter.");
    if (!/\d/.test(password)) errors.push("Must include at least one number.");
    if (!/[@$!%*?&]/.test(password))
      errors.push("Must include at least one special character (@$!%*?&).");
    return errors;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "newPassword") {
      setValidationErrors(validatePassword(value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const errors = validatePassword(formData.newPassword);
    if (errors.length > 0) {
      setError("Please meet all password requirements.");
      return;
    }

    if (formData.newPassword !== formData.cpassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5204/api/Account/update-password",
        { email, newPassword: formData.newPassword }
      );

      if (response.status === 200) {
        setMessage("Your password has been successfully updated.");
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (err) {
      setError("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="signin-container bg-image w-full h-full flex justify-center place-items-center text-white">
      <div className="bg-black/60 w-4/12 backdrop-blur-md rounded-lg p-6">
        <h2 className="text-bold text-[24px] text-center pb-3">
          Update Your Password
        </h2>

        <div className="w-full max-w-md mx-auto p-2">
          <FormInput
            id="newPassword"
            type={showPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="New Password"
            required
            icon={Lock}
            rightIcon={showPassword ? EyeClosed : Eye}
            onRightIconClick={() => setShowPassword((prev) => !prev)}
          />

          {validationErrors.length > 0 && (
            <div className="text-red-400 text-sm mt-2">
              <ul className="list-disc pl-5">
                {validationErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <FormInput
            id="cpassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.cpassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            required
            icon={Lock}
            rightIcon={showConfirmPassword ? EyeClosed : Eye}
            onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center mt-3">{error}</div>
        )}
        {message && (
          <div className="text-green-400 text-sm text-center mt-3">
            {message}
          </div>
        )}

        <div className="w-full max-w-md mx-auto p-2 pt-4 flex justify-center place-items-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className={`btn ${
              validationErrors.length > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={validationErrors.length > 0}
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
