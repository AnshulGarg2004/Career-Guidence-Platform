/**
 * Aptitude Test Page
 */

import AuthService from '../services/auth-service.js';
import StudentService from '../services/student-service.js';
import Logger from '../utils/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('Aptitude Test');

  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const timerElement = document.getElementById('timer');
  const loadingElement = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');
  const testContainer = document.getElementById('test-container');
  const questionContainer = document.getElementById('question-container');
  const paletteContainer = document.getElementById('palette-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const currentQuestionEl = document.getElementById('current-question');
  const totalQuestionsEl = document.getElementById('total-questions');
  const currentSectionEl = document.getElementById('current-section');
  const progressFill = document.getElementById('progress-fill');

  let currentUser = null;
  let testData = null;
  let currentQuestionIndex = 0;
  let answers = {};
  let startTime = null;
  let timerInterval = null;

  // Check authentication
  AuthService.onAuthStateChanged(async user => {
    if (!user) {
      window.location.href = '/student-login.html';
      return;
    }

    currentUser = user;
    userNameElement.textContent = user.displayName || user.email;

    await loadTest();
  });

  // Handle logout
  logoutBtn.addEventListener('click', async () => {
    try {
      clearInterval(timerInterval);
      await AuthService.logout();
      window.location.href = '/index.html';
    } catch (error) {
      Logger.error('Logout failed', { error: error.message });
      alert('Failed to logout. Please try again.');
    }
  });

  async function loadTest() {
    try {
      loadingElement.style.display = 'block';

      testData = await StudentService.getAptitudeTest('default');

      if (!testData || !testData.questions || testData.questions.length === 0) {
        throw new Error('No test questions available');
      }

      totalQuestionsEl.textContent = testData.questions.length;
      startTime = Date.now();

      displayQuestion(0);
      createPalette();
      startTimer(testData.duration || 60); // Default 60 minutes

      testContainer.style.display = 'block';
      loadingElement.style.display = 'none';

      Logger.info('Test started', { testId: testData.id, questionCount: testData.questions.length });
    } catch (error) {
      Logger.error('Failed to load test', { error: error.message });
      errorMessage.textContent = 'Failed to load test. Please try again or contact support.';
      errorMessage.style.display = 'block';
      loadingElement.style.display = 'none';
    }
  }

  function displayQuestion(index) {
    const question = testData.questions[index];
    currentQuestionIndex = index;
    
    currentQuestionEl.textContent = index + 1;
    currentSectionEl.textContent = question.section.charAt(0).toUpperCase() + question.section.slice(1);

    questionContainer.innerHTML = `
      <h3>Question ${index + 1}</h3>
      <p class="question-text">${question.question}</p>
      <div class="options-list">
        ${question.options.map((option, i) => `
          <label class="option-item ${answers[index] === i ? 'selected' : ''}" 
                 onclick="selectAnswer(${index}, ${i})">
            <input type="radio" 
                   name="question-${index}" 
                   value="${i}" 
                   ${answers[index] === i ? 'checked' : ''}
                   style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;">
            <span><strong>${String.fromCharCode(65 + i)}.</strong> ${option}</span>
          </label>
        `).join('')}
      </div>
    `;

    // Update progress bar
    const progress = ((index + 1) / testData.questions.length) * 100;
    progressFill.style.width = `${progress}%`;

    // Update navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.style.display = index === testData.questions.length - 1 ? 'none' : 'inline-block';
    submitBtn.style.display = index === testData.questions.length - 1 ? 'inline-block' : 'none';

    updatePalette();
  }

  function createPalette() {
    paletteContainer.innerHTML = testData.questions.map((_, i) => `
      <button class="palette-btn" onclick="goToQuestion(${i})">${i + 1}</button>
    `).join('');
  }

  function updatePalette() {
    const buttons = paletteContainer.querySelectorAll('.palette-btn');
    buttons.forEach((btn, i) => {
      btn.classList.remove('current', 'answered');
      if (i === currentQuestionIndex) {
        btn.classList.add('current');
      } else if (answers[i] !== undefined) {
        btn.classList.add('answered');
      }
    });
  }

  function startTimer(minutes) {
    let timeLeft = minutes * 60; // Convert to seconds

    timerInterval = setInterval(() => {
      timeLeft--;

      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      timerElement.textContent = `Time: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        submitTest();
      }
    }, 1000);
  }

  // Navigation
  prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      displayQuestion(currentQuestionIndex - 1);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      displayQuestion(currentQuestionIndex + 1);
    }
  });

  submitBtn.addEventListener('click', async () => {
    const unanswered = testData.questions.length - Object.keys(answers).length;
    
    if (unanswered > 0) {
      const confirm = window.confirm(
        `You have ${unanswered} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirm) return;
    }

    await submitTest();
  });

  async function submitTest() {
    try {
      clearInterval(timerInterval);
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      Logger.info('Submitting test', { 
        answeredCount: Object.keys(answers).length,
        totalQuestions: testData.questions.length 
      });

      const result = await StudentService.submitTestResults(
        currentUser.uid,
        testData.id,
        answers
      );

      Logger.info('Test submitted successfully', result);

      // Store result and redirect
      localStorage.setItem('testResult', JSON.stringify(result));
      window.location.href = '/test-completion.html';
    } catch (error) {
      Logger.error('Failed to submit test', { error: error.message });
      alert('Failed to submit test. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Test';
    }
  }

  // Make functions global
  window.selectAnswer = (questionIndex, optionIndex) => {
    answers[questionIndex] = optionIndex;
    Logger.debug('Answer selected', { questionIndex, optionIndex });
    displayQuestion(currentQuestionIndex);
  };

  window.goToQuestion = (index) => {
    displayQuestion(index);
  };

  // Prevent page refresh/close without confirmation
  window.addEventListener('beforeunload', (e) => {
    if (testContainer.style.display !== 'none') {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });
});
