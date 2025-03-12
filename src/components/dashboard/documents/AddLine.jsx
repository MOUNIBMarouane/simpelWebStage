import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const AddLine = ({ onLineAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [newLine, setNewLine] = useState({
    title: "",
    article: "",
    prix: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onLineAdded(newLine);
    setShowForm(false);
    setNewLine({ title: "", article: "", prix: "" });
  };

  return (
    <div>
      <motion.div
        onClick={() => setShowForm(true)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 grid place-items-center p-2 w-2/3 rounded-lg cursor-pointer transition border border-slate-700 h-full"
      >
        <div className="flex flex-row items-center">
          <PlusCircle size={24} className="text-blue-400" />
          <p className="text-gray-200 font-medium text-center pl-2">
            Add New Line
          </p>
        </div>
      </motion.div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
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
            <h2 className="text-xl font-bold text-white flex items-center">
              <PlusCircle size={20} className="mr-2 text-blue-400" />
              Add New Line
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newLine.title}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Article
                </label>
                <input
                  type="text"
                  name="article"
                  value={newLine.article}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  name="prix"
                  value={newLine.prix}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn"
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Add Line
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AddLine;
