// src/components/layout/MainLayout/index.jsx

import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";
import {
  Settings,
  User,
  FileText,
  Users,
  Network,
  LogOut,
  Menu as MenuIcon,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

/**
 * Main Layout Component - Wraps all authenticated pages
 */
const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State for sidebar visibility on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State for dropdown menus
  const [openMenus, setOpenMenus] = useState({
    documents: false,
    users: false,
  });

  // Format current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Check if a route is active
  const isRouteActive = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/dashboard";
  };

  // Toggle a dropdown menu
  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Handle user logout
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-gray-800 text-white border-r border-gray-700
          fixed lg:relative h-full z-30 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "left-0" : "-left-64 lg:left-0"}
        `}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={24} />
        </button>

        {/* User profile in sidebar */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar
              src={user?.profilePicture}
              alt={user?.username || "User"}
              className="h-10 w-10 rounded-full border-2 border-blue-500"
            />
            <div>
              <h3 className="text-sm font-medium">
                {user?.username || "User"}
              </h3>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role || "User"}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-2">
          {/* Dashboard Link */}
          <Link
            to="/dashboard"
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
              ${
                isRouteActive("/dashboard")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700/50"
              }
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Dashboard</span>
          </Link>

          {/* Documents Menu */}
          <div>
            <button
              onClick={() => toggleMenu("documents")}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                ${
                  isRouteActive("/document") ||
                  isRouteActive("/type-document") ||
                  isRouteActive("/circuit")
                    ? "bg-blue-600/50 text-white"
                    : "text-gray-300 hover:bg-gray-700/50"
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5" />
                <span>Documents</span>
              </div>
              {openMenus.documents ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {/* Documents Submenu */}
            {openMenus.documents && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-4">
                <Link
                  to="/documents"
                  className={`
                    block px-4 py-2 rounded-lg transition-colors text-sm
                    ${
                      isRouteActive("/documents")
                        ? "bg-blue-600/30 text-white"
                        : "text-gray-400 hover:bg-gray-700/30 hover:text-white"
                    }
                  `}
                >
                  All Documents
                </Link>
                <Link
                  to="/type-document"
                  className={`
                    block px-4 py-2 rounded-lg transition-colors text-sm
                    ${
                      isRouteActive("/type-document")
                        ? "bg-blue-600/30 text-white"
                        : "text-gray-400 hover:bg-gray-700/30 hover:text-white"
                    }
                  `}
                >
                  Document Types
                </Link>
                <Link
                  to="/circuit"
                  className={`
                    block px-4 py-2 rounded-lg transition-colors text-sm
                    ${
                      isRouteActive("/circuit")
                        ? "bg-blue-600/30 text-white"
                        : "text-gray-400 hover:bg-gray-700/30 hover:text-white"
                    }
                  `}
                >
                  Circuits
                </Link>
              </div>
            )}
          </div>

          {/* Users Menu - Only show for admin or full users */}
          {(user?.role?.toLowerCase() === "admin" ||
            user?.role?.toLowerCase() === "fulluser") && (
            <div>
              <button
                onClick={() => toggleMenu("users")}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                  ${
                    isRouteActive("/users-list") ||
                    isRouteActive("/user-details")
                      ? "bg-blue-600/50 text-white"
                      : "text-gray-300 hover:bg-gray-700/50"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </div>
                {openMenus.users ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {/* Users Submenu */}
              {openMenus.users && (
                <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-4">
                  <Link
                    to="/users-list"
                    className={`
                      block px-4 py-2 rounded-lg transition-colors text-sm
                      ${
                        isRouteActive("/users-list")
                          ? "bg-blue-600/30 text-white"
                          : "text-gray-400 hover:bg-gray-700/30 hover:text-white"
                      }
                    `}
                  >
                    All Users
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Profile Link */}
          <Link
            to="/user-profile"
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
              ${
                isRouteActive("/user-profile")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700/50"
              }
            `}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>

          {/* Settings Link */}
          <Link
            to="/settings"
            className={`
              flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
              ${
                isRouteActive("/settings")
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700/50"
              }
            `}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Menu toggle for mobile */}
            <button
              className="lg:hidden text-gray-300 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon size={24} />
            </button>

            {/* Page title and date */}
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-white">
                Good day, {user?.username || "User"}
              </h1>
              <p className="text-sm text-gray-400">{currentDate}</p>
            </div>

            {/* Search bar */}
            <div className="hidden md:flex items-center bg-gray-700/50 rounded-full px-4 py-2 w-1/3">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full"
              />
            </div>

            {/* Notifications and profile */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-xs text-white">
                  3
                </span>
              </button>

              <Link to="/user-profile" className="flex items-center space-x-2">
                <Avatar
                  src={user?.profilePicture}
                  alt={user?.username || "User"}
                  className="h-8 w-8 rounded-full border-2 border-blue-500"
                />
                <span className="hidden md:inline-block text-sm text-white">
                  {user?.username || "User"}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content Area with scrolling */}
        <main className="flex-1 overflow-y-auto bg-slate-900 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
