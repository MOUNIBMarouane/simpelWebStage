import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getDocument,
  getDocumentLine,
  getDocumetSublines,
  addDocumentSubLine,
  updateDocumentSubLine,
  deleteDocumentSubLine,
} from "../service/LInes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash,
  Edit,
  Eye as EyeIcon,
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

// SubLineModal component declaration
const SubLineModal = ({ isOpen, onClose, subLine, onSave, mode = "add" }) => {
  const [formData, setFormData] = useState({
    title: subLine?.title || "",
    attribute: subLine?.attribute || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.attribute) {
      return; // Basic validation
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
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-700/50 bg-slate-700/30 px-5 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {mode === "add" ? (
              <Plus size={18} className="text-green-400" />
            ) : (
              <Save size={18} className="text-blue-400" />
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
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:ring-blue-500 outline-none"
                placeholder="Enter subline title"
              />
            </div>

            <div>
              <label
                htmlFor="attribute"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Attribute <span className="text-red-400">*</span>
              </label>
              <input
                id="attribute"
                name="attribute"
                type="text"
                value={formData.attribute}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:ring-blue-500 outline-none"
                placeholder="Enter attribute value"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`flex-1 py-2.5 px-4 ${
                isSubmitting
                  ? "bg-blue-600/70"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
              } text-white rounded-lg transition-all duration-200 flex justify-center items-center shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30`}
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

// DetailCard component for reusability
const DetailCard = ({ title, details }) => (
  <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/80 to-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700/50 w-full h-full backdrop-blur-sm">
    <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
      {title === "Document Details" ? (
        <FileText size={20} />
      ) : (
        <List size={20} />
      )}
      {title}
    </h2>
    <div className="space-y-4">
      {Object.entries(details).map(([key, value], index) => (
        <motion.div
          key={key}
          className="flex flex-col p-2 rounded-lg hover:bg-slate-700/20 transition-colors"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <span className="text-gray-400 text-sm mb-1">{key}</span>
          <span
            className={`font-medium ${
              key.includes("ID")
                ? "text-blue-300 font-mono"
                : key === "Status"
                ? value === "Opened"
                  ? "text-yellow-300"
                  : "text-green-300"
                : key === "Price"
                ? "text-emerald-300"
                : "text-white"
            }`}
          >
            {value !== undefined && value !== null ? value : "-"}
          </span>
        </motion.div>
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
    icon = <EyeIcon size={14} />;
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

  if (!document || !line) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-slate-900 p-4">
        <div className="text-white text-center p-6 bg-red-500/20 rounded-lg border border-red-500/50 max-w-md">
          <AlertTriangle size={40} className="mx-auto mb-4 text-red-400" />
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
  }

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
      <div className="mb-4 flex justify-between items-center bg-slate-800/60 rounded-lg p-3 backdrop-blur-sm">
        <Link
          to={`/DocumentDetail/${idDoc}`}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors group px-3 py-1.5 bg-slate-700/40 hover:bg-slate-700/70 rounded-lg"
        >
          <ArrowLeft
            className="group-hover:-translate-x-1 transition-transform"
            size={18}
          />
          Back to Document
        </Link>

        <div className="flex items-center">
          <div className="text-md text-slate-400 mr-3 hidden md:block">
            <span className="text-blue-400 font-semibold">{line.title}</span> |
            Line {line.id}
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800 bg-slate-700/40"
            disabled={refreshing}
          >
            <RefreshCw
              size={16}
              className={`${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Main Content Grid - Flex with overflow */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        {/* Left section: Info cards */}
        <div className="lg:col-span-1 space-y-4 overflow-auto pr-2 custom-scrollbar">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <DetailCard title="Document Details" details={documentDetails} />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <DetailCard title="Line Details" details={lineDetails} />
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-to-br from-slate-800/90 to-slate-800/60 p-4 rounded-xl border border-slate-700/50 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-700/30 p-3 rounded-lg">
                <div className="text-slate-400 text-xs mb-1">
                  Total Sublines
                </div>
                <div className="text-2xl font-bold text-white">
                  {subLines.length}
                </div>
              </div>
              <div className="bg-slate-700/30 p-3 rounded-lg">
                <div className="text-slate-400 text-xs mb-1">Last Updated</div>
                <div className="text-sm font-medium text-white">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right section: Sublines with fixed header and scrollable content */}
        <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
          <motion.div
            className="bg-slate-800/90 rounded-xl border border-slate-700/50 shadow-xl flex flex-col h-full overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-700/50 sticky top-0 bg-slate-800 z-10">
              <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                <List size={20} />
                Sublines
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-600 hover:to-emerald-600 rounded-lg transition-all duration-300 inline-flex items-center gap-2 shadow-lg"
              >
                <Plus size={16} />
                Add Subline
              </button>
            </div>

            {/* Sublines Table - Scrollable container */}
            <div className="flex-1 overflow-auto custom-scrollbar p-4">
              <div className="rounded-lg border border-slate-700/50 overflow-hidden">
                <motion.table
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full border-collapse text-left"
                >
                  <thead>
                    <tr className="bg-slate-700/80 backdrop-blur-sm sticky top-0">
                      <th className="px-4 py-3 text-sm font-semibold text-slate-300">
                        ID
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-300">
                        Title
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-300">
                        Attribute
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-300 text-center w-32">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {subLines.length > 0 ? (
                      subLines.map((subLine, index) => (
                        <motion.tr
                          key={subLine.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-slate-700/20 rounded-lg border border-slate-700/30 overflow-hidden"
                        >
                          <td className="px-4 py-3 text-sm font-mono text-blue-300">
                            SL-{subLine.id}
                          </td>
                          <td
                            className="px-4 py-3 text-slate-300 truncate max-w-[200px]"
                            title={subLine.title}
                          >
                            {subLine.title}
                          </td>
                          <td
                            className="px-4 py-3 text-slate-300 truncate max-w-[200px]"
                            title={subLine.attribute}
                          >
                            {subLine.attribute}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedSubLine(subLine);
                                  setShowEditModal(true);
                                }}
                                className="p-1.5 rounded-md bg-slate-600/30 hover:bg-slate-600/50 transition-colors"
                              >
                                <Edit
                                  size={18}
                                  className="text-slate-300 group-hover:text-blue-300"
                                />
                              </button>
                              <button
                                onClick={() => handleDeleteSubLine(subLine.id)}
                                className="p-1.5 rounded-md bg-red-600/30 hover:bg-red-600/70 transition-all hover:scale-110 tooltip group"
                                data-tooltip="Delete"
                              >
                                <Trash
                                  size={18}
                                  className="text-red-400 group-hover:text-red-200"
                                />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <div className="mb-4 p-4 rounded-full bg-slate-700/30">
                              <List size={32} className="text-slate-400" />
                            </div>
                            <p className="text-slate-400 mb-2">
                              No sublines found
                            </p>
                            <button
                              onClick={() => setShowAddModal(true)}
                              className="px-4 py-2 mt-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm text-white"
                            >
                              Add Your First Subline
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </motion.table>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

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
                    ? "bg-gradient-to-r from-red-900/80 to-red-800/80 border-l-4 border-red-500"
                    : notification.type === "info"
                    ? "bg-gradient-to-r from-blue-900/80 to-blue-800/80 border-l-4 border-blue-500"
                    : "bg-gradient-to-r from-green-900/80 to-green-800/80 border-l-4 border-green-500"
                }`}
            >
              {notification.type === "error" ? (
                <AlertTriangle
                  size={18}
                  className="text-red-400 flex-shrink-0"
                />
              ) : notification.type === "info" ? (
                <Info size={18} className="text-blue-400 flex-shrink-0" />
              ) : (
                <CheckCircle
                  size={18}
                  className="text-green-400 flex-shrink-0"
                />
              )}
              <span className="text-sm">{notification.message}</span>
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

      {/* Custom scrollbar styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }

        /* Tooltip styling */
        .tooltip {
          position: relative;
        }
        .tooltip:before {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 8px;
          background: rgba(15, 23, 42, 0.95);
          color: white;
          font-size: 12px;
          white-space: nowrap;
          border-radius: 4px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s;
        }
        .tooltip:hover:before {
          opacity: 1;
          visibility: visible;
          bottom: calc(100% + 5px);
        }
      `}</style>
    </div>
  );
};

export default LineDetail;
