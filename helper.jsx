// Example implementation in src/components/dashboard/documents/DocumentList.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash, Eye, FileText, RefreshCw, PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

// Import the DataTable component
import DataTable from "../../common/DataTable";
import { getDocuments } from "../../../service/docSrvice";
import { getUserAccount } from "../../../service/authService";
import AddDocs from "./AddDocs";
import LoadingDocs from "./loadingDocs";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedDocs, setSelectedDocs] = useState([]);
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
    fetchDocuments();
  }, [navigate]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const fetchedDocs = await getDocuments();
      setDocuments(fetchedDocs);
    } catch (err) {
      toast.error("Failed to load documents. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDocuments();
    setTimeout(() => setRefreshing(false), 600);
    toast.success("Documents refreshed successfully!");
  };

  const handleDocumentAdded = (newDoc) => {
    setDocuments((prevDocs) => [newDoc, ...prevDocs]);
  };

  const handleDelete = async (id) => {
    // Store the document to be deleted for potential undo
    const deletedDoc = documents.find((doc) => doc.id === id);
    // Optimistically remove from UI
    setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));

    // Show confirmation toast
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
                const accessToken = localStorage.getItem("accessToken");
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
                // Restore the document if deletion fails
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
              // Restore the document if user cancels
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

  const handleBulkDelete = async () => {
    // Implementation of bulk delete logic
    // ...
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="font-bold text-white flex items-center">
          <FileText size={16} className="mr-2 text-blue-400" />
          My Documents
        </div>
      </div>

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
