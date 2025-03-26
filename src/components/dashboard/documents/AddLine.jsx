import React, { useState } from "react";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const AddLine = ({ onLineAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newLine, setNewLine] = useState({
    title: "",
    article: "",
    prix: "",
  });
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, name: "Title", field: "title" },
    { id: 2, name: "Article", field: "article" },
    { id: 3, name: "Price", field: "prix" },
  ];

  const handleNext = () => {
    const currentField = steps[currentStep - 1].field;
    if (!validateField(currentField)) return;
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateField = (field) => {
    if (!newLine[field]) {
      setErrors({ ...errors, [field]: "This field is required" });
      return false;
    }
    setErrors({ ...errors, [field]: "" });
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLine((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === steps.length) {
      onLineAdded(newLine);
      setShowForm(false);
      setNewLine({ title: "", article: "", prix: "" });
      setCurrentStep(1);
    }
  };
const getCurrentStepContent = () => {
  const current = steps[currentStep - 1];
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {current.name}
      </label>
      <input
        type="text"
        name={current.field}
        value={newLine[current.field]}
        onChange={handleChange}
        className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
      />
      {errors[current.field] && (
        <p className="text-red-400 text-sm mt-1">{errors[current.field]}</p>
      )}
    </div>
  );
};

  return (
    <div className="w-full h-full">
      <div>
        <motion.div
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br  from-blue-500/20 to-purple-500/20 grid place-items-center p-2 w-2/3 rounded-lg cursor-pointer transition border border-slate-700 h-full"
        >
          <div className="flex flex-row items-center">
            <PlusCircle size={24} className="text-blue-400" />
            <p className="text-gray-200 font-medium text-center pl-2">
              Add New Line
            </p>
          </div>
        </motion.div>
      </div>
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
                <div
                  type="div"
                  onClick={() => setShowForm(false)}
                  className="btn"
                >
                  Cancel
                </div>
                <div type="submit" className="btn">
                  Add Line
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AddLine;
