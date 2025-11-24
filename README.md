# 🎓 Career Guidance Platform

A comprehensive web-based platform designed to help students make informed career decisions through aptitude testing, personalized career recommendations, and college selection assistance.

![Platform Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node Version](https://img.shields.io/badge/Node-14%2B-green)
![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange)

## 📸 Platform Preview

![Career Guidance Platform Homepage](https://raw.githubusercontent.com/AkshatBajpai4218/Career-Guidence-Platform/main/screenshots/homepage.png)
*Modern dark-themed interface with intuitive navigation*

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Firebase Configuration](#-firebase-configuration)
- [API Endpoints](#-api-endpoints)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🌟 Overview

The **Career Guidance Platform** is an intelligent web application that helps students:
- Discover their strengths through comprehensive aptitude tests
- Receive personalized career recommendations
- Explore colleges based on location, courses, and preferences
- Make informed decisions about their academic future

### Who Is This For?

- **Students**: Looking for career direction and college options
- **Educational Institutions**: Wanting to guide students effectively
- **Career Counselors**: Seeking a digital tool for assessments

---

## ✨ Key Features

### For Students
- 📝 **User Registration & Authentication** - Secure signup/login system
- 🧠 **Aptitude Testing** - Comprehensive tests covering multiple domains
- 🎯 **Career Recommendations** - AI-driven suggestions based on test results
- 🏫 **College Discovery** - Search and filter colleges by:
  - Location (State/City)
  - Courses offered
  - College type (Engineering, Medical, Arts, etc.)
- 📊 **Personal Dashboard** - Track test results and saved colleges
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### For Admins
- 🔐 **Admin Dashboard** - Secure admin authentication
- ➕ **College Management** - Add, edit, and delete college information
- 📈 **Analytics** - View student registration and test completion stats
- 🎓 **Course Management** - Manage available courses and programs

### Design Highlights
- 🎨 **Modern Dark Theme** - Professional black and grey UI with purple/pink accents
- ✨ **Smooth Animations** - Engaging user experience with glassmorphism effects
- 🚀 **Fast Performance** - Optimized loading and real-time updates
- 🔒 **Secure** - Firebase Authentication with role-based access control

---

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations, glassmorphism, gradients
- **JavaScript (ES6+)** - Modular architecture
- **Firebase SDK** - Client-side authentication and database

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Firebase Admin SDK** - Server-side Firebase operations

### Database & Auth
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Authentication** - User management and security

### Development Tools
- **npm** - Package management
- **nodemon** - Development auto-reload
- **Winston** - Logging framework

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **A Firebase Account** - [Create free account](https://firebase.google.com/)
- **A code editor** - VS Code recommended
- **Git** (optional) - For version control

Check your installations:
```bash
node --version   # Should show v14.0.0 or higher
npm --version    # Should show 6.0.0 or higher
```

---

## 🚀 Installation & Setup

### Step 1: Download the Project

```bash
# If using Git
git clone <repository-url>
cd career-guidance

# Or simply extract the ZIP file and navigate to the folder
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### Step 3: Firebase Configuration

**⚠️ IMPORTANT**: You must set up your own Firebase project. Follow these steps:

#### 3.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "career-guidance-app")
4. Follow the setup wizard

#### 3.2 Enable Firebase Services
1. **Enable Authentication:**
   - Go to Authentication → Get started
   - Enable "Email/Password" sign-in method

2. **Enable Firestore Database:**
   - Go to Firestore Database → Create database
   - Start in production mode
   - Choose a location close to your users

#### 3.3 Get Web App Configuration
1. Go to Project Settings (⚙️ icon)
2. Scroll to "Your apps" section
3. Click web icon `</>` to add a web app
4. Register app with a nickname
5. Copy the `firebaseConfig` object

#### 3.4 Configure Client-Side Firebase
Open `public/js/config/firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // Replace this
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Replace this
  projectId: "YOUR_PROJECT_ID",              // Replace this
  storageBucket: "YOUR_PROJECT_ID.appspot.com",   // Replace this
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace this
  appId: "YOUR_APP_ID"                       // Replace this
};
```

#### 3.5 Configure Server-Side Firebase
1. In Firebase Console, go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Rename it to `serviceAccountKey.json`
5. Place it in `server/config/serviceAccountKey.json`

**🔒 Security Note**: Never commit `serviceAccountKey.json` to version control!

📖 **Detailed Setup Guide**: See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for step-by-step instructions with screenshots.

### Step 4: Initialize Database (Optional)

To populate sample data:

```bash
node scripts/init-db.js
```

This creates:
- Sample aptitude test questions
- Sample college data

### Step 5: Start the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:3000`

### Step 6: Open in Browser

Navigate to: **http://localhost:3000**

---

## 📁 Project Structure

```
career-guidance/
│
├── public/                          # Frontend files (client-side)
│   ├── index.html                   # Landing page
│   ├── student-signup.html          # Student registration
│   ├── student-login.html           # Student login
│   ├── admin-login.html             # Admin login
│   ├── aptitude-test.html           # Aptitude test interface
│   ├── career-selection.html        # Career recommendations
│   ├── location-selection.html      # Location filter
│   ├── college-list.html            # College search results
│   ├── college-details.html         # Individual college info
│   ├── student-details.html         # Student dashboard
│   ├── college-registration.html    # Admin: Add college
│   ├── test-completion.html         # Test results page
│   │
│   ├── css/
│   │   └── styles.css               # All styling (dark theme)
│   │
│   └── js/
│       ├── config/
│       │   └── firebase-config.js   # Firebase client config ⚙️
│       │
│       ├── pages/                   # Page-specific JavaScript
│       │   ├── admin-login.js
│       │   ├── aptitude-test.js
│       │   ├── career-selection.js
│       │   ├── college-details.js
│       │   ├── college-list.js
│       │   ├── college-registration.js
│       │   ├── location-selection.js
│       │   ├── student-details.js
│       │   ├── student-login.js
│       │   ├── student-signup.js
│       │   └── test-completion.js
│       │
│       ├── services/                # Business logic
│       │   ├── auth-service.js      # Authentication
│       │   ├── college-service.js   # College operations
│       │   └── student-service.js   # Student operations
│       │
│       └── utils/                   # Helper functions
│           ├── logger.js            # Client logging
│           └── validation.js        # Form validation
│
├── server/                          # Backend files (server-side)
│   ├── server.js                    # Main Express server
│   │
│   ├── config/
│   │   ├── firebase-admin.js        # Firebase Admin SDK setup
│   │   ├── serviceAccountKey.json   # Firebase credentials (SECRET) 🔒
│   │   └── serviceAccountKey.example.json  # Template
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── logger.js                # Request logging
│   │
│   ├── routes/
│   │   ├── auth.js                  # Auth endpoints
│   │   ├── colleges.js              # College endpoints
│   │   └── students.js              # Student endpoints
│   │
│   └── utils/
│       └── logger.js                # Server logging
│
├── scripts/
│   └── init-db.js                   # Database initialization
│
├── logs/                            # Application logs
│   ├── error.log                    # Error logs
│   └── combined.log                 # All logs
│
├── package.json                     # Dependencies & scripts
├── .gitignore                       # Git ignore rules
├── README.md                        # This file
└── FIREBASE_SETUP.md                # Detailed Firebase guide
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `public/js/config/firebase-config.js` | **⚙️ CLIENT CONFIG** - Replace with your Firebase web app config |
| `server/config/serviceAccountKey.json` | **🔒 SERVER SECRET** - Your Firebase admin credentials (DO NOT COMMIT) |
| `server/server.js` | Main Express server - handles all backend routes |
| `public/css/styles.css` | All styling - dark theme with 1600+ lines |
| `scripts/init-db.js` | Populates Firestore with sample data |

---

## 📖 Usage Guide

### For Students

#### 1. Create Account
1. Go to homepage → Click "Get Started"
2. Fill signup form with:
   - Full name
   - Email address
   - Strong password
   - Grade level
3. Click "Sign Up"

#### 2. Take Aptitude Test
1. Login with credentials
2. Click "Take Aptitude Test"
3. Answer all questions honestly
4. Submit test

#### 3. View Career Recommendations
1. After test completion, view personalized career suggestions
2. Each recommendation includes:
   - Career path description
   - Required skills
   - Relevant courses
   - Expected salary range

#### 4. Search Colleges
1. Select your preferred state/city
2. Browse college list
3. Filter by:
   - Course type
   - Location
   - College name
4. Click on any college to view detailed information

#### 5. View Your Dashboard
- Access "My Profile" to see:
  - Test results
  - Career recommendations
  - Saved colleges
  - Account information

### For Admins

#### 1. Admin Login
1. Go to `/admin-login.html`
2. Use admin credentials
3. Access admin dashboard

#### 2. Add New College
1. Click "Add College"
2. Fill in college details:
   - Name
   - Location (State/City)
   - Courses offered
   - Contact information
   - Facilities
3. Submit form

#### 3. Manage Colleges
- View all colleges
- Edit college information
- Delete colleges
- Update course offerings

---

## 🔥 Firebase Configuration

### Firestore Collections

The platform uses these Firestore collections:

#### `users` Collection
```javascript
{
  uid: "user-id",
  email: "student@example.com",
  fullName: "John Doe",
  role: "student",  // or "admin"
  grade: "12th",
  createdAt: timestamp,
  testCompleted: false
}
```

#### `colleges` Collection
```javascript
{
  id: "college-id",
  name: "College Name",
  state: "Maharashtra",
  city: "Mumbai",
  courses: ["Engineering", "Medical"],
  type: "Engineering",
  contactEmail: "info@college.edu",
  contactPhone: "+91-1234567890",
  website: "https://college.edu",
  facilities: ["Library", "Hostel", "Labs"],
  createdAt: timestamp
}
```

#### `testResults` Collection
```javascript
{
  id: "result-id",
  userId: "user-id",
  userName: "John Doe",
  answers: [...],
  score: 85,
  careerRecommendations: ["Engineering", "Technology"],
  completedAt: timestamp
}
```

#### `aptitudeTests` Collection
```javascript
{
  id: "test-id",
  questions: [
    {
      id: "q1",
      question: "What interests you most?",
      options: ["Science", "Arts", "Commerce", "Technology"],
      category: "interest"
    }
  ],
  totalQuestions: 20,
  createdAt: timestamp
}
```

### Security Rules

Update Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Colleges readable by all authenticated users
    match /colleges/{collegeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Test results accessible only to owner
    match /testResults/{resultId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Aptitude tests readable by all authenticated users
    match /aptitudeTests/{testId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new student | No |
| POST | `/api/auth/login` | Student/Admin login | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/verify` | Verify JWT token | Yes |

### Student Routes (`/api/students`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/students/:id` | Get student profile | Yes |
| PUT | `/api/students/:id` | Update student profile | Yes |
| POST | `/api/students/:id/test-result` | Save test result | Yes |
| GET | `/api/students/:id/test-results` | Get test history | Yes |

### College Routes (`/api/colleges`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/colleges` | Get all colleges | Yes |
| GET | `/api/colleges/:id` | Get college by ID | Yes |
| POST | `/api/colleges` | Add new college | Yes (Admin) |
| PUT | `/api/colleges/:id` | Update college | Yes (Admin) |
| DELETE | `/api/colleges/:id` | Delete college | Yes (Admin) |
| GET | `/api/colleges/search?state=&city=&course=` | Search colleges | Yes |

---

## 🔒 Security

### Implemented Security Measures

1. **Firebase Authentication** - Industry-standard user management
2. **JWT Tokens** - Secure session management
3. **Role-Based Access Control** - Student vs Admin permissions
4. **Firestore Security Rules** - Database-level access control
5. **Password Hashing** - Handled by Firebase Auth
6. **HTTPS Required** - In production (recommended)
7. **Input Validation** - Client and server-side validation
8. **XSS Protection** - Sanitized user inputs
9. **CORS Configuration** - Restricted cross-origin requests

### Security Best Practices

✅ **DO:**
- Keep `serviceAccountKey.json` secret and never commit it
- Use environment variables for sensitive data in production
- Enable Firebase App Check in production
- Regularly update dependencies (`npm audit fix`)
- Use strong passwords for admin accounts
- Monitor Firebase Console for suspicious activity

❌ **DON'T:**
- Share your Firebase credentials publicly
- Commit `serviceAccountKey.json` to Git
- Use weak passwords
- Disable Firestore security rules
- Expose API keys in client-side code (Firebase client keys are safe)

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. "Firebase SDK not loaded"
**Cause**: Firebase scripts not loaded or internet connection issue

**Solution:**
- Check internet connection
- Verify Firebase SDK scripts in HTML files
- Check browser console for errors

#### 2. "Permission denied" in Firestore
**Cause**: Firestore security rules blocking access

**Solution:**
- Verify user is authenticated
- Check Firestore security rules in Firebase Console
- Ensure user has correct role (student/admin)

#### 3. "Service account key not found"
**Cause**: Missing `serviceAccountKey.json` file

**Solution:**
```bash
# Check if file exists
ls server/config/serviceAccountKey.json

# If missing, download from Firebase Console
# Project Settings → Service accounts → Generate new private key
```

#### 4. Server won't start - "Port 3000 already in use"
**Cause**: Another process using port 3000

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port in server/server.js or set environment variable
set PORT=3001
npm run dev
```

#### 5. "Module not found" errors
**Cause**: Dependencies not installed

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 6. CSS not loading / Styles broken
**Cause**: Incorrect file paths or server not serving static files

**Solution:**
- Check `<link>` tag in HTML: `<link rel="stylesheet" href="/css/styles.css">`
- Verify Express static middleware in `server.js`
- Clear browser cache (Ctrl + Shift + R)

#### 7. Login not working
**Cause**: Firebase Authentication not properly configured

**Solution:**
- Verify Email/Password method is enabled in Firebase Console
- Check Firebase config in `firebase-config.js`
- Check browser console for Firebase errors
- Verify internet connection

---

## 🔧 Available Scripts

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Initialize database with sample data
node scripts/init-db.js

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🚀 Deployment

### Deploy to Production

#### Option 1: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
firebase deploy --only hosting
```

#### Option 2: Heroku

```bash
# Install Heroku CLI
# Create Procfile:
echo "web: node server/server.js" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
```

#### Option 3: Any Node.js Hosting
- Upload files to server
- Run `npm install --production`
- Set environment variables
- Start with `npm start`
- Use PM2 for process management

---

## 📝 License

This project is licensed under the **MIT License**.

```
Copyright (c) 2025 Career Guidance Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](#-troubleshooting) section
2. Review [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
3. Check Firebase Console for errors
4. Review browser console for client errors
5. Check `logs/error.log` for server errors

---

## 📊 Project Stats

- **Total Files**: 42+
- **Lines of Code**: 10,000+
- **CSS Lines**: 1,600+
- **Pages**: 11 HTML pages
- **JavaScript Modules**: 11 modules
- **API Endpoints**: 15+

---

**Made with ❤️ for students seeking career guidance**

Need help? Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed Firebase configuration steps!
