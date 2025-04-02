// src/utils/validation.js

/**
 * Utilities for form validation
 */
const validationUtils = {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Whether email is valid
   */
  isValidEmail: (email) => {
    if (!email) return false;
    
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with status and checks
   */
  validatePassword: (password) => {
    if (!password) {
      return {
        isValid: false,
        checks: {
          length: false,
          uppercase: false,
          lowercase: false,
          digit: false,
          specialChar: false
        }
      };
    }
    
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password)
    };
    
    const isValid = Object.values(checks).every(Boolean);
    
    return {
      isValid,
      checks
    };
  },
  
  /**
   * Validate username format
   * @param {string} username - Username to validate
   * @returns {Object} Validation result with status and errors
   */
  validateUsername: (username) => {
    if (!username) {
      return {
        isValid: false,
        errors: ['Username is required']
      };
    }
    
    const errors = [];
    
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }
    
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/.test(username)) {
      errors.push('Username can only contain letters, numbers, hyphens and underscores');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Validate name fields (first name, last name)
   * @param {string} name - Name to validate
   * @returns {Object} Validation result with status and errors
   */
  validateName: (name) => {
    if (!name) {
      return {
        isValid: false,
        errors: ['Name is required']
      };
    }
    
    const errors = [];
    
    if (name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    if (!/^[a-zA-Z]+$/.test(name)) {
      errors.push('Name can only contain letters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Check if a string is empty or just whitespace
   * @param {string} value - String to check
   * @returns {boolean} Whether the string is empty
   */
  isEmpty: (value) => {
    return value === undefined || value === null || value.trim() === '';
  },
  
  /**
   * Validate if a value is a valid number
   * @param {*} value - Value to check
   * @returns {boolean} Whether the value is a valid number
   */
  isNumber: (value) => {
    if (typeof value === 'number') return !isNaN(value);
    if (typeof value !== 'string') return false;
    
    return !isNaN(value) && !isNaN(parseFloat(value));
  },
  
  /**
   * Validate if a value is a positive number
   * @param {*} value - Value to check
   * @returns {boolean} Whether the value is a positive number
   */
  isPositiveNumber: (value) => {
    if (!validationUtils.isNumber(value)) return false;
    return parseFloat(value) > 0;
  },
  
  /**
   * Validate form fields
   * @param {Object} formData - Form data to validate
   * @param {Object} validationRules - Validation rules for each field
   * @returns {Object} Validation result with errors
   */
  validateForm: (formData, validationRules) => {
    const errors = {};
    
    Object.entries(validationRules).forEach(([field, rules]) => {
      const value = formData[field];
      
      // Required validation
      if (rules.required && validationUtils.isEmpty(value)) {
        errors[field] = 'This field is required';
        return;
      }
      
      // Min length validation
      if (rules.minLength && value?.length < rules.minLength) {
        errors[field] = `Minimum length is ${rules.minLength} characters`;
        return;
      }
      
      // Max length validation
      if (rules.maxLength && value?.length > rules.maxLength) {
        errors[field] = `Maximum length is ${rules.maxLength} characters`;
        return;
      }
      
      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message || 'Invalid format';
        return;
      }
      
      // Email validation
      if (rules.email && !validationUtils.isValidEmail(value)) {
        errors[field] = 'Invalid email address';
        return;
      }
      
      // Password validation
      if (rules.password) {
        const { isValid } = validationUtils.validatePassword(value);
        if (!isValid) {
          errors[field] = 'Password does not meet requirements';
          return;
        }
      }
      
      // Match validation
      if (rules.match && formData[rules.match] !== value) {
        errors[field] = rules.matchMessage || 'Fields do not match';
        return;
      }
      
      // Custom validation
      if (rules.validate) {
        const customError = rules.validate(value, formData);
        if (customError) {
          errors[field] = customError;
          return;
        }
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default validationUtils;