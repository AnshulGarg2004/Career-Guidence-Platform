/**
 * College Routes
 * Handles college-related operations
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db } = require('../config/firebase-admin');
const logger = require('../utils/logger');

/**
 * GET /api/colleges
 * Get all colleges with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { location, minFees, maxFees, ranking, course, limit = 50 } = req.query;

    let query = db.collection('colleges');

    // Apply filters
    if (location) {
      query = query.where('location', '==', location.toUpperCase());
    }

    const snapshot = await query.limit(parseInt(limit)).get();

    let colleges = [];
    snapshot.forEach(doc => {
      colleges.push({ id: doc.id, ...doc.data() });
    });

    // Client-side filtering for range queries (Firestore limitation)
    if (minFees) {
      colleges = colleges.filter(c => c.fees >= parseInt(minFees));
    }
    if (maxFees) {
      colleges = colleges.filter(c => c.fees <= parseInt(maxFees));
    }
    if (ranking) {
      colleges = colleges.filter(c => c.ranking <= parseInt(ranking));
    }
    if (course) {
      colleges = colleges.filter(c => 
        c.courses && c.courses.some(co => 
          co.toLowerCase().includes(course.toLowerCase())
        )
      );
    }

    logger.logDatabase('read', 'colleges', true, { count: colleges.length });
    res.json(colleges);
  } catch (error) {
    logger.error('Failed to fetch colleges', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/colleges/:id
 * Get college by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const collegeDoc = await db.collection('colleges').doc(id).get();

    if (!collegeDoc.exists) {
      logger.warn('College not found', { collegeId: id });
      return res.status(404).json({ error: 'College not found' });
    }

    logger.logDatabase('read', 'colleges', true, { collegeId: id });
    res.json({ id: collegeDoc.id, ...collegeDoc.data() });
  } catch (error) {
    logger.error('Failed to fetch college', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/colleges
 * Create a new college (Admin only)
 */
router.post('/',
  [
    body('name').trim().notEmpty(),
    body('location').isIn(['INDIA', 'ABROAD']),
    body('fees').isNumeric(),
    body('ranking').optional().isNumeric(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('College creation validation failed', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
      }

      const collegeData = {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await db.collection('colleges').add(collegeData);

      logger.logDatabase('create', 'colleges', true, { collegeId: docRef.id });
      res.status(201).json({
        message: 'College created successfully',
        id: docRef.id,
      });
    } catch (error) {
      logger.error('Failed to create college', { error: error.message });
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * PUT /api/colleges/:id
 * Update college (Admin only)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('colleges').doc(id).update(updateData);

    logger.logDatabase('update', 'colleges', true, { collegeId: id });
    res.json({ message: 'College updated successfully' });
  } catch (error) {
    logger.error('Failed to update college', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/colleges/:id
 * Delete college (Admin only)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('colleges').doc(id).delete();

    logger.logDatabase('delete', 'colleges', true, { collegeId: id });
    res.json({ message: 'College deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete college', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
