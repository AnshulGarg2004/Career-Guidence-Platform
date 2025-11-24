/**
 * College Service
 * Handles college-related operations
 */

import { db } from '../config/firebase-config.js';
import Logger from '../utils/logger.js';

const CollegeService = {
  /**
   * Get all colleges with filters
   */
  async getColleges(filters = {}) {
    try {
      Logger.info('Fetching colleges', filters);

      let query = db.collection('colleges');

      // Apply filters
      if (filters.location) {
        query = query.where('location', '==', filters.location);
      }

      const snapshot = await query.get();
      const colleges = [];

      snapshot.forEach(doc => {
        colleges.push({ id: doc.id, ...doc.data() });
      });

      // Client-side filtering for range queries
      let filteredColleges = colleges;

      if (filters.minFees) {
        filteredColleges = filteredColleges.filter(c => c.fees >= filters.minFees);
      }

      if (filters.maxFees) {
        filteredColleges = filteredColleges.filter(c => c.fees <= filters.maxFees);
      }

      if (filters.maxRanking) {
        filteredColleges = filteredColleges.filter(c => c.ranking && c.ranking <= filters.maxRanking);
      }

      if (filters.course) {
        filteredColleges = filteredColleges.filter(c =>
          c.courses && c.courses.some(course =>
            course.toLowerCase().includes(filters.course.toLowerCase())
          )
        );
      }

      Logger.info('Colleges fetched successfully', { count: filteredColleges.length });
      return filteredColleges;
    } catch (error) {
      Logger.error('Failed to fetch colleges', { error: error.message });
      throw error;
    }
  },

  /**
   * Get college by ID
   */
  async getCollegeById(collegeId) {
    try {
      Logger.info('Fetching college by ID', { collegeId });

      const doc = await db.collection('colleges').doc(collegeId).get();

      if (!doc.exists) {
        throw new Error('College not found');
      }

      Logger.info('College fetched successfully', { collegeId });
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      Logger.error('Failed to fetch college', { error: error.message });
      throw error;
    }
  },

  /**
   * Create a new college (Admin only)
   */
  async createCollege(collegeData) {
    try {
      Logger.info('Creating new college', { name: collegeData.name });

      const data = {
        ...collegeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await db.collection('colleges').add(data);

      Logger.info('College created successfully', { collegeId: docRef.id });
      return { id: docRef.id, ...data };
    } catch (error) {
      Logger.error('Failed to create college', { error: error.message });
      throw error;
    }
  },

  /**
   * Update college (Admin only)
   */
  async updateCollege(collegeId, updateData) {
    try {
      Logger.info('Updating college', { collegeId });

      const data = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      await db.collection('colleges').doc(collegeId).update(data);

      Logger.info('College updated successfully', { collegeId });
      return { success: true };
    } catch (error) {
      Logger.error('Failed to update college', { error: error.message });
      throw error;
    }
  },

  /**
   * Delete college (Admin only)
   */
  async deleteCollege(collegeId) {
    try {
      Logger.info('Deleting college', { collegeId });

      await db.collection('colleges').doc(collegeId).delete();

      Logger.info('College deleted successfully', { collegeId });
      return { success: true };
    } catch (error) {
      Logger.error('Failed to delete college', { error: error.message });
      throw error;
    }
  }
};

export default CollegeService;
