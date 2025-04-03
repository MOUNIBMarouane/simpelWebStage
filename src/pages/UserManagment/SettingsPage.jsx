import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import FormInput from "../../components/common/Form/Input/index";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [userInfo, setUserInfo] = useState({
    firstName: "Angelina",
    email: "carelyn_kg@hotmail.com",
    phone: "+1 121232324",
    country: "United States",
    address: "123 Main St",
  });

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log("Uploaded file:", file);
  };

  const renderForm = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Profile Image
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="profile-upload"
                />
                <label
                  htmlFor="profile-upload"
                  className="w-full px-4 py-2.5 text-sm text-white bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors duration-200"
                >
                  Upload New Image
                </label>
              </div>

              <FormInput
                id="firstName"
                label="First Name"
                value={userInfo.firstName}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
              />

              <FormInput
                id="email"
                label="Email"
                type="email"
                value={userInfo.email}
                onChange={handleInputChange}
                disabled
                className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
              />

              <FormInput
                id="phone"
                label="Phone Number"
                value={userInfo.phone}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
              />

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Country
                </label>
                <select
                  id="country"
                  value={userInfo.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm text-white bg-gray-700 border border-gray-600 rounded-lg shadow-sm hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors duration-300"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">UK</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <FormInput
                  id="address"
                  label="Address"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="currentPassword"
                label="Current Password"
                type="password"
                className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
              />

              <FormInput
                id="newPassword"
                label="New Password"
                type="password"
                className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
              />

              <FormInput
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                className="bg-gray-700 border-gray-600 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <div
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="inline-block" />
          <span className="text-lg font-semibold">Back</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <nav className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">
                  Prelite
                </h3>
                <ul className="space-y-2">
                  {["Security", "Notification", "Billing", "Integration"].map(
                    (item) => (
                      <li key={item}>
                        <div
                          onClick={() => setActiveTab(item.toLowerCase())}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                            activeTab === item.toLowerCase()
                              ? "bg-blue-500/20 text-blue-400"
                              : "hover:bg-gray-700"
                          }`}
                        >
                          {item}
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">
                  Personal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <div
                      onClick={() => setActiveTab("personal")}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeTab === "personal"
                          ? "bg-blue-500/20 text-blue-400"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      Information
                    </div>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Account Settings
              </h2>
              <p className="mt-2 text-gray-400">
                Manage your account information and preferences
              </p>
            </div>

            <form className="space-y-6">
              {renderForm()}

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
    </div>
  );
};

export default SettingsPage;
