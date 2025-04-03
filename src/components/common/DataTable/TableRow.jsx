// src/components/common/DataTable/TableRow.jsx

import React from "react";
import { motion } from "framer-motion";

/**
 * TableRow - A reusable table row component with animations
 *
 * @param {Object} props Component props
 * @param {Object} props.data Row data
 * @param {Array} props.columns Column definitions
 * @param {number} props.index Row index for animation delay
 * @param {Function} props.onClick Function to call when row is clicked
 * @param {boolean} props.isSelected Whether the row is selected
 * @param {Function} props.onSelect Function to call when selection checkbox is toggled
 * @returns {JSX.Element} The table row component
 */
const TableRow = ({
  data,
  columns,
  index = 0,
  onClick,
  isSelected = false,
  onSelect,
  className = "",
}) => {
  // Handle selection checkbox click
  const handleSelectClick = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(data.id);
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={`
        bg-slate-700/20 hover:bg-slate-700/40 transition-colors
        ${isSelected ? "bg-blue-500/10 border-l-4 border-blue-500" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {columns.map((column, colIndex) => (
        <td
          key={`${data.id || index}-${column.id || colIndex}`}
          className={`px-4 py-3 ${column.cellClassName || ""}`}
        >
          {column.id === "selection" ? (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleSelectClick}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 rounded-md bg-gray-700 border-gray-600"
            />
          ) : column.cell ? (
            column.cell(data)
          ) : (
            data[column.accessor]
          )}
        </td>
      ))}
    </motion.tr>
  );
};

export default TableRow;
