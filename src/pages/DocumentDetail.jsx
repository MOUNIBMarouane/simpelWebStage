import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
    <div className="w-full h-screen flex-col p-6 bg-blue-700/50 text-white relative">
      <div className="bg-amber-400">
        <Link to="/documents" className="mt-4 text-blue-300 hover:underline">
          Go Back to Documents
        </Link>
      </div>
      <div className="w-full h-full flex flex-row py-2 gap-2">
        {/* Left: Document Details */}
        <div className="w-1/2 flex flex-col justify-between">
          <div className="bg-blue-700 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Document Details</h2>
            <p>
              <strong>ID:</strong> DOC-{document.id}
            </p>
            <p>
              <strong>Title:</strong> {document.title}
            </p>
            <p>
              <strong>Date:</strong> {document.docDate}
            </p>
            <p>
              <strong>Type:</strong> {document.typeId}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {document.status === 0 ? "Opened" : "Activate"}
            </p>
          </div>
        </div>

        {/* Right: Document Lines Table */}
        <div className="w-3/2 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 w-full bg-amber-200">
            Document Lines
          </h2>
          <AddLine onLineAdded={handleAddLine} />

          <div className="mt-4 overflow-x-auto">
            <motion.table
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full border-collapse bg-gray-900 text-white rounded-lg"
            >
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-4 text-left uppercase text-sm tracking-wide">
                    #
                  </th>
                  <th className="p-4 text-left uppercase text-sm tracking-wide">
                    Article
                  </th>
                  <th className="p-4 text-left uppercase text-sm tracking-wide">
                    Price
                  </th>
                  <th className="p-4 text-left uppercase text-sm tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.length > 0 ? (
                  lines.map((line) => (
                    <motion.tr
                      key={line.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                    >
                      <td className="p-4">
                        DOC-{document.id}-L_{line.id}
                      </td>
                      <td className="p-4">
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
                          />
                        ) : (
                          line.article
                        )}
                      </td>
                      <td className="p-4">
                        {editingLine === line.id ? (
                          <input
                            type="text"
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
                          />
                        ) : (
                          line.prix
                        )}
                      </td>
                      <td className="p-4 flex items-center justify-center space-x-3">
                        {editingLine === line.id ? (
                          <>
                            <div
                              onClick={() => handleUpdateLine(line.id, line)}
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-700 text-white hover:bg-green-600 transition duration-200 cursor-pointer"
                            >
                              Save
                            </div>
                            <div
                              onClick={() => setEditingLine(null)}
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer"
                            >
                              Back
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              onClick={() => setEditingLine(line.id)}
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer"
                            >
                              <Edit size={18} />
                            </div>
                            <div
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-700 text-white hover:bg-red-600 transition duration-200 cursor-pointer"
                              onClick={() => handleDeleteLine(line.id)}
                            >
                              <Trash size={18} />
                            </div>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-400">
                      No lines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </motion.table>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`px-4 py-2 rounded-md flex items-center gap-4 ${
                notification.undo ? "bg-blue-600" : "bg-green-500"
              } text-white mb-2`}
            >
              <span>{notification.message}</span>
              {notification.undo && (
                <button
                  onClick={() => handleUndo(notification)}
                  className="underline hover:text-gray-200"
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

export default DocumentDetail;
