import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Camera,
} from "lucide-react";

const ProfileEdit = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
    profilePicture: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://192.168.1.94:5204/api/Account/user-info",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProfile({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email || "",
          username: response.data.username || "",
          phoneNumber: response.data.phoneNumber || "",
          address: response.data.address || "",
          city: response.data.city || "",
          country: response.data.country || "",
          profilePicture: response.data.profilePicture || "",
          currentPassword: "",
          newPassword: "",
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/image.(jpeg|jpg|png|gif)$/i)) {
      setError("Invalid file format. Allowed: .jpeg, .jpg, .png, .gif");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://192.168.1.94:5204/api/Account/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile((prev) => ({
        ...prev,
        profilePicture: `${response.data.filePath}`,
      }));
      setMessage("Profile picture updated successfully");
    } catch (err) {
      setError(err.response?.data || "Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        "http://192.168.1.94:5204/api/Account/update-profile",
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data || "Failed to update profile");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full overflow-auto p-6 bg-gray-900 rounded-xl shadow-2xl relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/10 rounded-xl" />

      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Edit Profile
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Profile Picture Section */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="group relative w-fit mx-auto"
          >
            <div className="w-40 h-40 rounded-full border-4 border-blue-500/30 hover:border-blue-400 transition-all overflow-hidden shadow-2xl relative">
              <img
                src={profile.profilePicture || "/default-avatar.jpg"}
                alt="Profile"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <motion.label
                whileHover={{ scale: 1.1 }}
                className="absolute bottom-3 right-3 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition-colors shadow-lg flex items-center justify-center"
              >
                <Camera className="w-6 h-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </motion.label>
            </div>
          </motion.div>

          {/* Personal Information */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl"
              >
                <h2 className="text-lg font-semibold text-blue-300 mb-6 flex items-center gap-2">
                  <User size={20} /> Basic Information
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center gap-3 bg-gray-700/30 p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-2"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700/30 p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-2"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Contact Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl"
              >
                <h2 className="text-lg font-semibold text-blue-300 mb-6 flex items-center gap-2">
                  <Mail size={20} /> Contact Information
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center gap-3 bg-gray-700/30 p-3 rounded-xl opacity-80">
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      disabled
                      className="w-full bg-transparent text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-700/30 p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                    <Phone className="text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-2"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Address Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl"
            >
              <h2 className="text-lg font-semibold text-blue-300 mb-6 flex items-center gap-2">
                <MapPin size={20} /> Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-gray-700/30 p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-2"
                  />
                </div>
                <div className="flex items-center gap-3 bg-gray-700/30 p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <input
                    type="text"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-2"
                  />
                </div>
                <div className="flex items-center gap-3 bg-gray-700/30 p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <select
                    name="country"
                    value={profile.country}
                    onChange={handleChange}
                    className="w-full bg-transparent text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-2"
                  >
                    <option value="" className="bg-gray-800">
                      Select Country
                    </option>
                    <option value="Morocco" className="bg-gray-800">
                      Morocco
                    </option>
                    {/* Add more countries as needed */}
                  </select>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Security Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl"
          >
            <h2 className="text-lg font-semibold text-blue-300 mb-6 flex items-center gap-2">
              <Lock size={20} /> Security Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-gray-700/30 p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={profile.currentPassword}
                    onChange={handleChange}
                    placeholder="Current Password"
                    className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-2"
                  />
                  <div
                    type="div"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-700/30 p-3 rounded-xl hover:bg-gray-700/50 transition-colors">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={profile.newPassword}
                    onChange={handleChange}
                    placeholder="New Password"
                    className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-sm text-gray-400 p-4 bg-gray-700/30 rounded-xl">
                  <p className="mb-2">Password requirements:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Minimum 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one number</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status Messages */}
          <div className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 text-red-300 rounded-xl border border-red-500/50 flex items-center gap-2"
              >
                <span className="text-red-500">⚠</span> {error}
              </motion.div>
            )}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/20 text-green-300 rounded-xl border border-green-500/50 flex items-center gap-2"
              >
                <span className="text-green-500">✔</span> {message}
              </motion.div>
            )}
          </div>

          {/* Submit div */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white transition-all shadow-2xl hover:shadow-blue-500/30 relative overflow-hidden"
          >
            <span className="relative z-10">Save Changes</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-20 transition-opacity" />
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfileEdit;
