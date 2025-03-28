import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Hash,
  FileText,
  DollarSign,
} from "lucide-react";

const AddLine = ({ onLineAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    article: "",
    prix: "",
  });
  const [errors, setErrors] = useState({});

  // Total number of steps in the form
  const totalSteps = 3;

  const toggleForm = () => {
    setIsOpen(!isOpen);
    // Reset form when opening
    if (!isOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      article: "",
      prix: "",
    });
    setErrors({});
    setCurrentStep(1);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1 && !formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (step === 2 && !formData.article.trim()) {
      newErrors.article = "Article is required";
    }

    if (step === 3) {
      if (!formData.prix) {
        newErrors.prix = "Price is required";
      } else if (isNaN(formData.prix) || parseFloat(formData.prix) < 0) {
        newErrors.prix = "Price must be a valid positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateStep(currentStep)) {
      onLineAdded(formData);
      setIsOpen(false);
      resetForm();
    }
  };

  // Get icon and label for each step
  const getStepInfo = (step) => {
    switch (step) {
      case 1:
        return { icon: <FileText size={18} />, label: "Title" };
      case 2:
        return { icon: <Hash size={18} />, label: "Article" };
      case 3:
        return { icon: <DollarSign size={18} />, label: "Price" };
      default:
        return { icon: <Plus size={18} />, label: "Add" };
    }
  };

  // Form animation variants
  const formVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  // Step content animation variants
  const stepVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: (direction) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={toggleForm}
        className={`w-full flex items-center justify-center gap-2 p-2.5 rounded-lg transition-colors ${
          isOpen
            ? "bg-red-500/20 hover:bg-red-500/30 text-red-300"
            : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
        }`}
      >
        {isOpen ? (
          <>
            <X size={18} />
            <span>Cancel</span>
          </>
        ) : (
          <>
            <Plus size={18} />
            <span>Add Line</span>
          </>
        )}
      </button>

      {/* Form Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={formVariants}
            className="mt-4 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
          >
            <div className="p-4">
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-slate-300">
                    Step {currentStep} of {totalSteps}:{" "}
                    {getStepInfo(currentStep).label}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {Math.round((currentStep / totalSteps) * 100)}% Complete
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{
                      width: `${((currentStep - 1) / totalSteps) * 100}%`,
                    }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step Content */}
                <AnimatePresence mode="wait" custom={currentStep}>
                  {currentStep === 1 && (
                    <StepContent
                      key="step1"
                      custom={currentStep}
                      title="Line Title"
                      description="Enter a descriptive title for this line item"
                      icon={<FileText size={20} />}
                    >
                      <div className="mb-4">
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter line title"
                          className={`w-full p-2.5 bg-slate-700/50 border ${
                            errors.title ? "border-red-500" : "border-slate-600"
                          } text-white rounded focus:ring-blue-500 outline-none`}
                        />
                        {errors.title && (
                          <span className="text-xs text-red-400 mt-1 block">
                            {errors.title}
                          </span>
                        )}
                      </div>
                    </StepContent>
                  )}

                  {currentStep === 2 && (
                    <StepContent
                      key="step2"
                      custom={currentStep}
                      title="Article Reference"
                      description="Enter the article reference or code"
                      icon={<Hash size={20} />}
                    >
                      <div className="mb-4">
                        <input
                          type="text"
                          name="article"
                          value={formData.article}
                          onChange={handleChange}
                          placeholder="Enter article reference"
                          className={`w-full p-2.5 bg-slate-700/50 border ${
                            errors.article
                              ? "border-red-500"
                              : "border-slate-600"
                          } text-white rounded focus:ring-blue-500 outline-none`}
                        />
                        {errors.article && (
                          <span className="text-xs text-red-400 mt-1 block">
                            {errors.article}
                          </span>
                        )}
                      </div>
                    </StepContent>
                  )}

                  {currentStep === 3 && (
                    <StepContent
                      key="step3"
                      custom={currentStep}
                      title="Price"
                      description="Enter the price for this line item"
                      icon={<DollarSign size={20} />}
                    >
                      <div className="mb-4">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                            $
                          </span>
                          <input
                            type="number"
                            name="prix"
                            step="0.01"
                            min="0"
                            value={formData.prix}
                            onChange={handleChange}
                            placeholder="0.00"
                            className={`w-full pl-8 p-2.5 bg-slate-700/50 border ${
                              errors.prix
                                ? "border-red-500"
                                : "border-slate-600"
                            } text-white rounded focus:ring-blue-500 outline-none`}
                          />
                        </div>
                        {errors.prix && (
                          <span className="text-xs text-red-400 mt-1 block">
                            {errors.prix}
                          </span>
                        )}
                      </div>
                    </StepContent>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                      currentStep === 1
                        ? "bg-slate-700/30 text-slate-500 cursor-not-allowed"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Back
                  </button>

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2"
                    >
                      <Check size={16} />
                      Add Line
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Step Content Component
const StepContent = ({ children, title, description, icon, custom }) => {
  // Define step variants inside the component to ensure they're available
  const contentVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: (direction) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={custom}
      variants={contentVariants}
      className="space-y-4"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      <div className="pl-14">{children}</div>
    </motion.div>
  );
};

export default AddLine;
