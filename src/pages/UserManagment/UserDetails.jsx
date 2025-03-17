import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const roleName = (idrole) => {
    console.log("Id role ", idrole);
    switch (idrole) {
      case 1:
        return "Admin";
      case 2:
        return "SimpleUser";
      case 3:
        return "FullUser";
    }
  };
  const activeSatus = (status) => {
    if (status) return "Active";
    return "Unactive";
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://192.168.1.94:5204/api/Admin/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/users");
      }
    };

    fetchUser();
  }, [userId, navigate]);

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <button
        onClick={() => navigate("/user-List")}
        className="mb-4 flex items-center gap-2 text-whi hover:text-blue-300"
      >
        <ArrowLeft size={20} /> Back to Users
      </button>

      <h2 className="text-3xl font-bold mb-6">User Details</h2>
      <div className="w-full flex gap-3">
        <div className="bg-gray-800 rounded-lg p-6 space-y-4 w-1/2">
          <DetailItem label="Username" value={user.username} />
          <DetailItem label="Email" value={user.email} />
          <DetailItem label="First Name" value={user.firstName} />
          <DetailItem label="Last Name" value={user.lastName} />
          <DetailItem label="Role" value={roleName(user.roleId)} />
          <DetailItem label="Status" value={activeSatus(user.isActive)} />
        </div>
        <div className="bg-gray-800 rounded-lg p-6 space-y-4 w-1/2">
        <label htmlFor=""> Logs list</label>
        
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="border-b border-gray-700 pb-2">
    <span className="text-gray-400 text-sm">{label}:</span>
    <p className="text-white">{value}</p>
  </div>
);

export default UserDetails;
