/**
 * Admin Login Page
 */

import AuthService from '../services/auth-service.js';
import Logger from '../utils/logger.js';
import Validation from '../utils/validation.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('Admin Login');

  const loginForm = document.getElementById('admin-login-form');
  const loginBtn = document.getElementById('admin-login-btn');
  const errorMessage = document.getElementById('error-message');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!Validation.isValidEmail(email)) {
      showError('Please enter a valid email address');
      return;
    }

    // Disable button
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    errorMessage.style.display = 'none';

    try {
      Logger.logUserAction('admin_login_attempt', { email });

      const result = await AuthService.login(email, password);

      // Check if user is admin
      const isAdmin = await AuthService.isAdmin(result.user);

      if (!isAdmin) {
        await AuthService.logout();
        showError('Access denied. Admin credentials required.');
        Logger.warn('Non-admin attempted admin login', { email });
        return;
      }

      Logger.logUserAction('admin_login_success', { userId: result.user.uid });

      // Redirect to admin dashboard
      window.location.href = '/admin-dashboard.html';
    } catch (error) {
      Logger.error('Admin login error', { error: error.message });

      let message = 'Login failed. Please check your credentials.';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid admin credentials.';
      }

      showError(message);
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Admin Login';
    }
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }
});
