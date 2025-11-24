# Firebase Setup Guide 🔥

Follow these steps to configure Firebase for your Career Guidance Platform.

## Prerequisites
- A Google account
- Node.js installed on your system

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., "career-guidance-app")
4. Accept terms and click **Continue**
5. Disable Google Analytics (optional) or configure it
6. Click **Create project**

## Step 2: Enable Authentication

1. In Firebase Console, click **Authentication** from left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. Enable **Email/Password** toggle
6. Click **Save**

## Step 3: Enable Firestore Database

1. Click **Firestore Database** from left sidebar
2. Click **Create database**
3. Choose **Start in production mode** (recommended)
4. Select a location closest to your users
5. Click **Enable**

### Set Firestore Security Rules

Go to **Rules** tab and use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Colleges collection - read for all authenticated, write for admins only
    match /colleges/{collegeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Aptitude tests - read for all authenticated users
    match /aptitudeTests/{testId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Test results - users can only access their own results
    match /testResults/{resultId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

Click **Publish**

## Step 4: Get Firebase Web Configuration

1. Go to **Project Settings** (gear icon ⚙️)
2. Scroll down to **Your apps** section
3. Click the web icon `</>` (Add app)
4. Enter app nickname (e.g., "Career Guidance Web")
5. **Do not** check "Set up Firebase Hosting"
6. Click **Register app**
7. Copy the `firebaseConfig` object

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

8. Paste this configuration into:
   - `public/js/config/firebase-config.js`

## Step 5: Generate Service Account Key

1. In Firebase Console, go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Confirm by clicking **Generate key**
4. A JSON file will download
5. Rename it to `serviceAccountKey.json`
6. Move it to: `server/config/serviceAccountKey.json`

⚠️ **IMPORTANT**: Never commit this file to Git! It's already in `.gitignore`

## Step 6: Initialize Database (Optional)

To add sample data for testing:

```bash
node scripts/init-db.js
```

This will create:
- Sample colleges
- Sample aptitude test questions

## Step 7: Test Your Setup

1. Start the server:
```bash
npm run dev
```

2. Open browser: `http://localhost:3000`
3. Try creating a new account
4. Check Firebase Console → Authentication to see the new user
5. Check Firestore Database to see created documents

## Troubleshooting

### "Firebase SDK not loaded"
- Check that Firebase scripts are included in HTML files
- Verify internet connection

### "Permission denied" errors
- Review Firestore security rules
- Ensure user is authenticated
- Check user role for admin operations

### "Invalid API key"
- Double-check `firebaseConfig` values
- Ensure no extra spaces or quotes
- Regenerate API key if needed

### "Service account key not found"
- Verify `serviceAccountKey.json` is in `server/config/`
- Check file permissions
- Regenerate the service account key

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

## Security Best Practices

1. ✅ Never commit `serviceAccountKey.json`
2. ✅ Never commit Firebase config with real credentials to public repos
3. ✅ Use environment variables for sensitive data in production
4. ✅ Enable Firebase App Check for production
5. ✅ Regularly rotate service account keys
6. ✅ Use strict Firestore security rules

## Next Steps

- Customize Firestore collections based on your needs
- Set up Firebase Storage if you need file uploads
- Configure Firebase Hosting for production deployment
- Set up Cloud Functions for server-side logic (optional)

---

🎉 Your Firebase setup is complete! You can now use the Career Guidance Platform.
