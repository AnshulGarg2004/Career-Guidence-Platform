/**
 * Location Selection Page
 */

import AuthService from '../services/auth-service.js';
import Logger from '../utils/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('Location Selection');

  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const careerInfo = document.getElementById('career-info');
  const locationCards = document.querySelectorAll('.location-card');
  const backBtn = document.getElementById('back-btn');

  // Check authentication
  AuthService.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = '/student-login.html';
      return;
    }
    userNameElement.textContent = user.displayName || user.email;
  });

  // Display selected career
  const selectedCareer = localStorage.getItem('selectedCareer');
  if (selectedCareer) {
    careerInfo.innerHTML = `
      <strong>Selected Career:</strong> ${selectedCareer.charAt(0).toUpperCase() + selectedCareer.slice(1)}
    `;
  } else {
    window.location.href = '/career-selection.html';
  }

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

  // Handle location selection
  locationCards.forEach(card => {
    const button = card.querySelector('.btn');
    button.addEventListener('click', () => {
      const location = card.dataset.location;
      Logger.logUserAction('location_selected', { location });

      localStorage.setItem('selectedLocation', location);
      window.location.href = '/college-list.html';
    });
  });

  // Back button
  backBtn.addEventListener('click', () => {
    window.location.href = '/career-selection.html';
  });
});
