/**
 * Authentication Routes
 * Handles user registration, login, and authentication
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { db, auth } = require('../config/firebase-admin');
const logger = require('../utils/logger');

/**
 * POST /api/auth/register
 * Register a new student
 */
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').trim().notEmpty(),
    body('phone').optional().isMobilePhone(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Registration validation failed', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, fullName, phone } = req.body;

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: fullName,
      });

      logger.logAuth('User registration', userRecord.uid, true, { email });

      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        uid: userRecord.uid,
        email,
        fullName,
        phone: phone || '',
        role: 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileComplete: false,
      });

      logger.logDatabase('create', 'users', true, { userId: userRecord.uid });

      res.status(201).json({
        message: 'User registered successfully',
        userId: userRecord.uid,
      });
    } catch (error) {
      logger.error('Registration failed', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * POST /api/auth/create-admin
 * Create admin user (should be called once during setup)
 */
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create admin user
    const userRecord = await auth.createUser({
      email: email || process.env.ADMIN_EMAIL,
      password: password || process.env.ADMIN_PASSWORD,
      displayName: 'System Admin',
    });

    // Set custom claims
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });

    // Create admin document
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      fullName: 'System Admin',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    logger.logAuth('Admin user created', userRecord.uid, true);

    res.status(201).json({
      message: 'Admin user created successfully',
      email: userRecord.email,
    });
  } catch (error) {
    logger.error('Admin creation failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /api/auth/user/:uid
 * Get user profile
 */
router.get('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      logger.warn('User not found', { uid });
      return res.status(404).json({ error: 'User not found' });
    }

    logger.logDatabase('read', 'users', true, { userId: uid });
    res.json(userDoc.data());
  } catch (error) {
    logger.error('Failed to fetch user', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
