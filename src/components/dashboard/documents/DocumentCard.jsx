import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash, Calendar, FileText, X } from "lucide-react";

const DocumentCard = ({
  title,
  date,
  description,
  status,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editStatus, setEditStatus] = useState(status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Format date for better readability
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const truncatedDescription =
    description.length > 120
      ? `${description.substring(0, 120)}...`
      : description;

  // Open modal and set current values
  const handleEditClick = () => {
    setEditTitle(title);
    setEditDescription(description);
    setEditStatus(status);
    setIsEditing(true);
  };

  // Handle Save Changes
  const handleSave = () => {
    if (!editTitle.trim()) {
      setError("Title is required");
      return;
    }
    if (!editDescription.trim()) {
      setError("Description cannot be empty");
      return;
    }

    onEdit(editTitle, editDescription, editStatus);
    setIsEditing(false);
  };

  return (
    <>
      {/* Main Document Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-lg rounded-lg p-4 border border-slate-700 hover:shadow-xl transition transform hover:scale-102 backdrop-blur-md w-full"
      >
        <div className="w-full flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
            <Calendar size={12} className="mr-1" />
            {formattedDate}
          </span>
        </div>

        <div className="w-full flex items-start mb-4">
          <FileText
            size={16}
            className="text-gray-400 mt-1 mr-2 flex-shrink-0"
          />
          <p className="text-gray-300 text-sm">{truncatedDescription}</p>
        </div>

        <div className="w-full flex justify-end mt-4">
          <div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEditClick}
            className="flex items-center mr-4 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-600 transition cursor-pointer text-sm font-medium"
          >
            <Pencil size={14} className="mr-1" /> Edit
          </div>
          <div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="flex items-center bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition cursor-pointer text-sm font-medium"
          >
            <Trash size={14} className="mr-1" /> Delete
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsEditing(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 border border-slate-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FileText size={20} className="mr-2 text-blue-400" />
                Edit Document
              </h2>
              <div
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-white transition cursor-pointer"
              >
                <X size={20} />
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-3 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Document Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="radio"
                      name="status"
                      value="opened"
                      checked={editStatus === "opened"}
                      onChange={() => setEditStatus("opened")}
                      className="form-radio text-blue-500"
                    />
                    <span>Opened</span>
                  </label>
                  <label className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="radio"
                      name="status"
                      value="public"
                      checked={editStatus === "public"}
                      onChange={() => setEditStatus("public")}
                      className="form-radio text-blue-500"
                    />
                    <span>Public</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default DocumentCard;
