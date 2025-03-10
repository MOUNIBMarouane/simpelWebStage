import "./globales.css";

import React, { useState } from "react";
import { useEffect } from "react";
import FormInput from "../components/FormInputs";
import { Lock, Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    cpassword: "",
  });
  const navigate = useNavigate();
  const { email } = useParams();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "PasswordHash") {
      validatePassword(value);
    }
  };
  const validatePassword = (password = "") => {
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
  useEffect(() => {
    if (formData.PasswordHash !== undefined) {
      validatePassword(formData.PasswordHash);
    }
  }, [formData.PasswordHash]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });

  useEffect(() => {
    validatePassword(formData.PasswordHash);
  }, [formData.PasswordHash]);
  const handleSubmit = async (event) => {
    // Handle sign in logic here
    event.preventDefault();
    console.log("Email:", email);
    const response = await axios.put(
      "http://192.168.1.59:5204/api/Account/update-password",
      {
        email,
        newPassword: formData.PasswordHash,
      }
    );

    if (response.status === 200) {
      console.log("hello");
      navigate("/");
    } else console.error("cheking");
  };

  return (
    <div className="signin-container bg-image  w-full h-full flex justify-center  place-items-center text-white">
      <div className=" bg-black/60 w-4/12 backdrop-blur-md rounded-lg p-6">
        <div className="w-full flex-col place-items-center pb-3">
          <h2 className="text-bold text-[24px]">Update your Password</h2>
          <br />
        </div>
        <div>
          <div className="">
            <div className="w-full max-w-md mx-auto p-2">
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
            </div>
          </div>
          <div className="w-full max-w-md mx-auto p-2 pt-4 flex justify-center place-items-center">
            <button type="submit" onClick={handleSubmit}>
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
