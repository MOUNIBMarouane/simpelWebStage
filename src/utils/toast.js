// src/utils/toast.js

import { toast } from 'react-toastify';
import React from 'react';
import { Check, AlertTriangle, Info, X, Trash } from 'lucide-react';

/**
 * Toast utility for consistent notifications throughout the application
 */
const toastUtils = {
  /**
   * Show a success toast
   * @param {string} message - Success message
   * @param {Object} options - Additional toast options
   */
  success: (message, options = {}) => {
    toast.success(
      <div className="flex items-center">
        <Check size={18} className="mr-2 text-green-500" />
        <span>{message}</span>
      </div>,
      {
        className: 'bg-green-50 border-l-4 border-green-500 text-green-800',
        progressClassName: 'bg-green-500',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        ...options
      }
    );
  },
  
  /**
   * Show an error toast
   * @param {string} message - Error message
   * @param {Object} options - Additional toast options
   */
  error: (message, options = {}) => {
    toast.error(
      <div className="flex items-center">
        <AlertTriangle size={18} className="mr-2 text-red-500" />
        <span>{message}</span>
      </div>,
      {
        className: 'bg-red-50 border-l-4 border-red-500 text-red-800',
        progressClassName: 'bg-red-500',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        ...options
      }
    );
  },
  
  /**
   * Show an information toast
   * @param {string} message - Info message
   * @param {Object} options - Additional toast options
   */
  info: (message, options = {}) => {
    toast.info(
      <div className="flex items-center">
        <Info size={18} className="mr-2 text-blue-500" />
        <span>{message}</span>
      </div>,
      {
        className: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
        progressClassName: 'bg-blue-500',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        ...options
      }
    );
  },
  
  /**
   * Show a warning toast
   * @param {string} message - Warning message
   * @param {Object} options - Additional toast options
   */
  warning: (message, options = {}) => {
    toast.warning(
      <div className="flex items-center">
        <AlertTriangle size={18} className="mr-2 text-yellow-500" />
        <span>{message}</span>
      </div>,
      {
        className: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800',
        progressClassName: 'bg-yellow-500',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        ...options
      }
    );
  },
  
  /**
   * Show a confirmation toast with action buttons
   * @param {string} message - Confirmation message
   * @param {Function} onConfirm - Confirm action callback
   * @param {Function} onCancel - Cancel action callback
   * @param {Object} options - Additional toast options
   * @returns {string} Toast ID
   */
  confirm: (message, onConfirm, onCancel = () => {}, options = {}) => {
    const toastId = toast.info(
      <div>
        <div className="flex items-center mb-2">
          <AlertTriangle size={18} className="mr-2 text-blue-500" />
          <span>{message}</span>
        </div>
        <div className="flex justify-end space-x-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(toastId);
              onConfirm();
            }}
            className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              toast.dismiss(toastId);
              onCancel();
            }}
            className="px-3 py-1 bg-gray-300 text-gray-800 text-sm font-medium rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        className: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
        closeButton: false,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        ...options
      }
    );
    
    return toastId;
  },
  
  /**
   * Show a delete confirmation toast
   * @param {string} message - Delete confirmation message
   * @param {Function} onConfirm - Confirm delete callback
   * @param {Function} onCancel - Cancel delete callback
   * @param {Object} options - Additional toast options
   * @returns {string} Toast ID
   */
  confirmDelete: (message, onConfirm, onCancel = () => {}, options = {}) => {
    const toastId = toast.error(
      <div>
        <div className="flex items-center mb-2">
          <Trash size={18} className="mr-2 text-red-500" />
          <span>{message}</span>
        </div>
        <div className="flex justify-end space-x-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(toastId);
              onConfirm();
            }}
            className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => {
              toast.dismiss(toastId);
              onCancel();
            }}
            className="px-3 py-1 bg-gray-300 text-gray-800 text-sm font-medium rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        className: 'bg-red-50 border-l-4 border-red-500 text-red-800',
        closeButton: false,
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        ...options
      }
    );
    
    return toastId;
  },
  
  /**
   * Dismiss a specific toast
   * @param {string} toastId - Toast ID to dismiss
   */
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  
  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },
  
  /**
   * Show a toast with undo option
   * @param {string} message - Message text
   * @param {Function} onUndo - Undo action callback
   * @param {Object} options - Additional toast options
   * @returns {string} Toast ID
   */
  undo: (message, onUndo, options = {}) => {
    const toastId = toast.info(
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Info size={18} className="mr-2 text-blue-500" />
          <span>{message}</span>
        </div>
        <button
          onClick={() => {
            toast.dismiss(toastId);
            onUndo();
          }}
          className="ml-4 text-blue-600 font-medium text-sm hover:text-blue-800"
        >
          UNDO
        </button>
      </div>,
      {
        className: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
        progressClassName: 'bg-blue-500',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        ...options
      }
    );
    
    return toastId;
  }
};

export default toastUtils;