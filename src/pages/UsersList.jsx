import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FormInput from "../components/FormInputs";
import { Mail, User, Lock, X, Trash, Pencil } from "lucide-react";
import FormSelect from "../components/inputs/FormSelect";
import axios from "axios";

import {} from "lucide-react";
import { DeletUser, UpdateUser } from "../service/authService";
import { a } from "framer-motion/client";
import FormSelectRole from "../components/inputs/FormSelectRole";
const UsersList = () => {
  const [Users, setUsers] = useState([]);
  const [showFormNew, setShowFormNew] = useState(false);
  const [showFormUpdate, setShowFormUpdate] = useState(false);
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
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });

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
        "http://192.168.1.85:5204/api/Admin/users",
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
            <FormSelect
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

  const handleChange = (e) => {
    setNewUsers({ ...newUsers, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    // Call API or update state with new user data
    console.log("Saving user data:", formData);
    UpdateUser(formData);
    // Close the form after saving
    setShowFormUpdate(false);
  };
  const handleClose = () => {
    setShowFormUpdate(false);
    setShowFormDetails(false);
    setFormData({
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      roleName: "",
    }); // Clear form
  };
  const deleteUsers = (id) => {
    setUsers(Users.filter((user) => user.id !== id));
    DeletUser(id);
  };

  const editUsers = (user) => {
    setNewUsers(user);
    setEditingUsers(user.id);
    setShowFormNew(true);
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
  const activeSatus = (status) => {
    if (status) return "Active";
    return "Unactive";
  };
  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://192.168.1.85:5204/api/Admin/users",
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
  }, [selectedUser, showFormUpdate, showFormDetails]);

  const handleUserClick = (user, option) => {
    console.log("selected: ", user);
    setSelectedUser(user);
    if (option === "update") setShowFormUpdate(true);
    else setShowFormDetails(true);
  };

  const filteredUsers = Users.filter((user) =>
    Object.values(user).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="w-full h-full flex justify-center items-center text-white bg-blue-800/50">
      <div className=" w-full h-full backdrop-blur-md p-6 shadow-lg">
        <h2 className="text-center text-2xl font-bold">Users List</h2>

        <div className="w-full flex flex-row justify-between pb-5">
          <input
            type="text"
            placeholder="Search Users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-2/6"
          />
          <div
            onClick={() => setShowFormNew(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition "
          >
            + Add Users
          </div>
        </div>
        <div className="w-full bg-red-600 flex justify-start gap-6 justify-items-center">
          <div className="bg-blue-600 flex text-center justify-items-center ">
            user selected:
          </div>
          <div className="flex gap-1">
            <FormInput id="fullName"  type="text" value={}/>
            <FormInput />
            <FormInput />
            <div className="bg-green-500 flex justify-center p-1">save</div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg shadow-lg">
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full border-collapse bg-gray-900 text-white rounded-lg"
          >
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-4 text-left uppercase text-sm tracking-wide">
                  Name
                </th>
                <th className="p-4 text-left uppercase text-sm tracking-wide">
                  Email
                </th>
                <th className="p-4 text-left uppercase text-sm tracking-wide">
                  Role
                </th>
                <th className="p-4 text-center uppercase text-sm tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                  >
                    <td
                      className="p-4"
                      onClick={() => handleUserClick(user, "details")}
                    >
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{roleName(user.roleId)}</td>
                    <td className="p-4 flex items-center justify-center space-x-3">
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer"
                        onClick={() => handleUserClick(user, "update")}
                      >
                        <Trash size={18} />
                        <p className="hidden sm:inline">Update</p>
                      </div>
                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-700 text-white hover:bg-red-600 transition duration-200 cursor-pointer"
                        onClick={() => deleteUsers(user.id)}
                      >
                        <Trash size={18} />
                        <p className="hidden sm:inline">Delete</p>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </motion.table>
        </div>
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

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition-colors ml-auto"
                  >
                    Complete Signup
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {showFormUpdate && selectedUser && (
        <div className="absolute bg-black/60 top-0 left-0 w-full h-full flex justify-center items-center text-white">
          <div className="relative bg-blue-950/60 backdrop-blur-md p-6 w-6/12 rounded-lg">
            <X
              className="absolute top-0 right-0 cursor-pointer m-2"
              onClick={handleClose}
            />

            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <p>
              <strong>Role:</strong> {roleName(selectedUser.roleId)}
            </p>

            <div className="space-y-4">
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
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                icon={User}
              />
              <FormSelectRole
                id="roleName"
                value={roleName(formData.roleName)}
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
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {showFormDetails && selectedUser && (
        <div className="absolute bg-black/60 top-0 left-0 w-full h-full flex justify-center items-center text-white">
          <div className="relative bg-blue-950/60 backdrop-blur-md p-6 w-6/12 rounded-lg">
            <X
              className="absolute top-0 right-0 cursor-pointer m-2"
              onClick={handleClose}
            />
            {console.log("Details data:", selectedUser)}
            <h2 className="text-2xl font-bold mb-4">User Detail form</h2>
            <p>
              <strong>Role:</strong> {roleName(selectedUser.roleId)}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>full Name:</strong> {selectedUser.firstName}{" "}
              {selectedUser.lastName}
            </p>
            <p>
              <strong>Accout status :</strong>{" "}
              {activeSatus(selectedUser.isActive)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
