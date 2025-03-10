import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  RefreshCw,
  Search,
  Calendar,
  Undo,
  Check,
  File,
} from "lucide-react";
import DocumentCard from "./DocumentCard";
import AddDocs from "./AddDocs";
import { getDocuments } from "../../../service/docSrvice";
import axios from "axios";
import LoadingDocs from "./loadingDocs";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUserAccount } from "../../../service/authService";
import "react-toastify/dist/ReactToastify.css";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDocuments();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleDocumentAdded = (newDoc) => {
    setDocuments((prevDocs) => [newDoc, ...prevDocs]);
  };
  const handleDelete = async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.warn("No access token found. User is not logged in.");
      navigate("/");
      return;
    }

    const deletedDoc = documents.find((doc) => doc.id === id);
    setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));

    let undo = false;

    // Custom Toast Notification
    const toastId = toast.warn(
      <div className="flex flex-col mt-2 ggggg">
        <p className="font-semibold text-yellow-500 flex items-center gap-1">
          <File size={24} className="text-yellow-500" />
          Document deleted! Undo?
        </p>
        <div className="flex justify-end gap-3 m-2">
          <div
            className="px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition flex items-center"
            onClick={() => {
              setDocuments((prevDocs) => [deletedDoc, ...prevDocs]); // Restore UI
              undo = true;
              toast.dismiss(toastId);
            }}
          >
            <Undo size={16} className="mr-1" />
            Undo
          </div>
          <div
            className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 transition flex items-center"
            onClick={async () => {
              if (!undo) {
                try {
                  await axios.delete(
                    `http://localhost:5204/api/Documents/${id}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                  );
                  console.log("Document deleted successfully:", id);
                } catch (err) {
                  console.error("Failed to delete from database:", err);
                  setDocuments((prevDocs) => [deletedDoc, ...prevDocs]); // Restore on failure
                }
              }
              toast.dismiss(toastId);
            }}
          >
            <Check size={16} className="mr-1" />
            Confirm
          </div>
        </div>
      </div>,
      { autoClose: 5000, closeOnClick: false, pauseOnHover: true }
    );

    // Auto-delete if not undone
    setTimeout(async () => {
      if (!undo) {
        try {
          await axios.delete(`http://localhost:5204/api/Documents/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          console.log("Document permanently deleted:", id);
        } catch (err) {
          console.error("Failed to delete document:", err);
          setDocuments((prevDocs) => [deletedDoc, ...prevDocs]); // Restore on failure
        }
      }
    }, 5000);
  };

  // Filtering logic (search, status, and date)
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || doc.status.toString() === filterStatus;

    const docDate = new Date(doc.createdAt).toISOString().split("T")[0]; // Format to YYYY-MM-DD

    const matchesDate =
      (!startDate || docDate >= startDate) && (!endDate || docDate <= endDate);

    return matchesSearch && matchesFilter && matchesDate;
  });

  return (
    <div className="w-full h-full max-h-full mx-auto py-8 px-4">
      <div className="w-full flex justify-between items-center mb-4">
        <ToastContainer
          position="top-center"
          toastStyle={{ textAlign: "center" }}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="font-bold text-white flex items-center">
          <FileText size={16} className="mr-2 text-blue-400" />
          My Documents
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter by Status */}
          <select
            className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="1">Closed</option>
            <option value="0">Opened</option>
          </select>

          {/* Start Date Filter */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="date"
              className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date Filter */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="date"
              className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="bg-slate-700 hover:bg-slate-600 text-white rounded-md flex items-center px-3 py-2"
          >
            <RefreshCw
              className={`${refreshing ? "animate-spin" : ""}`}
              size={20}
            />
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-6">
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

            {/* Document Cards */}

            <AnimatePresence>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
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
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No matching documents found</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
