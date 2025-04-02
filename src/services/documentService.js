// src/services/documentService.js

import apiClient from './api';

/**
 * Document Service - Handles all document-related API operations
 */
const documentService = {
  /**
   * Fetch all documents
   * @returns {Promise<Array>} Array of documents
   */
  getAllDocuments: async () => {
    try {
      const response = await apiClient.get('/Documents');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      throw error;
    }
  },

  /**
   * Fetch a single document by ID
   * @param {string|number} id - Document ID
   * @returns {Promise<Object>} Document data
   */
  getDocumentById: async (id) => {
    try {
      const response = await apiClient.get(`/Documents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch document ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new document
   * @param {Object} documentData - Document data to create
   * @returns {Promise<Object>} Created document
   */
  createDocument: async (documentData) => {
    try {
      const response = await apiClient.post('/Documents', documentData);
      return response.data;
    } catch (error) {
      console.error('Failed to create document:', error);
      throw error;
    }
  },

  /**
   * Update an existing document
   * @param {string|number} id - Document ID
   * @param {Object} documentData - Updated document data
   * @returns {Promise<Object>} Updated document
   */
  updateDocument: async (id, documentData) => {
    try {
      const response = await apiClient.put(`/Documents/${id}`, documentData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update document ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a document
   * @param {string|number} id - Document ID
   * @returns {Promise<boolean>} Success status
   */
  deleteDocument: async (id) => {
    try {
      await apiClient.delete(`/Documents/${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete document ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all document types
   * @returns {Promise<Array>} Array of document types
   */
  getDocumentTypes: async () => {
    try {
      const response = await apiClient.get('/Documents/Types');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch document types:', error);
      throw error;
    }
  },

  /**
   * Check if document type exists
   * @param {string} typeName - Type name to check
   * @returns {Promise<boolean>} Whether type exists
   */
  checkTypeExists: async (typeName) => {
    try {
      const response = await apiClient.post('/Documents/valide-type', { typeName });
      return response.data === "True";
    } catch (error) {
      console.error('Error checking document type:', error);
      throw error;
    }
  },

  /**
   * Create a new document type
   * @param {Object} typeData - Document type data
   * @returns {Promise<Object>} Created document type
   */
  createDocumentType: async (typeData) => {
    try {
      const response = await apiClient.post('/Documents/Types', typeData);
      return response.data;
    } catch (error) {
      console.error('Failed to create document type:', error);
      throw error;
    }
  },

  /**
   * Update a document type
   * @param {string|number} id - Type ID
   * @param {Object} typeData - Type data
   * @returns {Promise<Object>} Updated document type
   */
  updateDocumentType: async (id, typeData) => {
    try {
      const response = await apiClient.put(`/Documents/Types/${id}`, typeData);
      return response.data;
    } catch (error) {
      console.error('Failed to update document type:', error);
      throw error;
    }
  },

  /**
   * Delete a document type
   * @param {string|number} id - Type ID
   * @returns {Promise<boolean>} Success status
   */
  deleteDocumentType: async (id) => {
    try {
      await apiClient.delete(`/Documents/Types/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete document type:', error);
      throw error;
    }
  }
};

export default documentService;