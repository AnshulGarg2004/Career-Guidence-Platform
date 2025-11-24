/**
 * Database Initialization Script
 * Run this script to populate the database with sample data
 * Usage: node scripts/init-db.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../server/config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample Colleges Data
const sampleColleges = [
  {
    name: 'Indian Institute of Technology Delhi',
    location: 'INDIA',
    city: 'New Delhi',
    fees: 200000,
    ranking: 1,
    courses: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'],
    facilities: ['Modern Library', 'Research Labs', 'Sports Complex', 'Hostel', 'Cafeteria'],
    description: 'IIT Delhi is one of the premier engineering institutions in India.',
    avgPackage: '₹16 LPA',
    highestPackage: '₹1.2 Crore',
    recruiters: ['Google', 'Microsoft', 'Amazon', 'Adobe'],
    eligibility: {
      minCGPA: 7.5,
      requiredExam: 'JEE Advanced',
      minScore: '100/360'
    }
  },
  {
    name: 'Indian Institute of Technology Bombay',
    location: 'INDIA',
    city: 'Mumbai',
    fees: 210000,
    ranking: 2,
    courses: ['Computer Science', 'Aerospace Engineering', 'Chemical Engineering', 'Metallurgical Engineering'],
    facilities: ['State-of-art Labs', 'Library', 'Sports Facilities', 'Hostels', 'Medical Center'],
    description: 'IIT Bombay is known for its world-class education and research.',
    avgPackage: '₹18 LPA',
    highestPackage: '₹1.8 Crore',
    recruiters: ['Goldman Sachs', 'McKinsey', 'BCG', 'Google'],
    eligibility: {
      minCGPA: 7.5,
      requiredExam: 'JEE Advanced',
      minScore: '95/360'
    }
  },
  {
    name: 'Massachusetts Institute of Technology',
    location: 'ABROAD',
    city: 'Cambridge, USA',
    fees: 5000000,
    ranking: 1,
    courses: ['Computer Science', 'Artificial Intelligence', 'Robotics', 'Aerospace Engineering'],
    facilities: ['World-class Research Labs', 'Innovation Centers', 'Sports Complex', 'Student Housing'],
    description: 'MIT is a world-renowned institution for science and technology.',
    avgPackage: '$120,000',
    highestPackage: '$200,000',
    recruiters: ['Apple', 'Tesla', 'SpaceX', 'Amazon'],
    eligibility: {
      minCGPA: 9.0,
      requiredExam: 'SAT/ACT',
      minScore: '1500/1600'
    }
  },
  {
    name: 'BITS Pilani',
    location: 'INDIA',
    city: 'Pilani, Rajasthan',
    fees: 450000,
    ranking: 8,
    courses: ['Computer Science', 'Electronics', 'Mechanical', 'Chemical Engineering'],
    facilities: ['Modern Campus', 'Labs', 'Library', 'Sports', 'Hostels'],
    description: 'BITS Pilani is one of India\'s leading private engineering institutions.',
    avgPackage: '₹12 LPA',
    highestPackage: '₹60 LPA',
    recruiters: ['Microsoft', 'Amazon', 'Flipkart', 'Cisco'],
    eligibility: {
      minCGPA: 7.0,
      requiredExam: 'BITSAT',
      minScore: '280/390'
    }
  },
  {
    name: 'National Institute of Technology Trichy',
    location: 'INDIA',
    city: 'Tiruchirappalli',
    fees: 150000,
    ranking: 10,
    courses: ['Computer Science', 'Electronics', 'Mechanical', 'Production Engineering'],
    facilities: ['Central Library', 'Computer Center', 'Sports Complex', 'Hostels'],
    description: 'NIT Trichy is a premier technical institution in South India.',
    avgPackage: '₹10 LPA',
    highestPackage: '₹40 LPA',
    recruiters: ['TCS', 'Infosys', 'Cognizant', 'Wipro'],
    eligibility: {
      minCGPA: 6.5,
      requiredExam: 'JEE Main',
      minScore: '95 Percentile'
    }
  }
];

// Sample Aptitude Test
const sampleTest = {
  title: 'General Aptitude Test',
  description: 'This test evaluates your verbal, quantitative, and general knowledge skills',
  duration: 60,
  questions: [
    // Verbal Section
    {
      question: 'Choose the synonym of "Eloquent":',
      options: ['Silent', 'Articulate', 'Confused', 'Boring'],
      correctAnswer: 1,
      section: 'verbal'
    },
    {
      question: 'Fill in the blank: She was _____ by the news.',
      options: ['Shocked', 'Shocking', 'Shock', 'Shockingly'],
      correctAnswer: 0,
      section: 'verbal'
    },
    {
      question: 'Choose the antonym of "Abundance":',
      options: ['Plenty', 'Scarcity', 'Wealth', 'Prosperity'],
      correctAnswer: 1,
      section: 'verbal'
    },
    {
      question: 'Identify the correctly spelled word:',
      options: ['Occassion', 'Occasion', 'Ocasion', 'Occassion'],
      correctAnswer: 1,
      section: 'verbal'
    },
    {
      question: 'What is the meaning of "Ephemeral"?',
      options: ['Permanent', 'Temporary', 'Eternal', 'Ancient'],
      correctAnswer: 1,
      section: 'verbal'
    },
    
    // Quantitative Section
    {
      question: 'If 2x + 5 = 15, what is x?',
      options: ['5', '10', '7.5', '2.5'],
      correctAnswer: 0,
      section: 'quantitative'
    },
    {
      question: 'What is 15% of 200?',
      options: ['20', '25', '30', '35'],
      correctAnswer: 2,
      section: 'quantitative'
    },
    {
      question: 'If a train travels 120 km in 2 hours, what is its speed?',
      options: ['40 km/h', '50 km/h', '60 km/h', '70 km/h'],
      correctAnswer: 2,
      section: 'quantitative'
    },
    {
      question: 'What is the next number in the sequence: 2, 4, 8, 16, ?',
      options: ['20', '24', '32', '64'],
      correctAnswer: 2,
      section: 'quantitative'
    },
    {
      question: 'If the area of a square is 64 sq cm, what is its side length?',
      options: ['6 cm', '8 cm', '10 cm', '12 cm'],
      correctAnswer: 1,
      section: 'quantitative'
    },
    
    // General Knowledge Section
    {
      question: 'Who is known as the Father of Computers?',
      options: ['Charles Babbage', 'Alan Turing', 'Bill Gates', 'Steve Jobs'],
      correctAnswer: 0,
      section: 'generalKnowledge'
    },
    {
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
      correctAnswer: 2,
      section: 'generalKnowledge'
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
      section: 'generalKnowledge'
    },
    {
      question: 'Who wrote "Romeo and Juliet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
      correctAnswer: 1,
      section: 'generalKnowledge'
    },
    {
      question: 'What is the chemical symbol for Gold?',
      options: ['Go', 'Gd', 'Au', 'Ag'],
      correctAnswer: 2,
      section: 'generalKnowledge'
    }
  ]
};

async function initializeDatabase() {
  console.log('🚀 Starting database initialization...\n');

  try {
    // Add colleges
    console.log('📚 Adding sample colleges...');
    for (const college of sampleColleges) {
      const docRef = await db.collection('colleges').add({
        ...college,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`✓ Added: ${college.name} (ID: ${docRef.id})`);
    }

    // Add aptitude test
    console.log('\n📝 Adding sample aptitude test...');
    await db.collection('aptitudeTests').doc('default').set(sampleTest);
    console.log('✓ Added default aptitude test');

    console.log('\n✅ Database initialization completed successfully!');
    console.log('\nSummary:');
    console.log(`- Colleges added: ${sampleColleges.length}`);
    console.log(`- Test questions: ${sampleTest.questions.length}`);
    console.log('\n💡 Next steps:');
    console.log('1. Start the server: npm start');
    console.log('2. Create admin user: POST to /api/auth/create-admin');
    console.log('3. Open http://localhost:3000 in your browser\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    process.exit(0);
  }
}

// Run initialization
initializeDatabase();
