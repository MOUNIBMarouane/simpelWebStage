import React from "react";

const FormInput = ({
//   label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icon,
}) => {
  return (
    <div className="w-full space-y-2">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <div>
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`peer
            bg-transparent 
            placeholder:text-slate-400
            text-slate-700 
            text-sm border 
            border-slate-200
            rounded-md
            px-3
            py-2
            transition
            duration-300 ease 
            focus:outline-none 
            focus:border-slate-400 
            hover:border-slate-300 
            shadow-sm focus:shadow
            w-full
            rounded-lg
            border
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
            duration-200
            ${Icon ? "pl-10" : "pl-4"}
          `}
          />
          <label class="absolute cursor-text bg-gray-800 px-1 left-10 top-2.5 text-slate-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-5.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90">
            {/* {label} */}
          </label>
        </div>
      </div>
    </div>
  );
};

// Example usage
const EmailInputExample = () => {
  const [email, setEmail] = React.useState("");

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <FormInput
        label="Email"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
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
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        )}
      />
    </div>
  );
};

export default FormInput;
