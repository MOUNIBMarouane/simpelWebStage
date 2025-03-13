import React from "react";
import { File, List, PanelRightClose } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = ({ userRole, onLogout }) => {
  return (
    <nav className="h-full w-full space-y-3">
      <div className="h-full w-full flex flex-col justify-between">
        <ul className="space-x-2">
          {/* Show "Users" only if the user is an Admin */}
          {(userRole?.toLowerCase() === "admin" ||
            userRole?.toLowerCase() === "fulluser") && (
            <Link to="/Users-list">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-lg  border border-slate-700 hover:shadow-xl transition transform hover:scale-102 backdrop-blur-md w-fullbg-white w-full p-2 rounded-sm flex items-center hover:bg-blue-700 hover:text-sky-50">
                <List />
                <label htmlFor="img" className="w-full cursor-pointer">
                  Users
                </label>
              </div>
            </Link>
          )}

          <Link to="/documents">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-lg  border border-slate-700 hover:shadow-xl transition transform hover:scale-102 backdrop-blur-md w-fullbg-white w-full p-2 rounded-sm flex items-center hover:bg-blue-700 hover:text-sky-50">
              <File />
              <label htmlFor="img" className="w-full cursor-pointer">
                Documents
              </label>
            </div>
          </Link>
        </ul>

        {/* 🔹 Logout Button */}
        <div
          onClick={onLogout}
          className="bg-red-600/95 hover:bg-red-600 w-full p-2 rounded-sm flex items-center"
        >
          <PanelRightClose color="#E0F2FE" />
          <p className="w-full text-center cursor-pointer text-sky-50">
            Logout
          </p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
