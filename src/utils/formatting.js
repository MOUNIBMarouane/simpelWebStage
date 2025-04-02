// src/utils/formatting.js

/**
 * Utilities for consistent data formatting across the application
 */
const formattingUtils = {
  /**
   * Format a date in a consistent way
   * @param {string|Date} date - Date to format
   * @param {Object} options - Date formatting options
   * @returns {string} Formatted date string
   */
  formatDate: (date, options = {}) => {
    if (!date) return '-';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('en-US', defaultOptions);
    } catch (error) {
      console.error('Error formatting date:', error);
      return String(date);
    }
  },
  
  /**
   * Format a date and time
   * @param {string|Date} date - Date to format
   * @param {Object} options - Date formatting options
   * @returns {string} Formatted date and time string
   */
  formatDateTime: (date, options = {}) => {
    if (!date) return '-';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('en-US', defaultOptions);
    } catch (error) {
      console.error('Error formatting date time:', error);
      return String(date);
    }
  },
  
  /**
   * Format a number as currency
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (e.g., 'USD')
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted currency string
   */
  formatCurrency: (amount, currency = 'USD', locale = 'en-US') => {
    if (amount === null || amount === undefined) return '-';
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${amount}`;
    }
  },
  
  /**
   * Format a number with thousands separators
   * @param {number} value - Number to format
   * @param {number} fractionDigits - Number of fraction digits
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted number string
   */
  formatNumber: (value, fractionDigits = 0, locale = 'en-US') => {
    if (value === null || value === undefined) return '-';
    
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(value);
    } catch (error) {
      console.error('Error formatting number:', error);
      return `${value}`;
    }
  },
  
  /**
   * Format a percentage
   * @param {number} value - Value to format as percentage
   * @param {number} fractionDigits - Number of fraction digits
   * @param {string} locale - Locale for formatting
   * @returns {string} Formatted percentage string
   */
  formatPercentage: (value, fractionDigits = 1, locale = 'en-US') => {
    if (value === null || value === undefined) return '-';
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(value / 100);
    } catch (error) {
      console.error('Error formatting percentage:', error);
      return `${value}%`;
    }
  },
  
  /**
   * Truncate text to a specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @param {string} suffix - Suffix to add to truncated text
   * @returns {string} Truncated text
   */
  truncateText: (text, maxLength = 100, suffix = '...') => {
    if (!text) return '';
    
    if (text.length <= maxLength) {
      return text;
    }
    
    return `${text.slice(0, maxLength)}${suffix}`;
  },
  
  /**
   * Convert a string to title case
   * @param {string} text - Text to convert
   * @returns {string} Title case text
   */
  toTitleCase: (text) => {
    if (!text) return '';
    
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },
  
  /**
   * Format a file size
   * @param {number} bytes - Size in bytes
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted file size
   */
  formatFileSize: (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },
  
  /**
   * Format a phone number
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber: (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Strip non-numeric characters
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    
    // Format for US phone numbers
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phoneNumber;
  },
  
  /**
   * Format role name to readable format
   * @param {string} roleName - Role name
   * @returns {string} Formatted role name
   */
  formatRoleName: (roleName) => {
    if (!roleName) return '';
    
    // Convert camelCase to space-separated (e.g., "FullUser" to "Full User")
    return roleName.replace(/([A-Z])/g, ' $1').trim();
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
   * Format status as readable string
   * @param {boolean} status - Status value
   * @returns {string} Formatted status
   */
  formatStatus: (status) => {
    return status ? 'Active' : 'Inactive';
  }
};

export default formattingUtils;