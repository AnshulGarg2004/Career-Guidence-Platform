/**
 * Student Login Page
 */

import AuthService from '../services/auth-service.js';
import Logger from '../utils/logger.js';
import Validation from '../utils/validation.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('Student Login');

  const loginForm = document.getElementById('login-form');
  const loginBtn = document.getElementById('login-btn');
  const errorMessage = document.getElementById('error-message');

  // Check if already logged in
  AuthService.onAuthStateChanged(user => {
    if (user) {
      Logger.info('User already logged in, redirecting');
      window.location.href = '/career-selection.html';
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!Validation.isValidEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    if (!Validation.isValidPassword(password)) {
      showError('Password must be at least 6 characters');
      return;
    }

    // Disable button
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    errorMessage.style.display = 'none';

    try {
      Logger.logUserAction('login_attempt', { email });

      const result = await AuthService.login(email, password);

      Logger.logUserAction('login_success', { userId: result.user.uid });

      // Redirect to career selection
      window.location.href = '/career-selection.html';
    } catch (error) {
      Logger.error('Login error', { error: error.message });

      let message = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      }

      showError(message);
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }
});
