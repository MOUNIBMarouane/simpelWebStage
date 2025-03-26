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
  Key,
  Tag,
  Code,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { TypeDocExist } from "../service/docSrvice";

const AddDocumentType = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    typeAlias: "",
    typeName: "",
    typeAttr: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const headerCheckboxRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);

  const filteredDocumentTypes = documentTypes.filter((doc) =>
    Object.values(doc).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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

  useEffect(() => {
    fetchDocumentTypes();
  }, []);
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

  const handleDeleteDocumentTypes = async () => {
    if (!selectedDocs.length) return;

    const originalTypes = documentTypes;

    setDocumentTypes((prev) =>
      prev.filter((doc) => !selectedDocs.includes(doc.id))
    );
    setSelectedDocs([]);

    toast.info(
      <div className="p-4">
        <p className="font-semibold flex items-center gap-2">
          <Trash size={18} />
          Delete {selectedDocs.length} document type
          {selectedDocs.length > 1 ? "s" : ""}?
        </p>
        <div className="flex gap-4 mt-4 text-white">
          <div
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
                fetchDocumentTypes(); // Refresh list
              } catch (err) {
                setDocumentTypes(originalTypes);
                toast.error("Failed to delete document types");
              } finally {
                toast.dismiss("delete-doc-types"); // Hide toast on confirm
              }
            }}
          >
            Confirm
          </div>
          <div
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() => {
              setDocumentTypes(originalTypes);
              toast.dismiss("delete-doc-types");
            }}
          >
            Cancel
          </div>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        toastId: "delete-doc-types",
      }
    );
  };

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
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateStep = async () => {
    const TypenameExist = await TypeDocExist(formData.typeName);
    console.log("Is type exist", TypenameExist);

    if (step === 1 && !formData.typeName) {
      setError("Type Name is required");
      return false;
    }
    if (step === 1 && TypenameExist === "True") {
      setError("Type Name is alredy in used !");
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(); // Wait for validation result
    if (!isValid) return; // Stop if validation fails
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post("http://localhost:5204/api/Documents/Types", formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFormData({ typeAlias: "", typeName: "", typeAttr: "" });
      fetchDocumentTypes();
      setStep(1);
    } catch (err) {
      setError("Failed to add document type. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const DeleteDocType = async (id) => {
    toast.info(
      <div className="p-4">
        <p className="font-semibold flex items-center gap-2">
          <Trash size={18} />
          Are you sure you want to delete this document type?
        </p>
        <div className="flex gap-4 mt-4 text-white">
          <div
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
                fetchDocumentTypes(); // Refresh list after deletion
              } catch (err) {
                toast.error("Failed to delete document type");
              } finally {
                toast.dismiss("delete-doc-type"); // Hide toast on confirm
              }
            }}
          >
            Confirm
          </div>
          <div
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() => toast.dismiss("delete-doc-type")}
          >
            Cancel
          </div>
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

  return (
    <div className="w-full h-full max-h-full mx-auto">
      <div className="h-11/12 py-2 px-4">
        <div className="w-full flex justify-between items-center mb-4 ">
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
        {/* Add bulk delete button */}

        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate("/documents")}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-lg font-semibold">Back to Documents</span>
          </div>
        </div>

        <div className="flex gap-6 h-11/12 mb-4">
          {/* Stepped Form */}
          <div className="w-1/3 flex flex-col">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  New Document Type
                </h2>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`w-8 h-8 rounded-full flex items-center justify-center 
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
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <div className="relative">
                    <label className=" w-full  flex justify-start text-sm font-medium mb-2 text-gray-300">
                      Type Name *
                    </label>
                    <div className="relative">
                      <Tag
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        id="typeName"
                        value={formData.typeName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Document type name"
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="relative">
                    <label className=" w-full  flex justify-start text-sm font-medium mb-2 text-gray-300">
                      Type Alias
                    </label>
                    <div className="relative">
                      <input
                        id="typeAlias"
                        value={formData.typeAlias}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Type Alias "
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="relative">
                    <label className=" w-full  flex justify-start text-sm font-medium mb-2 text-gray-300">
                      Attributes
                    </label>
                    <div className="relative">
                      <Code
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        id="typeAttr"
                        value={formData.typeAttr}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="JSON attributes structure"
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {error && <div className="text-red-400 text-sm">{error}</div>}

                <div className="flex justify-between gap-4">
                  {step > 1 && (
                    <div
                      type="div"
                      onClick={handleBack}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronLeft size={18} />
                      Back
                    </div>
                  )}

                  {step < 3 ? (
                    <div
                      type="div"
                      onClick={handleNext}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      Next
                      <ChevronRight size={18} />
                    </div>
                  ) : (
                    <div
                      type="submit"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Save size={18} />
                      {loading ? "Saving..." : "Create"}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Document Types List */}
          <div className="flex-1 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-blue-400">
                  Existing Document Types
                </h3>
              </div>
            </div>
            <div className="h-full p-2">
              <div className=" flex justify-between px-1">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-900 border border-gray-700 text-white px-2 py-2 mb-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <div className="flex items-center mr-1 gap-2">
                  <input
                    type="checkbox"
                    ref={headerCheckboxRef}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded-md bg-gray-700 border-gray-600"
                  />
                  <span className="text-sm text-gray-400">Select All</span>
                </div>
              </div>
              <div className="h-10/12 overflow-y-auto p-2">
                {filteredDocumentTypes.map((doc) => (
                  <div
                    key={doc.id}
                    className="group bg-gray-900/50 hover:bg-gray-900 p-4 rounded-lg mb-3 transition-all border border-gray-800 hover:border-blue-500/30 m-1"
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
                          <h4 className="font-semibold text-lg">
                            {doc.typeName}
                          </h4>
                          <p className="text-sm text-gray-400">
                            Key: {doc.typeKey}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                          className="p-2 hover:bg-gray-800 rounded-lg text-blue-400"
                          onClick={() => setSelectedType(doc)}
                        >
                          <Eye size={18} />
                        </div>
                        <div
                          className="p-2 hover:bg-red-400 hover:text-white rounded-lg text-red-400 cursor-pointer"
                          onClick={() => DeleteDocType(doc.id)}
                        >
                          <Trash size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/90 border border-gray-700 rounded-xl p-6 w-full max-w-2xl"
          >
            <div className="flex justify-between items-start mb-4">
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

            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Type Name" value={selectedType.typeName} />
              <DetailItem label="Type Key" value={selectedType.typeKey} />
              <DetailItem
                label="Type Alias"
                value={selectedType.typeAlias || "-"}
              />
              <DetailItem
                label="Created Date"
                value={new Date(selectedType.createdAt).toLocaleDateString()}
              />
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">
                  Attributes
                </h4>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <DetailItem
                    label="Attributes"
                    value={selectedType.typeAttr}
                  />
                </div>
              </div>
              <div className="col-span-2 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Info size={16} />
                  <span>
                    Used in {selectedType.documents?.length || 0} documents
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {selectedDocs.length > 0 && (
        <div className="w-full h-1/12 bg-gradient-to-r from-white via-white to-red-500 border flex justify-end items-center p-6 relative bottom-0 left-0 rounded-lg backdrop-blur-sm">
          <div className="flex gap-4">
            <div
              className="bg-red-600 flex gap-2 text-white px-4 py-2 hover:bg-red-600/65 transition-all rounded-lg cursor-pointer shadow-lg hover:shadow-red-500/30"
              onClick={handleDeleteDocumentTypes}
            >
              <Trash size={20} />
              <span>{selectedDocs.length} selected</span>
              Delete Selected
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}:</span>
    <span className="text-white">{value || "-"}</span>
  </div>
);

export default AddDocumentType;
