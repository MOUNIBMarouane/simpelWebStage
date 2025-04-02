import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Edit,
  CheckCircle,
  AlertTriangle,
  CircuitBoard,
} from "lucide-react";

const CircuitModal = ({ isOpen, onClose, circuit, onSave, mode = "add" }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: circuit?.name || "",
    description: circuit?.description || "",
    configuration: circuit?.configuration || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (circuit) {
      setFormData({
        name: circuit.name,
        description: circuit.description,
        configuration: JSON.stringify(circuit.configuration, null, 2),
      });
    }
  }, [circuit]);

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.name.trim()) {
      newErrors.name = "Circuit name is required";
    }
    if (step === 2 && !formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step < 3) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        configuration: JSON.parse(formData.configuration),
      });
      onClose();
      toast.success(
        `Circuit ${mode === "add" ? "created" : "updated"} successfully`
      );
    } catch (error) {
      toast.error(`Error ${mode === "add" ? "creating" : "updating"} circuit`);
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CircuitBoard size={20} />
            {mode === "add" ? "New Circuit" : "Edit Circuit"} - Step {step}/3
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-700 mb-6 rounded-full">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="bg-gray-700/20 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      1
                    </span>
                    Circuit Basics
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Circuit Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full p-3 bg-gray-900 rounded-lg border ${
                      errors.name ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle size={14} /> {errors.name}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="bg-gray-700/20 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      2
                    </span>
                    Circuit Details
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={`w-full p-3 bg-gray-900 rounded-lg border ${
                      errors.description ? "border-red-500" : "border-gray-700"
                    } min-h-[120px]`}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle size={14} /> {errors.description}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="bg-gray-700/20 p-4 rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      3
                    </span>
                    Configuration Review
                  </h3>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <pre className="text-sm overflow-auto max-h-96">
                    {JSON.stringify(formData.configuration, null, 2)}
                  </pre>
                </div>

                <div className="bg-green-500/10 p-4 rounded-lg flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-400" />
                  <p className="text-green-300">
                    All required information provided and validated
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2"
              >
                <ChevronLeft size={18} /> Back
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center gap-2 ${
                isSubmitting ? "opacity-70" : ""
              }`}
            >
              {isSubmitting ? (
                "Processing..."
              ) : step < 3 ? (
                <>
                  Continue <ChevronRight size={18} />
                </>
              ) : (
                <>
                  {mode === "add" ? "Create Circuit" : "Update Circuit"}{" "}
                  <Save size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Usage in parent component
const CircuitManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState(null);

  const handleSaveCircuit = async (data) => {
    const url = selectedCircuit
      ? `/api/circuits/${selectedCircuit.id}`
      : "/api/circuits";

    await axios({
      method: selectedCircuit ? "put" : "post",
      url,
      data,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setSelectedCircuit(null);
          setIsModalOpen(true);
        }}
      >
        New Circuit
      </button>

      <CircuitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        circuit={selectedCircuit}
        onSave={handleSaveCircuit}
        mode={selectedCircuit ? "edit" : "add"}
      />
    </>
  );
};
