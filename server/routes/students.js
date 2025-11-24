/**
 * Student Routes
 * Handles student profiles, applications, and aptitude tests
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../config/firebase-admin');
const logger = require('../utils/logger');

/**
 * PUT /api/students/:uid/profile
 * Update student profile
 */
router.put('/:uid/profile', async (req, res) => {
  try {
    const { uid } = req.params;
    const profileData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
      profileComplete: true,
    };

    await db.collection('users').doc(uid).update(profileData);

    logger.logUserAction(uid, 'profile_updated');
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    logger.error('Failed to update profile', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/students/:uid/applications
 * Submit college application
 */
router.post('/:uid/applications',
  [
    body('collegeId').notEmpty(),
    body('course').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { uid } = req.params;
      const { collegeId, course, ...applicationData } = req.body;

      const application = {
        studentId: uid,
        collegeId,
        course,
        ...applicationData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await db.collection('applications').add(application);

      logger.logUserAction(uid, 'application_submitted', { 
        collegeId, 
        applicationId: docRef.id 
      });
      
      res.status(201).json({
        message: 'Application submitted successfully',
        applicationId: docRef.id,
      });
    } catch (error) {
      logger.error('Failed to submit application', { error: error.message });
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * GET /api/students/:uid/applications
 * Get student applications
 */
router.get('/:uid/applications', async (req, res) => {
  try {
    const { uid } = req.params;

    const snapshot = await db.collection('applications')
      .where('studentId', '==', uid)
      .get();

    const applications = [];
    snapshot.forEach(doc => {
      applications.push({ id: doc.id, ...doc.data() });
    });

    logger.logUserAction(uid, 'applications_fetched', { count: applications.length });
    res.json(applications);
  } catch (error) {
    logger.error('Failed to fetch applications', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/students/:uid/test-results
 * Submit aptitude test results
 */
router.post('/:uid/test-results', async (req, res) => {
  try {
    const { uid } = req.params;
    const { answers, testId } = req.body;

    // Get test questions
    const testDoc = await db.collection('aptitudeTests').doc(testId).get();
    
    if (!testDoc.exists) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const test = testDoc.data();
    let score = 0;
    let totalQuestions = 0;
    const sectionScores = {
      verbal: { score: 0, total: 0 },
      quantitative: { score: 0, total: 0 },
      generalKnowledge: { score: 0, total: 0 },
    };

    // Calculate scores
    test.questions.forEach((question, index) => {
      totalQuestions++;
      sectionScores[question.section].total++;

      if (answers[index] === question.correctAnswer) {
        score++;
        sectionScores[question.section].score++;
      }
    });

    const percentage = (score / totalQuestions) * 100;

    // Save test result
    const result = {
      studentId: uid,
      testId,
      score,
      totalQuestions,
      percentage: percentage.toFixed(2),
      sectionScores,
      answers,
      completedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('testResults').add(result);

    logger.logUserAction(uid, 'test_completed', { 
      testId, 
      score, 
      percentage: percentage.toFixed(2) 
    });

    res.status(201).json({
      message: 'Test submitted successfully',
      resultId: docRef.id,
      score,
      percentage: percentage.toFixed(2),
      sectionScores,
    });
  } catch (error) {
    logger.error('Failed to submit test results', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/students/:uid/test-results
 * Get student test results
 */
router.get('/:uid/test-results', async (req, res) => {
  try {
    const { uid } = req.params;

    const snapshot = await db.collection('testResults')
      .where('studentId', '==', uid)
      .get();

    const results = [];
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() });
    });

    logger.logUserAction(uid, 'test_results_fetched', { count: results.length });
    res.json(results);
  } catch (error) {
    logger.error('Failed to fetch test results', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/students/aptitude-tests/:testId
 * Get aptitude test questions
 */
router.get('/aptitude-tests/:testId', async (req, res) => {
  try {
    const { testId } = req.params;

    const testDoc = await db.collection('aptitudeTests').doc(testId).get();

    if (!testDoc.exists) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const test = testDoc.data();
    
    // Remove correct answers before sending to client
    const questionsWithoutAnswers = test.questions.map(q => ({
      question: q.question,
      options: q.options,
      section: q.section,
    }));

    logger.logDatabase('read', 'aptitudeTests', true, { testId });
    res.json({
      id: testDoc.id,
      title: test.title,
      description: test.description,
      duration: test.duration,
      questions: questionsWithoutAnswers,
    });
  } catch (error) {
    logger.error('Failed to fetch test', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
