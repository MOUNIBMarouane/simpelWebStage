import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getDocument,
  getDocumentLine,
  getDocumetSublines,
  addDocumentSubLine,
  updateDocumentSubLine,
  deleteDocumentSubLine,
} from "../service/Lines";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash,
  Edit,
  Eye,
  ArrowLeft,
  Save,
  X,
  Plus,
  RefreshCw,
  FileText,
  List,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

// Separate SubLineModal component for better organization
const SubLineModal = ({ isOpen, onClose, subLine, onSave, mode }) => {
  const [formData, setFormData] = useState({
    title: subLine?.title || "",
    attribute: subLine?.attribute || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Reset form data when subLine changes
  useEffect(() => {
    if (subLine) {
      setFormData({
        title: subLine.title || "",
        attribute: subLine.attribute || "",
      });
    }
  }, [subLine]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    if (!formData.attribute.trim()) {
      errors.attribute = "Attribute is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {mode === "add" ? "Add New Subline" : "Edit Subline"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1"
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
                  validationErrors.title ? "border-red-500" : "border-slate-600"
                } text-white rounded focus:ring-blue-500 outline-none`}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="attribute"
                className="block text-sm font-medium text-gray-300 mb-1"
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
                  validationErrors.attribute
                    ? "border-red-500"
                    : "border-slate-600"
                } text-white rounded focus:ring-blue-500 outline-none`}
              />
              {validationErrors.attribute && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.attribute}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 ${
                isSubmitting
                  ? "bg-blue-600/70"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white rounded-lg transition-colors flex justify-center items-center`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Improved DetailCard component for reusability
const DetailCard = ({ title, details }) => (
  <div className="bg-slate-800/90 p-6 rounded-xl shadow-lg border border-slate-700/50 w-full h-full">
    <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
      {title === "Document Details" ? (
        <FileText size={20} />
      ) : (
        <List size={20} />
      )}
      {title}
    </h2>
    <div className="space-y-3">
      {Object.entries(details).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <span className="text-gray-400 text-sm">{key}</span>
          <span className="text-white font-medium">
            {value !== undefined && value !== null ? value : "-"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Main component
const LineDetail = () => {
  const { idDoc, idLine } = useParams();
  const [document, setDocument] = useState(null);
  const [line, setLine] = useState(null);
  const [subLines, setSubLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingSubLine, setEditingSubLine] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubLine, setSelectedSubLine] = useState(null);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const docData = await getDocument(idDoc);
      if (docData) {
        setDocument(docData);
        const lineData = await getDocumentLine(idLine);
        if (lineData) {
          setLine(lineData);
          const subLinesData = await getDocumetSublines(idLine);
          setSubLines(subLinesData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      addNotification({
        id: Date.now(),
        message: `Failed to load data: ${error.message || "Unknown error"}`,
        type: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idDoc, idLine]);

  // Add Sublines Handler
  const handleAddSubLine = async (formData) => {
    try {
      const addedSubLine = await addDocumentSubLine(
        idLine,
        formData.title,
        formData.attribute
      );

      if (addedSubLine) {
        setSubLines((prevSubLines) => [...prevSubLines, addedSubLine]);
        addNotification({
          id: Date.now(),
          message: `SubLine ${addedSubLine.title} added successfully!`,
          type: "success",
        });

        // Refresh to ensure data consistency
        await fetchData();
        return true;
      }
    } catch (error) {
      console.error("Error adding subline:", error);
      addNotification({
        id: Date.now(),
        message: `Failed to add SubLine: ${error.message || "Unknown error"}`,
        type: "error",
      });
      throw error;
    }
  };

  // Update Sublines Handler
  const handleUpdateSubLine = async (formData) => {
    try {
      if (!selectedSubLine) {
        throw new Error("No subline selected for update");
      }

      const updated = await updateDocumentSubLine(selectedSubLine.id, {
        title: formData.title,
        attribute: formData.attribute,
      });

      if (updated) {
        setSubLines((prevSubLines) =>
          prevSubLines.map((subLine) =>
            subLine.id === selectedSubLine.id ? updated : subLine
          )
        );

        addNotification({
          id: Date.now(),
          message: `SubLine ${updated.title} updated successfully!`,
          type: "success",
        });

        // Refresh to ensure data consistency
        await fetchData();
        return true;
      }
    } catch (error) {
      console.error("Error updating subline:", error);
      addNotification({
        id: Date.now(),
        message: `Failed to update SubLine: ${
          error.message || "Unknown error"
        }`,
        type: "error",
      });
      throw error;
    }
  };

  // Delete Sublines Handler
  const handleDeleteSubLine = (id) => {
    const subLineToDelete = subLines.find((subLine) => subLine.id === id);
    if (!subLineToDelete) return;

    setSubLines((prevSubLines) =>
      prevSubLines.filter((subLine) => subLine.id !== id)
    );

    addNotification({
      id: Date.now(),
      message: `SubLine ${subLineToDelete.title} deleted.`,
      type: "info",
      undo: () => {
        setSubLines((prev) => [...prev, subLineToDelete]);
      },
      onConfirm: async () => {
        try {
          await deleteDocumentSubLine(id);
          // Refresh data after successful deletion
          await fetchData();
        } catch (error) {
          console.error("Error deleting subline:", error);
          setSubLines((prev) => [...prev, subLineToDelete]);
          addNotification({
            id: Date.now(),
            message: `Failed to delete SubLine: ${
              error.message || "Unknown error"
            }`,
            type: "error",
          });
        }
      },
    });
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    try {
      await fetchData();
      addNotification({
        id: Date.now(),
        message: "Data refreshed successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      addNotification({
        id: Date.now(),
        message: `Failed to refresh data: ${error.message || "Unknown error"}`,
        type: "error",
      });
    }
  };

  // Notification System
  const addNotification = (notification) => {
    const notificationId = notification.id;
    let timeoutId;

    if (notification.onConfirm) {
      timeoutId = setTimeout(() => {
        notification.onConfirm();
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }, 5000);
    } else {
      timeoutId = setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      }, 5000);
    }

    setNotifications((prev) => [
      ...prev,
      {
        ...notification,
        timeoutId,
      },
    ]);
  };

  const handleUndo = (notification) => {
    clearTimeout(notification.timeoutId);
    if (notification.undo) {
      notification.undo();
    }
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
  };

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center bg-slate-900">
        <div className="flex flex-col items-center text-white">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading line details...</p>
        </div>
      </div>
    );

  if (!document || !line)
    return (
      <div className="w-full h-screen flex justify-center items-center bg-slate-900">
        <div className="text-white text-center p-6 bg-red-500/20 rounded-lg border border-red-500/50">
          <h2 className="text-xl font-bold mb-2">Not Found</h2>
          <p>Document or line not found</p>
          <Link
            to="/documents"
            className="mt-4 inline-block px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Return to Documents
          </Link>
        </div>
      </div>
    );

  // Format document details for the card
  const documentDetails = {
    "Document ID": `DOC-${document.id}`,
    Title: document.title,
    Date: document.docDate,
    Type: document.typeId,
    Status: document.status === 0 ? "Opened" : "Activated",
  };

  // Format line details for the card
  const lineDetails = {
    "Line ID": `LINE-${line.id}`,
    Title: line.title,
    Article: line.article,
    Price: `$${parseFloat(line.prix).toFixed(2)}`,
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white p-6">
      {/* Add Subline Modal */}
      <AnimatePresence>
        {showAddModal && (
          <SubLineModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddSubLine}
            mode="add"
          />
        )}
      </AnimatePresence>

      {/* Edit Subline Modal */}
      <AnimatePresence>
        {showEditModal && selectedSubLine && (
          <SubLineModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedSubLine(null);
            }}
            subLine={selectedSubLine}
            onSave={handleUpdateSubLine}
            mode="edit"
          />
        )}
      </AnimatePresence>

      {/* Header with navigation and refresh */}
      <div className="mb-6 flex justify-between items-center">
        <Link
          to={`/DocumentDetail/${idDoc}`}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
        >
          <ArrowLeft
            className="group-hover:-translate-x-1 transition-transform"
            size={18}
          />
          Back to Document
        </Link>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-slate-800"
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={`${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left section: Info cards */}
        <div className="lg:col-span-1 space-y-6">
          <DetailCard title="Document Details" details={documentDetails} />
          <DetailCard title="Line Details" details={lineDetails} />
        </div>

        {/* Right section: Sublines */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/90 p-6 rounded-xl border border-slate-700/50 shadow-xl h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                <List size={20} />
                Sublines
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-green-600/80 hover:bg-green-600 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Add Subline
              </button>
            </div>

            {/* Sublines Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-700/50">
              <motion.table
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full border-collapse text-left"
              >
                <thead>
                  <tr className="bg-slate-700/80 backdrop-blur-sm">
                    <th className="px-4 py-3 text-sm font-semibold text-slate-300">
                      ID
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-300">
                      Title
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-300">
                      Attribute
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-300 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {subLines.length > 0 ? (
                    subLines.map((subLine) => (
                      <motion.tr
                        key={subLine.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-mono text-blue-300">
                          SL-{subLine.id}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {subLine.title}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {subLine.attribute}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedSubLine(subLine);
                                setShowEditModal(true);
                              }}
                              className="p-1.5 rounded-md bg-slate-600/30 hover:bg-slate-600/50 transition-colors tooltip"
                              data-tooltip="Edit"
                            >
                              <Edit size={18} className="text-slate-300" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubLine(subLine.id)}
                              className="p-1.5 rounded-md bg-red-600/30 hover:bg-red-600/50 transition-colors tooltip"
                              data-tooltip="Delete"
                            >
                              <Trash size={18} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        No sublines found. Click "Add Subline" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </motion.table>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg backdrop-blur-sm border 
                ${
                  notification.type === "error"
                    ? "border-red-500/50 bg-red-900/80"
                    : notification.type === "info"
                    ? "border-blue-500/50 bg-blue-900/80"
                    : "border-green-500/50 bg-green-900/80"
                } shadow-xl`}
            >
              {notification.type === "error" ? (
                <AlertTriangle size={18} className="text-red-400" />
              ) : notification.type === "info" ? (
                <Info size={18} className="text-blue-400" />
              ) : (
                <CheckCircle size={18} className="text-green-400" />
              )}
              <span className="text-sm">{notification.message}</span>
              {notification.undo && (
                <div
                  onClick={() => handleUndo(notification)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium underline cursor-pointer"
                >
                  Undo
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LineDetail;
