import React, { useEffect, useState } from "react";
import axios from "axios";

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
          "http://localhost:5204/api/Account/user-info",
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
          newPassword: ""
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
        "http://localhost:5204/api/Account/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("response: ", response.data);

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
        "http://localhost:5204/api/Account/update-profile",
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture Section */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Profile Picture
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={`${profile.profilePicture}`} // Add timestamp to bypass cache
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              ;
              <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
            </div>
            <div className="text-sm text-gray-600">
              <p>Allowed JPG, JPEG, PNG, or GIF</p>
              <p>Max size of 5MB</p>
            </div>
          </div>
        </div>
        {/* Personal Information Section */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                placeholder="first name"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed text-gray-800"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                placeholder="last name"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                User name
              </label>
              <input
                type="tel"
                name="username"
                value={profile.username}
                onChange={handleChange}
                placeholder="username"
                className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed text-gray-800"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Phone number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                placeholder="Ex: +212 600 000 000"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="address"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleChange}
                placeholder="city"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Country
              </label>
              <select
                name="country"
                value={profile.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
              >
                <option value="">Select Country</option>
                <option value="Morocco">Morocco</option>
              </select>
            </div>
          </div>
        </div>
        {/* Security Section */}
        // Update the Security section in your ProfileEdit component
        <div className="border-b pb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Security</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Current Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={profile.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={profile.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                placeholder="Enter new password"
              />
            </div>
            <div className="flex mt-4">
              <input
                data-hs-toggle-password='{"target": "#hs-toggle-password-with-checkbox"}'
                onClick={togglePasswordVisibility}
                id="hs-toggle-password-checkbox"
                type="checkbox"
                className="shrink-0  border-gray-100 rounded-sm text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              />
              <label
                htmlFor="hs-toggle-password-checkbox"
                className="text-sm text-gray-500 ms-3 dark:text-neutral-400"
              >
                Show passwords
              </label>
            </div>
          </div>
        </div>
        {error && <div className="text-red-600 text-sm mt-4">{error}</div>}
        {message && (
          <div className="text-green-600 text-sm mt-4">{message}</div>
        )}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
