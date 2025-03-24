import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserAccount } from "../../../service/authService";
import { addDocument } from "../../../service/docSrvice";
import FormSelect from "../../inputs/FormSelect";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, FileText, X, CheckCircle } from "lucide-react";
import ProgressBar from "./ProgressBar";

const AddDocs = ({ onDocumentAdded }) => {
  const [user, setUser] = useState(null);
  const [submittedDoc, setSubmittedDoc] = useState(null);

  const navigate = useNavigate();

  // State for document types
  const [documentTypes, setDocumentTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserAccount();
      if (userData) {
        setUser(userData);
      } else {
        navigate("/");
      }
    };

    // Fetch document types from API
    const fetchDocumentTypes = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          "http://localhost:5204/api/Documents/Types",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        console.log("Document types fetched:", response.data);
        setDocumentTypes(response.data);

        const transformedTypes = response.data.map((type) => ({
          value: type.id, // Ensure this is the numeric ID
          label: type.typeName, // Display name
          typeAttr: type.typeAttr, // Preserve additional attributes if needed
        }));

        setDocumentTypes(transformedTypes);
        console.log("Document types set :", documentTypes);
        setIsLoadingTypes(false);
      } catch (error) {
        console.error("Error fetching document types:", error);
        setIsLoadingTypes(false);
      }
    };

    fetchUser();
    fetchDocumentTypes();
  }, [navigate]);
  const StepIndicators = ({ steps, currentStep }) => {
    return (
      <div className="flex justify-between w-full mb-4">
        {Array.from({ length: steps }, (_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i + 1 === currentStep
                ? "bg-blue-500 text-white"
                : "bg-slate-700/50 text-gray-400"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    );
  };
  const [showForm, setShowForm] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    prefix: "",
    content: "",
    date: "",
    type: "",
    typeName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDoc((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };
  useEffect(() => {
    console.log("Document types updated:", documentTypes);
  }, [documentTypes]);
  // New handler for type selection
  const handleTypeChange = (selectedType) => {
    // Find the selected type object
    const selectedTypeObj = documentTypes.find(
      (type) => type.value === selectedType
    );

    console.log("Selected Type Object:", selectedTypeObj);

    setNewDoc((prev) => ({
      ...prev,
      type: selectedType, // This should be the numeric ID
      typeName: selectedTypeObj ? selectedTypeObj.label : "", // Use label for typeName
    }));

    if (error) setError("");
  };

  const handleNext = () => {
    if (step === 1 && !newDoc.title.trim()) {
      setError("Title is required.");
      return;
    }
    // if (step === 2 && !newDoc.title.trim()) {
    //   setError("Title is required.");
    //   return;
    // }
    if (step === 3 && !newDoc.content.trim()) {
      setError("Content cannot be empty.");
      return;
    }
    if (step === 4 && !newDoc.date) {
      setError("Please select a date .");
      return;
    }
    if (step === 5 && !newDoc.type) {
      setError("Please select a document type.");
      return;
    }
    setError("");
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Validate type selection
    if (!newDoc.type) {
      setError("Please select a document type.");
      setIsSubmitting(false);
      return;
    }

    console.log("Submitting document:", newDoc);
    try {
      const addedDoc = await addDocument(
        newDoc.title,
        newDoc.prefix,
        newDoc.content,
        newDoc.date,
        newDoc.type // This should be the numeric ID
      );
      console.log("Document added - handleSubmit:", addedDoc);
      if (addedDoc) {
        setSubmittedDoc(addedDoc); // Store the submitted document

        onDocumentAdded(addedDoc);
        setShowForm(false);
        setNewDoc({
          title: "",
          prefix: "",
          content: "",
          date: "",
          type: "",
          typeName: "",
        });
        setStep(1);
      }
    } catch (err) {
      console.error("Full error details:", err);
      console.error("Error response:", err.response);
      setError(
        err.response?.data?.message ||
          "An error occurred while saving your document."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {(user?.role === "Admin" || user?.role === "FullUser") && (
        <motion.div
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 grid place-items-center p-2  w-2/3  rounded-lg cursor-pointer transition border border-slate-700 h-full"
        >
          <div className="flex flex-row items-center">
            <PlusCircle size={48 / 2} className="text-blue-400 " />
            <p className="text-gray-200 font-medium text-center pl-2">
              Add New Document
            </p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setNewDoc({
                  title: "",
                  prefix: "",
                  content: "",
                  date: "",
                  type: "",
                  typeName: "",
                });
                setStep(1);
                setShowForm(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 border border-slate-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FileText size={20} className="mr-2 text-blue-400" />
                  New Document - Step {step}/4
                </h2>
                <div
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <X size={20} />
                </div>
              </div>

              {/* Combined Step Progress */}
              <ProgressBar steps={5} currentStep={step} />

              {error && (
                <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-3 py-2 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              {/* Step 1: Title */}
              {step === 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newDoc.title}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              {/* Step 2: Prefix */}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Document Prefix
                  </label>
                  <input
                    type="text"
                    name="prefix"
                    value={newDoc.prefix}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              {/* Step 3: Content */}
              {step === 3 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Document Content
                  </label>
                  <textarea
                    name="content"
                    value={newDoc.content}
                    onChange={handleChange}
                    rows={2}
                    className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              )}

              {/* Step 4: Date */}
              {step === 4 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Document Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newDoc.date}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              {/* Step 5: Document Type */}
              {step === 5 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Document Type
                  </label>
                  {isLoadingTypes ? (
                    <div className="text-gray-400">Loading types...</div>
                  ) : (
                    <FormSelect
                      id="type"
                      value={newDoc.type}
                      onChange={handleTypeChange}
                      options={documentTypes}
                      icon={(props) => (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          {...props}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      )}
                    />
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <button onClick={handleBack} className="btn">
                    Back
                  </button>
                )}
                {step < 5 ? (
                  <button onClick={handleNext} className="btn">
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="btn"
                    disabled={isLoadingTypes}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {/* Success card */}
        {submittedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setSubmittedDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <CheckCircle size={20} className="mr-2 text-green-400" />
                  Document Created Successfully
                </h2>
                <div
                  onClick={() => setSubmittedDoc(null)}
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <X size={20} />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <DetailItem
                  label="Created By"
                  value={submittedDoc.createdBy.username}
                />
                <DetailItem label="Title" value={submittedDoc.title} />
                <DetailItem label="Prefix" value={submittedDoc.documentKey} />
                <DetailItem
                  label="Type"
                  value={submittedDoc.documentType.typeName}
                />
                <DetailItem
                  label="Date"
                  value={new Date(submittedDoc.docDate).toLocaleDateString()}
                />
                <div className="border-t border-slate-700 pt-3">
                  <p className="text-gray-400 mb-1">Content:</p>
                  <p className="text-gray-200 whitespace-pre-wrap">
                    {submittedDoc.content}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSubmittedDoc(null)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// Add this component at the bottom of the file
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}:</span>
    <span className="text-white">{value || "-"}</span>
  </div>
);

export default AddDocs;
