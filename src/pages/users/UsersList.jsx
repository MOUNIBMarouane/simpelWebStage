import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import FormInput from "../components/FormInputs";
import FormInput from "../../components/common/Form/Input/index";
import {
  Mail,
  User,
  Lock,
  X,
  Trash,
  Pencil,
  Eye,
  Key,
  EyeOff,
} from "lucide-react";

import axios from "axios";
import {
  DeletUser,
  UpdateUser,
  FindUserName,
  FindUserMail,
} from "../../service/authService";
import RoleSelect from "../../components/inputs/RoleSelect";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersList = () => {
  const [Users, setUsers] = useState([]);
  const [showFormNew, setShowFormNew] = useState(false);
  const [showFormDetails, setShowFormDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUsers, setEditingUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState(1);

  // User form data for adding new users
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    PasswordHash: "",
    cpassword: "",
    roleName: "",
    secretkey: "", // For admin verification if needed
  });

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form validation states
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usermailError, setUsermailError] = useState("");
  const [secretKeyError, setSecretKeyError] = useState("");

  // Field validations
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });

  const [nameValidations, setNameValidations] = useState({
    firstName: { length: false, format: false },
    lastName: { length: false, format: false },
    username: { length: false, format: false },
  });

  const options = [
    { value: "Admin", label: "Admin" },
    { value: "FullUser", label: "FullUser" },
    { value: "SimpleUser", label: "SimpleUser" },
  ];

  // Functions for password toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate password with all requirements
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

  // Validate name fields (firstName, lastName, username)
  const validateName = (field, value) => {
    let validations;

    if (field === "username") {
      validations = {
        length: value.length >= 3,
        format: /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/.test(value), // Allows letters, numbers, `_`, `-` (not at start or end)
      };
    } else {
      validations = {
        length: value.length >= 3,
        format: /^[a-zA-Z]+$/.test(value), // Only letters for firstName and lastName
      };
    }

    setNameValidations((prev) => ({
      ...prev,
      [field]: validations,
    }));

    return validations.length && validations.format;
  };

  // Handle form input changes
  const handleInputChange = async (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear previous validation errors
    if (id === "username") {
      setUsernameError("");
      validateName(id, value);
    } else if (id === "email") {
      setUsermailError("");
    } else if (id === "PasswordHash") {
      validatePassword(value);
      if (formData.cpassword) {
        setPasswordError(
          value === formData.cpassword ? "" : "Passwords do not match!"
        );
      }
    } else if (id === "cpassword") {
      setPasswordError(
        value === formData.PasswordHash ? "" : "Passwords do not match!"
      );
    } else if (id === "firstName" || id === "lastName") {
      validateName(id, value);
    }
  };

  // Navigation between form steps
  const handleNext = async () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.username) {
        toast.error("Please fill in all fields");
        return;
      }

      if (
        !nameValidations.firstName.length ||
        !nameValidations.firstName.format ||
        !nameValidations.lastName.length ||
        !nameValidations.lastName.format ||
        !nameValidations.username.length ||
        !nameValidations.username.format
      ) {
        toast.error("Please correct the form errors before proceeding");
        return;
      }

      try {
        // Check if username exists
        const usernameExists = await FindUserName(formData.username);
        if (!usernameExists) {
          setUsernameError("Username is already taken. Please choose another.");
          toast.error("Username is already taken.");
          return;
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameError("Error checking username. Please try again.");
        return;
      }
    }

    if (step === 2) {
      if (!formData.email || !formData.PasswordHash || !formData.cpassword) {
        toast.error("Please fill in all fields");
        return;
      }

      if (formData.PasswordHash !== formData.cpassword) {
        setPasswordError("Passwords do not match!");
        toast.error("Passwords do not match!");
        return;
      }

      if (!validatePassword(formData.PasswordHash)) {
        setPasswordError("Password must meet all requirements.");
        toast.error("Password must meet all requirements.");
        return;
      }

      try {
        // Check if email exists
        const emailValid = await FindUserMail(formData.email);
        if (!emailValid) {
          setUsermailError("Email is already in use. Please use another.");
          toast.error("Email is already in use.");
          return;
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setUsermailError("Error checking email. Please try again.");
        return;
      }
    }

    // Clear errors and proceed to next step
    setPasswordError("");
    setUsermailError("");
    setStep((prev) => prev + 1);
  };

  // Go back to previous step
  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  // Submit the form to create a new user
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.roleName) {
      toast.error("Please select a user role");
      return;
    }

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

      const response = await axios.post(
        "http://192.168.1.59:5204/api/Admin/users",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...(formData.secretkey && { AdminSecret: formData.secretkey }),
          },
        }
      );

      if (response.status === 201) {
        toast.success("User successfully created!");
        setShowFormNew(false);
        // Reset form data
        setFormData({
          userId: "",
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          PasswordHash: "",
          cpassword: "",
          roleName: "",
          secretkey: "",
        });
        setStep(1);
        // Refresh the users list
        fetchUsers();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data || "Failed to create user");

      if (
        error.response?.data?.toLowerCase().includes("invalid admin secret")
      ) {
        setSecretKeyError(
          "The secret key is incorrect. Please check the key or contact administrator."
        );
      }
    }
  };

  // Render the current step form
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="w-full flex gap-4">
              <div className="w-1/2">
                <div className="mb-2">
                  <label className="text-gray-300" htmlFor="firstName">
                    First Name:
                  </label>
                </div>
                <FormInput
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                  icon={User}
                />
                <p
                  className={`text-sm mt-2 ${
                    nameValidations.firstName.length &&
                    nameValidations.firstName.format
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {nameValidations.firstName.length
                    ? nameValidations.firstName.format
                      ? "Valid name!"
                      : "Only letters allowed"
                    : "Name must be at least 3 characters"}
                </p>
              </div>
              <div className="w-1/2">
                <div className="mb-2">
                  <label className="text-gray-300" htmlFor="lastName">
                    Last Name:
                  </label>
                </div>
                <FormInput
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                  icon={User}
                />
                <p
                  className={`text-sm mt-2 ${
                    nameValidations.lastName.length &&
                    nameValidations.lastName.format
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {nameValidations.lastName.length
                    ? nameValidations.lastName.format
                      ? "Valid name!"
                      : "Only letters allowed"
                    : "Name must be at least 3 characters"}
                </p>
              </div>
            </div>
            <div>
              <label className="text-gray-300" htmlFor="username">
                User Name:
              </label>
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
            <p
              className={`text-sm mt-2 ${
                nameValidations.username.length &&
                nameValidations.username.format &&
                !usernameError
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {usernameError
                ? usernameError
                : nameValidations.username.length
                ? nameValidations.username.format
                  ? "Valid username!"
                  : "Username can only contain letters, numbers, '-', and '_'"
                : "Username must be at least 3 characters"}
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Account Security</h3>
            <div>
              <label className="text-gray-300" htmlFor="email">
                Email Address:
              </label>
            </div>
            <FormInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              icon={Mail}
            />
            <p
              className={`text-sm mt-2 ${
                usermailError ? "text-red-500" : "text-green-500"
              }`}
            >
              {usermailError
                ? usermailError
                : formData.email
                ? "Valid email!"
                : ""}
            </p>

            <div>
              <label className="text-gray-300" htmlFor="PasswordHash">
                Password:
              </label>
            </div>
            <FormInput
              id="PasswordHash"
              type={showPassword ? "text" : "password"}
              value={formData.PasswordHash}
              onChange={handleInputChange}
              placeholder="Password"
              required
              icon={Lock}
            />

            <div>
              <label className="text-gray-300" htmlFor="cpassword">
                Confirm Password:
              </label>
            </div>
            <FormInput
              id="cpassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.cpassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              required
              icon={Lock}
            />
            <p
              className={`text-sm mt-2 ${
                formData.cpassword
                  ? formData.PasswordHash === formData.cpassword
                    ? "text-green-500"
                    : "text-red-500"
                  : "text-white"
              }`}
            >
              {formData.cpassword
                ? formData.PasswordHash === formData.cpassword
                  ? "Passwords match!"
                  : "Passwords do not match!"
                : ""}
            </p>

            <div className="flex mt-4">
              <input
                onClick={togglePasswordVisibility}
                id="show-password-checkbox"
                type="checkbox"
                className="shrink-0 border-gray-100 rounded-sm text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              />
              <label
                htmlFor="show-password-checkbox"
                className="text-sm text-gray-500 ms-3 dark:text-neutral-400"
              >
                Show passwords
              </label>
            </div>

            <div className="text-sm text-gray-300">
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
              <div className="text-red-500 text-sm">{passwordError}</div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">User Role</h3>
            <div>
              <label className="text-gray-300 mb-2 block">
                Select User Role:
              </label>
              <RoleSelect
                id="roleName"
                value={formData.roleName}
                onChange={(e) =>
                  setFormData({ ...formData, roleName: e.target.value })
                }
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

            <div className="mt-6">
              <label className="text-gray-300" htmlFor="secretkey">
                Admin Secret Key (Optional):
              </label>
              <FormInput
                id="secretkey"
                type="password"
                value={formData.secretkey}
                onChange={handleInputChange}
                placeholder="Secret Key (if required)"
                icon={Key}
              />
              {secretKeyError && (
                <p className="text-red-500 text-sm mt-2">{secretKeyError}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Check if the next button should be disabled
  const isNextDisabled = () => {
    if (step === 1) {
      return !(
        formData.firstName &&
        formData.lastName &&
        formData.username &&
        nameValidations.firstName.length &&
        nameValidations.firstName.format &&
        nameValidations.lastName.length &&
        nameValidations.lastName.format &&
        nameValidations.username.length &&
        nameValidations.username.format
      );
    }

    if (step === 2) {
      return !(
        formData.email &&
        formData.PasswordHash &&
        formData.cpassword &&
        formData.PasswordHash === formData.cpassword &&
        Object.values(passwordValidations).every(Boolean)
      );
    }

    return false; // Step 3 doesn't need validation
  };

  const handleSave = async () => {
    // Call API or update state with new user data
    console.log("Saving user data:", formData);
    UpdateUser(formData);
    // Close the form after saving
  };

  const handleClose = () => {
    setShowFormDetails(false);
    setFormData({
      userId: "",
      firstName: "",
      lastName: "",
      email: "",
      roleName: "",
      PasswordHash: "",
      cpassword: "",
      secretkey: "",
    }); // Clear form
  };

  const deleteUsers = (id) => {
    setUsers(Users.filter((user) => user.id !== id));
    DeletUser(id);
    toast.success("User deleted successfully");
  };

  const editUsers = (user) => {
    setFormData({
      userId: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      username: user.username || "",
      roleName: user.roleId || "",
    });
    setEditingUsers(user.id);
    setShowFormNew(true);
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
        return "Unknown";
    }
  };

  const activeSatus = (status) => {
    return status ? "Active" : "Inactive";
  };

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://192.168.1.59:5204/api/Admin/users",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
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

  const handleUserClick = (user, option) => {
    setSelectedUser(user);

    if (option === "update") {
      // Update form data with selected user details
      setFormData({
        userId: user.id || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        roleName: user.roleId || "",
      });
    } else setShowFormDetails(true);
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
      <ToastContainer position="top-center" />
      <div className="w-full h-full backdrop-blur-md p-6 shadow-lg">
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
            onClick={() => {
              setShowFormNew(true);
              setStep(1);
              setFormData({
                userId: "",
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                PasswordHash: "",
                cpassword: "",
                roleName: "",
                secretkey: "",
              });
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer"
          >
            + Add User
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
                  #
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
                  Status
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
                    <td className="p-4">
                      <input type="checkbox" className="w-6 h-6 rounded-lg" />
                    </td>
                    <td
                      className="p-4 cursor-pointer hover:text-blue-300"
                      onClick={() => handleUserClick(user, "update")}
                    >
                      {user.username}
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{roleName(user.roleId)}</td>
                    <td className="p-4 items-center">
                      <FormGroup>
                        <FormControlLabel
                          control={<Switch defaultChecked={user.isActive} />}
                        />
                      </FormGroup>
                    </td>
                    <td className="p-4 flex items-center justify-center space-x-3">
                      {/* View Button */}
                      <div
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer"
                        onClick={() => handleUserClick(user, "details")}
                      >
                        <Eye size={18} />
                      </div>

                      {/* Delete Button */}
                      <div
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-700 text-white hover:bg-red-600 transition duration-200 cursor-pointer"
                        onClick={() => deleteUsers(user.id)}
                      >
                        <Trash size={18} />
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </motion.table>
        </div>
      </div>

      {/* Add/Edit User Form Modal */}
      {showFormNew && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowFormNew(false);
              setStep(1);
            }
          }}
          className="absolute bg-black/60 top-0 left-0 w-full h-full flex justify-center place-items-center text-white"
        >
          <div className="relative bg-blue-950/60 backdrop-blur-md p-6 md:w-6/12 lg:w-6/12 rounded-lg">
            <div className="w-full flex-col place-items-center pb-6">
              <X
                className="absolute top-0 right-0 cursor-pointer m-2"
                onClick={() => setShowFormNew(false)}
              />
              <h2 className="text-2xl font-bold">
                {editingUsers ? "Edit User" : "Add New User"}
              </h2>
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
                    className={`px-4 py-2 rounded transition-colors ml-auto ${
                      isNextDisabled()
                        ? "bg-gray-500 cursor-not-allowed opacity-50"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={isNextDisabled()}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition-colors ml-auto"
                  >
                    {editingUsers ? "Update User" : "Create User"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showFormDetails && selectedUser && (
        <div className="absolute bg-black/60 top-0 left-0 w-full h-full flex justify-center items-center text-white">
          <div className="relative bg-blue-950/60 backdrop-blur-md p-6 w-6/12 rounded-lg">
            <X
              className="absolute top-0 right-0 cursor-pointer m-2"
              onClick={handleClose}
            />
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Username:</span>{" "}
                {selectedUser.username}
              </p>
              <p>
                <span className="font-semibold">Role:</span>{" "}
                {roleName(selectedUser.roleId)}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedUser.email}
              </p>
              <p>
                <span className="font-semibold">Full Name:</span>{" "}
                {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <p>
                <span className="font-semibold">Account Status:</span>{" "}
                {activeSatus(selectedUser.isActive)}
              </p>
              <p>
                <span className="font-semibold">Created Date:</span>{" "}
                {selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
