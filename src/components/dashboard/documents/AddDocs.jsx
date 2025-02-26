import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, FileText, X, Check } from "lucide-react";
import { addDocument } from "../../../service/authService";

const AddDocs = ({ onDocumentAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    content: "",
    status: "opened",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setNewDoc({ ...newDoc, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async () => {
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
      const addedDoc = await addDocument(
        newDoc.title,
        newDoc.content,
        newDoc.status
      );
      if (addedDoc) {
        onDocumentAdded(addedDoc);
        setShowForm(false);
        setNewDoc({ title: "", content: "", status: "opened" });
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
        className=" bg-gradient-to-br from-blue-500/20 to-purple-500/20 grid place-items-center rounded-lg cursor-pointer p-6 transition border border-slate-700 backdrop-blur-md h-full"
      >
        <div className="flex flex-col items-center">
          <PlusCircle size={48} className="text-blue-400 mb-2" />
          <p className="text-gray-200 font-medium">Add New Document card</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
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
              <div className="flex justify-between items-center mb-4 ">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FileText size={20} className="mr-2 text-blue-400" />
                  New Document cardsss
                </h2>
                <div
                  onClick={() => setShowForm(false)}
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
                    name="title"
                    value={newDoc.title}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Document Content
                  </label>
                  <textarea
                    name="content"
                    value={newDoc.content}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
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
                        checked={newDoc.status === "opened"}
                        onChange={handleChange}
                        className="form-radio text-blue-500"
                      />
                      <span>Opened</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-300">
                      <input
                        type="radio"
                        name="status"
                        value="public"
                        checked={newDoc.status === "public"}
                        onChange={handleChange}
                        className="form-radio text-blue-500"
                      />
                      <span>Public</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition focus:outline-none"
                >
                  {/* <X size={16} className="mr-1.5" />  */}
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition focus:outline-none ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      {/* <Check size={16} className="mr-1.5" />  */}
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
