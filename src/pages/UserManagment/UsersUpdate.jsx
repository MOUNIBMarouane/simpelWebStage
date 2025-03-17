import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import FormInput from "../../components/FormInputs";
import FormSelectRole from "../../components/inputs/FormSelectRole";

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
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          username: response.data.username,
          email: response.data.email,
          roleName: response.data.roleId,
        });
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
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="p-6 text-white">
      <button
        onClick={() => navigate("/users")}
        className="mb-4 flex items-center gap-2 text-blue-400 hover:text-blue-300"
      >
        <ArrowLeft size={20} /> Back to Users
      </button>

      <h2 className="text-3xl font-bold mb-6">Update User</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-lg p-6 space-y-4"
      >
        <FormInput
          id="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <FormInput
          id="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <FormInput
          id="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <FormInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <FormSelectRole
          id="roleName"
          value={formData.roleName}
          onChange={handleChange}
          options={[
            { value: "Admin", label: "Admin" },
            { value: "FullUser", label: "FullUser" },
            { value: "SimpleUser", label: "SimpleUser" },
          ]}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UsersUpdate;
