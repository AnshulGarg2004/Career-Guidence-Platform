/**
 * Firebase Configuration
 * Initialize Firebase for client-side authentication and database
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Enable Authentication (Email/Password method)
 * 3. Enable Firestore Database
 * 4. Go to Project Settings > General > Your apps
 * 5. Copy your Firebase configuration and replace the values below
 */

// Replace these with your actual Firebase config values
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqtgU4vsfMG32Lzcbi5WoMAwJ_UbFjJMk",
  authDomain: "career-guiding-platform.firebaseapp.com",
  projectId: "career-guiding-platform",
  storageBucket: "career-guiding-platform.firebasestorage.app",
  messagingSenderId: "167271102752",
  appId: "1:167271102752:web:1de3333aed599a54c9ff45",
  measurementId: "G-8EHVYG8GSE"
};


let app, auth, db;

if (typeof firebase !== 'undefined') {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
}

export { app, auth, db, firebaseConfig };
