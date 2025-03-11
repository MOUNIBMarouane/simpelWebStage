import axios from "axios";

const API_BASE_URL = "http://localhost:5204/api";

export const getDocumentLines = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return [];
  }
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Lignes/by-document/${id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (response.status === 200) {
      console.log("response.data", response.data);
      return response.data; // Returns an array of Lines
    }
  } catch (error) {
    console.error("Failed to fetch Lines:", error);
    return [];
  }
};

export const addDocumentLine = async (id, title, article, prix) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("User is not authenticated.");
    return null;
  }
  try {
    const response = await axios.post(
      `${API_BASE_URL}/Lignes`,
      {
        documentId: id,
        title,
        article,
        prix,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 201) {
      console.log("response.data", response.data);
      return response.data; // Returns the new Line
    }
  } catch (error) {
    console.error("Failed to add Line:", error);
    return null;
  }
};

export const getDocumetSublines = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return [];
  }
  try {
    const response = await axios.get(
      `${API_BASE_URL}/SousLignes/by_ligne/${id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (response.status === 200) {
      return response.data; // Returns an array of SubLines
    }
  } catch (error) {
    console.error("Failed to fetch SubLines:", error);
    return [];
  }
};

export const addDocumentSubLine = async (ligneId, title, attribute) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("User is not authenticated.");
    return null;
  }
  try {
    const response = await axios.post(
      `${API_BASE_URL}/SousLignes`,
      {
        ligneId,
        title,
        attribute,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Failed to add SubLine:", error);
    return null;
  }
};
