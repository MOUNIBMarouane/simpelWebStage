// src/services/circuitService.js

import apiClient from './api';

/**
 * Circuit Service - Handles all circuit-related API operations
 */
const circuitService = {
  /**
   * Get all circuits
   * @returns {Promise<Array>} List of circuits
   */
  getAllCircuits: async () => {
    try {
      const response = await apiClient.get('/circuit');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch circuits:', error);
      throw error;
    }
  },
  
  /**
   * Get circuit by ID
   * @param {string|number} circuitId - Circuit ID
   * @returns {Promise<Object>} Circuit details
   */
  getCircuitById: async (circuitId) => {
    try {
      const response = await apiClient.get(`/circuit/${circuitId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch circuit ${circuitId}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new circuit
   * @param {Object} circuitData - Circuit data
   * @returns {Promise<Object>} Created circuit
   */
  createCircuit: async (circuitData) => {
    try {
      const response = await apiClient.post('/circuit', circuitData);
      return response.data;
    } catch (error) {
      console.error('Failed to create circuit:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing circuit
   * @param {string|number} circuitId - Circuit ID
   * @param {Object} circuitData - Updated circuit data
   * @returns {Promise<Object>} Updated circuit
   */
  updateCircuit: async (circuitId, circuitData) => {
    try {
      const response = await apiClient.put(`/circuit/${circuitId}`, circuitData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update circuit ${circuitId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a circuit
   * @param {string|number} circuitId - Circuit ID
   * @returns {Promise<boolean>} Success status
   */
  deleteCircuit: async (circuitId) => {
    try {
      await apiClient.delete(`/circuit/${circuitId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete circuit ${circuitId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get circuit details by circuit ID
   * @param {string|number} circuitId - Circuit ID
   * @returns {Promise<Array>} Circuit details
   */
  getCircuitDetails: async (circuitId) => {
    try {
      const response = await apiClient.get(`/circuitdetail/bycircuit/${circuitId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch circuit details for circuit ${circuitId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get circuit detail by ID
   * @param {string|number} detailId - Detail ID
   * @returns {Promise<Object>} Detail information
   */
  getCircuitDetailById: async (detailId) => {
    try {
      const response = await apiClient.get(`/circuitdetail/${detailId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch circuit detail ${detailId}:`, error);
      throw error;
    }
  },
  
  /**
   * Add circuit detail
   * @param {Object} detailData - Detail data
   * @returns {Promise<Object>} Created detail
   */
  addCircuitDetail: async (detailData) => {
    try {
      const response = await apiClient.post('/circuitdetail', detailData);
      return response.data;
    } catch (error) {
      console.error('Failed to add circuit detail:', error);
      throw error;
    }
  },
  
  /**
   * Update circuit detail
   * @param {string|number} detailId - Detail ID
   * @param {Object} detailData - Updated detail data
   * @returns {Promise<Object>} Updated detail
   */
  updateCircuitDetail: async (detailId, detailData) => {
    try {
      const response = await apiClient.put(`/circuitdetail/${detailId}`, detailData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update circuit detail ${detailId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete circuit detail
   * @param {string|number} detailId - Detail ID
   * @returns {Promise<boolean>} Success status
   */
  deleteCircuitDetail: async (detailId) => {
    try {
      await apiClient.delete(`/circuitdetail/${detailId}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete circuit detail ${detailId}:`, error);
      throw error;
    }
  }
};

export default circuitService;