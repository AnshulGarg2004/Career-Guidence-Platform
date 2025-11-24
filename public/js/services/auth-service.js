/**
 * Authentication Service
 * Handles user authentication operations
 */

import { auth, db } from '../config/firebase-config.js';
import Logger from '../utils/logger.js';

const AuthService = {
  /**
   * Register a new student
   */
  async register(email, password, fullName, phone = '') {
    try {
      Logger.info('Attempting user registration', { email });

      // Create user with Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update profile
      await user.updateProfile({
        displayName: fullName
      });

      // Create user document in Firestore
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email,
        fullName,
        phone,
        role: 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profileComplete: false
      });

      Logger.info('User registered successfully', { userId: user.uid });
      return { success: true, user };
    } catch (error) {
      Logger.error('Registration failed', { error: error.message });
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(email, password) {
    try {
      Logger.info('Attempting user login', { email });

      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();

      Logger.info('User logged in successfully', { userId: user.uid });
      return { success: true, user, userData };
    } catch (error) {
      Logger.error('Login failed', { error: error.message });
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      Logger.info('User logging out');
      await auth.signOut();
      Logger.info('User logged out successfully');
      return { success: true };
    } catch (error) {
      Logger.error('Logout failed', { error: error.message });
      throw error;
    }
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth.currentUser;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return auth.currentUser !== null;
  },

  /**
   * Get ID token for API calls
   */
  async getIdToken() {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  },

  /**
   * Auth state observer
   */
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  },

  /**
   * Check if user is admin
   */
  async isAdmin(user) {
    if (!user) return false;
    
    try {
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();
      return userData && userData.role === 'admin';
    } catch (error) {
      Logger.error('Failed to check admin status', { error: error.message });
      return false;
    }
  }
};

export default AuthService;
