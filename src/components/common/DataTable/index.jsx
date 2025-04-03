// src/components/common/DataTable/index.jsx

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

/**
 * DataTable - A reusable table component with consistent styling
 *
 * @param {Object} props Component props
 * @param {Array} props.columns Array of column definitions with {id, header, accessor, cell} properties
 * @param {Array} props.data Array of data objects to display
 * @param {Function} props.onRefresh Function to call when refresh button is clicked
 * @param {boolean} props.isLoading Loading state for the table
 * @param {Function} props.onRowClick Function to call when a row is clicked
 * @param {string} props.emptyMessage Message to display when there's no data
 * @param {React.ReactNode} props.actions Additional actions to show in the header
 * @param {React.ReactNode} props.emptyStateContent Custom content to show when table is empty
 * @param {string} props.searchPlaceholder Placeholder text for search input
 * @param {boolean} props.showSearch Whether to show search functionality
 * @param {Function} props.onSearch Function to call when search query changes
 * @returns {JSX.Element} The data table component
 */
const DataTable = ({
  columns = [],
  data = [],
  onRefresh,
  isLoading = false,
  onRowClick,
  emptyMessage = "No data found.",
  actions,
  emptyStateContent,
  searchPlaceholder = "Search...",
  showSearch = true,
  onSearch,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const headerCheckboxRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);

  // Effect for refreshing animation
  useEffect(() => {
    if (refreshing) {
      const timer = setTimeout(() => setRefreshing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [refreshing]);

  // Effect for header checkbox state
  useEffect(() => {
    if (headerCheckboxRef.current && data.length > 0) {
      const allSelected = selectedRows.length === data.length;
      const indeterminate =
        selectedRows.length > 0 && selectedRows.length < data.length;

      headerCheckboxRef.current.checked = allSelected;
      headerCheckboxRef.current.indeterminate = indeterminate;
    }
  }, [selectedRows, data]);

  // Handle refresh click
  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      await onRefresh();
    }
  };

  // Handle search query changes
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort the data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  // Handle row selection
  const handleSelectRow = (rowId) => {
    setSelectedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row) => row.id));
    }
  };

  return (
    <div className={`w-full flex flex-col h-full ${className}`}>
      {/* Table Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        {showSearch && (
          <div className="relative w-full sm:w-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 bg-gray-700/70 text-white rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-600/50"
            />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {actions}

          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isLoading || refreshing}
              className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
              aria-label="Refresh data"
            >
              <RefreshCw
                size={20}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-hidden rounded-lg border border-gray-700/50 bg-gray-800/30">
        <div className="h-full w-full overflow-auto custom-scrollbar">
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full border-collapse"
          >
            <thead>
              <tr className="bg-gray-700/90 backdrop-blur-sm sticky top-0 z-10">
                {columns.map((column, index) => (
                  <th
                    key={column.id || index}
                    className={`
                      px-4 py-3 text-left text-sm font-semibold text-slate-300
                      ${
                        column.sortable
                          ? "cursor-pointer hover:bg-gray-600/50"
                          : ""
                      }
                      ${column.className || ""}
                    `}
                    onClick={
                      column.sortable
                        ? () => handleSort(column.accessor)
                        : undefined
                    }
                  >
                    <div className="flex items-center">
                      {column.id === "selection" ? (
                        <input
                          type="checkbox"
                          ref={headerCheckboxRef}
                          onChange={handleSelectAll}
                          className="w-5 h-5 rounded-md bg-gray-700 border-gray-600"
                        />
                      ) : (
                        <>
                          {column.header}
                          {column.sortable && (
                            <div className="ml-1">
                              {sortConfig.key === column.accessor ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )
                              ) : null}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              <AnimatePresence>
                {sortedData.length > 0 ? (
                  sortedData.map((row, rowIndex) => (
                    <motion.tr
                      key={row.id || rowIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                      className={`
                        bg-slate-700/20 hover:bg-slate-700/30 transition-colors 
                        ${onRowClick ? "cursor-pointer" : ""}
                      `}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {columns.map((column, colIndex) => (
                        <td
                          key={`${row.id || rowIndex}-${column.id || colIndex}`}
                          className={`px-4 py-3 ${column.cellClassName || ""}`}
                        >
                          {column.id === "selection" ? (
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(row.id)}
                              onChange={() => handleSelectRow(row.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-5 h-5 rounded-md bg-gray-700 border-gray-600"
                            />
                          ) : column.cell ? (
                            column.cell(row)
                          ) : (
                            row[column.accessor]
                          )}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-700/10"
                  >
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                          <p>Loading data...</p>
                        </div>
                      ) : emptyStateContent ? (
                        emptyStateContent
                      ) : (
                        <div className="flex flex-col items-center py-8">
                          <div className="w-16 h-16 rounded-full bg-gray-700/30 flex items-center justify-center mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                              />
                            </svg>
                          </div>
                          <p>{emptyMessage}</p>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </motion.table>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default DataTable;
