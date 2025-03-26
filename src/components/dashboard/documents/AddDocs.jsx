import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserAccount } from "../../../service/authService";
import { addDocument } from "../../../service/docSrvice";
import FormSelect from "../../inputs/FormSelect";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, FileText, X, CheckCircle, Edit } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { format } from "date-fns";

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

  const [showForm, setShowForm] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    content: "",
    date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
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

  const validateStep = () => {
    switch (step) {
      case 1:
        return !!newDoc.title.trim();
      case 2:
        return !!newDoc.type;
      case 3:
        return !!newDoc.content.trim();
      case 4:
        return !!newDoc.date;
      default:
        return true;
    }
  };
  const handleEditField = (field) => {
    const fieldSteps = {
      title: 1,
      type: 2,
      content: 3,
      date: 4,
    };
    setStep(fieldSteps[field]);
    setShowReview(false);
  };

  const handleNext = () => {
    if (!validateStep()) {
      setError("Please fill in all required fields");
      return;
    }
    setError("");

    if (step === 4) {
      setShowReview(true);
    } else {
      setStep((prev) => prev + 1);
    }
  };
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const addedDoc = await addDocument(
        newDoc.title,
        newDoc.date,
        newDoc.content,
        newDoc.type
      );
      if (addedDoc) {
        onDocumentAdded(addedDoc);
        resetForm();
        setShowForm(false);
        navigate("/DocumentDetail/" + addedDoc.id);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error saving document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewDoc({
      title: "",
      date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      content: "",
      type: "",
      typeName: "",
    });
    setStep(1);
    setShowReview(false);
    setShowForm(false);
  };

  const handleEdit = () => {
    setShowReview(false);
    setStep(4); // Return to last step
  };

  return (
    <div>
      {(user?.role === "Admin" || user?.role === "FullUser") && (
        <motion.div
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 grid place-items-center p-2 w-2/3 rounded-lg cursor-pointer border border-slate-700 h-full"
        >
          <div className="flex flex-row items-center">
            <PlusCircle size={24} className="text-blue-400" />
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 border border-slate-700"
            >
              {!showReview ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <FileText size={20} className="mr-2 text-blue-400" />
                      New Document - Step {step}/4
                    </h2>
                    <X
                      size={20}
                      className="text-gray-400 hover:text-white cursor-pointer"
                      onClick={resetForm}
                    />
                  </div>

                  <ProgressBar steps={4} currentStep={step} />

                  {error && (
                    <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-3 py-2 rounded mb-4 text-sm">
                      {error}
                    </div>
                  )}

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

                  {step === 2 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Document Type
                      </label>
                      {isLoadingTypes ? (
                        <div className="text-gray-400">Loading types...</div>
                      ) : (
                        <FormSelect
                          value={newDoc.type}
                          onChange={handleTypeChange}
                          options={documentTypes}
                        />
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Document Content
                      </label>
                      <textarea
                        name="content"
                        value={newDoc.content}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>
                  )}

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

                  <div className="flex justify-between mt-6">
                    {step > 1 && (
                      <button
                        onClick={handleBack}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                      >
                        Back
                      </button>
                    )}
                    <div className="flex-grow" />
                    <button
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      {step === 4 ? "Review" : "Next"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <CheckCircle size={20} className="mr-2 text-green-400" />
                      Review Document
                    </h2>
                    <X
                      size={20}
                      className="text-gray-400 hover:text-white cursor-pointer"
                      onClick={resetForm}
                    />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center group">
                      <span className="text-gray-400">Title:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white">{newDoc.title}</span>
                        <Edit
                          size={16}
                          className="text-gray-400 hover:text-blue-400 cursor-pointer invisible group-hover:visible"
                          onClick={() => handleEditField("title")}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center group">
                      <span className="text-gray-400">Type:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white">{newDoc.typeName}</span>
                        <Edit
                          size={16}
                          className="text-gray-400 hover:text-blue-400 cursor-pointer invisible group-hover:visible"
                          onClick={() => handleEditField("type")}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center group">
                      <span className="text-gray-400">Content:</span>
                      <Edit
                        size={16}
                        className="text-gray-400 hover:text-blue-400 cursor-pointer invisible group-hover:visible"
                        onClick={() => handleEditField("content")}
                      />
                    </div>
                    <p className="text-gray-200 whitespace-pre-wrap border border-slate-700 p-2 rounded">
                      {newDoc.content}
                    </p>

                    <div className="flex justify-between items-center group">
                      <span className="text-gray-400">Date:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white">{newDoc.date}</span>
                        <Edit
                          size={16}
                          className="text-gray-400 hover:text-blue-400 cursor-pointer invisible group-hover:visible"
                          onClick={() => handleEditField("date")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowReview(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      Back to Form
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                    </button>
                  </div>
                </div>
              )}
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
