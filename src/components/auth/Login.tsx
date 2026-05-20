import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import './Login.css';

interface LoginProps {
  onSuccess: (tokenResponse: any) => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      onSuccess(tokenResponse);
    },
    scope: 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.announcements.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.topics.readonly https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly',
  });

  return (
    <div className="login-container">
      <div className="login-card glass-card">
        <div className="login-header">
          <div className="login-logo">A</div>
          <h1>Welcome to Assignly</h1>
          <p>Sign in to sync your Google Classroom assignments</p>
        </div>
        
        <div className="google-btn-wrapper">
          <button className="custom-google-btn" onClick={() => login()}>
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
            Sign in with Google
          </button>
        </div>

        <div className="login-footer">
          <p>By signing in, you agree to our Terms and Privacy Policy</p>
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
    </div>
  );
};

export default Login;
