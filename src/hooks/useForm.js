// src/hooks/useForm.js

import { useState, useCallback, useEffect } from 'react';
import validationUtils from '../utils/validation';

/**
 * Custom hook for form handling with validation
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @param {Function} onSubmit - Form submission callback
 * @returns {Object} Form methods and state
 */
const useForm = (initialValues = {}, validationRules = {}, onSubmit = () => {}) => {
  // Form values state
  const [values, setValues] = useState(initialValues);
  
  // Form errors state
  const [errors, setErrors] = useState({});
  
  // Form touched fields state
  const [touched, setTouched] = useState({});
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form dirty state
  const [isDirty, setIsDirty] = useState(false);
  
  // Update isDirty state when values change
  useEffect(() => {
    const isChanged = Object.keys(initialValues).some(
      key => initialValues[key] !== values[key]
    );
    setIsDirty(isChanged);
  }, [values, initialValues]);
  
  /**
   * Handle field change
   * @param {Event|Object} event - Change event or object with name and value
   */
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target || event;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors, touched]);
  
  /**
   * Handle field blur
   * @param {Event|Object} event - Blur event or object with name
   */
  const handleBlur = useCallback((event) => {
    const { name } = event.target || event;
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field
    if (validationRules[name]) {
      const fieldValidation = validationUtils.validateForm(
        { [name]: values[name] },
        { [name]: validationRules[name] }
      );
      
      if (!fieldValidation.isValid) {
        setErrors(prev => ({ ...prev, ...fieldValidation.errors }));
      } else {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  }, [values, validationRules]);
  
  /**
   * Validate all form fields
   * @returns {boolean} Whether form is valid
   */
  const validateForm = useCallback(() => {
    const validation = validationUtils.validateForm(values, validationRules);
    
    setErrors(validation.errors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    
    setTouched(prev => ({ ...prev, ...allTouched }));
    
    return validation.isValid;
  }, [values, validationRules]);
  
  /**
   * Handle form submission
   * @param {Event} event - Form submission event
   */
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }
    
    const isValid = validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        // You can handle form submission errors here
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validateForm, values, onSubmit]);
  
  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsDirty(false);
  }, [initialValues]);
  
  /**
   * Set field value programmatically
   * @param {string} name - Field name
   * @param {*} value - Field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);
  
  /**
   * Set field error programmatically
   * @param {string} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);
  
  /**
   * Check if field has error
   * @param {string} name - Field name
   * @returns {boolean} Whether field has error
   */
  const hasError = useCallback((name) => {
    return Boolean(touched[name] && errors[name]);
  }, [touched, errors]);
  
  /**
   * Check if form has any errors
   * @returns {boolean} Whether form has any errors
   */
  const hasErrors = useCallback(() => {
    return Object.keys(errors).some(key => Boolean(errors[key]));
  }, [errors]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validateForm,
    hasError,
    hasErrors
  };
};

export default useForm;