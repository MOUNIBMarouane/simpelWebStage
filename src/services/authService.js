// src/services/authService.js

import apiClient from './api';

/**
 * Auth Service - Handles all authentication-related API operations
 */
const authService = {
  /**
   * Login user with email/username and password
   * @param {string} emailOrUsername - Email or username
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response with tokens and user data
   */
  login: async (emailOrUsername, password) => {
    try {
      const response = await apiClient.post('/Auth/login', {
        emailOrUsername,
        password,
      });
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} adminSecret - Optional admin secret key
   * @returns {Promise<Object>} Registration response
   */
  register: async (userData, adminSecret = '') => {
    try {
      const response = await apiClient.post('/Auth/register', userData, {
        headers: {
          ...(adminSecret && { AdminSecret: adminSecret }),
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  /**
   * Verify email with code
   * @param {string} email - User email
   * @param {string} verificationCode - Email verification code
   * @returns {Promise<Object>} Verification response
   */
  verifyEmail: async (email, verificationCode) => {
    try {
      const response = await apiClient.post('/Auth/verify-email', {
        email,
        verificationCode,
      });
      
      return response.data;
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  },
  
  /**
   * Request password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} Password reset response
   */
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/Account/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  /**
   * Reset password with new password
   * @param {string} email - User email
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password update response
   */
  resetPassword: async (email, newPassword) => {
    try {
      const response = await apiClient.put('/Account/update-password', { 
        email, 
        newPassword 
      });
      
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
  
  /**
   * Logout user
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} Logout response
   */
  logout: async (userId) => {
    try {
      const response = await apiClient.post('/Auth/logout', { userId });
      
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refresh_token');
      
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Clear tokens even if logout fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refresh_token');
      
      throw error;
    }
  },
  
  /**
   * Get current user account data
   * @returns {Promise<Object>} User data
   */
  getUserAccount: async () => {
    try {
      const response = await apiClient.get('/Account/user-info');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      return null;
    }
  },
  
  /**
   * Get user role
   * @returns {Promise<Object>} User role
   */
  getUserRole: async () => {
    try {
      const response = await apiClient.get('/Account/user-role');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      return null;
    }
  },
  
  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/Account/update-profile', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },
  
  /**
   * Resend verification code
   * @param {string} email - User email
   * @returns {Promise<Object>} Response
   */
  resendVerificationCode: async (email) => {
    try {
      const response = await apiClient.post('/Account/resend-code', { email });
      return response.data;
    } catch (error) {
      console.error('Failed to resend code:', error);
      throw error;
    }
  },
  
  /**
   * Check if username is available
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if username is available
   */
  isUsernameAvailable: async (username) => {
    try {
      const response = await apiClient.post('/Auth/valide-username/', { username });
      return response.data === "True";
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  },
  
  /**
   * Check if email is available
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if email is available
   */
  isEmailAvailable: async (email) => {
    try {
      const response = await apiClient.post('/Auth/valide-email/', { email });
      return response.data === "True";
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
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
      return null;
    }
  },
  
  /**
   * Update user active status
   * @param {string|number} userId - User ID
   * @param {boolean} isActive - Active status
   * @returns {Promise<Object>} Response
   */
  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await apiClient.put(`/Admin/users/${userId}`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }
};

export default authService;