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
  label = "Select",
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel
          id={`${id}-label`}
          sx={{
            color: "rgb(148 163 184)",
            fontSize: "1rem",
            transform: "translate(14px, 10px) scale(1)",
            "&.Mui-focused": {
              // opacity: 0,
              
              color: "#3b82f6",
              transform: "translate(20px, -18px) scale(0.85)",
            },
            "&.MuiInputLabel-shrink": {
              transform: "translate(20px, -18px) scale(0.85)",
              color: "rgb(148 163 184)",
            },
          }}
        >
          {label}
        </InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          value={value}
          onChange={handleChange}
          required={required}
          variant="outlined"
          IconComponent={
            Icon
              ? () => <Icon style={{ fill: "white", right: "8px" }} />
              : undefined
          }
          sx={{
            fontSize: "0.875rem",
            borderRadius: "6px",
            backgroundColor: "rgb(51 65 85 / 0.5)",
            color: "white",
            border: "1px solid rgb(71 85 105)",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:hover": {
              borderColor: "rgb(100 116 139)",
            },
            "&.Mui-focused": {
              borderColor: "#3b82f6",
              boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
            },
            "& .MuiSelect-select": {
              padding: "10px",
              paddingRight: "32px",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                marginTop: "6px",
                borderRadius: "6px",
                backgroundColor: "rgb(51 65 85)",
                border: "1px solid rgb(71 85 105)",
                boxShadow: "none",
                "& .MuiMenuItem-root": {
                  fontSize: "0.875rem",
                  color: "white",
                  padding: "10px",
                  "&:hover": {
                    backgroundColor: "rgb(71 85 105)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgb(29 78 216)",
                    "&:hover": {
                      backgroundColor: "rgb(30 64 175)",
                    },
                  },
                },
              },
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                "&:first-of-type": {
                  borderTopLeftRadius: "6px",
                  borderTopRightRadius: "6px",
                },
                "&:last-child": {
                  borderBottomLeftRadius: "6px",
                  borderBottomRightRadius: "6px",
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FormSelect;
