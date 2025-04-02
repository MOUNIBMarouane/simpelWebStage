import axios from "axios";

const API_BASE_URL = "http://192.168.1.94:5204/api";

// Get Document by ID
export const getDocument = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return null;
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/Documents/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.status === 200) {
      return response.data; // Returns the document
    }
  } catch (error) {
    console.error("Failed to fetch document:", error);
    return null;
  }
};

// Get Line by ID
export const getDocumentLine = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return null;
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/Lignes/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.status === 200) {
      return response.data; // Returns the line
    }
  } catch (error) {
    console.error("Failed to fetch line:", error);
    return null;
  }
};

// Get Subline by ID
export const getSubLine = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return null;
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/SousLignes/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.status === 200) {
      return response.data; // Returns the subline
    }
  } catch (error) {
    console.error("Failed to fetch subline:", error);
    return null;
  }
};

// Existing functions for fetching lines and sublines by document/line ID
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
      console.log("response.data----doclines", response.data);
      return response.data; // Returns an array of Lines
    }
  } catch (error) {
    console.error("Failed to fetch Lines:", error);
    return [];
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

// Existing functions for adding, updating, and deleting lines and sublines
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

export const updateDocumentLine = async (id, title, article, prix) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("User is not authenticated.");
    return null;
  }
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Lignes/${id}`,
      {
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
    if (response.status === 200) {
      console.log("response.data", response.data);
      return response.data; // Returns the updated Line
    }
  } catch (error) {
    console.error("Failed to update Line:", error);
    return null;
  }
};

export const deleteDocumentLine = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("User is not authenticated.");
    return null;
  }
  try {
    const response = await axios.delete(`${API_BASE_URL}/SousLignes/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 204) {
      console.log("Line deleted successfully:", id);
      return true;
    }
  } catch (error) {
    console.error("Failed to delete Line:", error);
    return false;
  }
};
export const updateDocumentSubLine = async (id, updatedSubLine) => {};
export const deleteDocumentSubLine = async (id) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("User is not authenticated.");
    return null;
  }
  try {
    const response = await axios.delete(`${API_BASE_URL}/Lignes/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 204) {
      console.log("Line deleted successfully:", id);
      return true;
    }
  } catch (error) {
    console.error("Failed to delete Line:", error);
    return false;
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
