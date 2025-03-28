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
  Clock,
  DollarSign,
  Tag,
  ShoppingCart,
  Layers,
  ChevronRight,
} from "lucide-react";

// Redesigned SubLineModal with modern style
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
    } else {
      setFormData({
        title: "",
        attribute: "",
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
      className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-md z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-b border-slate-700/50 bg-slate-700/30 px-5 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {mode === "add" ? (
              <Plus size={18} className="text-green-400" />
            ) : (
              <Edit size={18} className="text-blue-400" />
            )}
            {mode === "add" ? "Add New Subline" : "Edit Subline"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-700/50 transition-colors"
          >
            <X
              size={20}
              className="text-slate-400 hover:text-white transition-colors"
            />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-300 mb-1 flex items-center"
              >
                Title <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter subline title"
                className={`w-full p-2.5 bg-slate-700/50 border ${
                  validationErrors.title ? "border-red-500" : "border-slate-600"
                } text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
              />
              {validationErrors.title && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span className="inline-block w-4 h-4 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs">!</span>
                  </span>
                  {validationErrors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="attribute"
                className="block text-sm font-medium text-slate-300 mb-1 flex items-center"
              >
                Attribute <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                id="attribute"
                name="attribute"
                type="text"
                value={formData.attribute}
                onChange={handleChange}
                placeholder="Enter attribute value"
                className={`w-full p-2.5 bg-slate-700/50 border ${
                  validationErrors.attribute
                    ? "border-red-500"
                    : "border-slate-600"
                } text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors`}
              />
              {validationErrors.attribute && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span className="inline-block w-4 h-4 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs">!</span>
                  </span>
                  {validationErrors.attribute}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 ${
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
                <>
                  {mode === "add" ? (
                    <Plus size={18} className="mr-2" />
                  ) : (
                    <Save size={18} className="mr-2" />
                  )}
                  {mode === "add" ? "Add Subline" : "Save Changes"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Modern detail card with icon and better spacing
const DetailCard = ({ title, icon, details }) => (
  <div className="bg-slate-800/60 rounded-xl shadow-lg border border-slate-700/50 h-full overflow-auto">
    <div className="border-b border-slate-700/50 bg-slate-800/80 p-4">
      <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
        {icon}
        {title}
      </h2>
    </div>
    <div className="p-4 divide-y divide-slate-700/30">
      {Object.entries(details).map(([key, value]) => (
        <div key={key} className="py-3 first:pt-0 last:pb-0 flex flex-col">
          <span className="text-slate-400 text-xs mb-1">{key}</span>
          <span className="text-white font-medium text-sm">
            {value !== undefined && value !== null ? value : "-"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Modern status badge component
const StatusBadge = ({ status }) => {
  let bgColor, textColor, icon, text;

  if (status === 0) {
    bgColor = "bg-blue-500/20";
    textColor = "text-blue-400";
    icon = <Eye size={14} />;
    text = "Opened";
  } else {
    bgColor = "bg-green-500/20";
    textColor = "text-green-400";
    icon = <CheckCircle size={14} />;
    text = "Activated";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${bgColor} ${textColor} text-xs font-medium`}
    >
      {icon}
      {text}
    </span>
  );
};

// Main component
const LineDetail = () => {
  const { idDoc, idLine } = useParams();
  const [document, setDocument] = useState(null);
  const [line, setLine] = useState(null);
  const [subLines, setSubLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
          message: `SubLine "${addedSubLine.title}" added successfully!`,
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
          message: `SubLine "${updated.title}" updated successfully!`,
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
      message: `SubLine "${subLineToDelete.title}" deleted.`,
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

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-slate-900">
        <div className="flex flex-col items-center gap-4 p-8 text-white">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-2 border-blue-500/30"></div>
          </div>
          <p className="text-slate-300">Loading line details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!document || !line) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-slate-900 p-4">
        <div className="text-white text-center p-6 bg-red-500/20 rounded-lg border border-red-500/50 max-w-md">
          <AlertTriangle size={40} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold mb-2">Not Found</h2>
          <p className="mb-6 text-slate-300">
            The document or line you're looking for doesn't exist or you don't
            have permission to view it.
          </p>
          <Link
            to="/documents"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            Return to Documents
          </Link>
        </div>
      </div>
    );
  }

  // Format document details for the card
  const documentDetails = {
    "Document ID": <span className="font-mono">{`DOC-${document.id}`}</span>,
    Title: document.title,
    Date: new Date(document.docDate).toLocaleDateString(),
    Type: (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
        {document.documentType?.typeName || document.typeId}
      </span>
    ),
    Status: <StatusBadge status={document.status} />,
  };

  // Format line details for the card
  const lineDetails = {
    "Line ID": <span className="font-mono">{`LINE-${line.id}`}</span>,
    Title: line.title || (
      <span className="text-slate-500 italic">Not specified</span>
    ),
    Article: <span className="font-medium">{line.article}</span>,
    Price: (
      <span className="text-green-400 font-semibold">{`$${parseFloat(
        line.prix
      ).toFixed(2)}`}</span>
    ),
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col overflow-hidden">
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
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                to={`/DocumentDetail/${idDoc}`}
                className="group flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                  <ArrowLeft
                    className="group-hover:-translate-x-0.5 transition-transform"
                    size={16}
                  />
                </div>
                <span className="font-medium">Back to Document</span>
              </Link>
              <div className="hidden md:flex items-center text-slate-500 ml-2">
                <ChevronRight size={16} />
                <span className="ml-2 text-slate-400 text-sm truncate max-w-[200px]">
                  {line.article}
                </span>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white transition-colors rounded-md hover:bg-slate-800 border border-slate-700/50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full h-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb for mobile */}
        <div className="md:hidden mb-4 text-sm text-slate-400">
          <span className="inline-block max-w-[200px] truncate">
            {line.article}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-2/3">
          {/* Left section: Info cards */}
          <div className="space-y-6 flex flex-col h-full">
            <div className="h-1/4">
              <DetailCard
                title="Document Details"
                icon={<FileText size={18} />}
                details={documentDetails}
              />
            </div>
            <div className="h-1/3">
              <DetailCard
                title="Line Details"
                icon={<ShoppingCart size={18} />}
                details={lineDetails}
              />
            </div>
          </div>

          {/* Right section: Sublines */}
          <div className="lg:col-span-2 h-2/3">
            <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 shadow-xl h-full overflow-auto">
              {/* Sublines header */}
              <div className="border-b border-slate-700/50 bg-slate-800/80 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                  <Layers size={18} />
                  Sublines
                  <span className="ml-2 px-1.5 py-0.5 bg-slate-700/70 text-slate-300 rounded-full text-xs">
                    {subLines.length}
                  </span>
                </h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="sm:ml-auto px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors inline-flex items-center gap-1.5 text-sm"
                >
                  <Plus size={16} />
                  Add Subline
                </button>
              </div>

              {/* Responsive Sublines content */}
              <div className="p-4">
                {subLines.length > 0 ? (
                  <>
                    {/* Mobile: Card layout */}
                    <div className="block sm:hidden space-y-3">
                      {subLines.map((subLine) => (
                        <motion.div
                          key={subLine.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-slate-700/20 rounded-lg border border-slate-700/30 overflow-hidden"
                        >
                          <div className="p-3 border-b border-slate-700/30 flex justify-between items-center">
                            <span className="font-mono text-xs text-blue-300">
                              SL-{subLine.id}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedSubLine(subLine);
                                  setShowEditModal(true);
                                }}
                                className="p-1.5 rounded-md bg-slate-600/30 hover:bg-slate-600/50 transition-colors"
                              >
                                <Edit size={16} className="text-slate-300" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubLine(subLine.id)}
                                className="p-1.5 rounded-md bg-red-600/30 hover:bg-red-600/50 transition-colors"
                              >
                                <Trash size={16} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                          <div className="p-3 space-y-2">
                            <div>
                              <span className="text-xs text-slate-400 block mb-1">
                                Title
                              </span>
                              <span className="text-white">
                                {subLine.title}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-slate-400 block mb-1">
                                Attribute
                              </span>
                              <span className="text-white">
                                {subLine.attribute}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Desktop: Table layout */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="bg-slate-700/30">
                            <th className="px-4 py-3 text-xs font-semibold text-slate-400 rounded-tl-lg">
                              ID
                            </th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-400">
                              Title
                            </th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-400">
                              Attribute
                            </th>
                            <th className="px-4 py-3 text-xs font-semibold text-slate-400 text-right rounded-tr-lg">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {subLines.map((subLine) => (
                            <motion.tr
                              key={subLine.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="hover:bg-slate-700/10 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm font-mono text-blue-300">
                                SL-{subLine.id}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-300 font-medium">
                                {subLine.title}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-300">
                                {subLine.attribute}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedSubLine(subLine);
                                      setShowEditModal(true);
                                    }}
                                    className="p-1.5 rounded-md bg-slate-600/30 hover:bg-slate-600/50 transition-colors tooltip"
                                    aria-label="Edit"
                                  >
                                    <Edit
                                      size={16}
                                      className="text-slate-300"
                                    />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSubLine(subLine.id)
                                    }
                                    className="p-1.5 rounded-md bg-red-600/30 hover:bg-red-600/50 transition-colors tooltip"
                                    aria-label="Delete"
                                  >
                                    <Trash size={16} className="text-red-400" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-700/30 flex items-center justify-center mb-4">
                      <Layers size={24} className="text-slate-500" />
                    </div>
                    <p className="text-slate-400 mb-2">No sublines found</p>
                    <p className="text-slate-400 mb-2">No sublines found</p>
                    <p className="text-slate-500 text-sm mb-6">
                      This line doesn't have any sublines yet.
                    </p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Add Your First Subline
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-[90vw] sm:max-w-md">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-md border shadow-xl
                ${
                  notification.type === "error"
                    ? "border-red-500/50 bg-red-900/90"
                    : notification.type === "info"
                    ? "border-blue-500/50 bg-blue-900/90"
                    : "border-green-500/50 bg-green-900/90"
                }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${
                  notification.type === "error"
                    ? "bg-red-500/20"
                    : notification.type === "info"
                    ? "bg-blue-500/20"
                    : "bg-green-500/20"
                }`}
              >
                {notification.type === "error" ? (
                  <AlertTriangle size={18} className="text-red-400" />
                ) : notification.type === "info" ? (
                  <Info size={18} className="text-blue-400" />
                ) : (
                  <CheckCircle size={18} className="text-green-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium line-clamp-2">
                  {notification.message}
                </p>
              </div>
              {notification.undo && (
                <button
                  onClick={() => handleUndo(notification)}
                  className="flex-shrink-0 ml-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded-md text-blue-400 text-sm font-medium transition-colors"
                >
                  Undo
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LineDetail;
