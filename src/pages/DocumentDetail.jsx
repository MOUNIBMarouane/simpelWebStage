import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDocument, updateDocument } from "../service/docSrvice";

import {
  getDocumentLines,
  addDocumentLine,
  updateDocumentLine,
  deleteDocumentLine,
} from "../service/Lines";
import AddLine from "../components/dashboard/documents/AddLine";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye as EyeIcon,
  Trash,
  Edit,
  ArrowLeft,
  FileText,
  CheckCircle,
  X,
  Info,
  List,
  RefreshCw,
} from "lucide-react";
import FormSelect from "../components/inputs/FormSelect";
import axios from "axios";
// import { EditLineModal } from "./EditLineModal";

const DocumentDetail = () => {
  const { idDoc } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lines, setLines] = useState([]);
  const [editingLine, setEditingLine] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    article: "",
    prix: "",
  });

  // Function to fetch document details
  const fetchDocument = async () => {
    setRefreshing(true);
    try {
      const data = await getDocument(idDoc);
      if (data) {
        console.log("Fetched document:", data);
        console.log("Document type info:", {
          typeId: data.typeId,
          documentType: data.documentType,
          documentTypeId: data.documentType?.id,
        });

        setDocument(data);

        // Initialize editedDocument with the fetched data
        // Ensure typeId is a number, not a string
        const typeId = data.documentType?.id || data.typeId;
        const numericTypeId =
          typeof typeId === "string" ? parseInt(typeId, 10) : typeId;

        setEditedDocument({
          ...data,
          // Ensure typeId is set properly as a number
          typeId: numericTypeId,
        });

        const linesData = await getDocumentLines(idDoc);
        setLines(linesData);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      addNotification({
        id: Date.now(),
        message: `Failed to load document: ${error.message || "Unknown error"}`,
      });
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Function to fetch document types
  const fetchDocumentTypes = async () => {
    setIsLoadingTypes(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        "http://localhost:5204/api/Documents/Types",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log("Fetched document types:", response.data);

      // Store the full type objects with all properties
      // Ensure values are numbers, not strings
      const transformedTypes = response.data.map((type) => ({
        // Ensure ID is a number
        value: typeof type.id === "string" ? parseInt(type.id, 10) : type.id,
        label: type.typeName,
        typeKey: type.typeKey,
        typeAttr: type.typeAttr,
        createdAt: type.createdAt,
        documents: type.documents,
        // Add original ID for debugging
        originalId: type.id,
      }));

      console.log("Transformed type options:", transformedTypes);
      setDocumentTypes(transformedTypes);
    } catch (error) {
      console.error("Error fetching document types:", error);
      addNotification({
        id: Date.now(),
        message: `Failed to load document types: ${
          error.message || "Unknown error"
        }`,
      });
    } finally {
      setIsLoadingTypes(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchDocumentTypes();
    fetchDocument();
  }, [idDoc]);

  // Debug: Log whenever editedDocument changes
  useEffect(() => {
    if (editedDocument) {
      console.log("Edited document updated:", editedDocument);
      console.log("Current document type ID:", editedDocument.typeId);
    }
  }, [editedDocument]);

  // Clean up notifications on unmount
  useEffect(() => {
    return () => {
      notifications.forEach((notification) => {
        clearTimeout(notification.timeoutId);
      });
    };
  }, [notifications]);

  const handleTypeChange = (selectedType) => {
    // Convert selectedType to a number if it's a string (this is crucial)
    const typeId =
      typeof selectedType === "string"
        ? parseInt(selectedType, 10)
        : selectedType;

    console.log(`Type selected: ${selectedType} (converted to: ${typeId})`);

    const selectedTypeObj = documentTypes.find(
      (type) => type.value === typeId || type.value === selectedType
    );

    if (!selectedTypeObj) {
      console.error(
        `Could not find type with ID: ${typeId} in options:`,
        documentTypes
      );
    } else {
      console.log("Selected type object:", selectedTypeObj);
    }

    setEditedDocument((prev) => ({
      ...prev,
      typeId: typeId, // Make sure we're using the number version
      documentType: {
        id: typeId,
        typeName: selectedTypeObj ? selectedTypeObj.label : "",
        typeKey: selectedTypeObj ? selectedTypeObj.typeKey : "",
        typeAttr: selectedTypeObj ? selectedTypeObj.typeAttr : "",
      },
    }));
  };

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

  const handleAddLine = async (newLine) => {
    try {
      const addedLine = await addDocumentLine(
        idDoc,
        newLine.title,
        newLine.article,
        newLine.prix
      );
      if (addedLine) {
        setLines((prevLines) => [...prevLines, addedLine]);
        addNotification({
          id: Date.now(),
          message: `Line LINE-${addedLine.id} added successfully!`,
        });
      }
    } catch (error) {
      console.error("Error adding line:", error);
      addNotification({
        id: Date.now(),
        message: `Failed to add line: ${error.message || "Unknown error"}`,
      });
    }
  };

const handleUpdateLine = async (formData) => {
  try {
    const updated = await updateDocumentLine(
      editingLine.id,
      formData.title,
      formData.article,
      formData.prix
    );

    if (updated) {
      // First update the local state
      setLines((prevLines) =>
        prevLines.map((line) => (line.id === editingLine.id ? updated : line))
      );

      // Show success notification
      addNotification({
        id: Date.now(),
        message: `Line ${
          updated.lingeKey || `LINE-${updated.id}`
        } updated successfully!`,
      });

      // Add a refresh of the entire document data to fix undefined values
      await fetchDocument();

      return true;
    }
  } catch (error) {
    console.error("Error updating line:", error);
    addNotification({
      id: Date.now(),
      message: `Failed to update line: ${error.message || "Unknown error"}`,
    });
    throw error;
  }
};

  const handleDeleteLine = (id) => {
    const lineToDelete = lines.find((line) => line.id === id);
    setLines((prevLines) => prevLines.filter((line) => line.id !== id));

    addNotification({
      id: Date.now(),
      message: `Line LINE-${id} deleted.`,
      undo: () => {
        setLines((prev) => [...prev, lineToDelete]);
      },
      onConfirm: async () => {
        try {
          await deleteDocumentLine(id);
        } catch (error) {
          setLines((prev) => [...prev, lineToDelete]);
          addNotification({
            id: Date.now(),
            message: `Failed to delete line LINE-${id}: ${
              error.message || "Unknown error"
            }`,
          });
        }
      },
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If we're canceling edit mode, reset to original document
      setEditedDocument({
        ...document,
        typeId: document.documentType?.id || document.typeId,
      });
    } else {
      // If we're entering edit mode, create a clean copy with correctly mapped fields
      setEditedDocument({
        ...document,
        // Ensure typeId is mapped correctly for the dropdown
        typeId: document.documentType?.id || document.typeId,
      });
      console.log("Entering edit mode with document:", {
        ...document,
        typeId: document.documentType?.id || document.typeId,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleDocumentChange = (e) => {
    const { name, value } = e.target;
    setEditedDocument((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentSave = async () => {
    try {
      // Ensure typeId is a number, not a string
      const typeId =
        typeof editedDocument.typeId === "string"
          ? parseInt(editedDocument.typeId, 10)
          : editedDocument.typeId;

      // Prepare data for update with properly formatted type ID
      const cleanedDocument = {
        id: editedDocument.id,
        title: editedDocument.title,
        content: editedDocument.content,
        documentKey: editedDocument.documentKey,
        docDate: editedDocument.docDate,
        // Ensure we're sending typeId as a number
        typeId: typeId,
        status: editedDocument.status || document.status,
      };

      // Log the exact payload we're sending
      console.log("Saving document with data:", cleanedDocument);
      console.log(
        `TypeId type: ${typeof cleanedDocument.typeId}, value: ${
          cleanedDocument.typeId
        }`
      );

      // Make the actual API call
      await updateDocument(document.id, cleanedDocument);

      // After successful update, refresh the document to get the latest data
      setIsEditing(false);

      // Show success notification
      addNotification({
        id: Date.now(),
        message: "Document updated successfully!",
      });

      // Refresh the document data to show the latest changes
      await fetchDocument();
    } catch (error) {
      console.error("Error updating document:", error);
      // Show more detailed error information
      const errorMessage =
        error.response?.data || error.message || "Unknown error";
      addNotification({
        id: Date.now(),
        message: `Failed to update document: ${errorMessage}`,
      });
    }
  };

  // Function to refresh document data manually
  const handleRefresh = async () => {
    try {
      await fetchDocument();
      addNotification({
        id: Date.now(),
        message: "Document refreshed successfully!",
      });
    } catch (error) {
      console.error("Error refreshing document:", error);
      addNotification({
        id: Date.now(),
        message: `Failed to refresh document: ${
          error.message || "Unknown error"
        }`,
      });
    }
  };

  if (loading)
    return <p className="text-white text-center">Loading document...</p>;
  if (!document)
    return <p className="text-white text-center">Document not found</p>;

  return (
    <div className="w-full h-full flex-col justify-center bg-slate-900 items-center text-white rounded-lg p-3 relative">
      {/* Edit Line Modal */}
      <AnimatePresence>
        {showEditForm && (
          <EditLineModal
            isOpen={showEditForm}
            onClose={() => setShowEditForm(false)}
            line={editingLine}
            onUpdate={handleUpdateLine}
          />
        )}
      </AnimatePresence>

      {/* Back Navigation */}
      <div className="h-1/12 mb-4 flex justify-between items-center">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
        >
          <ArrowLeft
            className="group-hover:-translate-x-1 transition-transform"
            size={18}
          />
          Back to Documents
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-10/12">
        {/* Document Details Card */}
        <div className="md:col-span-1 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-xl relative">
          <div className="flex flex-col justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400">
              <FileText size={20} />
              Document Details
            </h2>
            <div className="">
              {isEditing ? (
                <div className="w-full flex absolute bottom-0 left-0 justify-end gap-3 px-6 my-3">
                  <button
                    onClick={handleDocumentSave}
                    className="px-3 py-1.5 text-sm bg-green-600/30 hover:bg-green-600/50 rounded-md flex items-center gap-1"
                  >
                    <CheckCircle size={16} className="text-green-400" />
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="px-3 py-1.5 text-sm bg-slate-600/30 hover:bg-slate-600/50 rounded-md flex items-center gap-1"
                  >
                    <X size={16} className="text-slate-300" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="absolute top-4 right-4 p-2.5 bg-slate-600 hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                  <Edit size={16} className="text-slate-300" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {document.createdBy && (
              <DetailItem
                label="Created By"
                value={
                  <span className="font-medium">
                    {document.createdBy.username}
                  </span>
                }
              />
            )}

            <DetailItem
              label="Title"
              value={
                isEditing ? (
                  <input
                    type="text"
                    name="title"
                    value={editedDocument?.title || ""}
                    onChange={handleDocumentChange}
                    className="w-full p-2 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
                  />
                ) : (
                  document.title
                )
              }
            />

            <DetailItem
              label="Document Key"
              value={
                isEditing ? (
                  <input
                    type="text"
                    name="documentKey"
                    value={editedDocument?.documentKey || ""}
                    onChange={handleDocumentChange}
                    className="w-full p-2 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
                  />
                ) : (
                  document.documentKey
                )
              }
            />

            <DetailItem
              label="Type"
              value={
                isEditing ? (
                  isLoadingTypes ? (
                    <div className="flex items-center justify-center py-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-gray-400">
                        Loading types...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FormSelect
                        id="typeId"
                        value={editedDocument.typeId}
                        onChange={handleTypeChange}
                        options={documentTypes}
                      />
                      {editedDocument.typeId && (
                        <div className="mt-1 p-2 bg-slate-700/80 rounded text-xs text-gray-300 flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span>Type ID:</span>
                            <span className="font-mono">
                              {editedDocument.typeId} (
                              {typeof editedDocument.typeId})
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Type Name:</span>
                            <span>
                              {editedDocument.documentType?.typeName ||
                                "Unknown"}
                            </span>
                          </div>
                          {documentTypes.length > 0 && (
                            <div className="text-blue-300 text-2xs">
                              {documentTypes.some(
                                (t) => t.value === editedDocument.typeId
                              )
                                ? "✓ ID matches available options"
                                : "⚠️ ID not found in available options"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <span className="px-2 py-1 bg-slate-700/50 rounded-md text-sm">
                    {document.documentType?.typeName || "Unknown"}
                    {document.documentType?.id && (
                      <span className="ml-2 text-xs text-gray-500">
                        (ID: {document.documentType.id}, TypeID:{" "}
                        {document.typeId || "N/A"})
                      </span>
                    )}
                  </span>
                )
              }
            />

            <div className="pt-4 border-t border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">
                Content
              </h3>
              {isEditing ? (
                <textarea
                  name="content"
                  value={editedDocument?.content || ""}
                  onChange={handleDocumentChange}
                  className="w-full p-2 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none min-h-[100px]"
                />
              ) : (
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {document.content || (
                    <span className="italic text-slate-500">No content</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Lines Section */}
        <div className="md:col-span-3 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-xl">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl w-1/2 font-bold flex items-center gap-2 text-blue-400">
                <List size={20} />
                Document Lines
              </h2>
              <div className="w-1/2">
                <AddLine onLineAdded={handleAddLine} />
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              <motion.div
                className="h-full overflow-auto custom-scrollbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <table className="w-full relative border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-700/80 backdrop-blur-sm">
                      {["Line ID", "Article", "Price", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-sm font-semibold text-slate-300 first:rounded-tl-lg last:rounded-tr-lg"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-700/50">
                    {lines.length > 0 ? (
                      lines.map((line) => (
                        <motion.tr
                          key={line.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-slate-700/20 transition-colors group"
                        >
                          <td className="px-4 py-3 text-sm font-mono text-blue-300">
                            {line.lingeKey || `LINE-${line.id}`}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300">
                              {line.article}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300">
                              ${parseFloat(line.prix).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/DocumentDetail/${document.id}/${line.id}`}
                              >
                                <div
                                  className="p-1.5 rounded-md bg-blue-600/30 hover:bg-blue-600/50 transition-colors tooltip"
                                  data-tooltip="View"
                                >
                                  <EyeIcon
                                    size={18}
                                    className="text-blue-400"
                                  />
                                </div>
                              </Link>
                              <div
                                onClick={() => {
                                  setEditingLine(line);
                                  setEditFormData({
                                    title: line.title || "",
                                    article: line.article || "",
                                    prix: line.prix || "",
                                  });
                                  setShowEditForm(true);
                                }}
                                className="p-1.5 rounded-md bg-slate-600/30 hover:bg-slate-600/50 transition-colors tooltip cursor-pointer"
                                data-tooltip="Edit"
                              >
                                <Edit size={18} className="text-slate-300" />
                              </div>

                              <div
                                onClick={() => handleDeleteLine(line.id)}
                                className="p-1.5 rounded-md bg-red-600/30 hover:bg-red-600/50 transition-colors tooltip cursor-pointer"
                                data-tooltip="Delete"
                              >
                                <Trash size={18} className="text-red-400" />
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-4 text-center text-slate-500"
                        >
                          No lines found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 h-1/12">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg backdrop-blur-sm border border-slate-700/50 bg-slate-800/80 shadow-xl"
            >
              {notification.undo ? (
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

const DetailItem = ({ label, value }) => (
  <div>
    <span className="text-gray-400 text-sm block mb-1">{label}</span>
    <div className="text-white">{value || "-"}</div>
  </div>
);

const EditLineModal = ({ isOpen, onClose, line, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: line?.title || "",
    article: line?.article || "",
    prix: line?.prix || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Reset form data when line changes
  useEffect(() => {
    if (line) {
      setFormData({
        title: line.title || "",
        article: line.article || "",
        prix: line.prix || "",
      });
    }
  }, [line]);

  const validateForm = () => {
    const errors = {};
    if (!formData.article.trim()) {
      errors.article = "Article is required";
    }

    if (
      !formData.prix ||
      isNaN(formData.prix) ||
      parseFloat(formData.prix) < 0
    ) {
      errors.prix = "Price must be a valid positive number";
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
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update line:", error);
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
            Edit Line {line?.lingeKey || `LINE-${line?.id}`}
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
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="article"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Article <span className="text-red-400">*</span>
              </label>
              <input
                id="article"
                name="article"
                type="text"
                value={formData.article}
                onChange={handleChange}
                className={`w-full p-2.5 bg-slate-700/50 border ${
                  validationErrors.article
                    ? "border-red-500"
                    : "border-slate-600"
                } text-white rounded focus:ring-blue-500 outline-none`}
              />
              {validationErrors.article && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.article}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="prix"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Price <span className="text-red-400">*</span>
              </label>
              <input
                id="prix"
                name="prix"
                type="number"
                step="0.01"
                value={formData.prix}
                onChange={handleChange}
                className={`w-full p-2.5 bg-slate-700/50 border ${
                  validationErrors.prix ? "border-red-500" : "border-slate-600"
                } text-white rounded focus:ring-blue-500 outline-none`}
              />
              {validationErrors.prix && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.prix}
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
export default DocumentDetail;
