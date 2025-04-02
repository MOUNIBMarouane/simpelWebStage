import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  X,
  Plus,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";

const SubLineModal = ({ isOpen, onClose, subLine, onSave, mode = "add" }) => {
  const [formData, setFormData] = useState({
    title: subLine?.title || "",
    attribute: subLine?.attribute || "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form data when subLine changes
  useEffect(() => {
    if (subLine) {
      setFormData({
        title: subLine.title || "",
        attribute: subLine.attribute || "",
      });
      // In edit mode, we still start at step 1
      setCurrentStep(1);
    } else {
      setFormData({
        title: "",
        attribute: "",
      });
      setCurrentStep(1);
    }
  }, [subLine]);

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      }
    } else if (currentStep === 2) {
      if (!formData.attribute.trim()) {
        newErrors.attribute = "Attribute is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep < 3) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(`Failed to ${mode} subline:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-700/50 bg-slate-700/30 px-5 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {mode === "add" ? (
              <Plus size={18} className="text-green-400" />
            ) : (
              <Save size={18} className="text-blue-400" />
            )}
            {mode === "add" ? "Add New Subline" : "Edit Subline"} - Step{" "}
            {currentStep}/3
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-700/50 transition-colors"
          >
            <X
              size={20}
              className="text-slate-400 hover:text-white transition-colors"
            />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-700">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: "33.33%" }}
            animate={{
              width:
                currentStep === 1
                  ? "33.33%"
                  : currentStep === 2
                  ? "66.66%"
                  : "100%",
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between px-10 py-3 bg-slate-800/80">
          <div
            className={`flex flex-col items-center ${
              currentStep >= 1 ? "text-blue-400" : "text-slate-500"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-slate-700 bg-slate-800"
              }`}
            >
              1
            </div>
            <span className="text-xs mt-1">Title</span>
          </div>
          <div
            className={`flex flex-col items-center ${
              currentStep >= 2 ? "text-blue-400" : "text-slate-500"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-slate-700 bg-slate-800"
              }`}
            >
              2
            </div>
            <span className="text-xs mt-1">Attribute</span>
          </div>
          <div
            className={`flex flex-col items-center ${
              currentStep >= 3 ? "text-blue-400" : "text-slate-500"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 3
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-slate-700 bg-slate-800"
              }`}
            >
              3
            </div>
            <span className="text-xs mt-1">Review</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <AnimatePresence mode="wait">
            {currentStep === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-slate-700/20 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      1
                    </div>
                    Enter Subline Title
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 ml-8">
                    Provide a descriptive title for this subline
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full p-2.5 bg-slate-700/50 border ${
                      errors.title ? "border-red-500" : "border-slate-600"
                    } text-white rounded-lg focus:ring-blue-500 outline-none`}
                    placeholder="Enter subline title"
                    autoFocus
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertTriangle size={14} />
                      {errors.title}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : currentStep === 2 ? (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-slate-700/20 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      2
                    </div>
                    Set Attribute Value
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 ml-8">
                    Specify the attribute value for this subline
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="attribute"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Attribute <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="attribute"
                    name="attribute"
                    type="text"
                    value={formData.attribute}
                    onChange={handleChange}
                    className={`w-full p-2.5 bg-slate-700/50 border ${
                      errors.attribute ? "border-red-500" : "border-slate-600"
                    } text-white rounded-lg focus:ring-blue-500 outline-none`}
                    placeholder="Enter attribute value"
                    autoFocus
                  />
                  {errors.attribute && (
                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                      <AlertTriangle size={14} />
                      {errors.attribute}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-slate-700/20 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      3
                    </div>
                    Review Subline
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 ml-8">
                    Please review your subline information before submitting
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg border border-slate-600/50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-700/50 border-b border-slate-600/50 flex items-center">
                    <FileText size={16} className="text-blue-400 mr-2" />
                    <span className="text-slate-300 font-medium">
                      Subline Preview
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <span className="text-sm text-slate-400 block mb-1">
                        Title
                      </span>
                      <div className="p-2 bg-slate-700/50 rounded border border-slate-600/50 text-white">
                        {formData.title}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400 block mb-1">
                        Attribute
                      </span>
                      <div className="p-2 bg-slate-700/50 rounded border border-slate-600/50 text-white">
                        {formData.attribute}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-4">
                  <div className="flex items-start">
                    <CheckCircle
                      size={18}
                      className="text-green-400 mt-0.5 flex-shrink-0 mr-2"
                    />
                    <p className="text-sm text-green-300">
                      All required information has been provided. You're ready
                      to{" "}
                      {mode === "add"
                        ? "add this subline"
                        : "save these changes"}
                      .
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <ChevronLeft size={18} className="mr-1" />
                Back
              </button>
            )}

            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 ${
                isSubmitting
                  ? "bg-blue-600/70"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
              } text-white rounded-lg transition-colors flex justify-center items-center shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
              ) : currentStep < 3 ? (
                <>
                  Continue
                  <ChevronRight size={18} className="ml-1" />
                </>
              ) : (
                <>
                  {mode === "add" ? (
                    <>
                      <Plus size={18} className="mr-1" />
                      Add Subline
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-1" />
                      Save Changes
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default SubLineModal;
