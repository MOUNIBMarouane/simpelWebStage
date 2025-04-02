// src/services/userService.js

import apiClient from './api';

/**
 * User Service - Handles all user management API operations
 */
const userService = {
  /**
   * Get all users (admin only)
   * @returns {Promise<Array>} List of users
   */
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/Admin/users');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },
  
  /**
   * Get user by ID
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} User details
   */
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/Admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data
   * @param {string} adminSecret - Admin secret key
   * @returns {Promise<Object>} Created user
   */
  createUser: async (userData, adminSecret = '') => {
    try {
      const response = await apiClient.post('/Admin/users', userData, {
        headers: {
          ...(adminSecret && { AdminSecret: adminSecret }),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },
  
  /**
   * Update a user
   * @param {string|number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/Admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update user ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a user
   * @param {string|number} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  deleteUser: async (userId) => {
    try {
      await apiClient.delete(`/Admin/users/${userId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
      throw error;
    }
  },
  
  /**
   * Update user role
   * @param {string|number} userId - User ID
   * @param {string|number} roleId - New role ID
   * @returns {Promise<Object>} Updated user
   */
  updateUserRole: async (userId, roleId) => {
    try {
      const response = await apiClient.put(`/Admin/users/${userId}`, { roleId });
      return response.data;
    } catch (error) {
      console.error(`Failed to update user role:`, error);
      throw error;
    }
  },
  
  /**
   * Update user status (active/inactive)
   * @param {string|number} userId - User ID
   * @param {boolean} isActive - Active status
   * @returns {Promise<Object>} Updated user
   */
  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await apiClient.put(`/Admin/users/${userId}`, { isActive });
      return response.data;
    } catch (error) {
      console.error(`Failed to update user status:`, error);
      throw error;
    }
  },
  
  /**
   * Upload user profile image
   * @param {File} imageFile - Image file to upload
   * @returns {Promise<Object>} Upload response
   */
  uploadProfileImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await apiClient.post('/Account/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      throw error;
    }
  },
  
  /**
   * Get user activity logs
   * @param {string|number} userId - User ID
   * @returns {Promise<Array>} User logs
   */
  getUserLogs: async (userId) => {
    try {
      const response = await apiClient.get(`/Admin/logs/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user logs:', error);
      throw error;
    }
  },
  
  /**
   * Map role ID to role name
   * @param {number} roleId - Role ID
   * @returns {string} Role name
   */
  getRoleName: (roleId) => {
    const roleMap = {
      1: 'Admin',
      2: 'SimpleUser',
      3: 'FullUser',
    };
    return roleMap[roleId] || 'Unknown Role';
  },
  
  /**
   * Map role name to role ID
   * @param {string} roleName - Role name
   * @returns {number} Role ID
   */
  getRoleId: (roleName) => {
    const roleMap = {
      'Admin': 1,
      'SimpleUser': 2,
      'FullUser': 3,
    };
    return roleMap[roleName] || null;
  }
};

export default userService;