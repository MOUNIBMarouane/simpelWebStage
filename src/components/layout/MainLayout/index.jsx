import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  FileText,
  Users,
  LogOut,
  Menu as MenuIcon,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  Home,
  CircleUser,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import "../../../styles/dashboard.css"; // Import our new styles

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        !event.target.closest(".sidebar-glass") &&
        !event.target.closest(".menu-toggle")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="dashboard-container">
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            // onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: window.innerWidth > 1024 || sidebarOpen ? 0 : -280 }}
        className={`sidebar-glass glass-scroll ${
          sidebarOpen ? "open" : ""
        } lg:translate-x-0`}
      >
        {/* User profile section */}
        <div className="user-profile">
          <div className="user-avatar">
            <img
              src={user?.profilePicture || "/assets/default-avatar.png"}
              alt={user?.username || "User"}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.src = "/assets/default-avatar.png";
                e.target.onerror = null;
              }}
            />
          </div>
          <div className="ml-3">
            <h3 className="text-white font-medium text-sm">
              {user?.username || "User"}
            </h3>
            <p className="text-blue-300 text-xs capitalize">
              {user?.role || "User"}
            </p>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="mt-6 px-3">
          <div className="mb-3 px-4 text-xs font-semibold text-gray-400 uppercase">
            Main
          </div>

          {/* Dashboard Link */}
          <Link to="/dashboard">
            <div
              className={`nav-item ${
                isRouteActive("/dashboard") ? "active" : ""
              }`}
            >
              <Home size={18} className="mr-3" />
              <span>Dashboard</span>
            </div>
          </Link>

          {/* Documents Dropdown */}
          <div className="mb-2">
            <div
              className={`nav-item ${
                isRouteActive("/document") ||
                isRouteActive("/type-document") ||
                isRouteActive("/circuit")
                  ? "active"
                  : ""
              } justify-between cursor-pointer`}
              onClick={() => toggleMenu("documents")}
            >
              <div className="flex items-center">
                <FileText size={18} className="mr-3" />
                <span>Documents</span>
              </div>
              {openMenus.documents ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>

            <AnimatePresence>
              {openMenus.documents && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden ml-6 border-l border-gray-700/50 pl-3"
                >
                  <Link to="/documents">
                    <div
                      className={`nav-item text-sm py-2 ${
                        isRouteActive("/documents") ? "active" : ""
                      }`}
                    >
                      All Documents
                    </div>
                  </Link>
                  <Link to="/type-document">
                    <div
                      className={`nav-item text-sm py-2 ${
                        isRouteActive("/type-document") ? "active" : ""
                      }`}
                    >
                      Document Types
                    </div>
                  </Link>
                  <Link to="/circuit">
                    <div
                      className={`nav-item text-sm py-2 ${
                        isRouteActive("/circuit") ? "active" : ""
                      }`}
                    >
                      Circuits
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Users Menu - Only for admin or full users */}
          {(user?.role?.toLowerCase() === "admin" ||
            user?.role?.toLowerCase() === "fulluser") && (
            <div className="mb-2">
              <div
                className={`nav-item ${
                  isRouteActive("/users-list") || isRouteActive("/user-details")
                    ? "active"
                    : ""
                } justify-between cursor-pointer`}
                onClick={() => toggleMenu("users")}
              >
                <div className="flex items-center">
                  <Users size={18} className="mr-3" />
                  <span>Users</span>
                </div>
                {openMenus.users ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>

              <AnimatePresence>
                {openMenus.users && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden ml-6 border-l border-gray-700/50 pl-3"
                  >
                    <Link to="/users-list">
                      <div
                        className={`nav-item text-sm py-2 ${
                          isRouteActive("/users-list") ? "active" : ""
                        }`}
                      >
                        All Users
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <div className="mb-3 mt-6 px-4 text-xs font-semibold text-gray-400 uppercase">
            Account
          </div>

          {/* Profile Link */}
          <Link to="/user-profile">
            <div
              className={`nav-item ${
                isRouteActive("/user-profile") ? "active" : ""
              }`}
            >
              <CircleUser size={18} className="mr-3" />
              <span>Profile</span>
            </div>
          </Link>

          {/* Settings Link */}
          <Link to="/settings">
            <div
              className={`nav-item ${
                isRouteActive("/settings") ? "active" : ""
              }`}
            >
              <Settings size={18} className="mr-3" />
              <span>Settings</span>
            </div>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navigation */}
        <div className="topbar-glass mx-6 mt-4 px-6 flex items-center justify-between">
          {/* Menu toggle for mobile */}
          <button
            className="menu-toggle lg:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon size={24} />
          </button>

          {/* Page title and date */}
          <div className="hidden md:flex items-center h-full">
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-white">
                Welcome back, {user?.username || "User"}
              </h1>
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar size={14} className="mr-2" />
                {currentDate}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center p-2 px-4 bg-white/10 border border-white/20 rounded-full w-1/3">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full text-sm"
            />
          </div>

          {/* Notifications and profile */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Bell className="h-5 w-5 text-gray-300" />
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-5 w-5 flex items-center justify-center text-xs text-white">
                  3
                </span>
              </button>
            </div>

            <Link to="/user-profile" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="h-9 w-9 rounded-full object-cover border-2 border-transparent"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {user?.username?.charAt(0) || "U"}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <main className="content-glass glass-scroll mt-6 mb-6 mx-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
