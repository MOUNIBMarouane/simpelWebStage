import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormInput = ({
  id,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isPasswordField = type === "password";

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          id={id}
          type={isPasswordField && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`peer 
            text-sm border 
            duration-300 ease 
            hover:border-slate-300 
            shadow-sm focus:shadow
            w-full
            rounded-lg
            border-gray-300
            bg-white
            px-4
            py-2.5
            text-gray-900
            placeholder:text-gray-500
            focus:border-blue-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/20
            dark:border-gray-600
            dark:bg-gray-800
            dark:text-white
            dark:placeholder:text-gray-400
            dark:focus:border-blue-400
            dark:focus:ring-blue-400/20
            transition-colors
            ${Icon ? "pl-10" : "pl-4"} 
            ${isPasswordField ? "pr-10" : ""} // Adjust padding for the eye icon
          `}
        />
        {isPasswordField && (
          <div
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInput;
