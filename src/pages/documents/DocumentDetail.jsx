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

  // 1. Fix the fetchDocument function to correctly set the typeId
  const fetchDocument = async () => {
    setRefreshing(true);
    try {
      const data = await getDocument(idDoc);
      if (data) {
        console.log("Fetched document:", data);

        // Find the correct typeId from the document data
        // The API returns a documentType object with typeKey, typeName, etc.
        // but might not include the id directly in documentType
        const typeId = data.typeId; // This is the correct typeId from the API

        console.log("Document type info:", {
          typeId: typeId,
          documentType: data.documentType,
        });

        setDocument(data);

        // Set the correct typeId when initializing the editedDocument
        setEditedDocument({
          ...data,
          typeId: typeId, // Use the typeId directly from the API response
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
  // 6. Modify the fetchDocumentTypes function to better match with the API structure
  const fetchDocumentTypes = async () => {
    setIsLoadingTypes(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        "http://192.168.1.94:5204/api/Documents/Types",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log("Fetched document types:", response.data);

      // Transform the type data to match the format needed for FormSelect
      const transformedTypes = response.data.map((type) => ({
        // FormSelect needs value and label properties
        value: type.id,
        label: type.typeName,
        // Keep the other properties for reference
        typeKey: type.typeKey,
        typeAttr: type.typeAttr,
        typeAlias: type.typeAlias,
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

  // 4. Fix the handleTypeChange function to handle the typeId correctly
  const handleTypeChange = (selectedType) => {
    // Convert the selected type to a number
    const typeId = Number(selectedType);

    console.log(
      `Type selected: ${selectedType} (converted to number: ${typeId})`
    );

    if (isNaN(typeId)) {
      console.error("Invalid type ID selected:", selectedType);
      return;
    }

    // Find the selected type object
    const selectedTypeObj = documentTypes.find((type) => type.value === typeId);

    if (!selectedTypeObj) {
      console.error(
        `Type with ID ${typeId} not found in options:`,
        documentTypes
      );
      return;
    }

    console.log("Selected type object:", selectedTypeObj);

    // Update the edited document with the new type
    setEditedDocument((prev) => ({
      ...prev,
      typeId: typeId, // Store as number
      documentType: {
        typeName: selectedTypeObj.label,
        typeKey: selectedTypeObj.typeKey,
        typeAttr: selectedTypeObj.typeAttr,
        typeAlias: selectedTypeObj.typeAlias || "",
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

  // 2. Fix the handleEditToggle function to properly set the typeId
  const handleEditToggle = () => {
    if (isEditing) {
      // If we're canceling edit mode, reset to original document
      setEditedDocument({
        ...document,
        typeId: document.typeId, // Use the typeId directly from document
      });
    } else {
      // If we're entering edit mode, create a clean copy with correctly mapped typeId
      setEditedDocument({
        ...document,
        typeId: document.typeId, // Use the typeId directly from document
      });

      console.log("Entering edit mode with document:", {
        ...document,
        typeId: document.typeId,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleDocumentChange = (e) => {
    const { name, value } = e.target;
    setEditedDocument((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Fix the DetailItem for Type to render the typeId and select properly
  const renderTypeDetailItem = () => (
    <DetailItem
      label="Type"
      value={
        isEditing ? (
          isLoadingTypes ? (
            <div className="flex items-center justify-center py-2">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-400">Loading types...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Important debug information */}
              <div className="p-2 bg-slate-700/80 rounded text-xs text-blue-300 mb-2">
                Document typeId: {document.typeId} | editedDocument typeId:{" "}
                {editedDocument.typeId}
              </div>

              <FormSelect
                id="typeId"
                value={editedDocument.typeId}
                onChange={handleTypeChange}
                options={documentTypes}
              />
            </div>
          )
        ) : (
          <span className="px-2 py-1 bg-slate-700/50 rounded-md text-sm">
            {document.documentType?.typeName || "Unknown"}
            <span className="ml-2 text-xs text-gray-500">
              (TypeID: {document.typeId || "N/A"})
            </span>
          </span>
        )
      }
    />
  );

  const handleDocumentSave = async () => {
    try {
      // Ensure typeId is a number (not a string)
      const typeId = Number(editedDocument.typeId);

      if (isNaN(typeId)) {
        throw new Error("Type ID must be a valid number");
      }

      // Create a minimal update object with only the needed fields
      const updateData = {
        title: editedDocument.title,
        content: editedDocument.content,
        typeId: typeId,
      };

      console.log("Updating document with data:", updateData);

      // Call the update function with the document ID and update data
      await updateDocument(document.id, updateData);

      // Exit edit mode
      setIsEditing(false);

      // Show success notification
      addNotification({
        id: Date.now(),
        message: "Document updated successfully!",
      });

      // Refresh to show the latest changes
      await fetchDocument();
    } catch (error) {
      console.error("Error updating document:", error);
      addNotification({
        id: Date.now(),
        message: `Failed to update document: ${
          error.message || "Unknown error"
        }`,
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
    <div className="w-full h-full flex flex-col bg-slate-900 text-white pb-16 overflow-hidden">
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

      {/* Page Header with Navigation */}
      <div className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 mb-4">
        <div className="flex justify-between items-center py-3 px-4 max-w-7xl mx-auto">
          <Link
            to="/documents"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
              <ArrowLeft
                className="group-hover:-translate-x-0.5 transition-transform"
                size={18}
              />
            </div>
            <span className="font-medium">Back to Documents</span>
          </Link>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800 border border-slate-700/50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-3 sm:px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Document Details Panel */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 shadow-xl overflow-hidden h-full">
              <div className="relative">
                <div className="p-4 sm:p-5 border-b border-slate-700/50 bg-slate-800/80">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-blue-400">
                    <FileText size={20} />
                    Document Details
                  </h2>

                  {/* Edit/Save/Cancel Buttons */}
                  {!isEditing ? (
                    <button
                      onClick={handleEditToggle}
                      className="absolute top-4 right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      <Edit size={16} className="text-slate-300" />
                    </button>
                  ) : (
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <button
                        onClick={handleEditToggle}
                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                      >
                        <X size={16} className="text-slate-300" />
                      </button>
                      <button
                        onClick={handleDocumentSave}
                        className="p-2 bg-green-600/30 hover:bg-green-600/50 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                      >
                        <CheckCircle size={16} className="text-green-400" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Scrollable Content Area */}
                <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-13rem)]">
                  {document.createdBy && (
                    <DetailItem
                      label="Created By"
                      value={
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                            {document.createdBy.username
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="font-medium">
                            {document.createdBy.username}
                          </span>
                        </div>
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
                        <div className="px-3 py-2 bg-slate-700/20 rounded-md">
                          {document.title}
                        </div>
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
                        <div className="font-mono text-sm bg-slate-700/20 px-3 py-2 rounded-md">
                          {document.documentKey}
                        </div>
                      )
                    }
                  />

                  <DetailItem
                    label="Type"
                    value={
                      isEditing ? (
                        isLoadingTypes ? (
                          <div className="flex items-center justify-center py-3">
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
                          </div>
                        )
                      ) : (
                        <div className="px-3 py-2 bg-slate-700/20 rounded-md flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                            {document.typeId}
                          </span>
                          <span>
                            {document.documentType?.typeName || "Unknown"}
                          </span>
                        </div>
                      )
                    }
                  />

                  <div className="pt-3 border-t border-slate-700/50">
                    <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center">
                      <span>Content</span>
                      {!isEditing && document.content && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-slate-700/50 rounded-full">
                          {document.content.length} chars
                        </span>
                      )}
                    </h3>
                    {isEditing ? (
                      <textarea
                        name="content"
                        value={editedDocument?.content || ""}
                        onChange={handleDocumentChange}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none min-h-[120px] font-mono text-sm"
                      />
                    ) : (
                      <div className="p-3 bg-slate-700/20 rounded-md text-slate-300 whitespace-pre-wrap leading-relaxed text-sm max-h-[200px] overflow-y-auto custom-scrollbar">
                        {document.content || (
                          <span className="italic text-slate-500">
                            No content
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="pt-3 border-t border-slate-700/50 flex justify-end">
                      <button
                        onClick={handleDocumentSave}
                        className="px-4 py-2 bg-green-600/30 hover:bg-green-600/50 rounded-md flex items-center gap-2 transition-colors"
                      >
                        <CheckCircle size={16} className="text-green-400" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Document Lines Panel */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 shadow-xl overflow-hidden h-full flex flex-col">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-700/50 bg-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-blue-400">
                    <List size={20} />
                    Document Lines
                    <span className="ml-2 text-xs px-2 py-0.5 bg-slate-700/50 rounded-full text-slate-300">
                      {lines.length}
                    </span>
                  </h2>
                  <div className="sm:ml-auto">
                    <AddLine onLineAdded={handleAddLine} />
                  </div>
                </div>
              </div>

              {/* Table Container with better overflow handling */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-auto custom-scrollbar p-4 sm:p-5">
                  {/* Mobile View (Card-based) */}
                  <div className="md:hidden space-y-3">
                    {lines.length > 0 ? (
                      lines.map((line) => (
                        <motion.div
                          key={line.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-slate-700/20 rounded-lg border border-slate-700/30 overflow-hidden"
                        >
                          <div className="flex justify-between items-center p-3 bg-slate-700/30">
                            <div className="font-mono text-sm text-blue-300">
                              {line.lingeKey || `LINE-${line.id}`}
                            </div>
                            <div className="flex items-center gap-1">
                              <Link
                                to={`/DocumentDetail/${document.id}/${line.id}`}
                              >
                                <div className="p-1.5 rounded-md bg-blue-600/30 hover:bg-blue-600/50 transition-colors">
                                  <EyeIcon
                                    size={16}
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
                                className="p-1.5 rounded-md bg-slate-600/30 hover:bg-slate-600/50 transition-colors cursor-pointer"
                              >
                                <Edit size={16} className="text-slate-300" />
                              </div>
                              <div
                                onClick={() => handleDeleteLine(line.id)}
                                className="p-1.5 rounded-md bg-red-600/30 hover:bg-red-600/50 transition-colors cursor-pointer"
                              >
                                <Trash size={16} className="text-red-400" />
                              </div>
                            </div>
                          </div>
                          <div className="p-3 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-slate-400 text-xs">
                                Article:
                              </span>
                              <span className="text-slate-200 font-medium">
                                {line.article}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 text-xs">
                                Price:
                              </span>
                              <span className="text-slate-200 font-medium">
                                ${parseFloat(line.prix).toFixed(2)}
                              </span>
                            </div>
                            {line.title && (
                              <div className="flex justify-between">
                                <span className="text-slate-400 text-xs">
                                  Title:
                                </span>
                                <span className="text-slate-200 font-medium">
                                  {line.title}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-700/30 flex items-center justify-center mb-4">
                          <List size={24} className="text-slate-500" />
                        </div>
                        <p className="text-slate-400 mb-2">
                          No document lines found
                        </p>
                        <p className="text-slate-500 text-sm">
                          Add a new line to get started
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-700/30">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400 rounded-tl-lg w-1/6">
                            Line ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400 w-1/2">
                            Article
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-400 w-1/6">
                            Price
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-slate-400 rounded-tr-lg w-1/6">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {lines.length > 0 ? (
                          lines.map((line) => (
                            <motion.tr
                              key={line.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-slate-700/10 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm font-mono text-blue-300">
                                {line.lingeKey || `LINE-${line.id}`}
                              </td>
                              <td className="px-4 py-3 text-slate-300 font-medium">
                                {line.article}
                                {line.title && (
                                  <div className="text-xs text-slate-400 mt-1">
                                    {line.title}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-slate-200">
                                  ${parseFloat(line.prix).toFixed(2)}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
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
                                    <Edit
                                      size={18}
                                      className="text-slate-300"
                                    />
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
                            <td colSpan="4" className="px-4 py-8 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-slate-700/30 flex items-center justify-center mb-4">
                                  <List size={24} className="text-slate-500" />
                                </div>
                                <p className="text-slate-400 mb-2">
                                  No document lines found
                                </p>
                                <p className="text-slate-500 text-sm">
                                  Add a new line to get started
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Notification System */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-[90vw] sm:max-w-md">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg backdrop-blur-lg border border-slate-700/50 bg-slate-800/90 shadow-xl"
            >
              {notification.undo ? (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Info size={18} className="text-blue-400" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle size={18} className="text-green-400" />
                </div>
              )}
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

const DetailItem = ({ label, value }) => (
  <div>
    <span className="text-gray-400 text-sm block mb-1">{label}</span>
    <div className="text-white">{value || "-"}</div>
  </div>
);

// Updated EditLineModal with enhanced UI/UX
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
      className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-700/50 bg-slate-700/30 px-5 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Edit size={18} className="text-blue-400" />
            Edit Line {line?.lingeKey || `LINE-${line?.id}`}
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
                htmlFor="article"
                className="block text-sm font-medium text-slate-300 mb-1 flex items-center"
              >
                Article <span className="text-red-400 ml-1">*</span>
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
                } text-white rounded focus:ring-blue-500 outline-none transition-colors`}
              />
              {validationErrors.article && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span className="inline-block w-4 h-4 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs">!</span>
                  </span>
                  {validationErrors.article}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="prix"
                className="block text-sm font-medium text-slate-300 mb-1 flex items-center"
              >
                Price <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  $
                </span>
                <input
                  id="prix"
                  name="prix"
                  type="number"
                  step="0.01"
                  value={formData.prix}
                  onChange={handleChange}
                  className={`w-full pl-7 pr-3 py-2.5 bg-slate-700/50 border ${
                    validationErrors.prix
                      ? "border-red-500"
                      : "border-slate-600"
                  } text-white rounded focus:ring-blue-500 outline-none transition-colors`}
                />
              </div>
              {validationErrors.prix && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <span className="inline-block w-4 h-4 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs">!</span>
                  </span>
                  {validationErrors.prix}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Title <span className="text-xs text-slate-500">(Optional)</span>
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
