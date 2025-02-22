import React from "react";

function Layout() {
  return (
    <div className="flex w-full h-full ">
      <div className="grid h-full place-items-center">
        <NavBar />
      </div>
      <div className="ml-8 mr-8 w-full h-full pt-[136px] pb-12">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
