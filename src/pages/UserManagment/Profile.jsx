import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Edit,
  Edit2,
  Edit3,
} from "lucide-react";

const Profile = ({ user }) => {
  return (
    <div className="h-full w-full rounded-lg gap-3 p-6 space-y-6 flex">
      {/* Profile Card */}
      <div className="bg-blue-900 rounded-xl shadow-lg p-6 ">
        <div className="grid bg-amber-300 grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="col-span-1 bg-amber-600 flex flex-col items-center">
            <div className="relative">
              <img
                // src={user?.avatar || "/default-avatar.png"}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                alt="Profile"
              />
              <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-sm">
                <Edit size={16} />
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-4">Maroune MOUNIB</h2>
            <span className="text-gray-500">Admin</span>
          </div>
          <div>
            <Edit></Edit>
          </div>
          {/* Right Section */}
          {/* <div className="col-span-2 grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Birth Date</span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {user?.birthDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {user?.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">42</div>
                  <div className="text-sm text-gray-500">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1.2k</div>
                  <div className="text-sm text-gray-500">Connections</div>
                </div>
              </div>
            </div>

            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed">
                {user?.bio || "No biography available"}
              </p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Activity Logs Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Recent Activities</h3>
          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            View All
            <Clock size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* {logs?.map((log, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                {log.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{log.title}</div>
                <div className="text-sm text-gray-500">{log.description}</div>
              </div>
              <div className="text-sm text-gray-400">{log.time}</div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
