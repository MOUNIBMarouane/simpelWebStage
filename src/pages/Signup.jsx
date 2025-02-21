import "./globales.css";

import { useNavigate, Link } from "react-router-dom";

import Avatar from "../assets/icons/icons8-login-50.png";
import InputUI from "../components/inputs/InputUI";
import React, { useState } from "react";
import FormInput from "../components/FormInputs";
import { Mail, User, Lock } from "lucide-react";

const SignIn = () => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [PasswordHash, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle sign in logic here
    if (
      firstName &&
      lastName &&
      username &&
      email &&
      PasswordHash &&
      PasswordHash == cpassword
    ) {
      console.log("Email:", email);
      console.log("Password:", PasswordHash);
      // /api/Auth/registe
      const userData = {
        firstName,
        lastName,
        username,
        email,
        PasswordHash,
      };

      try {
        console.log(userData);
        const response = await fetch(
          "http://192.168.1.85:5204/api/Auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        );

        navigate(`/verify/${email}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Registration successful:", data);
          // Handle successful registration (e.g., redirect to login page)
        } else {
          console.error("Registration failed:", response.statusText);
          // Handle registration failure (e.g., show error message)
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle network or other errors
      }
    }
  };

  return (
    <div className="grad-bg bg-image  w-full h-full flex justify-center place-items-center text-white flex">
      <div className=" bg-grade  backdrop-blur-md p-6 md:w-6/12 lg:w-6/12 rounded">
        <div className="w-full flex-col place-items-center pb-6">
          <h2 className="text-[24px] font-bold">Sign Up</h2>
          <br />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="">
            <div className="w-full max-w-md mx-auto flex justify-between">
              <div className="w-6/12">
                <div className="w-full max-w-md mx-auto p-2">
                  <FormInput
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                    placeholder="First Name"
                    required
                    icon={User}
                  />
                </div>
              </div>
              <div className="w-6/12">
                <div className="w-full max-w-md mx-auto p-2">
                  <FormInput
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                    icon={User}
                  />
                </div>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="User Name"
                required
                icon={User}
              />
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                icon={Mail}
              />
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                id="password"
                type="password"
                value={PasswordHash}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                icon={Lock}
              />
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                id="cpassword"
                type="password"
                value={cpassword}
                onChange={(e) => setCPassword(e.target.value)}
                placeholder="Confirmation Password"
                required
                icon={Lock}
              />
            </div>
          </div>
          <div className="w-full max-w-md mx-auto p-2 pt-4 flex justify-between place-items-center">
            <label className="text-sm">
              I have alredy an account.{" "}
              <Link to="/sigin">
                <span>login</span>
              </Link>
            </label>
            <button type="submit">Sign Up</button>
          </div>
        </form>
        {/* <InputUI /> */}
      </div>
    </div>
  );
};

export default SignIn;
