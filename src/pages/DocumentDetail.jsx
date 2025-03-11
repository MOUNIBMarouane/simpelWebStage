import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getDocument,
  updateDocumentStatus,
  updateDocument,
} from "../service/docSrvice";

const DocumentDetail = () => {
  const { idDoc } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      const data = await getDocument(idDoc);
      if (data) {
        setDocument(data);
        setFormData({ title: data.title, content: data.content });
      }
      setLoading(false);
    };

    fetchDocument();
  }, [idDoc]);

  // Toggle Status Function
  const handleToggleStatus = async () => {
    if (!document) return;

    const newStatus = document.status === 0 ? 1 : 0;
    const updatedDoc = await updateDocumentStatus(idDoc, newStatus);

    if (updatedDoc) {
      setDocument({ ...document, status: newStatus });
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedDoc = await updateDocument(idDoc, formData);
    if (updatedDoc) {
      setDocument(updatedDoc);
      setEditMode(false);
    }
  };

  if (loading)
    return <p className="text-white text-center">Loading document...</p>;
  if (!document)
    return <p className="text-white text-center">Document not found</p>;

  return (
    <div className="w-full h-screen flex-col p-6 bg-blue-700/50 text-white">
      <div>
        <Link to="/documents" className="mt-4 text-blue-300 hover:underline">
          Go Back to Documents
        </Link>
      </div>
      <div className="w-full flex flex-row">
        {/* Left: Document Details */}
        <div className="w-1/2 flex flex-col items-center p-6">
          <div className="bg-blue-700 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Document Details</h2>
            <p>
              <strong>ID:</strong> DOC-{document.id}
            </p>
            <p>
              <strong>title:</strong> {document.title}
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
            <button
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-md"
              onClick={handleToggleStatus}
            >
              {document.status === 0 ? "Mark as Activate" : "Mark as Opened"}
            </button>

            {/* Edit Mode Toggle */}
            {/* <button
              className="mt-4 ml-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-md"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel" : "Edit Document"}
            </button> */}

          </div>
        </div>

        {/* Right: Document Lines Table (Coming Soon) */}
        <div className="w-1/2 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            Document Lines (Coming Soon)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
