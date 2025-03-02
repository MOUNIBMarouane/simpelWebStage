import React from "react";
// import { useAuth } from "../Auth/AuthContext"; // ✅ Ensure correct import

const Dashboard = () => {
  // const { user } = useAuth(); // ✅ Access user from context
  // console.log("Context ---",user)
  return <div>{/* <h1>Welcome, {user ? user.username : "Guest"}!</h1> */}</div>;
};

export default Dashboard;
