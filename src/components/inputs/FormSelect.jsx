import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const FormSelect = ({
  id,
  value,
  onChange,
  options,
  required = false,
  icon: Icon,
}) => {
  const handleChange = (e) => {
    // Extract the selected value and pass it directly to the onChange handler
    const selectedValue = e.target.value;
    onChange(selectedValue);
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        {/* {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <select
          id={id}
          value={value}
          onChange={handleChange}
          required={required}
          className={`peer text-sm border duration-300 ease hover:border-slate-300 shadow-sm focus:shadow w-full rounded-lg border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white transition-colors ${
            Icon ? "pl-10" : "pl-4"
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select> */}
        <Box>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id={id}
              value={value}
              label="Age"
              onChange={handleChange}
              required={required}
              sx={{
                fontSize: "0.875rem", // text-sm
                borderRadius: "0.5rem", // rounded-lg
                border: "1px solid",
                borderColor: "gray.300", // border-gray-300
                backgroundColor: "white", // bg-white
                color: "gray.900", // text-gray-900
                padding: "4px 4px", // px-4 py-2.5
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.1)", // shadow-sm
                "&:hover": {
                  borderColor: "slategray", // hover:border-slate-300
                },
                "&.Mui-focused": {
                  borderColor: "#3B82F6", // focus:border-blue-500
                  outline: "none",
                  boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.2)", // focus:ring-2 focus:ring-blue-500/20
                },
                "&.MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray.300",
                  },
                  "&:hover fieldset": {
                    borderColor: "slategray",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3B82F6",
                    boxShadow: "0px 0px 8px rgba(59, 130, 246, 0.2)",
                  },
                },
              }}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
    </div>
  );
};

export default FormSelect;
