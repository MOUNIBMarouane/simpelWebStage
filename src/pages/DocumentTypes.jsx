import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, FileText } from "lucide-react";


const AddDocumentType = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Track current step
  const [formData, setFormData] = useState({
    typeKey: "",
    typeName: "",
    typeAttr: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);

  // Fetch document types when the component mounts
  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:5204/api/Documents/Types",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setDocumentTypes(response.data);
    } catch (error) {
      console.error("Error fetching document types:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1); // Move to next step
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1); // Move to previous step
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://localhost:5204/api/Documents/Types",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201) {
        setFormData({ typeKey: "", typeName: "", typeAttr: "" }); // Reset form
        fetchDocumentTypes(); // Refresh document list after adding
        setStep(1); // Reset to step 1
      }
    } catch (err) {
      console.error("Error adding document type:", err);
      setError("Failed to add document type. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full text-white flex gap-6">
      {/* Sidebar: List of Document Types */}
      <div className="w-1/3 max-h-12/12 bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700 overflow-scroll">
        <h2 className="text-2xl font-bold text-blue-400">Document Types</h2>
        <ul className="mt-4 space-y-3">
          {documentTypes.length > 0 ? (
            documentTypes.map((doc) => (
              <li
                key={doc.typeKey}
                className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg shadow-md"
              >
                <FileText size={18} className="text-blue-400" />
                <div>
                  <p className="text-lg font-semibold">{doc.typeName}</p>
                  <p className="text-gray-400 text-sm">Key: {doc.typeKey}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No document types found.</p>
          )}
        </ul>
      </div>

      {/* Main Form: Add Document Type */}
      <div className="w-2/3">
        <button
          onClick={() => navigate("/documents")}
          className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-semibold">Back to Documents</span>
        </button>

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Add Document Type
          </h2>
          <p className="mt-2 text-gray-400">Enter the details below</p>

          {error && <p className="mt-4 text-red-500">{error}</p>}

          {/* Step Progress Indicator */}
          <StepProgress steps={3} currentStep={step} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Step 1: Type Key */}
            {step === 1 && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Type Key
                </label>
                <input
                  id="typeKey"
                  value={formData.typeKey}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {/* Step 2: Type Name */}
            {step === 2 && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Type Name
                </label>
                <input
                  id="typeName"
                  value={formData.typeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {/* Step 3: Type Attribute */}
            {step === 3 && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Type Attribute
                </label>
                <input
                  id="typeAttr"
                  value={formData.typeAttr}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <Save size={20} />
                  {loading ? "Saving..." : "Save Document Type"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentType;
