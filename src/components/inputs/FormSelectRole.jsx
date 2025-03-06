import React from "react";

const FormSelectRole = ({
  id,
  value,
  onChange,
  options,
  required = false,
  icon: Icon,
}) => {
  return (
    <div className="w-full space-y-2">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={`peer text-sm border duration-300 ease hover:border-slate-300 shadow-sm focus:shadow w-full rounded-lg border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white transition-colors ${
            Icon ? "pl-10" : "pl-4"
          }`}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FormSelectRole;
