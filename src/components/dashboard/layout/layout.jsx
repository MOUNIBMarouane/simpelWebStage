import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../navBar/NavBar";
import { getUserAccount } from "../../../service/authService";

function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // For redirecting if no user is found

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserAccount();
      if (userData) {
        setUser(userData);
      } else {
        // If no user, redirect to login page
        navigate("/signin");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="flex w-full h-full bg-gray-700">
      <div className="h-full w-2/12 bg-gray-900">
        <div className="w-full h-3/12 flex flex-col justify-center space-y-2">
          <div className="w-full flex flex-col justify-center">
            <Avatar sx={{ width: 56, height: 56 }} />
            <div>
              {user ? (
                <p className="text-white">{user.username || user.email}</p>
              ) : (
                <p className="text-gray-400">Not logged in</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-9/12 p-2 bg-gray-900">
          <NavBar />
        </div>
      </div>
      <div className="w-full h-full bg-blue-800 overflow">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
