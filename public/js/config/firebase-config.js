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

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app, auth, db;

if (typeof firebase !== 'undefined') {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
}

export { app, auth, db, firebaseConfig };
