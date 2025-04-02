// src/components/common/Form/Input/index.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Form Input Component - A reusable input field with various features
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Input id attribute
 * @param {string} props.type - Input type (text, password, email, etc)
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.placeholder - Input placeholder text
 * @param {boolean} props.required - Whether the input is required
 * @param {React.ElementType} props.icon - Icon component to show at start
 * @param {React.ElementType} props.rightIcon - Icon component to show at end
 * @param {Function} props.onRightIconClick - Click handler for right icon
 * @param {string} props.errorMessage - Error message to display
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {string} props.label - Label text
 * @param {string} props.className - Additional classes
 */
const FormInput = ({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  errorMessage,
  disabled = false,
  label,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility for password fields
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Determine if this is a password field
  const isPasswordField = type === 'password';
  
  // Determine the input type based on password visibility
  const inputType = isPasswordField && showPassword ? 'text' : type;

  // Determine icon to show for password fields
  const PasswordIcon = showPassword ? EyeOff : Eye;

  return (
    <div className="w-full space-y-2">
      {/* Show label if provided */}
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Left icon */}
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        
        {/* Input element */}
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full
            text-sm 
            rounded-lg
            border border-gray-600
            bg-gray-800
            text-white
            placeholder:text-gray-500
            focus:border-blue-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/20
            transition-colors
            ${Icon ? 'pl-10' : 'pl-4'} 
            ${(isPasswordField || RightIcon) ? 'pr-10' : 'pr-4'} 
            ${disabled ? 'cursor-not-allowed opacity-60' : ''}
            ${errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            py-2.5
            ${className}
          `}
        />
        
        {/* Right icon - either custom or password toggle */}
        {(isPasswordField || RightIcon) && (
          <div
            onClick={isPasswordField ? togglePasswordVisibility : onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer"
            role={isPasswordField ? "button" : undefined}
            tabIndex={isPasswordField ? 0 : undefined}
            aria-label={isPasswordField ? "Toggle password visibility" : undefined}
          >
            {isPasswordField ? (
              <PasswordIcon className="h-5 w-5" />
            ) : RightIcon ? (
              <RightIcon className="h-5 w-5" />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  icon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
  onRightIconClick: PropTypes.func,
  errorMessage: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default FormInput;