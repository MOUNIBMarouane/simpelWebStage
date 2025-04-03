// src/components/dashboard/navBar/NavBar.jsx
import React, { useState } from "react";
import {
  File,
  List,
  PanelRightClose,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const NavBar = ({ userRole, onLogout }) => {
  // State to manage the visibility of sublinks
  const [showUsersSublinks, setShowUsersSublinks] = useState(false);
  const [showDocumentsSublinks, setShowDocumentsSublinks] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  return (
    <nav className="h-full w-full space-y-3 ">
      <div className="h-full w-full flex flex-col justify-between">
        <ul className="space-y-2">
          {/* Show "Users" only if the user is an Admin or FullUser */}
          {(userRole?.toLowerCase() === "admin" ||
            userRole?.toLowerCase() === "fulluser") && (
            <div>
              <div
                onClick={() => setShowUsersSublinks(!showUsersSublinks)}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-lg border border-slate-700 hover:shadow-xl transition transform hover:scale-102 backdrop-blur-md w-full p-2 rounded-sm flex items-center justify-between hover:bg-blue-700 hover:text-sky-50 cursor-pointer"
              >
                <div className="flex items-center">
                  <List />
                  <label htmlFor="img" className="w-full cursor-pointer ml-2">
                    Users
                  </label>
                </div>
                {showUsersSublinks ? <ChevronUp /> : <ChevronDown />}
              </div>

              {/* Sublinks for Users */}
              {showUsersSublinks && (
                <div className="pl-4 mt-2 space-y-2">
                  <Link to="/users-list">
                    <div className="bg-slate-700/50 hover:bg-slate-600/50 p-2 rounded-sm flex items-center hover:text-sky-50">
                      <label htmlFor="img" className="w-full cursor-pointer">
                        All Users
                      </label>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Documents Section */}
          <div>
            <div
              onClick={() => setShowDocumentsSublinks(!showDocumentsSublinks)}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-lg border border-slate-700 hover:shadow-xl transition transform hover:scale-102 backdrop-blur-md w-full p-2 rounded-sm flex items-center justify-between hover:bg-blue-700 hover:text-sky-50 cursor-pointer"
            >
              <div className="flex items-center">
                <File />
                <label htmlFor="img" className="w-full cursor-pointer ml-2">
                  Documents
                </label>
              </div>
              {showDocumentsSublinks ? <ChevronUp /> : <ChevronDown />}
            </div>

            {/* Sublinks for Documents */}
            {showDocumentsSublinks && (
              <div className="pl-4 mt-2 space-y-2">
                <Link to="/documents">
                  <div className="bg-slate-700/50 hover:bg-slate-600/50 p-2 rounded-sm flex items-center hover:text-sky-50">
                    <label htmlFor="img" className="w-full cursor-pointer">
                      All Documents
                    </label>
                  </div>
                </Link>
                <Link to="/type-document">
                  <div className="bg-slate-700/50 hover:bg-slate-600/50 p-2 rounded-sm flex items-center hover:text-sky-50">
                    <label htmlFor="img" className="w-full cursor-pointer">
                      Document Types
                    </label>
                  </div>
                </Link>
                <Link to="/circuit">
                  <div className="bg-slate-700/50 hover:bg-slate-600/50 p-2 rounded-sm flex items-center hover:text-sky-50">
                    <label htmlFor="img" className="w-full cursor-pointer">
                      Circuits
                    </label>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </ul>

        {/* Logout div */}
        <div
          onClick={handleLogout}
          className="bg-red-600/95 hover:bg-red-600 w-full p-2 rounded-sm flex items-center cursor-pointer"
        >
          <PanelRightClose color="#E0F2FE" />
          <p className="w-full text-center text-sky-50">Logout</p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
