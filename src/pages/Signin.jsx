import "./globales.css";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "../assets/icons/icons8-login-50.png";
import React, { useState } from "react";
import FormInput from "../components/FormInputs";
import { User, Lock } from "lucide-react";
import axios from "axios";
// import { useContext } from "react";
// import AuthContext from "../Auth/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setError("");

  //   try {
  //     const response = await axios.post(
  //       "http://192.168.1.85:5204/api/Auth/login",
  //       {
  //         emailOrUsername: email,
  //         password: password,
  //       }
  //     );

  //     if (response.status === 200) {
  //       console.log("Login successful:", response.data);
  //       navigate("/dashboard");
  //     } else {
  //       setError("Login failed. Please check your credentials and try again.");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setError(
  //       error.response?.data?.message ||
  //         "An error occurred during login. Please try again."
  //     );
  //   }
  // };

  // const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://192.168.1.85:5204/api/Auth/login",
        {
          emailOrUsername: email,
          password: password,
        }
      );

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        // login(
        //   response.data.user,
        //   response.data.accessToken,
        //   response.data.refreshToken
        // );
        localStorage.setItem("accessToken", response.data.accessToken);
        // console.log(response.data);

        navigate("/dashboard");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred during login. Please try again."
      );
    }
  };

  return (
    <div className="signin-container bg-image w-full h-full flex justify-center place-items-center text-white">
      <div className="bg-black/60 w-full  md:w-4/12 backdrop-blur-md rounded-lg p-6">
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
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                icon={User}
              />
            </div>
            <div className="w-full max-w-md mx-auto p-2">
              <FormInput
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
          {error && (
            <div className="w-full max-w-md mx-auto p-2 pt-4 text-red-500">
              {error}
            </div>
          )}
          <div className="w-full max-w-md mx-auto p-2 pt-4 flex justify-between place-items-center">
            <Link
              to="/forgot-password"
              className="text-[12px] text-blue-400 hover:text-blue-300"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="w-full max-w-md mx-auto p-2 pt-4 flex justify-between place-items-center">
            <label className="text-[12px]">
              I didn't have an account.{" "}
              <Link to="/signup">
                <span>register</span>
              </Link>
            </label>
            <button type="submit">LOGIN</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
