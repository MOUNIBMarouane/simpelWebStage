import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  FileText,
  Eye,
  Trash,
  Key,
  Tag,
  Code,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AddDocumentType = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    typeKey: "",
    typeName: "",
    typeAttr: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [documentTypes, setDocumentTypes] = useState([]);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://192.168.1.94:5204/api/Documents/Types",
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

  const validateStep = () => {
    if (step === 1 && !formData.typeName) {
      setError("Type Name is required");
      return false;
    }
    if (step === 2 && !formData.typeKey) {
      setError("Type Key is required");
      return false;
    }
    if (step === 3 && !formData.typeAttr) {
      setError("Type Attribute is required");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(
        "http://192.168.1.94:5204/api/Documents/Types",
        formData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setFormData({ typeKey: "", typeName: "", typeAttr: "" });
      fetchDocumentTypes();
      setStep(1);
    } catch (err) {
      setError("Failed to add document type. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-full text-white flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/documents")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-semibold">Back to Documents</span>
        </button>
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
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Type Name
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
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Type Key
                  </label>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      id="typeKey"
                      value={formData.typeKey}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Unique identifier key"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="relative">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
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
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>
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
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {loading ? "Saving..." : "Create Document"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Document Types List */}
        <div className="flex-1 bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl overflow-hidden">
          <h3 className="text-xl font-semibold mb-6 text-blue-400">
            Existing Document Types
          </h3>

          <div className="h-full overflow-y-auto pr-2">
            {documentTypes.map((doc) => (
              <div
                key={doc.typeKey}
                className="group bg-gray-900/50 hover:bg-gray-900 p-4 rounded-lg mb-3 transition-all border border-gray-800 hover:border-blue-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <FileText className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{doc.typeName}</h4>
                      <p className="text-sm text-gray-400">
                        Key: {doc.typeKey}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-blue-400">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-red-400">
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentType;
