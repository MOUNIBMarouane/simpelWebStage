// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  BarChart2,
  Users,
  FileText,
  Calendar,
  Activity,
  Layers,
  TrendingUp,
  Clock,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="glass-card mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back,{" "}
              <span className="gradient-text">{user?.username || "User"}</span>
            </h1>
            <p className="text-gray-300">
              Here's what's happening with your documents and team today.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="glass-button flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>View Calendar</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Documents Stat */}
        <motion.div variants={itemVariants} className="stats-card">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Documents</p>
              <h3 className="text-2xl font-bold text-white mt-1">128</h3>
              <div className="flex items-center mt-2 text-green-400 text-xs">
                <TrendingUp size={14} className="mr-1" />
                <span>+12% this month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <FileText size={24} className="text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Users Stat */}
        <motion.div variants={itemVariants} className="stats-card">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <h3 className="text-2xl font-bold text-white mt-1">24</h3>
              <div className="flex items-center mt-2 text-green-400 text-xs">
                <TrendingUp size={14} className="mr-1" />
                <span>+5% this week</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users size={24} className="text-purple-400" />
            </div>
          </div>
        </motion.div>

        {/* Types Stat */}
        <motion.div variants={itemVariants} className="stats-card">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Document Types</p>
              <h3 className="text-2xl font-bold text-white mt-1">8</h3>
              <div className="flex items-center mt-2 text-blue-400 text-xs">
                <Clock size={14} className="mr-1" />
                <span>Last updated 3 days ago</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Layers size={24} className="text-emerald-400" />
            </div>
          </div>
        </motion.div>

        {/* Activity Stat */}
        <motion.div variants={itemVariants} className="stats-card">
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Recent Activity</p>
              <h3 className="text-2xl font-bold text-white mt-1">42</h3>
              <div className="flex items-center mt-2 text-yellow-400 text-xs">
                <Activity size={14} className="mr-1" />
                <span>Last hour: 6 actions</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <BarChart2 size={24} className="text-orange-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Documents Section */}
      <motion.div variants={itemVariants} className="glass-card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FileText size={20} className="mr-2 text-blue-400" />
            Recent Documents
          </h2>
          <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-700/50">
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4">Annual Financial Report</td>
                <td className="py-3 pr-4">Finance</td>
                <td className="py-3 pr-4">Apr 2, 2025</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Completed
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4">Product Roadmap Q2</td>
                <td className="py-3 pr-4">Planning</td>
                <td className="py-3 pr-4">Mar 28, 2025</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    In Progress
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4">Team Performance Review</td>
                <td className="py-3 pr-4">HR</td>
                <td className="py-3 pr-4">Mar 25, 2025</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                    Draft
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4">Client Proposal - XYZ Corp</td>
                <td className="py-3 pr-4">Sales</td>
                <td className="py-3 pr-4">Mar 20, 2025</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                    Sent
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Activity Feed and Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.div
          variants={itemVariants}
          className="glass-card lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Activity size={20} className="mr-2 text-blue-400" />
              Recent Activity
            </h2>
          </div>

          <div className="space-y-4">
            {/* Activity Item */}
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mr-4">
                <Users size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white">
                  <span className="font-semibold">John Doe</span> added a new
                  document
                </p>
                <p className="text-gray-400 text-sm">
                  Client Presentation - ABC Inc
                </p>
                <p className="text-gray-500 text-xs mt-1">10 minutes ago</p>
              </div>
            </div>

            {/* Activity Item */}
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mr-4">
                <FileText size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-white">
                  <span className="font-semibold">Sarah Kim</span> updated
                  document
                </p>
                <p className="text-gray-400 text-sm">Q2 Marketing Plan</p>
                <p className="text-gray-500 text-xs mt-1">35 minutes ago</p>
              </div>
            </div>

            {/* Activity Item */}
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mr-4">
                <Layers size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white">
                  <span className="font-semibold">System</span> created new
                  document type
                </p>
                <p className="text-gray-400 text-sm">Legal Agreement</p>
                <p className="text-gray-500 text-xs mt-1">1 hour ago</p>
              </div>
            </div>

            {/* Activity Item */}
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mr-4">
                <Users size={20} className="text-orange-400" />
              </div>
              <div>
                <p className="text-white">
                  <span className="font-semibold">Admin</span> added new user
                </p>
                <p className="text-gray-400 text-sm">
                  Michael Chen (Sales Department)
                </p>
                <p className="text-gray-500 text-xs mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calendar / Upcoming Section */}
        <motion.div variants={itemVariants} className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Calendar size={20} className="mr-2 text-blue-400" />
              Upcoming
            </h2>
          </div>

          <div className="space-y-4">
            {/* Event Item */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-white">Team Meeting</h4>
                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                  Today
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">3:00 PM - 4:00 PM</p>
              <p className="text-gray-500 text-xs mt-2">5 participants</p>
            </div>

            {/* Event Item */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-white">Document Review</h4>
                <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-xs">
                  Tomorrow
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">11:00 AM - 12:00 PM</p>
              <p className="text-gray-500 text-xs mt-2">Q1 Financial Report</p>
            </div>

            {/* Event Item */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-white">Client Call</h4>
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                  Apr 5
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">2:30 PM - 3:30 PM</p>
              <p className="text-gray-500 text-xs mt-2">ABC Corporation</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
