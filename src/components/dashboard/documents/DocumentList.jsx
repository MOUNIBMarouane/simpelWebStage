import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  RefreshCw,
  Search,
  Calendar,
  Undo,
  Eye,
  Trash,
  Check,
  File,
} from "lucide-react";
import DocumentCard from "./DocumentCard";
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
import { div } from "framer-motion/client";

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
  const [statuscontole, setStatusControl] = useState("Opened");
  const [activedel, setActiveDel] = useState(false);
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
                <Search
                  className="absolute left-3  top-3 transform  text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search documents "
                  className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
        <div className="w-full h-10/12 p-1 overflow-y-scroll overflow-x-clip scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
            {/* Document Liste */}
            <div className="overflow-hidden rounded-lg shadow-lg">
              <motion.table
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full border-collapse bg-gray-900 text-white rounded-lg"
              >
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="p-4 text-left uppercase text-sm tracking-wide">
                      <input
                        type="checkbox"
                        ref={headerCheckboxRef}
                        onChange={() => {
                          if (
                            selectedDocs.length === filteredDocuments.length
                          ) {
                            setSelectedDocs([]);
                          } else {
                            const allIds = filteredDocuments.map(
                              (doc) => doc.id
                            );
                            setSelectedDocs(allIds);
                          }
                        }}
                        className="w-6 h-6 rounded-lg"
                      />
                    </th>
                    <th className="p-4 text-left uppercase text-sm tracking-wide">
                      Title
                    </th>
                    <th className="p-4 text-left uppercase text-sm tracking-wide">
                      Date
                    </th>
                    <th className="p-4 text-left uppercase text-sm tracking-wide">
                      Type
                    </th>
                    <th className="p-4 uppercase text-sm tracking-wide text-center">
                      <div>Status</div>
                    </th>
                    <th className="p-4 text-right uppercase text-sm tracking-wide flex items-center justify-evenly">
                      <div onClick={handleRefresh}>
                        <RefreshCw
                          onClick={handleRefresh}
                          disabled={loading || refreshing}
                          className={`cursor-pointer rounded-4xl ${
                            refreshing ? "animate-spin" : ""
                          }`}
                          size={28}
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <motion.tr
                        key={doc.documentKey}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
                      >
                        <td className="p-4 flex gap-1.5">
                          <input
                            type="checkbox"
                            className="w-6 h-6 rounded-lg"
                            checked={selectedDocs.includes(doc.id)}
                            onChange={() => handleSelectDoc(doc.id)}
                          />
                          <p>{doc.documentKey}</p>
                        </td>
                        <td
                          className="p-4"
                          // onClick={() => handleUserClick(user, "update")}
                        >
                          {doc.title}
                        </td>
                        <td className="p-4">
                          {" "}
                          {new Date(doc.docDate).toLocaleDateString("sv-SE")}
                        </td>
                        <td className="p-4">{doc.documentType.typeName}</td>
                        <td className="p-4 items-center ">
                          <FormGroup className="items-center">
                            <FormControlLabel
                              control={<Switch />}
                              label="Activate"
                            />
                          </FormGroup>
                        </td>
                        <td className="p-4 flex items-center justify-center space-x-3">
                          {/* Toggle div */}

                          {/* View div */}
                          <Link to={`/DocumentDetail/${doc.id}`}>
                            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition duration-200 cursor-pointer">
                              <Eye size={18} />
                            </div>
                          </Link>

                          {/* Delete div */}
                          <div
                            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-700 text-white hover:bg-red-600 transition duration-200 cursor-pointer"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash size={18} />
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-400">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </motion.table>
            </div>
          </div>
        </div>
      )}
      {selectedDocs.length > 0 && (
        <div className="w-full h-1/12 bg-gradient-to-r from-white via-white to-red-500 border flex justify-end items-center p-6 absolute bottom-0 left-0 rounded-lg backdrop-blur-sm">
          <div className="flex gap-4">
            <div
              className="bg-red-600 flex gap-2 text-white px-4 py-2 hover:bg-red-600/65 transition-all rounded-lg cursor-pointer shadow-lg hover:shadow-red-500/30"
              onClick={handleBulkDelete}
            >
              <Trash />
              <p>Delete d ({selectedDocs.length})</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
