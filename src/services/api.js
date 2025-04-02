// src/services/api.js

import axios from 'axios';

/**
 * Base API URL from environment variables or use default
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.94:5204/api';

/**
 * Create an Axios instance with default configurations
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - adds auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - handle token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is not an unauthorized error or the request has already been retried
    if (error.response?.status !== 403 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    originalRequest._retry = true;
    
    try {
      // Attempt to refresh the token
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });
      
      if (response.status === 200) {
        // Update the tokens in storage
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request
        return apiClient(originalRequest);
      }
    } catch (refreshError) {
      // If refresh fails, log out the user
      console.error('Token refresh failed:', refreshError);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refresh_token');
      
      // Redirect to login page
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;