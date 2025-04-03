import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  RefreshCw,
  Search,
  Calendar,
  Eye,
  Trash,
  PlusCircle,
} from "lucide-react";
import AddDocs from "./AddDocs";
import { getDocuments } from "../../../service/docSrvice";
import axios from "axios";
import LoadingDocs from "./loadingDocs";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getUserAccount } from "../../../service/authService";
import "react-toastify/dist/ReactToastify.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

// Import the DataTable component
import DataTable from "../../common/DataTable";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const [selectedDocs, setSelectedDocs] = useState([]);
  const headerCheckboxRef = useRef(null);
  // Update the filteredDocuments calculation
  const filteredDocuments = documents.filter((doc) => {
    const searchLower = searchQuery.toLowerCase();
    // Convert all searchable fields to strings
    const documentKey = doc.documentKey?.toString().toLowerCase() || "";
    const docId = doc.id?.toString().toLowerCase() || "";
    const docType = doc.documentType?.typeName.toLowerCase() || "";
    const docStatus = doc.status?.toString().toLowerCase() || "";

    return (
      doc.title.toLowerCase().includes(searchLower) ||
      doc.content.toLowerCase().includes(searchLower) ||
      documentKey.includes(searchLower) ||
      docId.includes(searchLower) ||
      docType.includes(searchLower) ||
      docStatus.includes(searchLower)
    );
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const fetchedDocs = await getDocuments();
      console.log("Fetched documents:", fetchedDocs);
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

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      const allSelected =
        selectedDocs.length === filteredDocuments.length &&
        filteredDocuments.length > 0;
      const someSelected =
        selectedDocs.length > 0 &&
        selectedDocs.length < filteredDocuments.length;
      headerCheckboxRef.current.checked = allSelected;
      headerCheckboxRef.current.indeterminate = someSelected;
    }
  }, [selectedDocs, filteredDocuments]);

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

    toast.info(
      <div className="p-4">
        <p className="font-semibold flex items-center gap-2">
          <Trash size={18} />
          Delete document "{deletedDoc.title}"?
        </p>
        <div className="flex gap-4 mt-4 text-white">
          <div
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 cursor-pointer"
            onClick={async () => {
              try {
                await axios.delete(
                  `http://192.168.1.94:5204/api/Documents/${id}`,
                  {
                    headers: { Authorization: `Bearer ${accessToken}` },
                  }
                );
                toast.dismiss();
                toast.success("Document deleted successfully");
              } catch (err) {
                console.error("Delete failed:", err);
                setDocuments((prevDocs) => [...prevDocs, deletedDoc]);
                toast.error("Failed to delete document");
              }
            }}
          >
            Confirm
          </div>
          <div
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() => {
              setDocuments((prevDocs) => [...prevDocs, deletedDoc]);
              toast.dismiss();
            }}
          >
            Cancel
          </div>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        toastId: `delete-doc-${id}`,
      }
    );
  };

  const handleSelectDoc = (id) => {
    setSelectedDocs(
      (prevSelectedDocs) =>
        prevSelectedDocs.includes(id)
          ? prevSelectedDocs.filter((docId) => docId !== id) // Deselect
          : [...prevSelectedDocs, id] // Select
    );
  };

  const handleBulkDelete = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.warn("No access token found. User is not logged in.");
      navigate("/");
      return;
    }

    toast.info(
      <div className="p-4">
        <p className="font-semibold">
          Delete {selectedDocs.length} document
          {selectedDocs.length > 1 ? "s" : ""}?
        </p>
        <div className="flex gap-4 mt-4 text-white">
          <div
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 cursor-pointer"
            onClick={async () => {
              try {
                await Promise.all(
                  selectedDocs.map((id) =>
                    axios.delete(
                      `http://192.168.1.94:5204/api/Documents/${id}`,
                      {
                        headers: { Authorization: `Bearer ${accessToken}` },
                      }
                    )
                  )
                );
                setDocuments((prevDocs) =>
                  prevDocs.filter((doc) => !selectedDocs.includes(doc.id))
                );
                setSelectedDocs([]);
                toast.dismiss();
                toast.success(
                  `${selectedDocs.length} document${
                    selectedDocs.length > 1 ? "s" : ""
                  } deleted`
                );
              } catch (err) {
                console.error("Bulk delete failed:", err);
                toast.error("Failed to delete documents");
              }
            }}
          >
            Confirm
          </div>
          <div
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() => {
              toast.dismiss();
            }}
          >
            Cancel
          </div>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        toastId: "bulk-delete-docs",
      }
    );
  };
  // Define table columns
  const columns = [
    {
      id: "selection",
      header: "",
      accessor: "id",
      cellClassName: "w-12",
    },
    {
      id: "documentKey",
      header: "ID",
      accessor: "documentKey",
      cell: (row) => (
        <div className="font-mono text-xs text-blue-300">{row.documentKey}</div>
      ),
      cellClassName: "w-1/6",
    },
    {
      id: "title",
      header: "Title",
      accessor: "title",
      cell: (row) => (
        <div className="truncate max-w-xs" title={row.title}>
          {row.title}
        </div>
      ),
      cellClassName: "w-1/3",
    },
    {
      id: "date",
      header: "Date",
      accessor: "docDate",
      cell: (row) => (
        <div>{new Date(row.docDate).toLocaleDateString("en-US")}</div>
      ),
      cellClassName: "w-1/6",
    },
    {
      id: "type",
      header: "Type",
      accessor: "documentType.typeName",
      cell: (row) => <div>{row.documentType?.typeName}</div>,
      cellClassName: "w-1/6",
    },
    {
      id: "actions",
      header: "Actions",
      accessor: "id",
      cell: (row) => (
        <div className="flex items-center justify-center space-x-3">
          <Link to={`/DocumentDetail/${row.id}`}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer">
              <Eye size={18} />
            </div>
          </Link>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-700 text-white hover:bg-red-600 transition duration-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            <Trash size={18} />
          </div>
        </div>
      ),
      cellClassName: "w-1/6 text-right",
    },
  ];
  // Custom actions for the table header
  const tableActions = <AddDocs onDocumentAdded={handleDocumentAdded} />;

  // Custom empty state content
  const emptyStateContent = (
    <div className="flex flex-col items-center py-12">
      <div className="w-20 h-20 rounded-full bg-gray-700/30 flex items-center justify-center mb-4">
        <FileText size={32} className="text-gray-500" />
      </div>
      <p className="text-gray-400 mb-4">No documents found</p>
      {(user?.role === "Admin" || user?.role === "FullUser") && (
        <div
          onClick={() =>
            document.getElementById("add-document-button")?.click()
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle size={18} />
          Create your first document
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full max-h-full mx-auto py-2 px-4">
      <div className="w-full flex justify-between items-center mb-4 ">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="font-bold text-white flex items-center">
          <FileText size={16} className="mr-2 text-blue-400" />
          My Documents
        </div>
      </div>

      <div className="flex flex-row  w-full sm:w-auto justify-between  h-1/12">
        <div className="flex flex-col sm:flex-row gap-2 items-start w-full h-full justify-between">
          <div className="flex gap-2 justify-between w-full ">
            {/* Search Input */}
            <div className=" flex w-4/12">
              <div className="relative ">
                {/* <Search
                  className="absolute left-3  top-3 transform  text-gray-400"
                  size={20}
                /> */}
                {/* <input
                  type="text"
                  placeholder="Search documents "
                  className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                /> */}
              </div>
            </div>
            <div className=" flex w-full justify-between">
              {/* Add document div/card */}
              <div className="w-4/12">
                <AddDocs onDocumentAdded={handleDocumentAdded} />
              </div>
              <div className="w-8/12 flex justify-around">
                {/* Start Date Filter */}
                <div className="flex items-center gap-2">
                  <p>Start date: </p>
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
                </div>

                {/* End Date Filter */}
                <div className="flex items-center gap-2">
                  <p>End Date: </p>
                  <div className="relative ">
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="date"
                      className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none "
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingDocs />
        </div>
      ) : (
        <div className="w-full h-[calc(100vh-180px)] flex flex-col">
          <DataTable
            columns={columns}
            data={documents}
            onRefresh={handleRefresh}
            isLoading={loading}
            onRowClick={(row) => navigate(`/DocumentDetail/${row.id}`)}
            actions={tableActions}
            emptyStateContent={emptyStateContent}
            onSearch={(query) => console.log("Search query:", query)}
            searchPlaceholder="Search documents..."
          />
        </div>
      )}

      {/* Bulk Delete Action Bar */}
      {selectedDocs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 left-4 bg-gray-800 border border-red-500/30 flex justify-between items-center p-4 rounded-lg shadow-lg backdrop-blur-sm z-40"
        >
          <div className="text-white">
            <span className="font-semibold">{selectedDocs.length}</span>{" "}
            document(s) selected
          </div>
          <div className="flex gap-3">
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              onClick={() => setSelectedDocs([])}
            >
              Cancel
            </button>
            <button
              className="bg-red-600 flex gap-2 text-white px-4 py-2 hover:bg-red-700 transition rounded-lg"
              onClick={handleBulkDelete}
            >
              <Trash size={20} />
              Delete Selected
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentList;
