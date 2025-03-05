import axios from "axios";

const API_BASE_URL = "http://192.168.1.85:5204/api";

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
export const addDocument = async (title, content, date, type) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("User is not authenticated.");
    return null;
  }

  try {
    // Ensure primitive values are passed
    const safeTitle = title.toString();
    const safeContent = content.toString();
    const safeDate = date.toString();
    const safeType = Number(type); // Convert to number if it's an ID

    console.log("Adding document...", {
      safeTitle,
      safeContent,
      safeDate,
      safeType,
    });

    const response = await axios.post(
      `${API_BASE_URL}/Documents`,
      {
        title: safeTitle,
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
// export const addDocument = async (title, content, date, type) => {
//   const userData = await getUserAccount();
//   let resul = 0;
//   const accessToken = localStorage.getItem("accessToken");
//   // const userId = localStorage.getItem("userId"); // Ensure userId is stored after login

//   if (!accessToken) {
//     console.error("User is not authenticated.");
//     return null;
//   }

//   try {
//     console.log("Adding document...", title, content, date, type);
//     const response = await axios.post(
//       `${API_BASE_URL}/Documents`, // ✅ Use /api/Documents
//       {
//         title,
//         content,
//         docDate: date,
//         typeId: type,
//       },
//       {
//         "Content-Type": "application/json",
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     );
//     console.log("response", response);

//     if (response.status === 201) {
//       console.log("Document added successfully:", response.data);
//       return response.data; // Return the newly created document
//     }
//   } catch (error) {
//     console.error("Failed to add document:", error);
//     return null;
//   }
// };
