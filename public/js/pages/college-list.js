/**
 * College List Page
 */

import AuthService from '../services/auth-service.js';
import CollegeService from '../services/college-service.js';
import Logger from '../utils/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('College List');

  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const selectionInfo = document.getElementById('selection-info');
  const collegesList = document.getElementById('colleges-list');
  const loadingElement = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');
  const backBtn = document.getElementById('back-btn');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const resetFiltersBtn = document.getElementById('reset-filters');

  let allColleges = [];

  // Check authentication
  AuthService.onAuthStateChanged(async user => {
    if (!user) {
      window.location.href = '/student-login.html';
      return;
    }
    userNameElement.textContent = user.displayName || user.email;

    // Load colleges
    await loadColleges();
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

  // Display selections
  const selectedCareer = localStorage.getItem('selectedCareer');
  const selectedLocation = localStorage.getItem('selectedLocation');

  if (!selectedLocation) {
    window.location.href = '/location-selection.html';
    return;
  }

  selectionInfo.innerHTML = `
    <strong>Career:</strong> ${selectedCareer || 'Not selected'} | 
    <strong>Location:</strong> ${selectedLocation}
  `;

  // Load colleges
  async function loadColleges() {
    try {
      loadingElement.style.display = 'block';
      collegesList.innerHTML = '';

      allColleges = await CollegeService.getColleges({
        location: selectedLocation
      });

      displayColleges(allColleges);
    } catch (error) {
      Logger.error('Failed to load colleges', { error: error.message });
      errorMessage.textContent = 'Failed to load colleges. Please try again.';
      errorMessage.style.display = 'block';
    } finally {
      loadingElement.style.display = 'none';
    }
  }

  // Display colleges
  function displayColleges(colleges) {
    if (colleges.length === 0) {
      collegesList.innerHTML = '<p class="text-center text-muted">No colleges found matching your criteria.</p>';
      return;
    }

    collegesList.innerHTML = colleges.map(college => `
      <div class="college-card">
        <div class="college-header">
          <h3>${college.name}</h3>
          <div class="college-location">📍 ${college.city || college.location}</div>
        </div>
        <div class="college-body">
          <div class="college-info">
            <div class="info-item">
              <span class="info-label">Ranking:</span>
              <span class="info-value">#${college.ranking || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Annual Fees:</span>
              <span class="info-value">₹${college.fees?.toLocaleString() || 'N/A'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Courses:</span>
              <span class="info-value">${college.courses?.slice(0, 2).join(', ') || 'Various'}</span>
            </div>
          </div>
          <button class="btn btn-primary btn-block" onclick="viewCollege('${college.id}')">
            View Details
          </button>
        </div>
      </div>
    `).join('');
  }

  // Filter colleges
  applyFiltersBtn.addEventListener('click', () => {
    const course = document.getElementById('course-filter').value.trim();
    const minFees = document.getElementById('min-fees').value;
    const maxFees = document.getElementById('max-fees').value;
    const ranking = document.getElementById('ranking').value;

    const filters = {};
    if (course) filters.course = course;
    if (minFees) filters.minFees = parseInt(minFees);
    if (maxFees) filters.maxFees = parseInt(maxFees);
    if (ranking) filters.maxRanking = parseInt(ranking);

    Logger.logUserAction('colleges_filtered', filters);

    let filtered = [...allColleges];

    if (filters.course) {
      filtered = filtered.filter(c =>
        c.courses?.some(course =>
          course.toLowerCase().includes(filters.course.toLowerCase())
        )
      );
    }
    if (filters.minFees) {
      filtered = filtered.filter(c => c.fees >= filters.minFees);
    }
    if (filters.maxFees) {
      filtered = filtered.filter(c => c.fees <= filters.maxFees);
    }
    if (filters.maxRanking) {
      filtered = filtered.filter(c => c.ranking && c.ranking <= filters.maxRanking);
    }

    displayColleges(filtered);
  });

  // Reset filters
  resetFiltersBtn.addEventListener('click', () => {
    document.getElementById('course-filter').value = '';
    document.getElementById('min-fees').value = '';
    document.getElementById('max-fees').value = '';
    document.getElementById('ranking').value = '';
    displayColleges(allColleges);
  });

  // Logout
  logoutBtn.addEventListener('click', async () => {
    await AuthService.logout();
    window.location.href = '/index.html';
  });

  // Back button
  backBtn.addEventListener('click', () => {
    window.location.href = '/location-selection.html';
  });

  // Make viewCollege function global
  window.viewCollege = (collegeId) => {
    localStorage.setItem('selectedCollegeId', collegeId);
    window.location.href = '/college-details.html';
  };
});
