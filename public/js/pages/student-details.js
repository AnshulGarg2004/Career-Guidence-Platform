/**
 * Student Details Page
 */

import AuthService from '../services/auth-service.js';
import StudentService from '../services/student-service.js';
import Logger from '../utils/logger.js';
import Validation from '../utils/validation.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('Student Details');

  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const detailsForm = document.getElementById('student-details-form');
  const saveBtn = document.getElementById('save-btn');
  const backBtn = document.getElementById('back-btn');
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');

  let currentUser = null;

  // Check authentication
  AuthService.onAuthStateChanged(async user => {
    if (!user) {
      window.location.href = '/student-login.html';
      return;
    }

    currentUser = user;
    userNameElement.textContent = user.displayName || user.email;

    // Load existing profile data
    await loadProfileData(user.uid);
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

  async function loadProfileData(userId) {
    try {
      const profile = await StudentService.getProfile(userId);

      // Pre-fill form if data exists
      if (profile.fullName) document.getElementById('fullName').value = profile.fullName;
      if (profile.dob) document.getElementById('dob').value = profile.dob;
      if (profile.gender) document.getElementById('gender').value = profile.gender;
      if (profile.phone) document.getElementById('phone').value = profile.phone;
      if (profile.highSchool) document.getElementById('highSchool').value = profile.highSchool;
      if (profile.passYear) document.getElementById('passYear').value = profile.passYear;
      if (profile.cgpa) document.getElementById('cgpa').value = profile.cgpa;
      if (profile.entranceExam) document.getElementById('entranceExam').value = profile.entranceExam;
      if (profile.entranceScore) document.getElementById('entranceScore').value = profile.entranceScore;
      if (profile.address) document.getElementById('address').value = profile.address;
      if (profile.city) document.getElementById('city').value = profile.city;
      if (profile.state) document.getElementById('state').value = profile.state;
      if (profile.country) document.getElementById('country').value = profile.country;
      if (profile.pincode) document.getElementById('pincode').value = profile.pincode;

      Logger.info('Profile data loaded', { userId });
    } catch (error) {
      Logger.warn('No existing profile data', { error: error.message });
    }
  }

  detailsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      dob: document.getElementById('dob').value,
      gender: document.getElementById('gender').value,
      phone: document.getElementById('phone').value.trim(),
      highSchool: document.getElementById('highSchool').value.trim(),
      passYear: parseInt(document.getElementById('passYear').value),
      cgpa: parseFloat(document.getElementById('cgpa').value),
      entranceExam: document.getElementById('entranceExam').value.trim(),
      entranceScore: document.getElementById('entranceScore').value 
        ? parseFloat(document.getElementById('entranceScore').value) 
        : null,
      address: document.getElementById('address').value.trim(),
      city: document.getElementById('city').value.trim(),
      state: document.getElementById('state').value.trim(),
      country: document.getElementById('country').value.trim(),
      pincode: document.getElementById('pincode').value.trim()
    };

    // Validation
    if (!Validation.isRequired(formData.fullName)) {
      showError('Full name is required');
      return;
    }

    if (!Validation.isValidPhone(formData.phone)) {
      showError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!Validation.isValidCGPA(formData.cgpa)) {
      showError('Please enter a valid CGPA/Percentage');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    errorMessage.style.display = 'none';

    try {
      Logger.logUserAction('profile_update_attempt', { userId: currentUser.uid });

      await StudentService.updateProfile(currentUser.uid, formData);

      Logger.logUserAction('profile_updated', { userId: currentUser.uid });

      successMessage.textContent = 'Profile saved successfully! Redirecting to aptitude test...';
      successMessage.style.display = 'block';

      setTimeout(() => {
        window.location.href = '/aptitude-test.html';
      }, 2000);
    } catch (error) {
      Logger.error('Failed to save profile', { error: error.message });
      showError('Failed to save profile. Please try again.');
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save & Continue to Aptitude Test';
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await AuthService.logout();
    window.location.href = '/index.html';
  });

  backBtn.addEventListener('click', () => {
    window.history.back();
  });

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    window.scrollTo(0, 0);
  }
});
