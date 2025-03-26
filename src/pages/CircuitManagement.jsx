import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Trash,
  Eye,
  Key,
  Info,
  Check,
  Edit,
  Network,
} from "lucide-react";
import FormInput from "../components/FormInputs";

const CircuitManagement = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    circuitKey: "",
    title: "",
    descriptif: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [circuits, setCircuits] = useState([]);
  const [selectedCircuits, setSelectedCircuits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReview, setShowReview] = useState(false);
  const formRef = useRef(null);
  const [editingCircuit, setEditingCircuit] = useState(null);
  const [circuitDetails, setCircuitDetails] = useState([]);
  const formContainerRef = useRef(null);

  const handleModifyCircuit = (circuit) => {
    setEditingCircuit(circuit);
    setFormData({
      circuitKey: circuit.circuitKey,
      title: circuit.title,
      descriptif: circuit.descriptif,
      isActive: circuit.isActive,
    });
    formContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // Fetch circuits on mount
  useEffect(() => {
    fetchCircuits();
  }, []);

  const fetchCircuits = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5204/api/circuit", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCircuits(response.data);
    } catch (error) {
      console.error("Error fetching circuits:", error);
    }
  };

  const validateStep = () => {
    if (step === 1 && !formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (step === 2 && !formData.descriptif.trim()) {
      setError("Description is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const url = editingCircuit
        ? `http://localhost:5204/api/circuit/${editingCircuit.id}`
        : "http://localhost:5204/api/circuit";

      const method = editingCircuit ? "put" : "post";

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      toast.success(
        `Circuit ${editingCircuit ? "updated" : "created"} successfully!`
      );
      fetchCircuits();
      resetForm();
    } catch (err) {
      toast.error(`Failed to ${editingCircuit ? "update" : "create"} circuit`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCircuitDetails = async (circuitId) => {
    try {
      const response = await axios.get(
        `http://localhost:5204/api/circuitdetail/bycircuit/${circuitId}`
      );
      setCircuitDetails(response.data);
    } catch (error) {
      console.error("Error fetching circuit details:", error);
    }
  };

  const handleAddDetail = async (circuitId) => {
    // Implement detail creation logic
  };

  const resetForm = () => {
    setFormData({
      circuitKey: "",
      title: "",
      descriptif: "",
      isActive: true,
    });
    setStep(1);
    setShowReview(false);
  };

  const handleDeleteCircuit = async (id) => {
    toast.info(
      <div className="p-4">
        <p className="font-semibold flex items-center gap-2">
          <Trash size={18} />
          Delete this circuit?
        </p>
        <div className="flex gap-4 mt-4 text-white">
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 cursor-pointer"
            onClick={async () => {
              try {
                const accessToken = localStorage.getItem("accessToken");
                await axios.delete(`http://localhost:5204/api/circuit/${id}`, {
                  headers: { Authorization: `Bearer ${accessToken}` },
                });
                toast.success("Circuit deleted");
                fetchCircuits();
              } catch (err) {
                toast.error("Delete failed");
              } finally {
                toast.dismiss();
              }
            }}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        toastId: "delete-circuit",
      }
    );
  };

  return (
    <div className="w-full h-full max-h-full mx-auto relative">
      <div className="h-11/12 py-2 px-4">
        <div className="flex items-center justify-between mb-4">
          <div
            onClick={() => navigate("/documents")}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="text-lg font-semibold">Back to Documents</span>
          </div>
        </div>

        {/* Creation Workflow */}
        <div className="flex gap-6 h-11/12 mb-4">
          {/* Form Section */}
          <div className="w-1/3 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  New Circuit
                </h2>
                {step > 1 && (
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                      ${
                        step >= s
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-400"
                      }`}
                  >
                    {s}
                  </div>
                ))}
              </div>

              <form ref={formRef} className="space-y-6">
                {step === 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Title *
                    </label>
                    <FormInput
                      label="Circuit Title *"
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter circuit title"
                      autoFocus
                    />
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="Description"
                      value={formData.descriptif}
                      onChange={(e) =>
                        setFormData({ ...formData, descriptif: e.target.value })
                      }
                      placeholder="Describe the circuit purpose"
                      rows={4}
                      className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-gray-300">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded bg-gray-700 border-gray-600"
                      />
                      Active Status
                    </label>
                  </div>
                )}

                {error && <div className="text-red-400 text-sm">{error}</div>}

                <div className="flex justify-between gap-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft size={18} />
                      Back
                    </button>
                  ) : (
                    <div className="flex-1" /> // Spacer
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowReview(true)}
                      className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      Create
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Circuits List */}
          <div className="flex-1 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-blue-400">
                Existing Circuits
              </h3>
              <input
                type="text"
                placeholder="Search circuits..."
                className="bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {circuits.map((circuit) => (
                <motion.div
                  key={circuit.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-900/50 p-4 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Network size={18} className="text-blue-400" />
                        <span className="font-semibold">{circuit.title}</span>
                        {circuit.isActive && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            Active
                          </span>
                        )}
                        {!circuit.isActive && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                            inActive
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {circuit.descriptif}
                      </p>
                    </div>
                    {/* <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"> */}
                    <div className="flex gap-3">
                      <div
                        className="p-2 hover:bg-gray-800 rounded-lg text-blue-400"
                        onClick={() => handleModifyCircuit(circuit.id)}
                      >
                        <Edit size={18} />
                      </div>
                      <div
                        className="p-2 hover:bg-red-400 hover:text-white rounded-lg text-red-400 cursor-pointer"
                        onClick={() => handleDeleteCircuit(circuit.id)}
                      >
                        <Trash size={18} />
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowReview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-400">
                  Review Circuit
                </h3>
                <button
                  onClick={() => setShowReview(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <ReviewItem label="Title" value={formData.title} />
                <ReviewItem label="Description" value={formData.descriptif} />
                <ReviewItem
                  label="Status"
                  value={formData.isActive ? "Active" : "Inactive"}
                  className={
                    formData.isActive ? "text-green-400" : "text-red-400"
                  }
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setShowReview(false);
                  }}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  <Edit size={18} /> Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  {loading ? "Saving..." : "Confirm"}
                  {!loading && <Check size={18} />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-right" />
    </div>
  );
};

const ReviewItem = ({ label, value, className }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}:</span>
    <span className={`text-white ${className}`}>{value || "-"}</span>
  </div>
);

export default CircuitManagement;
