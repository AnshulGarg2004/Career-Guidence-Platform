/**
 * Authentication Middleware
 * Verifies Firebase tokens and protects routes
 */

const { auth } = require('../config/firebase-admin');
const logger = require('../utils/logger');

/**
 * Verify Firebase ID token
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Authentication failed: No token provided');
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    
    logger.logAuth('Token verified', decodedToken.uid, true);
    next();
  } catch (error) {
    logger.error('Token verification failed', { error: error.message });
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Check if user is admin
 */
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check custom claims or admin collection
    const userRecord = await auth.getUser(req.user.uid);
    
    if (userRecord.customClaims && userRecord.customClaims.admin === true) {
      logger.logAuth('Admin access granted', req.user.uid, true);
      next();
    } else {
      logger.warn('Admin access denied', { userId: req.user.uid });
      res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    logger.error('Admin check failed', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { verifyToken, isAdmin };
