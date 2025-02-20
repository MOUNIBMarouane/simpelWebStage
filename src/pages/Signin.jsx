import "./globales.css";
import Avatar from "../assets/icons/icons8-login-50.png";
import React, { useState } from "react";
import FormInput from "../components/FormInputs";
import { Mail, User, Lock, Phone, Link, Calendar } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle sign in logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="signin-container bg-image  w-full h-full flex justify-center  place-items-center text-white">
      <div className=" bg-black/60 w-4/12 backdrop-blur-md h-2/3 rounded-lg p-6">
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
        <form onSubmit={handleSubmit}>
          <div className="">
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                icon={User}
              />
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
                label="Password"
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
          <div className="w-full max-w-md mx-auto p-2 pt-4 flex justify-between place-items-center place-items-center">
            <label className="text-[12px]">
              I didn't have an account. <span>register</span>
            </label>
            <button type="submit">LOGIN</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
