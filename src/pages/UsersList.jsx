import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FormInput from "../components/FormInputs";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  User,
  Lock,
  X,
  Workflow,
  Edit,
  Trash,
  Trash2,
  Search,
  Plus,
} from "lucide-react";
import FormSelect from "../components/inputs/FormSelect";
import axios from "axios";

import {} from "lucide-react";
const UsersList = () => {
  const [Users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
        setShowForm(false);
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
    { value: "", label: "Select an option" },
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

  const addOrEditUsers = () => {
    if (
      !newUsers.username ||
      !newUsers.email ||
      !newUsers.password ||
      !newUsers.firstName ||
      !newUsers.lastName ||
      !newUsers.roleName
    )
      return;

    if (editingUsers) {
      setUsers(
        Users.map((user) =>
          user.id === editingUsers ? { ...user, ...newUsers } : user
        )
      );
    } else {
      setUsers([...Users, { id: Date.now(), ...newUsers }]);
    }

    setShowForm(false);
    setNewUsers({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      roleName: "",
    });
    setEditingUsers(null);
  };

  const deleteUsers = (id) => {
    setUsers(Users.filter((user) => user.id !== id));
  };

  const editUsers = (user) => {
    setNewUsers(user);
    setEditingUsers(user.id);
    setShowForm(true);
  };
  const roleName = (idrole) => {
    console.log("Id role ", idrole);
    switch (idrole) {
      case 1:
        return "Admin";
      case 2:
        return "Simple User";
      case 3:
        return "Full User";
    }
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
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition "
          >
            + Add Users
          </div>

          {/* {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-700 p-4 rounded-lg shadow-md hover:shadow-lg"
            >
              <h3 className="text-lg font-bold">{user.name}</h3>
              <p className="text-sm">{user.position}</p>
              <p className="text-sm text-gray-300">{user.email}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => editUsers(user)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <div
                  onClick={() => deleteUsers(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded flex"
                >
                  Delete
                </div>
              </div>
            </motion.div>
          ))} */}
        </div>
        <div>
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full border-collapse bg-gray-900 text-white rounded-lg shadow-lg"
          >
            <thead className="bg-blue-800">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Actions</th>
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
                    className="border-b border-gray-700 hover:bg-gray-800"
                  >
                    <td className="p-3">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{roleName(user.roleId)}</td>
                    <td className="p-3 text-center flex justify-center">
                      <div className="w-full p-2 rounded-lg flex justify-center bg-gray-700 text-yellow-400 hover:text-yellow-500 mx-2">
                        <Edit size={18} className="w-full" />
                      </div>
                      <div
                        className="w-full p-2 bg-red-100 rounded-lg flex justify-center text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash size={18} />
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </motion.table>
        </div>
      </div>

      {showForm && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
          className="absolute bg-black/60 top-0 left-0 w-full h-full flex justify-center place-items-center text-white"
        >
          <div className="relative bg-grade bg-blue-950/60 backdrop-blur-md p-6 md:w-6/12 lg:w-6/12 rounded-lg">
            <div className="w-full flex-col place-items-center pb-6">
              <X
                className="absolute top-0 right-0 cursor-pointer m-2"
                onClick={() => setShowForm(false)}
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
        // <div className="fixed inset-0 flex justify-center items-center bg-black/50">
        //   <motion.div
        //     initial={{ opacity: 0, scale: 0.9 }}
        //     animate={{ opacity: 1, scale: 1 }}
        //     transition={{ duration: 0.3 }}
        //     className="bg-black/70 p-6 rounded-lg shadow-lg w-96 backdrop-blur-md"
        //   >
        //     <h2 className="text-xl font-bold mb-4 text-white text-center">
        //       {editingUsers ? "Edit Users" : "Add New Users"}
        //     </h2>
        //     <input
        //       type="text"
        //       name="name"
        //       placeholder="Name"
        //       value={newUsers.name}
        //       onChange={handleChange}
        //       className="w-full p-2 mb-2 bg-white/10 text-white border border-gray-400 rounded"
        //     />
        //     <input
        //       type="text"
        //       name="name"
        //       placeholder="Name"
        //       value={newUsers.name}
        //       onChange={handleChange}
        //       className="w-full p-2 mb-2 bg-white/10 text-white border border-gray-400 rounded"
        //     />
        //     <input
        //       type="text"
        //       name="name"
        //       placeholder="Name"
        //       value={newUsers.name}
        //       onChange={handleChange}
        //       className="w-full p-2 mb-2 bg-white/10 text-white border border-gray-400 rounded"
        //     />
        //     <input
        //       type="text"
        //       name="name"
        //       placeholder="Name"
        //       value={newUsers.name}
        //       onChange={handleChange}
        //       className="w-full p-2 mb-2 bg-white/10 text-white border border-gray-400 rounded"
        //     />
        //     <input
        //       type="text"
        //       name="name"
        //       placeholder="Name"
        //       value={newUsers.name}
        //       onChange={handleChange}
        //       className="w-full p-2 mb-2 bg-white/10 text-white border border-gray-400 rounded"
        //     />
        //     <input
        //       type="text"
        //       name="position"
        //       placeholder="Position"
        //       value={newUsers.position}
        //       onChange={handleChange}
        //       className="w-full p-2 mb-2 bg-white/10 text-white border border-gray-400 rounded"
        //     />
        //     <input
        //       type="email"
        //       name="email"
        //       placeholder="Email"
        //       value={newUsers.email}
        //       onChange={handleChange}
        //       className="w-full p-2 mb-2 bg-white/10 text-white border border-gray-400 rounded"
        //     />
        //     <div className="flex justify-between">
        //       <button
        //         onClick={addOrEditUsers}
        //         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        //       >
        //         {editingUsers ? "Update" : "Add"}
        //       </button>
        //       <div
        //         onClick={() => setShowForm(false)}
        //         className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
        //       >
        //         Cancel
        //       </div>
        //     </div>
        //   </motion.div>
        // </div>
      )}
    </div>
  );
};

export default UsersList;
