import axios from "axios";
import { title } from "framer-motion/client";

const API_BASE_URL = "http://localhost:5204/api";

export const getDocuments = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return [];
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/Documents`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 200) {
      return response.data; // Returns an array of documents
    }
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return [];
  }
};
export const addDocument = async (title,prefix, content, date, type) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("User is not authenticated.");
    return null;
  }

  try {
    // Ensure primitive values are passed
    const safeTitle = title.toString();
    const safePrefix = prefix.toString();
    const safeContent = content.toString();
    const safeDate = date.toString();
    const safeType = Number(type); // Convert to number if it's an ID

    console.log("Adding document...", {
      safeTitle,
      safePrefix,
      safeContent,
      safeDate,
      safeType,
    });

    const response = await axios.post(
      `${API_BASE_URL}/Documents`,
      {
        title: safeTitle,
        documentAlias:safePrefix,
        content: safeContent,
        docDate: safeDate,
        typeId: safeType,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response);

    if (response.status === 201) {
      console.log("Document added successfully:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Failed to add document:", error);
    console.error("Error details:", error.response?.data);
    console.error("Error config:", error.config);
    throw error;
  }
};

export const getDocument = async (idDoc) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return [];
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/Documents/${idDoc}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 200) {
      return response.data; // Returns an array of documents
    }
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return [];
  }
};

// Function to update document status
export const updateDocumentStatus = async (idDoc, newStatus, document) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;

  try {
    const response = await axios.put(
      `${API_BASE_URL}/Documents/${idDoc}`,
      {
        title: document.title,
        content: document.content,
        docDate: document.docDate,
        typeId: document.typeId,
        status: newStatus,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return response.status === 200 ? response.data : null;
  } catch (error) {
    console.error("Error updating document status:", error);
    return null;
  }
};
export const updateDocument = async (idDoc, updatedData) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;

  try {
    const response = await axios.put(
      `${API_BASE_URL}/Documents/${idDoc}`,
      updatedData,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.status === 200 ? response.data : null;
  } catch (error) {
    console.error("Error updating document:", error);
    return null;
  }
};


