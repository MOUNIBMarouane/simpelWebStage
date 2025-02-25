import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Calendar, FileText } from "lucide-react";

const DocumentCard = ({ title, date, description, onDelete, onEdit }) => {
  // Format the date to be more readable
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Truncate description if it's too long
  const truncatedDescription =
    description.length > 120
      ? `${description.substring(0, 120)}...`
      : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-lg rounded-lg p-6 border border-slate-700 hover:shadow-xl transition transform hover:scale-102 backdrop-blur-md"
    >
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
          <Calendar size={12} className="mr-1" />
          {formattedDate}
        </span>
      </div>

      <div className="flex items-start mb-4">
        <FileText size={16} className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
        <p className="text-gray-300 text-sm">{truncatedDescription}</p>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex items-center bg-emerald-500/90 text-white px-3 py-1.5 rounded-md hover:bg-emerald-600 transition cursor-pointer text-sm font-medium"
        >
          <Pencil size={14} className="mr-1.5" /> Edit
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="flex items-center bg-rose-500/90 text-white px-3 py-1.5 rounded-md hover:bg-rose-600 transition cursor-pointer text-sm font-medium"
        >
          <Trash2 size={14} className="mr-1.5" /> Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DocumentCard;
