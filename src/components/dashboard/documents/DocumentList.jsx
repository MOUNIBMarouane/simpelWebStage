import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  RefreshCw,
  Grid,
  List,
  CheckSquare,
  RefreshCcwDotIcon,
  RefreshCcw,
} from "lucide-react";
import DocumentCard from "./DocumentCard";
import DocumentListItem from "./DocumentListItem"; // We'll create this component next
import AddDocs from "./AddDocs";
import { getDocuments } from "../../../service/authService";
import axios from "axios";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // "card" or "list"
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const fetchedDocs = await getDocuments();
      setDocuments(fetchedDocs);
      setError(null);
    } catch (err) {
      setError("Failed to load documents. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDocuments();
    setTimeout(() => setRefreshing(false), 600); // Minimum animation time
  };

  const handleDocumentAdded = (newDoc) => {
    setDocuments((prevDocs) => [newDoc, ...prevDocs]);
  };

  const handleDelete = async (id) => {
    // Implement delete functionality

    console.log("delete card ID:", id);
    console.log("in progress calling delete card ID:", id);
    const accessToken = localStorage.getItem("accessToken");
    console.log("in progress see accestoken delete card ID:", id);
    if (!accessToken) {
      console.warn("No access token found. User is not logged in.");
      navigate("/");
      // return null; // Don't throw an error, just return null
    }
    console.log("in progress check access token delete card ID:", id);
    try {
      const path = `http://192.168.1.85:5204/api/Documents/${id}`;
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
      const respence = await axios.delete(path, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("delete complitecard ID:", id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (
    id,
    updatedTitle,
    updatedDescription,
    updatedStatus
  ) => {
    try {
      let satus = 1;
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.warn("No access token found. User is not logged in.");
        return;
      }

      // API call to update document (modify the URL to match your API)
      if (updatedStatus === "opened") satus = 0;
      const response = await axios.put(
        `http://192.168.1.85:5204/api/Documents/${id}`,
        {
          title: updatedTitle,
          content: updatedDescription,
          status: satus,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200) {
        // Update the state to reflect the edited document
        setDocuments((prevDocs) =>
          prevDocs.map((doc) =>
            doc.id === id
              ? {
                  ...doc,
                  title: updatedTitle,
                  content: updatedDescription,
                  status: satus,
                }
              : doc
          )
        );
      }
    } catch (error) {
      console.error("Failed to update document:", error);
    }
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
    // Save user preference in localStorage
    localStorage.setItem("documentViewMode", mode);
  };

  useEffect(() => {
    fetchDocuments();
    // Load user preference if exists
    const savedViewMode = localStorage.getItem("documentViewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  return (
    <div className="bg-slate-800/60 container mx-auto py-8 px-4 ">
      <div className="flex flex-col  sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="font-bold text-white flex items-center">
          <FileText
            size={16}
            className="h-full w-full mr-2 text-blue-400 text-[16px]"
          />
          My Documents
        </div>
        <div className="w-full flex justify-end items-center">
          {/* View Toggle */}
          <div className=" rounded-lg flex justify-between items-center ">
            <div
              onClick={() => toggleViewMode("card")}
              className={`p-1 mr-2 rounded-md flex items-center transition-colors ${
                viewMode === "card"
                  ? "bg-blue-600 text-white"
                  : "text-white bg-gray-400 hover:text-white hover:bg-blue-700"
              }`}
              aria-label="Grid view"
            >
              <Grid size={32} />
            </div>
            <div
              onClick={() => toggleViewMode("list")}
              className={`p-1 rounded-md flex items-center transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-white bg-gray-400 hover:text-white hover:bg-blue-700"
              }`}
              aria-label="List view"
            >
              <List size={32} />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className=" w-3 bg-slate-700 hover:bg-slate-600 text-white rounded-md flex items-center"
        >
          <RefreshCw className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
        </motion.button>
      </div>

      {error && (
        <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-blue-500 mb-4"
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
            <p className="text-gray-300">Loading documents...</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full">
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Add document button/card */}
              <div className="h-full">
                <AddDocs onDocumentAdded={handleDocumentAdded} />
              </div>

              {/* Document cards */}
              <AnimatePresence>
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    title={doc.title}
                    date={doc.createdAt || new Date().toISOString()}
                    description={doc.content}
                    status={doc.status}

                    onDelete={() => handleDelete(doc.id)}
                    onEdit={(updatedTitle, updatedDescription, updatedStatus) =>
                      handleEdit(
                        doc.id,
                        updatedTitle,
                        updatedDescription,
                        updatedStatus
                      )
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              {/* Add document button - compact version for list view */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  document.querySelector("[data-add-doc-trigger]").click()
                }
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center mb-4 font-medium"
              >
                <FileText size={18} className="mr-2" />
                Add New Document
              </motion.button>

              {/* Hidden trigger for the AddDocs component */}
              <div
                className="hidden"
                data-add-doc-trigger
                onClick={() => document.querySelector("[data-add-doc]").click()}
              ></div>
              <div className="hidden" data-add-doc>
                <AddDocs onDocumentAdded={handleDocumentAdded} />
              </div>

              {/* Document list bg-slate-800/50*/}
              <div className="  bg-slate-800/50 w-full h-full rounded-lg border border-slate-700 overflow-hidden">
                {documents.length > 0 ? (
                  <ul className="divide-y divide-slate-700">
                    <AnimatePresence>
                      {documents.map((doc) => (
                        <DocumentListItem
                          key={doc.id}
                          title={doc.title}
                          date={
                            doc.createdAt ||
                            doc.dateCreated ||
                            new Date().toISOString()
                          }
                          description={doc.content}
                          onDelete={() => handleDelete(doc.id)}
                          onEdit={(
                            updatedTitle,
                            updatedDescription,
                            updatedStatus
                          ) =>
                            handleEdit(
                              doc.id,
                              updatedTitle,
                              updatedDescription,
                              updatedStatus
                            )
                          }
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                ) : (
                  <div className="py-12">
                    <div className="text-center text-gray-400">
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No documents found</p>
                      <p className="text-sm mt-2">
                        Click the "Add New Document" button to create your first
                        document
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {documents.length === 0 && viewMode === "card" && (
            <div className="col-span-full py-8">
              <div className="text-center text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No documents found</p>
                <p className="text-sm mt-2">
                  Click the "Add New Document" button to create your first
                  document
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
