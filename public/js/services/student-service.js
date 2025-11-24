/**
 * Student Service
 * Handles student-related operations
 */

import { db } from '../config/firebase-config.js';
import Logger from '../utils/logger.js';

const StudentService = {
  /**
   * Update student profile
   */
  async updateProfile(userId, profileData) {
    try {
      Logger.info('Updating student profile', { userId });

      const data = {
        ...profileData,
        updatedAt: new Date().toISOString(),
        profileComplete: true
      };

      await db.collection('users').doc(userId).update(data);

      Logger.info('Profile updated successfully', { userId });
      return { success: true };
    } catch (error) {
      Logger.error('Failed to update profile', { error: error.message });
      throw error;
    }
  },

  /**
   * Get student profile
   */
  async getProfile(userId) {
    try {
      Logger.info('Fetching student profile', { userId });

      const doc = await db.collection('users').doc(userId).get();

      if (!doc.exists) {
        throw new Error('User not found');
      }

      Logger.info('Profile fetched successfully', { userId });
      return doc.data();
    } catch (error) {
      Logger.error('Failed to fetch profile', { error: error.message });
      throw error;
    }
  },

  /**
   * Submit college application
   */
  async submitApplication(userId, applicationData) {
    try {
      Logger.info('Submitting college application', { userId, collegeId: applicationData.collegeId });

      const data = {
        studentId: userId,
        ...applicationData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await db.collection('applications').add(data);

      Logger.info('Application submitted successfully', { applicationId: docRef.id });
      return { id: docRef.id, ...data };
    } catch (error) {
      Logger.error('Failed to submit application', { error: error.message });
      throw error;
    }
  },

  /**
   * Get student applications
   */
  async getApplications(userId) {
    try {
      Logger.info('Fetching student applications', { userId });

      const snapshot = await db.collection('applications')
        .where('studentId', '==', userId)
        .get();

      const applications = [];
      snapshot.forEach(doc => {
        applications.push({ id: doc.id, ...doc.data() });
      });

      Logger.info('Applications fetched successfully', { count: applications.length });
      return applications;
    } catch (error) {
      Logger.error('Failed to fetch applications', { error: error.message });
      throw error;
    }
  },

  /**
   * Get aptitude test
   */
  async getAptitudeTest(testId = 'default') {
    try {
      Logger.info('Fetching aptitude test', { testId });

      const doc = await db.collection('aptitudeTests').doc(testId).get();

      if (!doc.exists) {
        throw new Error('Test not found');
      }

      const test = doc.data();
      
      // Remove correct answers
      const questions = test.questions.map(q => ({
        question: q.question,
        options: q.options,
        section: q.section
      }));

      Logger.info('Test fetched successfully', { testId });
      return {
        id: doc.id,
        title: test.title,
        description: test.description,
        duration: test.duration,
        questions
      };
    } catch (error) {
      Logger.error('Failed to fetch test', { error: error.message });
      throw error;
    }
  },

  /**
   * Submit test results
   */
  async submitTestResults(userId, testId, answers) {
    try {
      Logger.info('Submitting test results', { userId, testId });

      // Get test with correct answers
      const testDoc = await db.collection('aptitudeTests').doc(testId).get();
      const test = testDoc.data();

      // Calculate scores
      let score = 0;
      const sectionScores = {
        verbal: { score: 0, total: 0 },
        quantitative: { score: 0, total: 0 },
        generalKnowledge: { score: 0, total: 0 }
      };

      test.questions.forEach((question, index) => {
        sectionScores[question.section].total++;

        if (answers[index] === question.correctAnswer) {
          score++;
          sectionScores[question.section].score++;
        }
      });

      const totalQuestions = test.questions.length;
      const percentage = ((score / totalQuestions) * 100).toFixed(2);

      // Save results
      const resultData = {
        studentId: userId,
        testId,
        score,
        totalQuestions,
        percentage: parseFloat(percentage),
        sectionScores,
        answers,
        completedAt: new Date().toISOString()
      };

      const docRef = await db.collection('testResults').add(resultData);

      Logger.info('Test results submitted successfully', { 
        resultId: docRef.id, 
        score, 
        percentage 
      });

      return {
        id: docRef.id,
        score,
        totalQuestions,
        percentage: parseFloat(percentage),
        sectionScores
      };
    } catch (error) {
      Logger.error('Failed to submit test results', { error: error.message });
      throw error;
    }
  },

  /**
   * Get test results
   */
  async getTestResults(userId) {
    try {
      Logger.info('Fetching test results', { userId });

      const snapshot = await db.collection('testResults')
        .where('studentId', '==', userId)
        .get();

      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });

      Logger.info('Test results fetched successfully', { count: results.length });
      return results;
    } catch (error) {
      Logger.error('Failed to fetch test results', { error: error.message });
      throw error;
    }
  }
};

export default StudentService;
