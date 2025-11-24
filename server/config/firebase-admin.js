/**
 * Firebase Admin SDK Configuration
 * Server-side Firebase initialization
 */

const admin = require('firebase-admin');
const logger = require('../utils/logger');

let db = null;
let auth = null;

try {
  // Initialize Firebase Admin
  // Note: You need to download your serviceAccountKey.json from Firebase Console
  const serviceAccount = require('./serviceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  });

  db = admin.firestore();
  auth = admin.auth();

  logger.info('Firebase Admin initialized successfully');
} catch (error) {
  logger.error('Failed to initialize Firebase Admin', { error: error.message });
  console.error('⚠️  Please ensure serviceAccountKey.json is in server/config/ directory');
  console.error('⚠️  Download it from Firebase Console > Project Settings > Service Accounts');
}

module.exports = { admin, db, auth };
