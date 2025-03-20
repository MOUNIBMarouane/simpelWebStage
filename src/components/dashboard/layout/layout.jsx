import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../navBar/NavBar";
import { authLogout, getUserAccount } from "../../../service/authService";
import { Link } from "react-router-dom";
import { ExpandMore, Notifications, Search } from "@mui/icons-material";

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
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex w-full h-full rounded-3xl  gap-2 p-2 backdrop-blur-md shadow-lg">
      <div className="h-full w-2/12 rounded-lg bg-blue-950/55">
        <div className="w-full h-3/12 flex flex-col justify-center space-y-2 space-x-2">
          <div className="w-full flex flex-col justify-center items-center">
            <Link to="/user-profile">
              <Avatar
                sx={{ width: 56, height: 56 }}
                src={user?.profilePicture}
              />
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
        <div className="w-full h-9/12 p-2  shadow-lg">
          {/* Pass logout function to NavBar */}
          <NavBar userRole={user?.role} onLogout={handleLogout} />
        </div>
      </div>
      <div className="w-full h-full bg-dash">
        {/* top bar of dash board */}
        <div className="w-full h-full flex  flex-col justify-between  bg-dash">
          {/* Updated Top Bar */}
          <div className="w-full h-1/12 rounded-lg p-2 px-6 bg-blue-950/50 flex items-center justify-between ">
            {/* Left Section */}
            <div className="flex flex-col">
              <h2 className="text-white text-xl font-semibold">
                Good Morning, {user?.username || "User"}
              </h2>
              <p className="text-gray-300 text-sm">{formattedDate}</p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="flex items-center bg-blue-950/30 rounded-full px-4 py-2">
                {/* <Search className="text-gray-400 mr-2" />Z */}
                <Search className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-white placeholder-gray-400"
                />
              </div>

              {/* Notifications */}
              <div className="text-gray-300 w-[36px] h-[36px] rounded-full flex justify-center items-center hover:text-white transition-colors bg-blue-900/75 border ">
                {/* <Notifications /> */}
                <Notifications />
              </div>

              {/* Profile Section */}
              <div className="flex items-center gap-2 bg-white/50 p-1 rounded-full">
                <Link to="/user-profile" className="flex items-center gap-2">
                  <Avatar
                    sx={{ width: 36, height: 36 }}
                    src={user?.profilePicture}
                    className="border-2 border-white"
                  />
                  <div className="text-white">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-gray-300 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  {/* <ExpandMore className="text-white" /> */}
                </Link>
                <ExpandMore
                  sx={{ width: 36, height: 36 }}
                  className="text-white bg-gray-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-11/12 bg-blue-950/70 mt-2 rounded-lg">
            <Outlet />
          </div>
        </div>
        {/* <div className="w-full h-11/12">
          <Outlet />
        </div> */}
      </div>
    </div>
  );
}

export default Layout;
