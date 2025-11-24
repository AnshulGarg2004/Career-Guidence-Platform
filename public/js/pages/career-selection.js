/**
 * Career Selection Page
 */

import AuthService from '../services/auth-service.js';
import Logger from '../utils/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('Career Selection');

  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const careerCards = document.querySelectorAll('.career-card');

  // Check authentication
  AuthService.onAuthStateChanged(async user => {
    if (!user) {
      Logger.warn('Unauthenticated access attempt');
      window.location.href = '/student-login.html';
      return;
    }

    // Display user name
    userNameElement.textContent = user.displayName || user.email;

    Logger.info('Career selection page loaded', { userId: user.uid });
  });

  // Handle logout
  logoutBtn.addEventListener('click', async () => {
    try {
      await AuthService.logout();
      window.location.href = '/index.html';
    } catch (error) {
      Logger.error('Logout failed', { error: error.message });
      alert('Failed to logout. Please try again.');
    }
  });

  // Handle career selection
  careerCards.forEach(card => {
    const button = card.querySelector('.btn');
    button.addEventListener('click', () => {
      const career = card.dataset.career;
      Logger.logUserAction('career_selected', { career });

      // Save selection to localStorage
      localStorage.setItem('selectedCareer', career);

      // Redirect to location selection
      window.location.href = '/location-selection.html';
    });
  });
});
