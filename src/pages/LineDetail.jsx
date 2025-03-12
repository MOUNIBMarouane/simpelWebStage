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
import { Trash, Edit } from "lucide-react";

const LineDetail = () => {
  const { idDoc, idLine } = useParams();
  const [document, setDocument] = useState(null);
  const [line, setLine] = useState(null);
  const [subLines, setSubLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubLine, setEditingSubLine] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [newSubLine, setNewSubLine] = useState({ title: "", attribute: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    fetchData();
  }, [idDoc, idLine]);

  // Add Sublines Handler
  const handleAddSubLine = async (e) => {
    e.preventDefault();
    if (!newSubLine.title || !newSubLine.attribute) {
      alert("Please fill in all fields.");
      return;
    }

    const addedSubLine = await addDocumentSubLine(
      idLine,
      newSubLine.title,
      newSubLine.attribute
    );
    if (addedSubLine) {
      setSubLines((prevSubLines) => [...prevSubLines, addedSubLine]);
      setNewSubLine({ title: "", attribute: "" }); // Reset form
      addNotification({
        id: Date.now(),
        message: `SubLine ${addedSubLine.title} added successfully!`,
      });
    }
  };

  // Update Sublines Handler
  const handleUpdateSubLine = async (id, updatedSubLine) => {
    try {
      const updated = await updateDocumentSubLine(id, updatedSubLine);
      if (updated) {
        setSubLines((prevSubLines) =>
          prevSubLines.map((subLine) => (subLine.id === id ? updated : subLine))
        );
        setEditingSubLine(null); // Exit edit mode
        addNotification({
          id: Date.now(),
          message: `SubLine ${updated.title} updated successfully!`,
        });
      }
    } catch (error) {
      addNotification({
        id: Date.now(),
        message: `Failed to update SubLine ${updatedSubLine.title}.`,
      });
    }
  };

  // Delete Sublines Handler
  const handleDeleteSubLine = (id) => {
    const subLineToDelete = subLines.find((subLine) => subLine.id === id);
    setSubLines((prevSubLines) =>
      prevSubLines.filter((subLine) => subLine.id !== id)
    );

    addNotification({
      id: Date.now(),
      message: `SubLine ${subLineToDelete.title} deleted.`,
      undo: () => {
        setSubLines((prev) => [...prev, subLineToDelete]);
      },
      onConfirm: async () => {
        try {
          await deleteDocumentSubLine(id);
        } catch (error) {
          setSubLines((prev) => [...prev, subLineToDelete]);
          addNotification({
            id: Date.now(),
            message: `Failed to delete SubLine ${subLineToDelete.title}.`,
          });
        }
      },
    });
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
    return <p className="text-white text-center">Loading line details...</p>;
  if (!document || !line)
    return <p className="text-white text-center">Document or line not found</p>;

  return (
    <div className="w-full h-screen flex-col p-6 bg-blue-700/50 text-white relative">
      <div className="bg-amber-400">
        <Link
          to={`/documents/${idDoc}`}
          className="mt-4 text-blue-300 hover:underline"
        >
          Go Back to Document
        </Link>
      </div>
      <div className="w-full h-full flex flex-row py-2 gap-2">
        {/* Left: Document and Line Details */}
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
          <div className="bg-blue-700 p-6 rounded-xl shadow-lg w-full max-w-md mt-4">
            <h2 className="text-2xl font-bold mb-4">Line Details</h2>
            <p>
              <strong>ID:</strong> LINE-{line.id}
            </p>
            <p>
              <strong>Title:</strong> {line.title}
            </p>
            <p>
              <strong>Article:</strong> {line.article}
            </p>
            <p>
              <strong>Price:</strong> {line.prix}
            </p>
          </div>
        </div>

        {/* Right: Sublines Table and Add Sublines Form */}
        <div className="w-3/2 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 w-full bg-amber-200">
            Sublines
          </h2>

          {/* Add Sublines Form */}
          <form onSubmit={handleAddSubLine} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Title"
                value={newSubLine.title}
                onChange={(e) =>
                  setNewSubLine({ ...newSubLine, title: e.target.value })
                }
                className="p-2 rounded-lg bg-gray-700 text-white"
              />
              <input
                type="text"
                placeholder="Attribute"
                value={newSubLine.attribute}
                onChange={(e) =>
                  setNewSubLine({ ...newSubLine, attribute: e.target.value })
                }
                className="p-2 rounded-lg bg-gray-700 text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition duration-200"
              >
                Add Subline
              </button>
            </div>
          </form>

          {/* Sublines Table */}
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
                    Title
                  </th>
                  <th className="p-4 text-left uppercase text-sm tracking-wide">
                    Attribute
                  </th>
                  <th className="p-4 text-left uppercase text-sm tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subLines.length > 0 ? (
                  subLines.map((subLine) => (
                    <motion.tr
                      key={subLine.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                    >
                      <td className="p-4">
                        LINE-{line.id}-SL_{subLine.id}
                      </td>
                      <td className="p-4">
                        {editingSubLine === subLine.id ? (
                          <input
                            type="text"
                            value={subLine.title}
                            onChange={(e) =>
                              setSubLines((prevSubLines) =>
                                prevSubLines.map((sl) =>
                                  sl.id === subLine.id
                                    ? { ...sl, title: e.target.value }
                                    : sl
                                )
                              )
                            }
                          />
                        ) : (
                          subLine.title
                        )}
                      </td>
                      <td className="p-4">
                        {editingSubLine === subLine.id ? (
                          <input
                            type="text"
                            value={subLine.attribute}
                            onChange={(e) =>
                              setSubLines((prevSubLines) =>
                                prevSubLines.map((sl) =>
                                  sl.id === subLine.id
                                    ? { ...sl, attribute: e.target.value }
                                    : sl
                                )
                              )
                            }
                          />
                        ) : (
                          subLine.attribute
                        )}
                      </td>
                      <td className="p-4 flex items-center justify-center space-x-3">
                        {editingSubLine === subLine.id ? (
                          <>
                            <div
                              onClick={() =>
                                handleUpdateSubLine(subLine.id, subLine)
                              }
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-700 text-white hover:bg-green-600 transition duration-200 cursor-pointer"
                            >
                              Save
                            </div>
                            <div
                              onClick={() => setEditingSubLine(null)}
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer"
                            >
                              Back
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              onClick={() => setEditingSubLine(subLine.id)}
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer"
                            >
                              <Edit size={18} />
                            </div>
                            <div
                              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-700 text-white hover:bg-red-600 transition duration-200 cursor-pointer"
                              onClick={() => handleDeleteSubLine(subLine.id)}
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
                      No sublines found.
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

export default LineDetail;
