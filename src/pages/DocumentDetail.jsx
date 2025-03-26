import React, { useEffect, useState } from "react";
import { useParams, Link, Links } from "react-router-dom";
import { getDocument } from "../service/docSrvice";
import {
  getDocumentLines,
  addDocumentLine,
  updateDocumentLine,
  deleteDocumentLine,
} from "../service/Lines";
import AddLine from "../components/dashboard/documents/AddLine";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash, Edit } from "lucide-react";
import { ArrowLeft, FileText, CheckCircle, X, Info, List } from "lucide-react";

const DocumentDetail = () => {
  const { idDoc } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lines, setLines] = useState([]);
  const [editingLine, setEditingLine] = useState(null);
  const [notifications, setNotifications] = useState([]);

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

    fetchDocument();
  }, [idDoc]);

  useEffect(() => {
    return () => {
      notifications.forEach((notification) => {
        clearTimeout(notification.timeoutId);
      });
    };
  }, [notifications]);

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

  const handleUpdateLine = async (id, updatedLine) => {
    try {
      const updated = await updateDocumentLine(
        id,
        updatedLine.title,
        updatedLine.article,
        updatedLine.prix
      );
      if (updated) {
        setLines((prevLines) =>
          prevLines.map((line) => (line.id === id ? updated : line))
        );
        setEditingLine(null);
        addNotification({
          id: Date.now(),
          message: `Line LINE-${id} updated successfully!`,
        });
      }
    } catch (error) {
      addNotification({
        id: Date.now(),
        message: `Failed to update line LINE-${id}.`,
      });
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
            message: `Failed to delete line LINE-${id}.`,
          });
        }
      },
    });
  };

  if (loading)
    return <p className="text-white text-center">Loading document...</p>;
  if (!document)
    return <p className="text-white text-center">Document not found</p>;

  return (
    <div className="w-full h-full flex-col justify-center bg-slate-900 items-center text-white rounded-lg p-3  relative ">
      {/* Back div */}
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
        <div className="md:col-span-1 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
            <FileText size={20} />
            Document Details
          </h2>

          <div className="space-y-4">
            <DetailItem
              label="Created By"
              value={
                <span className="font-medium">
                  {document.createdBy.username}
                </span>
              }
            />
            <DetailItem label="Title" value={document.title} />
            <DetailItem label="Prefix" value={document.documentKey} />
            <DetailItem
              label="Type"
              value={
                <span className="px-2 py-1 bg-slate-700/50 rounded-md text-sm">
                  {document.documentType.typeName}
                </span>
              }
            />
            <DetailItem
              label="Date"
              value={new Date(document.docDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />

            <div className="pt-4 border-t border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">
                Content
              </h3>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {document.content || (
                  <span className="italic text-slate-500">No content</span>
                )}
              </p>
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
                            {editingLine === line.id ? (
                              <input
                                type="text"
                                value={line.article}
                                onChange={(e) =>
                                  setLines((prevLines) =>
                                    prevLines.map((l) =>
                                      l.id === line.id
                                        ? { ...l, article: e.target.value }
                                        : l
                                    )
                                  )
                                }
                                className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            ) : (
                              <span className="text-slate-300">
                                {line.article}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {editingLine === line.id ? (
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={line.prix}
                                onChange={(e) =>
                                  setLines((prevLines) =>
                                    prevLines.map((l) =>
                                      l.id === line.id
                                        ? { ...l, prix: e.target.value }
                                        : l
                                    )
                                  )
                                }
                                className="w-full bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                            ) : (
                              <span className="text-slate-300">
                                ${parseFloat(line.prix).toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {editingLine === line.id ? (
                                <>
                                  <div
                                    onClick={() =>
                                      handleUpdateLine(line.id, line)
                                    }
                                    className="p-1.5 rounded-md bg-green-600/30 hover:bg-green-600/50 transition-colors tooltip"
                                    data-tooltip="Save"
                                  >
                                    <CheckCircle
                                      size={18}
                                      className="text-green-400"
                                    />
                                  </div>
                                  <div
                                    onClick={() => setEditingLine(null)}
                                    className="p-1.5 rounded-md bg-slate-600/30 hover:bg-slate-600/50 transition-colors tooltip"
                                    data-tooltip="Cancel"
                                  >
                                    <X size={18} className="text-slate-300" />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    onClick={() => setEditingLine(line.id)}
                                    className="p-1.5 rounded-md bg-slate-600/30 hover:bg-slate-600/50 transition-colors tooltip"
                                    data-tooltip="Edit"
                                  >
                                    <Edit
                                      size={18}
                                      className="text-slate-300"
                                    />
                                  </div>
                                  <div
                                    onClick={() => handleDeleteLine(line.id)}
                                    className="p-1.5 rounded-md bg-red-600/30 hover:bg-red-600/50 transition-colors tooltip"
                                    data-tooltip="Delete"
                                  >
                                    <Trash size={18} className="text-red-400" />
                                  </div>
                                </>
                              )}
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
