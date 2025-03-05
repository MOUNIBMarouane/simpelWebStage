import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, RefreshCw, Grid, List } from "lucide-react";
import DocumentCard from "./DocumentCard";
import DocumentListItem from "./DocumentListItem"; // We'll create this component next
import AddDocs from "./AddDocs";
import { getDocuments } from "../../../service/docSrvice";
import axios from "axios";
import LoadingDocs from "./loadingDocs";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUserAccount } from "../../../service/authService";
import "react-toastify/dist/ReactToastify.css";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserAccount();
      if (userData) {
        setUser(userData);
      } else {
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);
  console.log("user:", user);
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

  // Add this inside your component
  const handleDelete = async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.warn("No access token found. User is not logged in.");
      navigate("/");
      return;
    }

    // Store the deleted document temporarily for possible undo
    const deletedDoc = documents.find((doc) => doc.id === id);

    // Optimistically remove the document from the UI
    setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));

    // Show toast with undo option
    toast.warn(
      <div>
        <p>Document deleted. Undo?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="bg-gray-500 text-white px-3 py-1 rounded"
            onClick={() => {
              setDocuments((prevDocs) => [deletedDoc, ...prevDocs]); // Restore UI
              toast.dismiss();
            }}
          >
            Undo
          </button>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={async () => {
              try {
                await axios.delete(
                  `http://192.168.1.85:5204/api/Documents/${id}`,
                  { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                console.log("Document deleted successfully :", id);
                toast.dismiss();
              } catch (err) {
                console.error("Failed to delete from database:", err);
                setDocuments((prevDocs) => [deletedDoc, ...prevDocs]); // Restore on failure
                toast.dismiss();
              }
            }}
          >
            Confirm
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  // Add this inside the return statement
  <ToastContainer position="top-right" />;

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

  useEffect(() => {
    fetchDocuments();
    // Load user preference if exists
    const savedViewMode = localStorage.getItem("documentViewMode");
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  return (
    <div className="w-full h-full max-h-full  mx-auto py-8 px-4">
      <ToastContainer
        position="top-center"
        toastStyle={{ textAlign: "center" }}
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />
      <div className="flex flex-col h-1/12  sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="font-bold text-white flex items-center">
          <FileText
            size={16}
            className="h-full w-full mr-2 text-blue-400 text-[16px]"
          />
          My Documents
        </div>
        <div className="w-full flex justify-end items-center">
          {/* View Toggle */}
          {/* <div className=" rounded-lg flex justify-between items-center ">
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
          </div> */}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className=" bg-slate-700 hover:bg-slate-600 text-white rounded-md flex items-center"
        >
          <RefreshCw className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
        </motion.button>
      </div>
      {/* <div className="h-1/12">
        <AddDocs onDocumentAdded={handleDocumentAdded} />
      </div> */}
      {error && (
        <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingDocs />
        </div>
      ) : (
        <div className="w-full h-10/12 p-1 overflow-y-scroll overflow-x-clip scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
            {/* Add document button/card */}
            <div className="h-full">
              <AddDocs onDocumentAdded={handleDocumentAdded} />
            </div>
            {/* Document cards */}
            <AnimatePresence>
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  id={doc.id}
                  title={doc.title}
                  date={doc.createdAt || new Date().toISOString()}
                  description={doc.content}
                  status={doc.status}
                  userRole={user?.role}
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
          {documents.length === 0 && (
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
