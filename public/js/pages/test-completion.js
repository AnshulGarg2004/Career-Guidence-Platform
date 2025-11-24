/**
 * Test Completion Page
 */

import AuthService from '../services/auth-service.js';
import Logger from '../utils/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('Test Completion');

  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const loadingElement = document.getElementById('loading');
  const resultsContainer = document.getElementById('results-container');
  const viewApplicationsBtn = document.getElementById('view-applications-btn');
  const browseCollegesBtn = document.getElementById('browse-colleges-btn');

  // Check authentication
  AuthService.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = '/student-login.html';
      return;
    }
    userNameElement.textContent = user.displayName || user.email;
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

  // Get test results from localStorage
  const resultData = localStorage.getItem('testResult');
  
  if (!resultData) {
    window.location.href = '/career-selection.html';
    return;
  }

  const result = JSON.parse(resultData);
  displayResults(result);

  function displayResults(result) {
    setTimeout(() => {
      loadingElement.style.display = 'none';
      resultsContainer.style.display = 'block';

      // Overall score
      document.getElementById('percentage').textContent = result.percentage;
      document.getElementById('score').textContent = result.score;
      document.getElementById('total').textContent = result.totalQuestions;

      // Section scores
      const sections = result.sectionScores;

      // Verbal
      document.getElementById('verbal-score').textContent = sections.verbal.score;
      document.getElementById('verbal-total').textContent = sections.verbal.total;
      const verbalPercent = ((sections.verbal.score / sections.verbal.total) * 100).toFixed(1);
      document.getElementById('verbal-percent').textContent = `${verbalPercent}%`;

      // Quantitative
      document.getElementById('quant-score').textContent = sections.quantitative.score;
      document.getElementById('quant-total').textContent = sections.quantitative.total;
      const quantPercent = ((sections.quantitative.score / sections.quantitative.total) * 100).toFixed(1);
      document.getElementById('quant-percent').textContent = `${quantPercent}%`;

      // General Knowledge
      document.getElementById('gk-score').textContent = sections.generalKnowledge.score;
      document.getElementById('gk-total').textContent = sections.generalKnowledge.total;
      const gkPercent = ((sections.generalKnowledge.score / sections.generalKnowledge.total) * 100).toFixed(1);
      document.getElementById('gk-percent').textContent = `${gkPercent}%`;

      // Eligibility message
      const eligibilityStatus = document.getElementById('eligibility-status');
      
      if (result.percentage >= 60) {
        eligibilityStatus.innerHTML = `
          <h4 style="color: #10b981;">✓ Congratulations!</h4>
          <p>You have passed the aptitude test with ${result.percentage}%. Your application will now be reviewed by the college admissions team.</p>
        `;
        eligibilityStatus.style.borderColor = '#10b981';
        eligibilityStatus.style.backgroundColor = '#ecfdf5';
      } else if (result.percentage >= 40) {
        eligibilityStatus.innerHTML = `
          <h4 style="color: #f59e0b;">⚠ Conditional Pass</h4>
          <p>You scored ${result.percentage}%. Your application will be reviewed, but you may need to provide additional documentation or appear for an interview.</p>
        `;
        eligibilityStatus.style.borderColor = '#f59e0b';
        eligibilityStatus.style.backgroundColor = '#fffbeb';
      } else {
        eligibilityStatus.innerHTML = `
          <h4 style="color: #ef4444;">Need Improvement</h4>
          <p>You scored ${result.percentage}%. While your application has been submitted, we recommend improving your scores. You may retake the test after 30 days.</p>
        `;
        eligibilityStatus.style.borderColor = '#ef4444';
        eligibilityStatus.style.backgroundColor = '#fef2f2';
      }

      Logger.info('Test results displayed', { 
        percentage: result.percentage, 
        passed: result.percentage >= 60 
      });
    }, 1500);
  }

  // Event listeners
  logoutBtn.addEventListener('click', async () => {
    await AuthService.logout();
    window.location.href = '/index.html';
  });

  viewApplicationsBtn.addEventListener('click', () => {
    alert('Applications page coming soon!');
  });

  browseCollegesBtn.addEventListener('click', () => {
    // Clear selections to start fresh
    localStorage.removeItem('selectedCareer');
    localStorage.removeItem('selectedLocation');
    localStorage.removeItem('selectedCollegeId');
    localStorage.removeItem('testResult');
    window.location.href = '/career-selection.html';
  });
});
