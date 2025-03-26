import React from "react";
import { User, Mail, Phone, Calendar, Clock, Edit, Pen } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = ({ user }) => {
  return (
    <div className="flex gap-6 p-6 w-full text-white">
      {/* Profile Card */}
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-1/3 border border-gray-700">
        <div className="w-full flex justify-end">
          <Link to={"/user-update/emal."}>
            <div className=" bg-white p-2 rounded-full text-gray-700 hover:bg-gray-600 transition-colors">
              <Pen size={16} />
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="relative w-32 h-32">
            <img
              src={user?.avatar || "/default-avatar.png"}
              className="w-32 h-32 rounded-full border-4 border-gray-700 shadow-lg"
              alt="Profile"
            />
            <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-sm hover:bg-blue-500 transition-colors">
              <Edit size={16} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {user?.name || "User Name"}
          </h2>
          <span className="text-gray-400">{user?.role || "User Role"}</span>
          <div className="mt-4 flex flex-col gap-2 text-gray-300 w-full">
            <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
              <Mail size={18} className="text-blue-400" />
              {user?.email || "user@example.com"}
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
              <Phone size={18} className="text-blue-400" />
              {user?.phone || "+123-456-7890"}
            </div>
            <div className="flex items-center gap-2 p-3 bg-gray-700 rounded-lg">
              <Calendar size={18} className="text-blue-400" />
              {user?.birthDate || "01/01/1990"}
            </div>
          </div>
          <div className="w-full mt-6 space-y-3">
            {/* <div className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] shadow-lg">
              Send Message
            </div> */}
            <div className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg font-medium text-red-400 transition-colors duration-200">
              Delete Account
            </div>
          </div>
        </div>
      </div>

      {/* Details & Activity */}
      <div className="flex-1 space-y-6">
        {/* <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-3 mb-3">
            Billing Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-400">
                Billing Address
              </h4>
              <p className="text-gray-300 bg-gray-700 p-4 rounded-lg">
                {user?.billingAddress || "123 Main Street, New York, NY 10001"}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-400">
                Delivery Address
              </h4>
              <p className="text-gray-300 bg-gray-700 p-4 rounded-lg">
                {user?.deliveryAddress ||
                  "456 Oak Avenue, Los Angeles, CA 90001"}
              </p>
            </div>
          </div>
        </div> */}

        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-3 mb-3">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {user?.activities?.map((activity, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Clock size={18} className="text-blue-400" />
                  </div>
                  <span className="text-gray-300">{activity.title}</span>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            )) || (
              <p className="text-gray-400 text-center py-4">
                No recent activities
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
