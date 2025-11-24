/**
 * College Registration Page
 */

import AuthService from '../services/auth-service.js';
import CollegeService from '../services/college-service.js';
import Logger from '../utils/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('College Registration');

  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const collegeInfo = document.getElementById('college-info');
  const eligibilityCriteria = document.getElementById('eligibility-criteria');
  const proceedBtn = document.getElementById('proceed-btn');
  const backBtn = document.getElementById('back-btn');

  let selectedCollege = null;

  // Check authentication
  AuthService.onAuthStateChanged(async user => {
    if (!user) {
      window.location.href = '/student-login.html';
      return;
    }
    userNameElement.textContent = user.displayName || user.email;

    await loadCollegeInfo();
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

  async function loadCollegeInfo() {
    const collegeId = localStorage.getItem('selectedCollegeId');
    
    if (!collegeId) {
      window.location.href = '/college-list.html';
      return;
    }

    try {
      selectedCollege = await CollegeService.getCollegeById(collegeId);

      displayCollegeInfo(selectedCollege);
      displayEligibility(selectedCollege);

      Logger.info('College registration page loaded', { collegeId });
    } catch (error) {
      Logger.error('Failed to load college info', { error: error.message });
      alert('Failed to load college information');
      window.location.href = '/college-list.html';
    }
  }

  function displayCollegeInfo(college) {
    collegeInfo.innerHTML = `
      <h3>${college.name}</h3>
      <p><strong>Location:</strong> ${college.city || college.location}</p>
      <p><strong>Annual Fees:</strong> ₹${college.fees?.toLocaleString() || 'N/A'}</p>
      <p><strong>Ranking:</strong> #${college.ranking || 'N/A'}</p>
    `;
  }

  function displayEligibility(college) {
    const criteria = college.eligibility || {
      minCGPA: 6.0,
      requiredExam: 'Any entrance exam',
      minScore: 'As per category'
    };

    eligibilityCriteria.innerHTML = `
      <ul>
        <li><strong>Minimum CGPA:</strong> ${criteria.minCGPA || '6.0'} / 10</li>
        <li><strong>Required Exam:</strong> ${criteria.requiredExam || 'Any entrance exam'}</li>
        <li><strong>Minimum Score:</strong> ${criteria.minScore || 'As per category'}</li>
        <li><strong>Documents Required:</strong> 10th & 12th mark sheets, ID proof</li>
        <li><strong>Aptitude Test:</strong> Mandatory for all applicants</li>
      </ul>
    `;
  }

  proceedBtn.addEventListener('click', () => {
    Logger.logUserAction('proceed_to_student_details', { 
      collegeId: selectedCollege.id 
    });
    window.location.href = '/student-details.html';
  });

  backBtn.addEventListener('click', () => {
    window.location.href = '/college-details.html';
  });

  logoutBtn.addEventListener('click', async () => {
    await AuthService.logout();
    window.location.href = '/index.html';
  });
});
