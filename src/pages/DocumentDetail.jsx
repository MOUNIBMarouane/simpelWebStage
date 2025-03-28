import React, { useEffect, useState } from "react";
import { useParams, Link, Links } from "react-router-dom";
import { getDocument, updateDocument } from "../service/docSrvice";
import {
  getDocumentLines,
  addDocumentLine,
  updateDocumentLine,
  deleteDocumentLine,
} from "../service/Lines";
import AddLine from "../components/dashboard/documents/AddLine";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash, Edit, EyeIcon } from "lucide-react";
import { ArrowLeft, FileText, CheckCircle, X, Info, List } from "lucide-react";
import FormSelect from "../components/inputs/FormSelect";

const DocumentDetail = () => {
  const { idDoc } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lines, setLines] = useState([]);
  const [editingLine, setEditingLine] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocument, setEditedDocument] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    article: "",
    prix: "",
  });

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      const data = await getDocument(idDoc);
      if (data) {
        setDocument(data);
        const linesData = await getDocumentLines(idDoc);
        setLines(linesData);
      }
      setLoading(false);
    };
    
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
    fetchDocumentTypes();
    fetchDocument();
  }, [idDoc]);

  useEffect(() => {
    return () => {
      notifications.forEach((notification) => {
        clearTimeout(notification.timeoutId);
      });
    };
  }, [notifications]);
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
  };

  const handleUpdateLine = async () => {
    try {
      const updated = await updateDocumentLine(
        editingLine.id,
        editFormData.title,
        editFormData.article,
        editFormData.prix
      );

      if (updated) {
        setLines((prevLines) =>
          prevLines.map((line) => (line.id === editingLine.id ? updated : line))
        );
        setShowEditForm(false);
        addNotification({
          id: Date.now(),
          message: `Line LINE-${editingLine.id} updated successfully!`,
        });
      }
    } catch (error) {
      addNotification({
        id: Date.now(),
        message: `Failed to update line LINE-${editingLine.id}.`,
      });
    }
  };

  // Edit form modal component
  const EditLineForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex justify-center items-center bg-black/70 backdrop-blur-sm z-50"
      onClick={() => setShowEditForm(false)}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Edit Line {editingLine?.lingeKey}
          </h2>
          <button
            onClick={() => setShowEditForm(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateLine();
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Article
              </label>
              <input
                type="text"
                value={editFormData.article}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    article: e.target.value,
                  }))
                }
                className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={editFormData.prix}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    prix: e.target.value,
                  }))
                }
                className="w-full p-2.5 bg-slate-700/50 border border-slate-600 text-white rounded focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => setShowEditForm(false)}
              className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

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
            message: `Failed to delete line LINE-${id}.`,
          });
        }
      },
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedDocument({ ...document });
    }
  };

  const handleDocumentChange = (e) => {
    const { name, value } = e.target;
    setEditedDocument((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentSave = async () => {
    try {
      const updatedDoc = await updateDocument(document.id, editedDocument);
      setDocument(updatedDoc);
      setIsEditing(false);
      addNotification({
        id: Date.now(),
        message: "Document updated successfully!",
      });
    } catch (error) {
      addNotification({
        id: Date.now(),
        message: "Failed to update document",
      });
    }
  };

  if (loading)
    return <p className="text-white text-center">Loading document...</p>;
  if (!document)
    return <p className="text-white text-center">Document not found</p>;

  return (
    <div className="w-full h-full flex-col justify-center bg-slate-900 items-center text-white rounded-lg p-3  relative ">
      {/* Back div */}
      {showEditForm && (
        <EditLineForm
          editingLine={editingLine}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          handleUpdateLine={handleUpdateLine}
          setShowEditForm={setShowEditForm}
        />
      )}

      <div className="h-1/12">
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
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-10/12">
        {/* Document Details Card */}
        <div className="md:col-span-1 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-xl relative">
          <div className="flex flex-col justify-between  mb-4">
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
            <DetailItem
              label="Created By"
              value={
                <span className="font-medium">
                  {document.createdBy.username}
                </span>
              }
            />

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
              label="Prefix"
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
                  <FormSelect
                    value={document.type}
                    onChange={handleTypeChange}
                    options={documentTypes}
                  />
                ) : (
                  <span className="px-2 py-1 bg-slate-700/50 rounded-md text-sm">
                    {document.documentType.typeName}
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
                          key={line.lingeKey}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-slate-700/20 transition-colors group"
                        >
                          <td className="px-4 py-3 text-sm font-mono text-blue-300">
                            {line.lingeKey}
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
                              <>
                                <Link
                                  to={`/DocumentDetail/${document.id}/${line.id}`}
                                >
                                  <div
                                    className="p-1.5 rounded-md bg-red-blue/30 hover:bg-blue-600/50 transition-colors tooltip"
                                    data-tooltip="View"
                                  >
                                    <EyeIcon
                                      size={18}
                                      className="text-blue-600"
                                    />
                                  </div>
                                </Link>
                                <div
                                  onClick={() => {
                                    setEditingLine(line); // Pass the whole line object
                                    setEditFormData({
                                      title: line.title,
                                      article: line.article,
                                      prix: line.prix,
                                    });
                                    setShowEditForm(true);
                                  }}
                                  className="p-1.5 rounded-md bg-slate-600/30 hover:bg-slate-600/50 transition-colors tooltip"
                                  data-tooltip="Edit"
                                >
                                  <Edit size={18} className="text-slate-300" />
                                </div>

                                <div
                                  onClick={() => handleDeleteLine(line.id)}
                                  className="p-1.5 rounded-md bg-red-600/30 hover:bg-red-600/50 transition-colors tooltip"
                                  data-tooltip="Delete"
                                >
                                  <Trash size={18} className="text-red-400" />
                                </div>
                              </>
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
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
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
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}:</span>
    <span className="text-white">{value || "-"}</span>
  </div>
);
export default DocumentDetail;
