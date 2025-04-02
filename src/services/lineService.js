// src/services/lineService.js

import apiClient from './api';

/**
 * Line Service - Handles all document lines related API operations
 */
const lineService = {
  /**
   * Get document lines by document ID
   * @param {string|number} documentId - Document ID
   * @returns {Promise<Array>} List of document lines
   */
  getDocumentLines: async (documentId) => {
    try {
      const response = await apiClient.get(`/Lignes/by-document/${documentId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch lines for document ${documentId}:`, error);
      return [];
    }
  },
  
  /**
   * Get line by ID
   * @param {string|number} lineId - Line ID
   * @returns {Promise<Object>} Line details
   */
  getLineById: async (lineId) => {
    try {
      const response = await apiClient.get(`/Lignes/${lineId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch line ${lineId}:`, error);
      return null;
    }
  },
  
  /**
   * Add a new line to a document
   * @param {string|number} documentId - Document ID
   * @param {string} title - Line title
   * @param {string} article - Line article
   * @param {string|number} prix - Line price
   * @returns {Promise<Object>} Created line
   */
  addDocumentLine: async (documentId, title, article, prix) => {
    try {
      const response = await apiClient.post('/Lignes', {
        documentId,
        title,
        article,
        prix,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add line:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing line
   * @param {string|number} lineId - Line ID
   * @param {string} title - Updated title
   * @param {string} article - Updated article
   * @param {string|number} prix - Updated price
   * @returns {Promise<Object>} Updated line
   */
  updateLine: async (lineId, title, article, prix) => {
    try {
      const response = await apiClient.put(`/Lignes/${lineId}`, {
        title,
        article,
        prix,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to update line ${lineId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a line
   * @param {string|number} lineId - Line ID
   * @returns {Promise<boolean>} Success status
   */
  deleteLine: async (lineId) => {
    try {
      await apiClient.delete(`/Lignes/${lineId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete line ${lineId}:`, error);
      return false;
    }
  },
  
  /**
   * Get sublines for a line
   * @param {string|number} lineId - Line ID
   * @returns {Promise<Array>} List of sublines
   */
  getSublines: async (lineId) => {
    try {
      const response = await apiClient.get(`/SousLignes/by_ligne/${lineId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch sublines for line ${lineId}:`, error);
      return [];
    }
  },
  
  /**
   * Get subline by ID
   * @param {string|number} sublineId - Subline ID
   * @returns {Promise<Object>} Subline details
   */
  getSublineById: async (sublineId) => {
    try {
      const response = await apiClient.get(`/SousLignes/${sublineId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch subline ${sublineId}:`, error);
      return null;
    }
  },
  
  /**
   * Add a new subline to a line
   * @param {string|number} lineId - Line ID
   * @param {string} title - Subline title
   * @param {string} attribute - Subline attribute
   * @returns {Promise<Object>} Created subline
   */
  addSubline: async (lineId, title, attribute) => {
    try {
      const response = await apiClient.post('/SousLignes', {
        ligneId: lineId,
        title,
        attribute,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add subline:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing subline
   * @param {string|number} sublineId - Subline ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated subline
   */
  updateSubline: async (sublineId, updateData) => {
    try {
      const response = await apiClient.put(`/SousLignes/${sublineId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update subline ${sublineId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a subline
   * @param {string|number} sublineId - Subline ID
   * @returns {Promise<boolean>} Success status
   */
  deleteSubline: async (sublineId) => {
    try {
      await apiClient.delete(`/SousLignes/${sublineId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete subline ${sublineId}:`, error);
      return false;
    }
  }
};

export default lineService;