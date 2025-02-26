import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../navBar/NavBar";
import { getUserAccount } from "../../../service/authService";

function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserAccount();
      if (userData) {
        setUser(userData);
      } else {
        navigate("/signin");
      }
    };

    fetchUser();
  }, [navigate]);

  // 🔹 Logout Function
  const handleLogout = () => {
    // Clear user session (replace this with your actual logout logic)
    localStorage.removeItem("accessToken"); // If using tokens
    setUser(null);
    navigate("/signin"); // Redirect to login page
  };

  return (
    <div className="flex w-full h-full bg-gray-700">
      <div className="h-full w-2/12 bg-gray-900">
        <div className="w-full h-3/12 flex flex-col justify-center space-y-2">
          <div className="w-full flex flex-col justify-center items-center">
            <Avatar sx={{ width: 56, height: 56 }} />
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
        <Outlet/>
      </div>
    </div>
  );
}

export default Layout;
