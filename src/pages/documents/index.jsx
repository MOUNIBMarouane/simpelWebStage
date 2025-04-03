import React, { useState, useEffect } from "react";
// import { getDocuments } from "../../service/LInes";
// import DocumentCard from "../components/dashboard/documents/DocumentCard";
// import AddDocs from "../components/dashboard/documents/AddDocs";
import DocumentList from "../../components/dashboard/documents/DocumentList";

const Documents = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const allDocuments = await getDocuments();
    setDocuments(allDocuments);
  };

  const handleDocumentAdded = (newDoc) => {
    setDocuments((prevDocs) => [...prevDocs, newDoc]); // ✅ Add new document to UI
  };

  return (
    <div className="w-full h-full max-h-full flex justify-center items-center text-white">
      <div className="bg-blue-800/50 w-full h-full backdrop-blur-md shadow-lg">
        <DocumentList />
      </div>
    </div>
  );
};

export default Documents;
