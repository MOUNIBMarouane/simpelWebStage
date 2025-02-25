import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, FileText, X, Check } from "lucide-react";
import { addDocument } from "../../../service/authService";

const AddDocs = ({ onDocumentAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setNewDoc({ ...newDoc, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!newDoc.title.trim()) {
      setError("Please enter a title for your document");
      return;
    }

    if (!newDoc.content.trim()) {
      setError("Please add some content to your document");
      return;
    }

    setIsSubmitting(true);

    try {
      const addedDoc = await addDocument(newDoc.title, newDoc.content);
      if (addedDoc) {
        onDocumentAdded(addedDoc);
        setShowForm(false);
        setNewDoc({ title: "", content: "" });
      } else {
        setError("Failed to add document. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while saving your document");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        onClick={() => setShowForm(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 grid place-items-center rounded-lg cursor-pointer p-6 transition border border-slate-700 backdrop-blur-md h-full"
      >
        <div className="flex flex-col items-center">
          <PlusCircle size={48} className="text-blue-400 mb-2" />
          <p className="text-gray-200 font-medium">Add New Document</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForm(false);
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
                  New Document
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-3 py-2 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Document Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter a descriptive title..."
                    value={newDoc.title}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Document Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    placeholder="Write your document content here..."
                    value={newDoc.content}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition focus:outline-none flex items-center"
                >
                  <X size={16} className="mr-1.5" />
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition focus:outline-none flex items-center ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-1.5" />
                      Save Document
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddDocs;
