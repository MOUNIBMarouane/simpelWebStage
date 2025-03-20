import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, LogIn, LogOut, ShieldAlert } from "lucide-react";
import { getLogs } from "../../service/authService";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  // Helper function to get action details
  const getActionDetails = (action) => {
    // Handle undefined/null action by defaulting to an empty string
    const lowerAction = action?.toLowerCase() ?? "";

    if (lowerAction.includes("login")) {
      return {
        icon: <LogIn size={16} className="text-green-400" />,
        color: "border-green-500",
        textColor: "text-green-400",
      };
    }

    if (lowerAction.includes("logout")) {
      return {
        icon: <LogOut size={16} className="text-red-400" />,
        color: "border-red-500",
        textColor: "text-red-400",
      };
    }

    // Default case for unknown actions
    return {
      icon: <ShieldAlert size={16} className="text-blue-400" />,
      color: "border-blue-500",
      textColor: "text-blue-400",
    };
  };

  const roleName = (idrole) => {
    switch (idrole) {
      case 1:
        return "Admin";
      case 2:
        return "SimpleUser";
      case 3:
        return "FullUser";
      default:
        return "Unknown Role";
    }
  };

  const activeStatus = (status) => (status ? "Active" : "Inactive");

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const userResponse = await axios.get(
          `http://localhost:5204/api/Admin/users/${userId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setUser(userResponse.data);

        const logsData = await getLogs(userId);
        if (logsData) setLogs(logsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/users");
      } finally {
        setLoading(false);
        setIsLoadingLogs(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  if (loading)
    return <div className="text-white p-6">Loading user data...</div>;

  return (
    <div className="p-6 text-white">
      <button
        onClick={() => navigate("/users-list")}
        className="mb-4 flex items-center gap-2 hover:text-blue-300"
      >
        <ArrowLeft size={20} /> Back to Users
      </button>

      <h2 className="text-3xl font-bold mb-6">User Details</h2>
      <div className="w-full flex gap-6">
        {/* User Details Card */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4 w-1/2">
          <DetailItem label="Username" value={user.username} />
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="First Name" value={user.firstName} />
          <DetailItem label="Last Name" value={user.lastName} />
          <DetailItem label="Role" value={roleName(user.roleId)} />
          <DetailItem label="Status" value={activeStatus(user.isActive)} />
        </div>

        {/* Logs Card */}
        <div className="bg-gray-800 rounded-lg p-6 w-1/2">
          <h3 className="text-xl font-semibold mb-4">Activity Logs</h3>

          {isLoadingLogs ? (
            <div className="text-gray-400">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-gray-400">No activity logs found</div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {logs.map((log) => {
                const actionDetails = getActionDetails(log.action);

                return (
                  <div
                    key={log.id}
                    className={`bg-gray-700/30 p-4 rounded-lg border-l-4 ${actionDetails.color}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {actionDetails.icon}
                        <span
                          className={`font-medium ${actionDetails.textColor}`}
                        >
                          {log.action}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {formatDateTime(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{log.details}</p>
                    <div className="mt-2 text-xs text-gray-400">
                      {log.ipAddress && `IP: ${log.ipAddress}`}
                      {log.userAgent && ` • ${log.userAgent}`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="border-b border-gray-700 pb-3">
    <span className="text-gray-400 text-sm">{label}:</span>
    <p className="text-white mt-1">{value || "-"}</p>
  </div>
);

export default UserDetails;
