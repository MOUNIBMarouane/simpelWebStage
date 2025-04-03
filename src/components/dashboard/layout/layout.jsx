import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../navBar/NavBar";
import { Link } from "react-router-dom";
import { ExpandMore, Notifications, Search } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Settings, History, LogOut, UserCircle } from "lucide-react";
import { RxAvatar } from "react-icons/rx";
import { useAuth } from "../../../contexts/AuthContext";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

function Layout() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex w-full h-full rounded-3xl gap-2 p-2 backdrop-blur-md shadow-lg">
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
        <div className="w-full h-9/12 p-2 shadow-lg">
          {/* Pass logout function to NavBar */}
          <NavBar userRole={user?.role} onLogout={handleLogout} />
        </div>
      </div>
      <div className="w-full h-full bg-dash">
        {/* top bar of dash board */}
        <div className="w-full h-full flex flex-col justify-between bg-dash">
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
                <Search className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-white placeholder-gray-400"
                />
              </div>

              {/* Notifications */}
              <div className="text-gray-300 w-[36px] h-[36px] rounded-full flex justify-center items-center hover:text-white transition-colors bg-blue-900/75 border ">
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
                </Link>
                <Menu
                  animate={{
                    mount: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      },
                    },
                    unmount: {
                      y: 25,
                      opacity: 0,
                      transition: {
                        duration: 0.15,
                        ease: "easeIn",
                      },
                    },
                  }}
                  placement="bottom-end"
                >
                  <MenuHandler>
                    <div
                      aria-label="User menu"
                      className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
                    >
                      <ExpandMore
                        className="text-white"
                        sx={{
                          width: 24,
                          height: 24,
                          transition: "transform 200ms ease-in-out",
                        }}
                      />
                    </div>
                  </MenuHandler>

                  <MenuList className="min-w-[200px] p-2 bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl dark:bg-gray-800/90 dark:border-gray-600">
                    <div className="flex flex-col gap-1">
                      <Link to="settings">
                        <MenuItem
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={() => console.log("Settings")}
                        >
                          <Settings
                            size={18}
                            className="text-gray-600 dark:text-gray-300"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Settings
                          </span>
                        </MenuItem>
                      </Link>

                      <MenuItem
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => navigate("/user-profile")}
                      >
                        <UserCircle
                          size={18}
                          className="text-gray-600 dark:text-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          Profile
                        </span>
                      </MenuItem>

                      <hr className="my-1 border-t border-white/20 dark:border-gray-600" />

                      <MenuItem
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50/50 dark:hover:bg-red-900/30 transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut
                          size={18}
                          className="text-red-500 dark:text-red-400"
                        />
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          Log Out
                        </span>
                      </MenuItem>
                    </div>
                  </MenuList>
                </Menu>
              </div>
            </div>
          </div>

          <div className="w-full h-11/12 bg-blue-950/70 mt-2 rounded-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
