import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeClosed, Mail, User, Lock, Key } from "lucide-react";
import FormInput from "../components/FormInputs";
import { useEffect } from "react";
import axios from "axios";
import { FindUserName } from "../service/authService";

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
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  const [nameValidations, setNameValidations] = useState({
    firstName: { length: false, format: false },
    lastName: { length: false, format: false },
    username: { length: false, format: false },
  });

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "PasswordHash") {
      validatePassword(value);
    } else if (id === "firstName" || id === "lastName" || id === "username") {
      validateName(id, value);
    }
  };

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };
    setPasswordValidations(validations);

    return Object.values(validations).every(Boolean);
  };

  const validateName = (field, value) => {
    let validations;

    if (field === "username") {
      validations = {
        length: value.length >= 3,
        format: /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/.test(value), // Allows letters, numbers, `_`, `-` (not at start or end)
      };
    } else {
      validations = {
        length: value.length >= 3,
        format: /^[a-zA-Z]+$/.test(value), // Only letters for firstName and lastName
      };
    }
    setNameValidations((prev) => ({
      ...prev,
      [field]: validations,
    }));
  };

  const handleNext = async () => {
    if (
      step === 1 &&
      (!formData.firstName || !formData.lastName || !formData.username)
    ) {
      console.log(FindUserName(formData.username));
      alert("Please fill in all fields");
      return;
    } else {
      console.log("try to get user name");
      try {
        console.log("Checking if username exists...");

        const usernameExists = await FindUserName(formData.username); // Await API call

        if (!usernameExists) {
          // Stop the process if username is taken
          alert("Username is already taken. Please choose another.");
          return;
        }
      } catch (error) {
        console.error("Error checking username:", error);
        alert(
          "An error occurred while checking the username. Please try again."
        );
        return;
      }
    }
    if (
      step === 2 &&
      (!formData.email || !formData.PasswordHash || !formData.cpassword)
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (step === 2 && formData.PasswordHash !== formData.cpassword) {
      alert("Passwords don't match");
      return;
    }
    if (step === 2 && !validatePassword(formData.PasswordHash)) {
      setPasswordError(
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character."
      );
      return;
    }
    setPasswordError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      PasswordHash: formData.PasswordHash,
    };

    try {
      const response = await axios.post(
        "http://192.168.1.85:5204/api/Auth/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            AdminSecret: formData.secretkey,
          },
        }
      );

      if (response.status === 200) {
        navigate(`/verify/${formData.email}`);
      } else {
        console.error("Registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const isNextDisabled = () => {
    if (step === 1) {
      return !(
        (
          formData.firstName &&
          formData.lastName &&
          formData.username &&
          nameValidations.firstName.length &&
          nameValidations.firstName.format &&
          nameValidations.lastName.length &&
          nameValidations.lastName.format &&
          nameValidations.username.length &&
          nameValidations.username.format
        )
        // FindUserName(nameValidations.username)
      );
    }

    if (step === 2) {
      return !(
        (
          formData.email &&
          formData.PasswordHash &&
          formData.cpassword &&
          formData.PasswordHash === formData.cpassword &&
          Object.values(passwordValidations).every(Boolean)
        ) // Ensures all validations pass
      );
    }

    return false; // Step 3 doesn't need validation
  };

  useEffect(() => {
    validatePassword(formData.PasswordHash);
  }, [formData.PasswordHash]);

  useEffect(() => {
    validateName("firstName", formData.firstName);
    validateName("lastName", formData.lastName);
    validateName("username", formData.username);
  }, [formData.firstName, formData.lastName, formData.username]);
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                <FormInput
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                  icon={User}
                />
                <p
                  className={`text-sm mt-2 ${
                    nameValidations.firstName.length &&
                    nameValidations.firstName.format
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {nameValidations.firstName.length
                    ? nameValidations.firstName.format
                      ? "Valid name!"
                      : "Only letters allowed"
                    : "Name must be at least 3 characters"}
                </p>
              </div>
              <div className="w-1/2">
                <FormInput
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                  icon={User}
                />
                <p
                  className={`text-sm mt-2 ${
                    nameValidations.lastName.length &&
                    nameValidations.lastName.format
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {nameValidations.lastName.length
                    ? nameValidations.lastName.format
                      ? "Valid name!"
                      : "Only letters allowed"
                    : "Name must be at least 3 characters"}
                </p>
              </div>
            </div>
            <FormInput
              id="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
              icon={User}
            />
            <p
              className={`text-sm mt-2 ${
                nameValidations.username.length &&
                nameValidations.username.format
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {nameValidations.username.length
                ? nameValidations.username.format
                  ? "Valid name!"
                  : "Only letters allowed"
                : "Name must be at least 3 characters"}
            </p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Account Security</h3>
            <FormInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              icon={Mail}
            />

            <FormInput
              id="PasswordHash"
              type={showPassword ? "text" : "password"}
              value={formData.PasswordHash}
              onChange={handleInputChange}
              placeholder="Password"
              required
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye} // Toggle icon
              onRightIconClick={togglePasswordVisibility} // Handle click
            />

            <FormInput
              id="cpassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.cpassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              required
              icon={Lock}
              rightIcon={showConfirmPassword ? EyeOff : Eye} // Toggle icon
              onRightIconClick={toggleConfirmPasswordVisibility} // Handle click
            />
            <div className="text-sm text-gray-400 transition-all">
              <p>Password must include:</p>
              <ul>
                <li
                  className={
                    passwordValidations.length ? "text-green-500" : "text-white"
                  }
                >
                  At least 8 characters
                </li>
                <li
                  className={
                    passwordValidations.uppercase
                      ? "text-green-500"
                      : "text-white"
                  }
                >
                  An uppercase letter
                </li>
                <li
                  className={
                    passwordValidations.lowercase
                      ? "text-green-500"
                      : "text-white"
                  }
                >
                  A lowercase letter
                </li>
                <li
                  className={
                    passwordValidations.digit ? "text-green-500" : "text-white"
                  }
                >
                  A digit
                </li>
                <li
                  className={
                    passwordValidations.specialChar
                      ? "text-green-500"
                      : "text-white"
                  }
                >
                  A special character (@$!%*?&)
                </li>
              </ul>
            </div>
            {passwordError && (
              <div className="text-white text-sm">{passwordError}</div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
              Administrative Access
            </h3>
            <FormInput
              id="secretkey"
              type="text"
              value={formData.secretkey}
              onChange={handleInputChange}
              placeholder="Secret Key (Optional)"
              icon={Key}
            />
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className=" grad-bg bg-image w-full h-full flex justify-center place-items-center text-white">
      <div className="bg-grade bg-black/60 backdrop-blur-md p-6 md:w-6/12 lg:w-6/12 rounded">
        <div className="w-full flex-col place-items-center pb-6">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full ${
                  step >= num ? "bg-blue-500" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {renderStep()}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition-colors"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors ml-auto"
                disabled={isNextDisabled()}
              >
                Next {step}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition-colors ml-auto"
              >
                Complete Signup
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
