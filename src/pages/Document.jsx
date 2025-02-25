import React, { useState, useEffect } from "react";
import { getDocuments } from "../service/authService";
import DocumentCard from "../components/dashboard/documents/DocumentCard";
import AddDocs from "../components/dashboard/documents/AddDocs";
import DocumentList from "../components/dashboard/documents/DocumentList";

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
    <div className="w-full h-full flex justify-center items-center text-white">
      <div className="bg-black/60 w-full h-full backdrop-blur-md p-6 shadow-lg">
        {/* <h2 className="text-center text-2xl font-bold">Documents</h2> */}
        <div className="">
          <DocumentList />
          {/* <AddDocs onDocumentAdded={handleDocumentAdded} />
          {documents.length > 0 ? (
            documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                title={doc.title}
                date={doc.createdAt}
                description={doc.content}
              />
            ))
          ) : (
            <p>No documents available.</p>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Documents;
