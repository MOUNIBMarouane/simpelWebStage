import React, { useState, useEffect } from "react";
import "./usersStyles.css";
import { motion } from "framer-motion";
import FormInput from "../../components/FormInputs";
import {
  Mail,
  User,
  Lock,
  X,
  Trash,
  Pencil,
  Eye,
  MailIcon,
  MailsIcon,
  Pen,
} from "lucide-react";
import FormSelect from "../../components/inputs/FormSelect";
import axios from "axios";

import {} from "lucide-react";
import { DeletUser, updateStatus, UpdateUser } from "../../service/authService";
import { a } from "framer-motion/client";
import FormSelectRole from "../../components/inputs/FormSelectRole";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Add, Search } from "@mui/icons-material";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [Users, setUsers] = useState([]);
  const [showFormNew, setShowFormNew] = useState(false);
  const [showFormDetails, setShowFormDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUsers, setEditingUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUsers, setNewUsers] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    roleName: "",
  });
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    PasswordHash: "",
    cpassword: "",
    roleName: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  // Handle individual user selection
  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle select all/none
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });
  const toggleUserStatus = async (user) => {
    const originalUser = user;
    const updatedStatus = !user.isActive;

    try {
      // Optimistic UI update
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, isActive: updatedStatus } : u
        )
      );

      // Call API service
      await updateStatus(user.id, updatedStatus);
      toast.dismiss()
      toast.success(
        `User ${updatedStatus ? "activated" : "blocked"} successfully`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } catch (error) {
      console.error("Status update failed:", error);

      // Revert UI on error
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === originalUser.id ? originalUser : u))
      );

      // Show error toast
      toast.error(`Failed to ${updatedStatus ? "activate" : "block"} user`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "PasswordHash") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };
    setPasswordValidations(validations);

    return Object.values(validations).every(Boolean);
  };

  const handleNext = () => {
    if (
      step === 1 &&
      (!formData.firstName || !formData.lastName || !formData.username)
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (
      step === 2 &&
      (!formData.email || !formData.PasswordHash || !formData.cpassword)
    ) {
      alert("Please fill in all fields");
      return;
    }
    if (step === 2 && formData.PasswordHash !== formData.cpassword) {
      alert("Passwords don't match");
      return;
    }
    if (step === 2 && !validatePassword(formData.PasswordHash)) {
      setPasswordError(
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a digit, and a special character."
      );
      return;
    }
    setPasswordError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      roleName: formData.roleName,
      email: formData.email,
      PasswordHash: formData.PasswordHash,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");

      console.log(userData);
      console.log(accessToken);
      const response = await axios.post(
        "http://localhost:5204/api/Admin/users",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        console.log("User succusful saved");
        setShowFormNew(false);
        // navigate(`/verify/${formData.email}`);
      } else {
        console.log(response.status);
        // console.error("Registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const options = [
    { value: "Admin", label: "Admin" },
    { value: "FullUser", label: "FullUser" },
    { value: "SimpleUser", label: "SimpleUser" },
  ];
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 ">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                <FormInput
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                  icon={User}
                />
              </div>
              <div className="w-1/2">
                <FormInput
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                  icon={User}
                />
              </div>
            </div>
            <FormInput
              id="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
              icon={User}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Account Security</h3>
            <FormInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              icon={Mail}
            />
            <FormInput
              id="PasswordHash"
              type="password"
              value={formData.PasswordHash}
              onChange={handleInputChange}
              placeholder="Password"
              required
              icon={Lock}
            />

            <FormInput
              id="cpassword"
              type="password"
              value={formData.cpassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              required
              icon={Lock}
            />
            <div className="text-sm text-gray-400">
              <p>Password must include:</p>
              <ul>
                <li
                  className={
                    passwordValidations.length ? "text-green-500" : "text-white"
                  }
                >
                  At least 8 characters
                </li>
                <li
                  className={
                    passwordValidations.uppercase
                      ? "text-green-500"
                      : "text-white"
                  }
                >
                  An uppercase letter
                </li>
                <li
                  className={
                    passwordValidations.lowercase
                      ? "text-green-500"
                      : "text-white"
                  }
                >
                  A lowercase letter
                </li>
                <li
                  className={
                    passwordValidations.digit ? "text-green-500" : "text-white"
                  }
                >
                  A digit
                </li>
                <li
                  className={
                    passwordValidations.specialChar
                      ? "text-green-500"
                      : "text-white"
                  }
                >
                  A special character (@$!%*?&)
                </li>
              </ul>
            </div>
            {passwordError && (
              <div className="text-white text-sm">{passwordError}</div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Role of User</h3>
            <FormSelectRole
              id="roleName"
              value={formData.roleName}
              onChange={handleInputChange}
              options={options}
              icon={(props) => (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...props}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const deleteUsers = (ids) => {
    if (!Array.isArray(ids)) ids = [ids];

    toast.info(
      <div className="p-4">
        <p className="font-semibold">
          Delete {ids.length} user{ids.length > 1 ? "s" : ""}?
        </p>
        <div className="flex gap-4 mt-4 text-white">
          <div
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            onClick={() => {
              // Update UI first
              setUsers((prev) => prev.filter((user) => !ids.includes(user.id)));
              setSelectedUsers((prev) =>
                prev.filter((id) => !ids.includes(id))
              );

              // Send delete requests
              ids.forEach((id) => DeletUser(id));

              toast.dismiss();
              toast.success(
                `${ids.length} user${ids.length > 1 ? "s" : ""} deleted`
              );
            }}
          >
            Confirm
          </div>
          <div
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </div>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        toastId: "delete-confirmation",
      }
    );
  };

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

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:5204/api/Admin/users",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        userId: selectedUser.id || "",
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        email: selectedUser.email || "",
        roleName: selectedUser.roleId || "",
      });
    }
  }, [selectedUser, showFormDetails]);

  const filteredUsers = Users.filter((user) =>
    Object.values(user).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="w-full h-full flex-col justify-center items-center text-white rounded-lg pt-3 ">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        // pauseOnHover
        // theme="colored"
      />
      <div className=" w-full h-full backdrop-blur-md shadow-lg rounded-lg">
        <h2 className=" text-2xl font-bold w-full text-left pl-6 ">
          Users List
        </h2>
        <div className="w-full flex  flex-row px-6 py-3 gap-2.5">
          <div className="w-5/12 h-full flex flex-row justify-between gap-2.5 ">
            <div className="flex w-9/12 items-centert  rounded-lg  focus-within:border-amber-200">
              {/* <Search className="text-gray-400 mr-2" />Z */}
              <FormInput
                id="searchUser"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ..."
                required={false}
                icon={Search}
              />
            </div>
            <div
              onClick={() => setShowFormNew(true)}
              className="bg-green-500 w-4/12 text-white px-4 py-2 hover:bg-green-600 transition rounded-lg cursor-pointer"
            >
              <Add />
              Add Users
            </div>
          </div>
          {/* <div className=" w-8/12 flex items-center">Filter</div> */}
        </div>
        <div className="w-full max-h-10/12 overflow-auto  rounded-lg shadow-lg p-6 ">
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full  border-collapse bg-gray-900 text-white rounded-lg"
          >
            <thead className="bg-blue-700 text-white h-1/12">
              <tr>
                <th className="p-4 text-left uppercase text-sm tracking-wide">
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded-lg"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-left uppercase text-sm tracking-wide">
                  User Name
                </th>
                <th className="p-4 text-left uppercase text-sm tracking-wide">
                  Email
                </th>
                <th className="p-4 text-left uppercase text-sm tracking-wide">
                  Role
                </th>
                <th className="p-4 text-left uppercase text-sm tracking-wide">
                  Status{" "}
                </th>
                <th className="p-4 text-center uppercase text-sm tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="h-10/12 overflow-scroll">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="w-6 h-6 rounded-lg"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                      />
                    </td>
                    <td className="p-4">{user.username}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{roleName(user.roleId)} </td>
                    <td className="p-4 items-center">
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor=""
                          style={{
                            color: user.isActive ? "#4CAF50" : "#FF3B30",
                            fontWeight: 600,
                            transition: "color 0.3s ease",
                          }}
                        >
                          {user.isActive ? "Active" : "Blocked"}
                        </label>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={user.isActive}
                                onChange={() => toggleUserStatus(user)}
                                sx={{
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "#4CAF50",
                                    "& + .MuiSwitch-track": {
                                      backgroundColor: "#4CAF50",
                                    },
                                  },
                                  "& .MuiSwitch-switchBase": {
                                    color: "#FF3B30",
                                    "& + .MuiSwitch-track": {
                                      backgroundColor: "#FF3B30",
                                    },
                                  },
                                }}
                              />
                            }
                          />
                        </FormGroup>
                      </div>
                    </td>

                    <td className="p-4 flex items-center justify-center space-x-3">
                      {/* Toggle Button */}
                      {/* View Button */}
                      <Link to={`/user-details/${user.id}`}>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer">
                          <Eye size={18} />
                        </div>
                      </Link>
                      <Link to={`/user-update/${user.id}`}>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer">
                          <Pen size={18} />
                        </div>
                      </Link>
                      {/* Delete Button */}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </motion.table>
        </div>
        {selectedUsers.length > 0 && (
          <div className="w-full h-1/12 bg-gradient-to-r from-white via-white to-red-500 border flex justify-end items-center p-6 absolute bottom-0 rounded-lg backdrop-blur-sm">
            <div
              className="bg-red-600 flex gap-2 text-white px-4 py-2 hover:bg-red-600/65 transition-all rounded-lg cursor-pointer shadow-lg hover:shadow-red-500/30"
              onClick={() => deleteUsers(selectedUsers)}
            >
              <Trash />
              <p>Delete ({selectedUsers.length})</p>
            </div>
          </div>
        )}
      </div>
      {showFormNew && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowFormNew(false);
          }}
          className="absolute bg-black/60 top-0 left-0 w-full h-full flex justify-center place-items-center text-white"
        >
          <div className="relative bg-grade bg-blue-950/60 backdrop-blur-md p-6 md:w-6/12 lg:w-6/12 rounded-lg">
            <div className="w-full flex-col place-items-center pb-6">
              <X
                className="absolute top-0 right-0 cursor-pointer m-2"
                onClick={() => setShowFormNew(false)}
              />
              <h2 className="text-2xl font-bold">Add New User</h2>
              <div className="flex justify-center mt-4 space-x-2">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`w-3 h-3 rounded-full ${
                      step >= num ? "bg-blue-500" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {renderStep()}

              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition-colors"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors ml-auto"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition-colors ml-auto"
                  >
                    Complete Signup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
