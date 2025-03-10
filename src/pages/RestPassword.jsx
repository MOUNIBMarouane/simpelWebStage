import "./globales.css";

import React, { useState } from "react";
import FormInput from "../components/FormInputs";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    // Handle sign in logic here
    console.log("Email:", email);
    const response = await axios.post(
      "http://192.168.1.59:5204/api/Account/forgot-password",
      {
        email,
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
          <h2 className="text-bold text-[24px]">Reset your Password</h2>
          <br />
        </div>
        <div>
          <div className="">
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
