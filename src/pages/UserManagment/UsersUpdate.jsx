import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import FormInput from "../../components/common/Form/Input/index";

const UsersUpdate = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    roleName: "",
  });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [initialRole, setInitialRole] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Available roles excluding the current one
  const allRoles = ["Admin", "FullUser", "SimpleUser"];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://192.168.1.94:5204/api/Admin/users/${userId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const roleMapping = {
          1: "Admin",
          2: "FullUser",
          3: "SimpleUser",
        };

        // Extract role ID and map it to role name
        const currentRoleId = response.data.roleId; // Assuming roleId is returned
        const currentRole = roleMapping[currentRoleId] || "Unknown Role";

        console.log("current role", currentRole);
        setInitialRole(currentRole);

        // Set available roles excluding current role
        setAvailableRoles(allRoles.filter((role) => role !== currentRole));

        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          username: response.data.username,
          email: response.data.email,
          roleName: currentRole,
        });

        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/users-list");
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `http://192.168.1.94:5204/api/Admin/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      navigate("/users-list");
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  return (
    <div className="p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div
          onClick={() => navigate("/users-list")}
          className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="inline-block" />
          <span className="text-lg font-semibold">Back to Users</span>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Update User
            </h2>
            <p className="mt-2 text-gray-400">Edit user details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
              />
              <FormInput
                id="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
              />
              <FormInput
                id="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
              />
              <FormInput
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Role
                </label>
                <select
                  id="roleName"
                  value={formData.roleName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-300 ease"
                >
                  <option value={initialRole} disabled>
                    Current Role: {initialRole}
                    {/* {initialRole.replace(/([A-Z])/g, " $1").trim()} */}
                  </option>
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                      {/* {role.replace(/([A-Z])/g, " $1").trim()} */}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-700">
              <div
                type="submit"
                className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Save size={20} />
                <span>Save Changes</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsersUpdate;
