import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Key,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { FindUserName, FindUserMail } from "../../service/authService";
import "../globales.css";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    PasswordHash: "",
    cpassword: "",
    secretkey: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [secretKeyError, setSecretKeyError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usermailError, setUsermailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validations, setValidations] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: {
      length: false,
      uppercase: false,
      lowercase: false,
      digit: false,
      specialChar: false,
    },
    passwordsMatch: false,
  });

  const navigate = useNavigate();

  const validateName = (field, value) => {
    if (field === "firstName" || field === "lastName") {
      return value.length >= 2 && /^[a-zA-Z]+$/.test(value);
    } else if (field === "username") {
      return (
        value.length >= 3 &&
        /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/.test(value)
      );
    }
    return false;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const validationsCopy = { ...validations };

    validationsCopy.password.length = password.length >= 8;
    validationsCopy.password.uppercase = /[A-Z]/.test(password);
    validationsCopy.password.lowercase = /[a-z]/.test(password);
    validationsCopy.password.digit = /\d/.test(password);
    validationsCopy.password.specialChar = /[@$!%*?&]/.test(password);

    setValidations(validationsCopy);

    return Object.values(validationsCopy.password).every(Boolean);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate specific fields
    if (name === "firstName" || name === "lastName" || name === "username") {
      setValidations((prev) => ({
        ...prev,
        [name]: validateName(name, value),
      }));

      if (name === "username") {
        setUsernameError("");
      }
    } else if (name === "email") {
      setValidations((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
      setUsermailError("");
    } else if (name === "PasswordHash") {
      validatePassword(value);
      setPasswordError("");

      // Also check if passwords match
      if (formData.cpassword) {
        setValidations((prev) => ({
          ...prev,
          passwordsMatch: value === formData.cpassword,
        }));
      }
    } else if (name === "cpassword") {
      setValidations((prev) => ({
        ...prev,
        passwordsMatch: value === formData.PasswordHash,
      }));
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.username) {
        return;
      }

      if (
        !validations.firstName ||
        !validations.lastName ||
        !validations.username
      ) {
        return;
      }

      try {
        const usernameExists = await FindUserName(formData.username);
        if (!usernameExists) {
          setUsernameError("Username is already taken. Please choose another.");
          return;
        }
      } catch (error) {
        setUsernameError("Error checking username. Please try again.");
        return;
      }
    }

    if (step === 2) {
      if (!formData.email || !formData.PasswordHash || !formData.cpassword) {
        return;
      }

      if (
        !validations.email ||
        !Object.values(validations.password).every(Boolean) ||
        !validations.passwordsMatch
      ) {
        return;
      }

      try {
        const emailValid = await FindUserMail(formData.email);
        if (!emailValid) {
          setUsermailError("Email is already in use. Please use another.");
          return;
        }
      } catch (error) {
        setUsermailError("Error checking email. Please try again.");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    // Important: Prevent default form submission behavior
    if (e) e.preventDefault();

    console.log("Submit button clicked");

    setIsSubmitting(true);
    setSecretKeyError("");

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      PasswordHash: formData.PasswordHash,
    };

    console.log("Submitting user data:", userData);

    try {
      const response = await axios.post(
        "http://192.168.1.94:5204/api/Auth/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            AdminSecret: formData.secretkey || "", // Ensure it's not undefined
          },
        }
      );

      console.log("Registration response:", response);

      if (response.status === 200) {
        navigate(`/verify/${formData.email}`);
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (
        error.response?.data?.toLowerCase().includes("invalid admin secret.")
      ) {
        setSecretKeyError(
          "The secret key is incorrect. Please check and try again."
        );
      } else {
        console.error("Error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if Next button should be disabled
  const isNextDisabled = () => {
    if (step === 1) {
      return (
        !validations.firstName ||
        !validations.lastName ||
        !validations.username ||
        !!usernameError
      );
    }
    if (step === 2) {
      return (
        !validations.email ||
        !Object.values(validations.password).every(Boolean) ||
        !validations.passwordsMatch ||
        !!usermailError
      );
    }
    return false;
  };

  return (
    <div className="w-full h-full bg-image flex items-center justify-center p-4">
      <div className="relative max-w-md w-full bg-gray-900/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500"></div>

        {/* Progress indicator */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400 text-sm">
              Step {step} of 3:{" "}
              {step === 1
                ? "Personal Info"
                : step === 2
                ? "Security"
                : "Finish Up"}
            </p>

            <div className="flex justify-center mt-6 gap-4">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`rounded-full flex items-center justify-center ${
                    step >= num
                      ? "w-8 h-8 bg-blue-600 text-white"
                      : "w-8 h-8 bg-gray-700 text-gray-400"
                  } transition-all duration-300`}
                >
                  {step > num ? <CheckCircle size={16} /> : num}
                </div>
              ))}
            </div>
          </div>

          {/* Important: Wrap all content in a form element with onSubmit handler */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <label
                    className="w-full m-1 flex text-sm font-medium text-gray-300"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-800 border ${
                        formData.firstName
                          ? validations.firstName
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      placeholder="Enter your first name"
                    />
                    {formData.firstName && !validations.firstName && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        First name must contain only letters
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    className="w-full m-1 flex text-sm font-medium text-gray-300"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-800 border ${
                        formData.lastName
                          ? validations.lastName
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      placeholder="Enter your last name"
                    />
                    {formData.lastName && !validations.lastName && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        Last name must contain only letters
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    className="w-full m-1 flex text-sm font-medium text-gray-300"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-800 border ${
                        formData.username
                          ? validations.username && !usernameError
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      placeholder="Choose a username"
                    />
                    {usernameError ? (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {usernameError}
                      </p>
                    ) : formData.username && !validations.username ? (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        Username must be at least 3 characters (letters,
                        numbers, _ or -)
                      </p>
                    ) : formData.username && validations.username ? (
                      <p className="mt-1 text-xs text-green-500 flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Username looks good!
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Security */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <label
                    className="w-full m-1 flex text-sm font-medium text-gray-300"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-800 border ${
                        formData.email
                          ? validations.email && !usermailError
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      placeholder="Enter your email"
                    />
                    {usermailError ? (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        {usermailError}
                      </p>
                    ) : formData.email && !validations.email ? (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <AlertCircle size={12} className="mr-1" />
                        Please enter a valid email address
                      </p>
                    ) : formData.email && validations.email ? (
                      <p className="mt-1 text-xs text-green-500 flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Email looks good!
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    className="w-full m-1 flex text-sm font-medium text-gray-300"
                    htmlFor="PasswordHash"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="PasswordHash"
                      name="PasswordHash"
                      type={showPassword ? "text" : "password"}
                      value={formData.PasswordHash}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-2.5 bg-gray-800 border ${
                        formData.PasswordHash
                          ? Object.values(validations.password).every(Boolean)
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {formData.PasswordHash && (
                    <div className="mt-3 space-y-1.5">
                      <div className="flex gap-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-1/5 rounded-full ${
                                Object.values(validations.password).filter(
                                  Boolean
                                ).length > i
                                  ? "bg-blue-500"
                                  : "bg-gray-700"
                              }`}
                            ></div>
                          ))}
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        <div
                          className={`text-xs flex items-center ${
                            validations.password.length
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {validations.password.length ? (
                            <CheckCircle size={12} className="mr-1" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-gray-500 mr-1"></div>
                          )}
                          At least 8 characters
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            validations.password.uppercase
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {validations.password.uppercase ? (
                            <CheckCircle size={12} className="mr-1" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-gray-500 mr-1"></div>
                          )}
                          Uppercase letter
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            validations.password.lowercase
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {validations.password.lowercase ? (
                            <CheckCircle size={12} className="mr-1" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-gray-500 mr-1"></div>
                          )}
                          Lowercase letter
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            validations.password.digit
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {validations.password.digit ? (
                            <CheckCircle size={12} className="mr-1" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-gray-500 mr-1"></div>
                          )}
                          At least one number
                        </div>
                        <div
                          className={`text-xs flex items-center ${
                            validations.password.specialChar
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {validations.password.specialChar ? (
                            <CheckCircle size={12} className="mr-1" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-gray-500 mr-1"></div>
                          )}
                          Special character (@$!%*?&)
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    className="w-full m-1 flex text-sm font-medium text-gray-300"
                    htmlFor="cpassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="cpassword"
                      name="cpassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.cpassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-12 py-2.5 bg-gray-800 border ${
                        formData.cpassword
                          ? validations.passwordsMatch
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                            : "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                      } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formData.cpassword && !validations.passwordsMatch && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      Passwords don't match
                    </p>
                  )}
                  {formData.cpassword && validations.passwordsMatch && (
                    <p className="mt-1 text-xs text-green-500 flex items-center">
                      <CheckCircle size={12} className="mr-1" />
                      Passwords match!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Admin Key */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-800">
                  <h3 className="text-lg font-medium text-blue-300 mb-2 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Almost Done!
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Your account is ready to be created. If you have an admin
                    secret key, enter it below. Otherwise, leave it blank to
                    create a regular user account.
                  </p>
                </div>

                <div className="space-y-1">
                  <label
                    className="w-full m-1 flex text-sm font-medium text-gray-300"
                    htmlFor="secretkey"
                  >
                    Admin Secret Key (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="secretkey"
                      name="secretkey"
                      type="password"
                      value={formData.secretkey}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500"
                      placeholder="Enter admin key (if you have one)"
                    />
                  </div>
                  {secretKeyError && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {secretKeyError}
                    </p>
                  )}
                </div>

                <div className="mt-4 text-center text-gray-400 text-sm">
                  By clicking "Create Account", you agree to our Terms of
                  Service and Privacy Policy.
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Back
                </button>
              ) : (
                <div></div> // Empty div to maintain flex spacing
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className={`px-6 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    isNextDisabled()
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 focus:ring-blue-500"
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg hover:from-green-700 hover:to-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
