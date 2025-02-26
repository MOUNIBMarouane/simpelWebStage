import React from "react";
import { File, List, PanelRightClose } from "lucide-react";
import { Link } from "react-router-dom";
// import { Dock } from "lucide-react";
const NavBar = (logged) => {
  return (
    <nav className="h-full w-ful space-y-3">
      {/* pages */}
      <div className="h-full w-full flex flex-col justify-between">
        <ul className="space-x-2 ">
          <Link to="/Users-list">
            <div className="bg-white w-full p-2 rounded-sm flex justify-items-center hover:bg-blue-700 hover:text-sky-50">
              <List />
              <label htmlFor="img" className="w-full cursor-pointer">
                {" "}
                Users
              </label>
            </div>
          </Link>

          {/* <br /> */}
          <Link to="/documents">
            <div className="bg-white w-full p-2 rounded-sm flex justify-items-center hover:bg-blue-700 hover:text-sky-50">
              <File />
              <label htmlFor="img" className="w-full cursor-pointer">
                {" "}
                Documents
              </label>
            </div>
          </Link>
        </ul>

        <Link to="/login">
          <div className="bg-red-600/95 hover:bg-red-600 w-full p-2 rounded-sm flex justify-items-center">
            <PanelRightClose color="#E0F2FE" />
            <label htmlFor="img" className="w-full cursor-pointer text-sky-50">
              {" "}
              exit
            </label>
          </div>
        </Link>
      </div>
      {/* setting and exit */}
    </nav>
  );
};

export default NavBar;
