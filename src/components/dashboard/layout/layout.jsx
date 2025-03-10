import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../navBar/NavBar";
import { authLogout, getUserAccount } from "../../../service/authService";
import { Link } from "react-router-dom";

function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserAccount();
      if (userData) {
        setUser(userData);
      } else {
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);
  useEffect(() => {
    window.testLogout = handleLogout;
  }, []);
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    console.log("Before logout, refresh token:", refreshToken); // Debugging line

    if (!refreshToken) {
      console.warn("Refresh token is missing before calling logout!");
    } else {
      await authLogout(user?.userid); // Call before removing the token
    }

    // Remove tokens after logout attempt
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refresh_token");

    setUser(null);
    navigate("/");
  };

  return (
    <div className="flex w-full h-full bg-gray-700">
      <div className="h-full w-2/12 bg-gray-900">
        <div className="w-full h-3/12 flex flex-col justify-center space-y-2">
          <div className="w-full flex flex-col justify-center items-center">
            <Link to="/users-profile">
              <Avatar sx={{ width: 56, height: 56 }} />
            </Link>
            <div className="text-center">
              {user ? (
                <>
                  <p className="text-white">{user?.username || user?.email}</p>
                  <p className="text-white capitalize">{user?.role}</p>
                </>
              ) : (
                <p className="text-gray-400">Not logged in</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-9/12 p-2 bg-gray-900">
          {/* Pass logout function to NavBar */}
          <NavBar userRole={user?.role} onLogout={handleLogout} />
        </div>
      </div>
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
