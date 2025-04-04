// src/service/authService.jsx

import axios from "axios";

const API_BASE_URL = "http://192.168.1.94:5204/api";

/**
 * Get the current user's role
 * @returns {Promise<string|null>} User role or null if not logged in
 */
export const getUserRole = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return null; // Don't throw an error, just return null
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/Account/user-role`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user role:", error);
    return null; // Return null if request fails
  }
};

/**
 * Get the current user's account information
 * @returns {Promise<Object|null>} User data or null if not logged in
 */
export const getUserAccount = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return null; // Don't throw an error, just return null
  }

  try {
    console.log("Fetching user account data with token:", accessToken);

    const response = await axios.get(`${API_BASE_URL}/Account/user-info`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("User data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null; // Return null if request fails
  }
};

/**
 * Update user information
 * @param {Object} formData - User data to update
 * @returns {Promise<Object|null>} Updated user data or null if failed
 */
export const UpdateUser = async (formData) => {
  const accessToken = localStorage.getItem("accessToken");
  console.log("Update user called with data:", formData);
  console.log("User ID:", formData.userId);

  try {
    const response = await axios.put(
      `${API_BASE_URL}/Admin/users/${formData.userId}`,
      formData,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.status === 200 || response.status === 201) {
      console.log("User updated successfully:", response.data);
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to update user:", error);
    return null;
  }
};

/**
 * Delete a user
 * @param {string|number} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const DeletUser = async (userId) => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axios.delete(
      `${API_BASE_URL}/Admin/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.status === 200 || response.status === 204) {
      console.log("User deleted successfully");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to delete user:", error);
    return false;
  }
};

/**
 * Check if username is available
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} Whether username is available
 */
export const FindUserName = async (username) => {
  try {
    console.log("Checking username:", username);

    const resp = await axios.post(`${API_BASE_URL}/Auth/valide-username/`, {
      username: username,
    });

    if (resp.data === "True") {
      console.log("Username is available");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking username:", error.response?.data);
    return false;
  }
};

/**
 * Check if email is available
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} Whether email is available
 */
export const FindUserMail = async (email) => {
  try {
    console.log("Checking email:", email);
    const resp = await axios.post(`${API_BASE_URL}/Auth/valide-email/`, {
      email,
    });
    if (resp.data === "True") {
      console.log("Email is available");
      return true;
    }

    return false;
  } catch (error) {
    console.log("Error checking email:", error.response?.data || error);
    return false;
  }
};

/**
 * Logout the current user
 * @param {string|number} id - User ID
 * @returns {Promise<boolean>} Success status
 */
export const authLogout = async (id) => {
  const refreshToken = localStorage.getItem("refresh_token");
  const accessToken = localStorage.getItem("accessToken");
  console.log("Refresh token at logout:", refreshToken);

  if (!refreshToken) {
    console.warn("No refresh token found. User is not logged in.");
    return false;
  }

  console.log("Logging out user ID:", id);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/Auth/logout`,
      { userId: id },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      console.log("User logged out successfully:", response.data);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to log out user:", error.response?.data || error);
    return false;
  }
};

/**
 * Get user activity logs
 * @param {string|number} userId - User ID
 * @returns {Promise<Array|null>} User logs or null if failed
 */
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

/**
 * Update user status (active/inactive)
 * @param {string|number} userId - User ID
 * @param {boolean} isActive - Active status
 * @returns {Promise<Object|null>} Updated user or null if failed
 */
export const updateStatus = async (userId, isActive) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.warn("No access token found. User is not logged in.");
    return null;
  }

  try {
    const response = await axios.put(
      `${API_BASE_URL}/Admin/users/${userId}`,
      { isActive }, // Send the new status in request body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    if (error.response) {
      // Handle specific HTTP error codes
      console.error("Server responded with:", error.response.status);
    }
    throw error; // Re-throw to allow error handling in components
  }
};
