// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">
          Welcome, {user?.username || "User"}!
        </h2>
        <p className="text-gray-300">
          This is your application dashboard. From here, you can manage your
          documents, access system features, and more.
        </p>
      </div>

      {/* Additional dashboard content can be added here */}
    </div>
  );
};

export default Dashboard;
