import axios from "axios";

const API_BASE_URL = "http://192.168.1.85:5204/api";

export const getUserRole = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return null; // Don't throw an error, just return null
  }

  try {
    const response = await axios.get(
      "http://192.168.1.85:5204/api/Account/user-role",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null; // Return null if request fails
  }
};

export const getUserAccount = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return null; // Don't throw an error, just return null
  }

  try {
    const response = await axios.get(
      "http://192.168.1.85:5204/api/Account/user-info",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("affiche resp user data---", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null; // Return null if request fails
  }
};

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

export const addDocument = async (title, content, status) => {
  const userData = await getUserAccount();
  let resul = 0;
  const accessToken = localStorage.getItem("accessToken");
  // const userId = localStorage.getItem("userId"); // Ensure userId is stored after login

  if (!accessToken) {
    console.error("User is not authenticated.");
    return null;
  }

  try {
    console.log("status -----", status);
    if (status !== "opened") resul = 1;
    const response = await axios.post(
      `${API_BASE_URL}/Documents`, // ✅ Use /api/Documents
      {
        title,
        content,
        status: resul,
        createdByUserId: userData.userid, // ✅ Automatically set user ID
      },
      {
        "Content-Type": "application/json",

        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.status === 201) {
      console.log("Document added successfully:", response.data);
      return response.data; // Return the newly created document
    }
  } catch (error) {
    console.error("Failed to add document:", error);
    return null;
  }
};

export const UpdateUser = async (formData) => {
  const accessToken = localStorage.getItem("accessToken");
  console.log("update user called-------", formData);
  console.log("iduser ------", formData.userId);
  const response = await axios.put(
    `${API_BASE_URL}/Admin/users/${formData.userId}`,
    formData,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (response.status === 201) {
    console.log("Document added successfully:", response.data);
    return response.data; // Return the newly created document
  }
};

export const DeletUser = async (userId) => {
  const accessToken = localStorage.getItem("accessToken");
  const response = await axios.delete(`${API_BASE_URL}/Admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (response.status === 201) {
    console.log("Document deleted successfully:", response.data);
    return response.data; // Return the newly created document
  }
};

export const FindUserName = async (username) => {
  try {
    console.log("Checking username:", username);

    const resp = await axios.post(`${API_BASE_URL}/Auth/valide-username/`, {
      username: username,
    });

    if (resp.data === "True") {
      console.log("Username is available");
      return true;
    } else return false;
  } catch (error) {
    console.error("Error checking username:", error.response?.data || error);
    return false;
  }
};

export const FindUserMail = async (email) => {
  try {
    console.log("check for email:", email);
    const resp = await axios.post(`${API_BASE_URL}/Auth/valide-email/`, {
      email,
    });
    if (resp.data === "True") {
      console.log("Email is available -- service");
      return true;
    } else return false;
  } catch (error) {
    console.log("Error checking email:", error.response?.data || error);
    return false;
  }
};
