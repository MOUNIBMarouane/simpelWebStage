// components/inputs/RoleSelect.jsx
import React from "react";

const RoleSelect = ({ value, onChange, currentRole }) => {
  const roleOptions = [
    { id: 1, name: "Admin" },
    { id: 2, name: "FullUser" },
    { id: 3, name: "BasicUser" },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors duration-300 ease"
    >
      <option value="" disabled>
        Select Role
      </option>
      {roleOptions
        .filter((role) => role.name !== currentRole)
        .map((role) => (
          <option key={role.id} value={role.id}>
            {role.name.replace(/([A-Z])/g, " $1").trim()}{" "}
            {/* Converts "FullUser" to "Full User" */}
          </option>
        ))}
    </select>
  );
};

export default RoleSelect;
