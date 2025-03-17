import axios from "axios";

const API_BASE_URL = "http://192.168.1.94:5204/api";

export const getUserRole = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return null; // Don't throw an error, just return null
  }
  try {
    const response = await axios.get(
      "http://192.168.1.94:5204/api/Account/user-role",
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
      "http://192.168.1.94:5204/api/Account/user-info",
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
    console.error("Error checking username:", error.response?.data);
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

export const authLogout = async (id) => {
  const refreshToken = localStorage.getItem("refresh_token");
  const accessToken = localStorage.getItem("accessToken");
  console.log("refresh token--- at logout", refreshToken);

  if (!refreshToken) {
    console.warn("No refresh token found. User is not logged in.");
    return null;
  } else console.log("refresh token---", refreshToken);
  console.log("id---", id);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/Auth/logout`, // Send an empty body
      { userId: id },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      console.log("User logged out successfully:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Failed to log out user:", error.response?.data || error);
    return null;
  }
};

export const getLogs = async (userId) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return null;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/Admin/logs/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    console.log("User logs retrieved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user logs:", error.response?.data || error);
    return null;
  }
};
