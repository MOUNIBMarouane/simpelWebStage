import React, { createContext, useState, useEffect, useRef } from "react";
// import axios from "axios";
// import api from "../compoenets/refreshAccessToken";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    nickname: null,
    email: null,
    id: null,
    state: "inactive",
  });
  const updateAuth = (data) => {
    if (data === "Logout successful") {
      setAuth({
        user: null,
        nickname: null,
        email: null,
        id: null,
        state: "inactive",
      });
      navigate("/login");
    } else {
      setAuth({
        user: data.username,
        nickname: data.nickname,
        email: data.email,
        id: data.id,
        image: data.image,
        state: "active",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        updateAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
