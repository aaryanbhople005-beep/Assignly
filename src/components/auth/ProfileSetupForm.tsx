import React, { useState, useEffect } from 'react';
// Import Login.css for shared styling, or create ProfileSetupForm.css if more specific styles are needed.
// Ensure your CSS supports .profile-form, .form-group, label, input, and .submit-button classes.
import './Login.css'; 

interface ProfileSetupFormProps {
  googleId: string;
  googleName: string;
  googlePictureUrl: string;
  googleEmail: string;
  onSubmitProfileData: (userData: any) => void; // userData will contain all collected fields
}

const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({
  googleId,
  googleName,
  googlePictureUrl,
  googleEmail,
  onSubmitProfileData,
}) => {
  // Initialize fullName with the name from Google, allowing it to be edited.
  const [fullName, setFullName] = useState(googleName);
  const [universityName, setUniversityName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [courseBranch, setCourseBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitProfileData({
      googleId,
      googleName,
      googlePictureUrl,
      googleEmail,
      fullName,
      universityName,
      studentEmail,
      courseBranch,
      graduationYear,
    });
  };

  // Effect to update fullName if googleName prop changes, ensuring it's always up-to-date
  // if the component re-renders with new Google auth data.
  useEffect(() => {
    setFullName(googleName);
  }, [googleName]);

  return (
    <div className="login-container"> {/* Reusing login container for layout consistency */}
      <div className="login-card glass-card"> {/* Reusing login card styling */}
        <div className="login-header"> {/* Reusing header styling */}
          <div className="login-logo">A</div> {/* Placeholder for logo */}
          <h1>Complete Your Profile</h1>
          <p>Please provide the following details to set up your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="universityName">University/College Name</label>
            <input
              type="text"
              id="universityName"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              placeholder="e.g., Example University"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="studentEmail">Student Email</label>
            <input
              type="email"
              id="studentEmail"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="e.g., student@example.edu"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="courseBranch">Course/Branch</label>
            <input
              type="text"
              id="courseBranch"
              value={courseBranch}
              onChange={(e) => setCourseBranch(e.target.value)}
              placeholder="e.g., Computer Science"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="graduationYear">Graduation Year</label>
            <input
              type="text" // Using text for flexibility (e.g., '2025', '2025-2026')
              id="graduationYear"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="e.g., 2026"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Complete Setup
          </button>
        </form>

        <div className="login-footer"> {/* Reusing login footer */}
          <p>Your academic information is handled with care.</p>
        </div>
      </div>

      {/* Background Decor */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
    </div>
  );
};

export default ProfileSetupForm;
