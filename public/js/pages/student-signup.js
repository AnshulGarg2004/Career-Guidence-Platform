/**
 * Student Sign Up Page
 */

import AuthService from '../services/auth-service.js';
import Logger from '../utils/logger.js';
import Validation from '../utils/validation.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('Student Signup');

  const signupForm = document.getElementById('signup-form');
  const signupBtn = document.getElementById('signup-btn');
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    const validationRules = {
      fullName: { required: true },
      email: { required: true, email: true },
      password: { required: true, password: true }
    };

    const validation = Validation.validateForm(
      { fullName, email, password },
      validationRules
    );

    if (!validation.isValid) {
      showError(Object.values(validation.errors)[0]);
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (phone && !Validation.isValidPhone(phone)) {
      showError('Please enter a valid 10-digit phone number');
      return;
    }

    // Disable button
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating Account...';
    errorMessage.style.display = 'none';

    try {
      Logger.logUserAction('signup_attempt', { email });

      await AuthService.register(email, password, fullName, phone);

      Logger.logUserAction('signup_success');

      successMessage.textContent = 'Account created successfully! Redirecting...';
      successMessage.style.display = 'block';

      setTimeout(() => {
        window.location.href = '/career-selection.html';
      }, 2000);
    } catch (error) {
      Logger.error('Signup error', { error: error.message });

      let message = 'Registration failed. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use a stronger password.';
      }

      showError(message);
      signupBtn.disabled = false;
      signupBtn.textContent = 'Sign Up';
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
  }
});
