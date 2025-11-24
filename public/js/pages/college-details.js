/**
 * College Details Page
 */

import AuthService from '../services/auth-service.js';
import CollegeService from '../services/college-service.js';
import Logger from '../utils/logger.js';

document.addEventListener('DOMContentLoaded', () => {
  Logger.logPageView('College Details');

  const userNameElement = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');
  const loadingElement = document.getElementById('loading');
  const errorMessage = document.getElementById('error-message');
  const collegeDetails = document.getElementById('college-details');
  const backBtn = document.getElementById('back-btn');
  const applyBtn = document.getElementById('apply-btn');

  let selectedCollege = null;

  // Check authentication
  AuthService.onAuthStateChanged(async user => {
    if (!user) {
      window.location.href = '/student-login.html';
      return;
    }
    userNameElement.textContent = user.displayName || user.email;

    await loadCollegeDetails();
  });

  // Handle logout
  logoutBtn.addEventListener('click', async () => {
    try {
      await AuthService.logout();
      window.location.href = '/index.html';
    } catch (error) {
      Logger.error('Logout failed', { error: error.message });
      alert('Failed to logout. Please try again.');
    }
  });

  async function loadCollegeDetails() {
    const collegeId = localStorage.getItem('selectedCollegeId');

    if (!collegeId) {
      window.location.href = '/college-list.html';
      return;
    }

    try {
      selectedCollege = await CollegeService.getCollegeById(collegeId);

      displayCollege(selectedCollege);
      loadingElement.style.display = 'none';
      collegeDetails.style.display = 'block';

      Logger.info('College details loaded', { collegeId });
    } catch (error) {
      Logger.error('Failed to load college details', { error: error.message });
      errorMessage.textContent = 'Failed to load college details';
      errorMessage.style.display = 'block';
      loadingElement.style.display = 'none';
    }
  }

  function displayCollege(college) {
    collegeDetails.innerHTML = `
      <div class="details-grid">
        <div class="details-main">
          <h2>${college.name}</h2>
          
          <!-- Key Information Highlight -->
          <div class="highlight-box">
            <h3 style="margin-top: 0;">Quick Information</h3>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-value">₹${college.fees?.toLocaleString() || 'N/A'}</div>
                <div class="stat-label">Annual Fees</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">#${college.ranking || 'N/A'}</div>
                <div class="stat-label">Ranking</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${college.city || college.location}</div>
                <div class="stat-label">Location</div>
              </div>
            </div>
          </div>

          <!-- About Section -->
          <div class="info-section">
            <h3>📖 About ${college.name}</h3>
            <p>${college.description || 'This is a premier educational institution offering world-class education and facilities with a focus on academic excellence and holistic development.'}</p>
          </div>

          <!-- Tuition & Housing -->
          <div class="info-section">
            <h3>💰 Tuition & Housing</h3>
            <div class="feature-list">
              <div class="feature-item">
                <h4>Annual Tuition</h4>
                <div class="feature-value">₹${college.fees?.toLocaleString() || 'N/A'}</div>
                <p>Per academic year</p>
              </div>
              <div class="feature-item">
                <h4>Hostel Fees</h4>
                <div class="feature-value">₹${college.hostelFees?.toLocaleString() || '80,000'}</div>
                <p>Accommodation & meals included</p>
              </div>
              <div class="feature-item">
                <h4>Security Deposit</h4>
                <div class="feature-value">₹${college.securityDeposit?.toLocaleString() || '25,000'}</div>
                <p>Refundable at course completion</p>
              </div>
            </div>
          </div>

          <!-- Eligibility Requirements -->
          <div class="eligibility-section">
            <h4>📋 Eligibility Requirements</h4>
            <div class="eligibility-grid">
              <div class="eligibility-item">
                <h5>Academic Requirement</h5>
                <div class="requirement"><strong>Minimum Percentage:</strong> ${college.eligibility?.minPercentage || '60%'}</div>
                <div class="requirement"><strong>Minimum CGPA:</strong> ${college.eligibility?.minCGPA || '6.0'}/10</div>
              </div>
              <div class="eligibility-item">
                <h5>Education Background</h5>
                <div class="requirement"><strong>Qualification:</strong> ${college.eligibility?.qualification || '12th Pass (Science/Commerce)'}</div>
                <div class="requirement"><strong>Required Subjects:</strong> ${college.eligibility?.subjects || 'Math, Physics, Chemistry'}</div>
              </div>
              <div class="eligibility-item">
                <h5>Age Criteria</h5>
                <div class="requirement"><strong>Min Age:</strong> ${college.eligibility?.minAge || '17 years'}</div>
                <div class="requirement"><strong>Max Age:</strong> ${college.eligibility?.maxAge || 'No limit'}</div>
              </div>
            </div>
          </div>

          <!-- Entrance Exam Details -->
          <div class="exam-details">
            <h4>📝 Entrance Exam Requirements</h4>
            <div class="exam-grid">
              <div class="exam-card">
                <div class="exam-name">${college.entranceExam?.name || 'JEE Mains'}</div>
                <div class="exam-info"><strong>Conducted by:</strong> ${college.entranceExam?.conductedBy || 'NTA'}</div>
                <div class="exam-info"><strong>Frequency:</strong> ${college.entranceExam?.frequency || 'Twice a year'}</div>
                <div class="cutoff-score">Cutoff: ${college.entranceExam?.cutoff || '85+ percentile'}</div>
              </div>
              ${college.alternateExams ? college.alternateExams.map(exam => `
                <div class="exam-card">
                  <div class="exam-name">${exam.name}</div>
                  <div class="exam-info"><strong>Conducted by:</strong> ${exam.conductedBy}</div>
                  <div class="cutoff-score">Cutoff: ${exam.cutoff}</div>
                </div>
              `).join('') : `
                <div class="exam-card">
                  <div class="exam-name">State CET</div>
                  <div class="exam-info"><strong>Conducted by:</strong> State Govt.</div>
                  <div class="cutoff-score">Cutoff: 70+ percentile</div>
                </div>
              `}
            </div>
          </div>

          <!-- Courses Offered -->
          <div class="info-section">
            <h3>🎓 Courses Offered</h3>
            <div class="facilities-grid">
              ${(college.courses || ['Computer Science & Engineering', 'Mechanical Engineering', 'Electronics & Communication', 'Civil Engineering']).map(course => 
                `<div class="facility-item"><strong>${course}</strong></div>`
              ).join('')}
            </div>
          </div>

          <!-- Campus Placements -->
          <div class="info-section">
            <h3>🏢 Campus Placement Statistics</h3>
            <div class="placement-stats">
              <div class="placement-stat">
                <div class="stat-percentage">${college.placementRate || '92%'}</div>
                <div class="stat-label">Placement Rate</div>
              </div>
              <div class="placement-stat">
                <div class="stat-value">₹${college.avgPackage || '7.5 LPA'}</div>
                <div class="stat-label">Average Package</div>
              </div>
              <div class="placement-stat">
                <div class="stat-value">₹${college.highestPackage || '45 LPA'}</div>
                <div class="stat-label">Highest Package</div>
              </div>
              <div class="placement-stat">
                <div class="stat-value">${college.companiesVisited || '150+'}</div>
                <div class="stat-label">Companies Visited</div>
              </div>
            </div>
            <div class="feature-list" style="margin-top: 1.5rem;">
              <div class="feature-item">
                <h4>Top Recruiters</h4>
                <p>${(college.recruiters || ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro']).join(', ')}</p>
              </div>
              <div class="feature-item">
                <h4>Placement Support</h4>
                <p>Dedicated placement cell, resume building, interview preparation, career counseling</p>
              </div>
            </div>
          </div>

          <!-- Facilities -->
          <div class="info-section">
            <h3>🏫 Campus Facilities</h3>
            <div class="facilities-grid">
              ${(college.facilities || [
                '🔬 Modern Laboratories',
                '📚 Digital Library',
                '💻 Computer Centers',
                '🏃 Sports Complex',
                '🏠 Hostel (Boys & Girls)',
                '🍽️ Cafeteria',
                '🚑 Medical Center',
                '📡 WiFi Campus',
                '🚌 Transport',
                '🎭 Auditorium',
                '🏋️ Gymnasium',
                '☕ Food Courts'
              ]).map(facility => 
                `<div class="facility-item">${facility}</div>`
              ).join('')}
            </div>
          </div>

          <!-- Scholarships -->
          <div class="info-section">
            <h3>🎖️ Scholarship Schemes</h3>
            <div class="feature-list">
              <div class="feature-item">
                <h4>Merit Scholarship</h4>
                <div class="feature-value">Up to 50%</div>
                <p>For students scoring above 90% in qualifying exam</p>
              </div>
              <div class="feature-item">
                <h4>Need-Based Aid</h4>
                <div class="feature-value">₹50,000/year</div>
                <p>For economically disadvantaged students</p>
              </div>
              <div class="feature-item">
                <h4>Sports Quota</h4>
                <div class="feature-value">25% Fee Waiver</div>
                <p>For state/national level athletes</p>
              </div>
              <div class="feature-item">
                <h4>Girl Child Scholarship</h4>
                <div class="feature-value">₹30,000/year</div>
                <p>Encouraging female education</p>
              </div>
            </div>
          </div>

          <!-- Support Services -->
          <div class="info-section">
            <h3>🤝 Campus Support Services</h3>
            <div class="services-grid">
              <div class="service-card">
                <h4>📖 Academic Support</h4>
                <ul>
                  <li>Peer tutoring programs</li>
                  <li>Extra classes for weak students</li>
                  <li>Study groups and workshops</li>
                  <li>Faculty office hours</li>
                </ul>
              </div>
              <div class="service-card">
                <h4>💼 Career Counseling</h4>
                <ul>
                  <li>One-on-one career guidance</li>
                  <li>Resume and CV building</li>
                  <li>Mock interviews</li>
                  <li>Industry mentorship</li>
                </ul>
              </div>
              <div class="service-card">
                <h4>🧠 Mental Health</h4>
                <ul>
                  <li>Professional counselors</li>
                  <li>Stress management workshops</li>
                  <li>Peer support groups</li>
                  <li>24/7 helpline</li>
                </ul>
              </div>
              <div class="service-card">
                <h4>🌐 Student Activities</h4>
                <ul>
                  <li>Technical clubs and societies</li>
                  <li>Cultural events</li>
                  <li>Sports tournaments</li>
                  <li>Community service programs</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Technical Expertise -->
          <div class="expertise-section">
            <h4>💡 Technical Expertise & Focus Areas</h4>
            <div class="expertise-tags">
              ${(college.expertise || ['AI & Machine Learning', 'Cloud Computing', 'IoT', 'Blockchain', 'Cybersecurity', 'Data Science', 'Robotics', 'Full Stack Development']).map(tech => 
                `<span class="expertise-tag">${tech}</span>`
              ).join('')}
            </div>
          </div>

          <!-- Rules & Regulations -->
          <div class="rules-section">
            <h4>⚠️ Important Rules & Regulations</h4>
            <ul class="rules-list">
              <li><strong>Attendance:</strong> Minimum 75% attendance required in each subject</li>
              <li><strong>Dress Code:</strong> Formal attire mandatory on campus (Monday-Friday)</li>
              <li><strong>ID Cards:</strong> Students must carry college ID at all times</li>
              <li><strong>Hostel Curfew:</strong> 10:00 PM on weekdays, 11:00 PM on weekends</li>
              <li><strong>Anti-Ragging:</strong> Zero tolerance policy, strict action against violators</li>
              <li><strong>Electronic Devices:</strong> Mobile phones not allowed in classrooms/exams</li>
              <li><strong>Library:</strong> Books must be returned within 15 days, fine for late returns</li>
              <li><strong>Examinations:</strong> Malpractice results in immediate disqualification</li>
            </ul>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="details-sidebar">
          <div class="details-card">
            <h4>📍 Contact Information</h4>
            <p><strong>Address:</strong><br>${college.address || 'Main Campus Road, ' + (college.city || 'City Name')}</p>
            <p><strong>Phone:</strong> ${college.phone || 'Not available'}</p>
            <p><strong>Email:</strong> ${college.email || 'admissions@college.edu.in'}</p>
            <p><strong>Website:</strong> ${college.website || 'www.college.edu.in'}</p>
          </div>

          <div class="details-card">
            <h4>🗓️ Important Dates</h4>
            <p><strong>Application Start:</strong> ${college.dates?.applicationStart || 'April 1, 2024'}</p>
            <p><strong>Application End:</strong> ${college.dates?.applicationEnd || 'June 30, 2024'}</p>
            <p><strong>Entrance Exam:</strong> ${college.dates?.entranceExam || 'July 15-20, 2024'}</p>
            <p><strong>Session Starts:</strong> ${college.dates?.sessionStart || 'August 1, 2024'}</p>
          </div>

          <div class="details-card">
            <h4>🔗 Quick Links</h4>
            <ul>
              <li><a href="${college.links?.prospectus || '#'}" target="_blank">Download Prospectus</a></li>
              <li><a href="${college.links?.application || '#'}" target="_blank">Online Application</a></li>
              <li><a href="${college.links?.syllabus || '#'}" target="_blank">Course Syllabus</a></li>
              <li><a href="${college.links?.gallery || '#'}" target="_blank">Campus Gallery</a></li>
            </ul>
          </div>

          <div class="details-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h4 style="color: white;">✨ Why Choose Us?</h4>
            <ul style="color: white;">
              <li>NAAC A+ Accredited</li>
              <li>Industry Partnerships</li>
              <li>Modern Infrastructure</li>
              <li>Experienced Faculty</li>
              <li>100% Placement Support</li>
              <li>International Exposure</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  applyBtn.addEventListener('click', () => {
    Logger.logUserAction('apply_to_college', { collegeId: selectedCollege.id });
    window.location.href = '/college-registration.html';
  });

  backBtn.addEventListener('click', () => {
    window.location.href = '/college-list.html';
  });

  logoutBtn.addEventListener('click', async () => {
    await AuthService.logout();
    window.location.href = '/index.html';
  });
});
