/**
 * Validation Utilities
 * Client-side validation functions
 */

const Validation = {
  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  isValidPassword(password) {
    return password && password.length >= 6;
  },

  /**
   * Validate phone number
   */
  isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  },

  /**
   * Validate required field
   */
  isRequired(value) {
    return value && value.toString().trim().length > 0;
  },

  /**
   * Validate number range
   */
  isInRange(value, min, max) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  },

  /**
   * Validate CGPA
   */
  isValidCGPA(cgpa) {
    return this.isInRange(cgpa, 0, 10) || this.isInRange(cgpa, 0, 100);
  },

  /**
   * Sanitize input
   */
  sanitize(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Show validation error
   */
  showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  },

  /**
   * Hide validation error
   */
  hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'none';
    }
  },

  /**
   * Validate form data
   */
  validateForm(formData, rules) {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = formData[field];

      if (rule.required && !this.isRequired(value)) {
        errors[field] = `${field} is required`;
        continue;
      }

      if (rule.email && value && !this.isValidEmail(value)) {
        errors[field] = 'Invalid email format';
      }

      if (rule.password && value && !this.isValidPassword(value)) {
        errors[field] = 'Password must be at least 6 characters';
      }

      if (rule.phone && value && !this.isValidPhone(value)) {
        errors[field] = 'Invalid phone number';
      }

      if (rule.min !== undefined && value && parseFloat(value) < rule.min) {
        errors[field] = `Must be at least ${rule.min}`;
      }

      if (rule.max !== undefined && value && parseFloat(value) > rule.max) {
        errors[field] = `Must be at most ${rule.max}`;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default Validation;
