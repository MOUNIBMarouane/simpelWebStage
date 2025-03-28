import React, { useState } from "react";
import { PlusCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";

const AddLine = ({ onLineAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
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

  const validateStep = () => {
    const currentField = steps[currentStep - 1].field;
    if (!newLine[currentField]?.trim()) {
      setErrors({ ...errors, [currentField]: "This field is required" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLine((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === steps.length) {
      if (validateStep()) {
        onLineAdded(newLine);
        setShowForm(false);
        setNewLine({ title: "", article: "", prix: "" });
        setCurrentStep(1);
      }
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
          type={current.field === "prix" ? "number" : "text"}
          name={current.field}
          value={newLine[current.field]}
          onChange={handleChange}
          className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
          placeholder={`Enter ${current.name.toLowerCase()}`}
          autoFocus
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
          className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 grid place-items-center p-2 w-2/3 rounded-lg cursor-pointer transition border border-slate-700 h-full"
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
          className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-slate-700"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PlusCircle size={20} className="text-blue-400" />
                Add New Line
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                    ${
                      currentStep >= step.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                >
                  {step.id}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {getCurrentStepContent()}

              <div className="flex justify-between gap-4 mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>
                ) : (
                  <div className="flex-1" />
                )}

                <button
                  type={currentStep === steps.length ? "submit" : "button"}
                  onClick={currentStep === steps.length ? null : handleNext}
                  className={`flex-1 py-2.5 text-white rounded-lg font-medium flex items-center justify-center gap-2 ${
                    currentStep === steps.length
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {currentStep === steps.length ? (
                    "Add Line"
                  ) : (
                    <>
                      Next
                      <ChevronRight size={18} />
                    </>
                  )}
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
