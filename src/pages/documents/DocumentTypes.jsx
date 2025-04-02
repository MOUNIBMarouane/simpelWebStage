import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  X,
  Save,
  FileText,
  Eye,
  Trash,
  Tag,
  Code,
  ChevronLeft,
  ChevronRight,
  Edit,
  Check,
  Network,
  Search,
} from "lucide-react";
import { TypeDocExist } from "../service/docSrvice";
import FormInput from "../components/FormInputs";

const AddDocumentType = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    typeName: "",
    typeAttr: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const formRef = useRef(null);
  const headerCheckboxRef = useRef(null);

  // Fetch document types on mount
  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      const allSelected =
        selectedDocs.length === documentTypes.length &&
        documentTypes.length > 0;
      const someSelected =
        selectedDocs.length > 0 && selectedDocs.length < documentTypes.length;
      headerCheckboxRef.current.checked = allSelected;
      headerCheckboxRef.current.indeterminate = someSelected;
    }
  }, [selectedDocs, documentTypes]);

  const filteredDocumentTypes = documentTypes.filter((doc) =>
    Object.values(doc).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const fetchDocumentTypes = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:5204/api/Documents/Types",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setDocumentTypes(response.data);
    } catch (error) {
      console.error("Error fetching document types:", error);
      toast.error("Failed to load document types");
    }
  };

  const handleModifyType = (type) => {
    setEditingType(type);
    setFormData({
      typeName: type.typeName,
      typeAttr: type.typeAttr || "",
    });
    setStep(1);
  };

  const handleSelectDoc = (typeKey) => {
    setSelectedDocs((prev) =>
      prev.includes(typeKey)
        ? prev.filter((key) => key !== typeKey)
        : [...prev, typeKey]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDocs(documentTypes.map((doc) => doc.id));
    } else {
      setSelectedDocs([]);
    }
  };

  const validateStep = async () => {
    if (step === 1 && !formData.typeName.trim()) {
      setError("Type Name is required");
      return false;
    }

    if (step === 1 && !editingType) {
      const typeExists = await TypeDocExist(formData.typeName);
      if (typeExists === "True") {
        setError("Type Name is already in use!");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (!isValid) return;
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    setFormData({
      typeName: "",
      typeAttr: "",
    });
    setEditingType(null);
    setStep(1);
    setShowReview(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const url = editingType
        ? `http://localhost:5204/api/Documents/Types/${editingType.id}`
        : "http://localhost:5204/api/Documents/Types";

      const method = editingType ? "put" : "post";

      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      toast.success(
        `Document type ${editingType ? "updated" : "created"} successfully!`
      );
      fetchDocumentTypes();
      resetForm();
      setShowReview(false);
    } catch (err) {
      toast.error(
        `Failed to ${editingType ? "update" : "create"} document type`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocumentType = async (id) => {
    toast.info(
      <div className="p-4">
        <p className="font-semibold flex items-center gap-2">
          <Trash size={18} />
          Delete this document type?
        </p>
        <div className="flex gap-4 mt-4 text-white">
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 cursor-pointer"
            onClick={async () => {
              try {
                const accessToken = localStorage.getItem("accessToken");
                await axios.delete(
                  `http://localhost:5204/api/Documents/Types/${id}`,
                  {
                    headers: { Authorization: `Bearer ${accessToken}` },
                  }
                );
                toast.success("Document type deleted successfully");
                fetchDocumentTypes();
              } catch (err) {
                toast.error("Failed to delete document type");
              } finally {
                toast.dismiss("delete-doc-type");
              }
            }}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() => toast.dismiss("delete-doc-type")}
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
        toastId: "delete-doc-type",
      }
    );
  };

  const handleDeleteMultiple = async () => {
    if (!selectedDocs.length) return;

    const originalTypes = documentTypes;

    toast.info(
      <div className="p-4">
        <p className="font-semibold flex items-center gap-2">
          <Trash size={18} />
          Delete {selectedDocs.length} document type
          {selectedDocs.length > 1 ? "s" : ""}?
        </p>
        <div className="flex gap-4 mt-4 text-white">
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 cursor-pointer"
            onClick={async () => {
              try {
                const accessToken = localStorage.getItem("accessToken");
                await Promise.all(
                  selectedDocs.map((id) =>
                    axios.delete(
                      `http://localhost:5204/api/Documents/Types/${id}`,
                      {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      }
                    )
                  )
                );
                toast.success(
                  `${selectedDocs.length} type${
                    selectedDocs.length > 1 ? "s" : ""
                  } deleted`
                );
                fetchDocumentTypes();
                setSelectedDocs([]);
              } catch (err) {
                setDocumentTypes(originalTypes);
                toast.error("Failed to delete document types");
              } finally {
                toast.dismiss("delete-multiple");
              }
            }}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() => {
              toast.dismiss("delete-multiple");
            }}
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
        toastId: "delete-multiple",
      }
    );
  };

  return (
    <div className="w-full h-full max-h-full mx-auto">
      <div className="h-11/12 py-2 px-4">
        <div className="w-full flex justify-between items-center mb-4">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div
            onClick={() => navigate("/documents")}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="text-lg font-semibold">Back to Documents</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Document Type Manager
          </h1>
        </div>

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
                  {editingType ? "Edit Document Type" : "New Document Type"}
                </h2>
                {editingType && (
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2].map((s) => (
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
                      Type Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Tag
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        id="typeName"
                        value={formData.typeName}
                        onChange={(e) =>
                          setFormData({ ...formData, typeName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Enter document type name"
                        autoFocus
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      This name will be used to identify the document type in
                      the system
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Attributes
                    </label>
                    <div className="relative">
                      <Code
                        className="absolute left-3 top-8 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <textarea
                        id="typeAttr"
                        value={formData.typeAttr}
                        onChange={(e) =>
                          setFormData({ ...formData, typeAttr: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[150px] resize-none"
                        placeholder="Enter JSON attributes structure"
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      Optional: Add JSON structure for document type attributes
                    </p>
                  </div>
                )}

                {error && (
                  <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                    {error}
                  </div>
                )}

                <div className="flex justify-between gap-4 mt-auto">
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
                    <div className="flex-1" /> // Spacer for single button in first step
                  )}

                  {step < 2 ? (
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
                      {editingType ? "Update" : "Create"}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Document Types List */}
          <div className="flex-1 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-blue-400">
                Existing Document Types
              </h3>

              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search document types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-900 w-full border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    ref={headerCheckboxRef}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded-md bg-gray-700 border-gray-600"
                  />
                  <span className="text-sm text-gray-400">Select All</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {filteredDocumentTypes.length > 0 ? (
                  filteredDocumentTypes.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="group bg-gray-900/50 hover:bg-gray-900 p-4 rounded-lg mb-3 transition-all border border-gray-800 hover:border-blue-500/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedDocs.includes(doc.id)}
                            onChange={() => handleSelectDoc(doc.id)}
                            className="w-5 h-5 rounded-md bg-gray-700 border-gray-600"
                          />
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <FileText className="text-blue-400" size={20} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-white">
                              {doc.typeName}
                            </h4>
                            <p className="text-sm text-gray-400">
                              Key: {doc.typeKey}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div
                            className="p-2 hover:bg-gray-800 rounded-lg text-blue-400 cursor-pointer"
                            onClick={() => setSelectedType(doc)}
                          >
                            <Eye size={18} />
                          </div>
                          <div
                            className="p-2 hover:bg-gray-800 rounded-lg text-blue-400 cursor-pointer"
                            onClick={() => handleModifyType(doc)}
                          >
                            <Edit size={18} />
                          </div>
                          <div
                            className="p-2 hover:bg-red-400 hover:text-white rounded-lg text-red-400 cursor-pointer"
                            onClick={() => handleDeleteDocumentType(doc.id)}
                          >
                            <Trash size={18} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    {searchQuery ? (
                      <div>
                        <p>No document types found matching "{searchQuery}"</p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="mt-2 text-blue-400 hover:text-blue-300"
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      <p>No document types found. Create your first one!</p>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Document Type Details Modal */}
      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedType(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-gray-800/90 border border-gray-700 rounded-xl p-6 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                  <FileText size={20} />
                  {selectedType.typeName} Details
                </h3>
                <X
                  size={20}
                  className="text-gray-400 hover:text-white cursor-pointer"
                  onClick={() => setSelectedType(null)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <DetailItem label="Type Name" value={selectedType.typeName} />
                <DetailItem label="Type Key" value={selectedType.typeKey} />
                <DetailItem
                  label="Created Date"
                  value={new Date(selectedType.createdAt).toLocaleDateString()}
                />
                <DetailItem
                  label="Used In"
                  value={`${selectedType.documents?.length || 0} document(s)`}
                />

                <div className="col-span-2">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">
                    Attributes
                  </h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <pre className="text-white text-sm overflow-auto whitespace-pre-wrap max-h-40">
                      {selectedType.typeAttr || "No attributes defined"}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => {
                    handleModifyType(selectedType);
                    setSelectedType(null);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setSelectedType(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  Review Document Type
                </h3>
                <button
                  onClick={() => setShowReview(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <ReviewItem label="Type Name" value={formData.typeName} />
                <ReviewItem
                  label="Attributes"
                  value={formData.typeAttr || "No attributes defined"}
                  isCode={true}
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
                  {loading ? "Saving..." : editingType ? "Update" : "Create"}
                  {!loading && <Check size={18} />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Delete Action Bar */}
      <AnimatePresence>
        {selectedDocs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 left-4 bg-gray-800 border border-red-500/30 flex justify-between items-center p-4 rounded-lg shadow-lg backdrop-blur-sm z-40"
          >
            <div className="text-white">
              <span className="font-semibold">{selectedDocs.length}</span>{" "}
              document type(s) selected
            </div>
            <div className="flex gap-3">
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                onClick={() => setSelectedDocs([])}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 flex gap-2 text-white px-4 py-2 hover:bg-red-700 transition rounded-lg"
                onClick={handleDeleteMultiple}
              >
                <Trash size={20} />
                Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailItem = ({ label, value, className }) => (
  <div className="bg-gray-900/30 p-3 rounded-lg">
    <span className="text-gray-400 text-sm block mb-1">{label}</span>
    <span className={`text-white font-medium ${className}`}>
      {value || "-"}
    </span>
  </div>
);

const ReviewItem = ({ label, value, className, isCode }) => (
  <div className="flex flex-col">
    <span className="text-gray-400 mb-1">{label}:</span>
    {isCode ? (
      <pre className="text-white text-sm bg-gray-900/50 p-3 rounded-lg overflow-auto whitespace-pre-wrap max-h-32">
        {value || "-"}
      </pre>
    ) : (
      <span className={`text-white ${className}`}>{value || "-"}</span>
    )}
  </div>
);

export default AddDocumentType;
