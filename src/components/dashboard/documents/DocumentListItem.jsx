import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Calendar, FileText } from "lucide-react";

const DocumentListItem = ({ title, date, description, onDelete, onEdit }) => {
  // Format the date to be more readable
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Truncate description if it's too long
  const truncatedDescription =
    description.length > 160
      ? `${description.substring(0, 160)}...`
      : description;

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="hover:bg-slate-700/30 transition-colors"
    >
      <div className="flex items-center p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <FileText size={16} className="text-blue-400 mr-2 flex-shrink-0" />
            <h3 className="text-base font-medium text-white truncate">
              {title}
            </h3>
          </div>

          <p className="mt-1 text-sm text-gray-300 line-clamp-2">
            {truncatedDescription}
          </p>

          <div className="flex items-center mt-2">
            <Calendar size={12} className="text-gray-400 mr-1" />
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-full transition"
            aria-label="Edit document"
          >
            <Pencil size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="flex items-center bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-700 transition cursor-pointer text-sm font-medium"
          >
            <Trash size={14} /> Delete
          </motion.button>
        </div>
      </div>
    </motion.li>
  );
};

export default DocumentListItem;
