import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create context
export const AuthContext = createContext(); // ✅ Named export

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      fetchUserData(storedAccessToken);
    }
  }, []);

  const login = async (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    await fetchUserData(access);
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(
        "http://192.168.1.85:5204/api/Account/user-info",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Named export for AuthContext and default export for AuthProvider
export default AuthProvider;
