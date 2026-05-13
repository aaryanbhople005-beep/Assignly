import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

interface LoginProps {
  onSuccess: (credentialResponse: any) => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  return (
    <div className="login-container">
      <div className="login-card glass-card">
        <div className="login-header">
          <div className="login-logo">A</div>
          <h1>Welcome to Assignly</h1>
          <p>Please sign in to continue</p>
        </div>
        
        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
            useOneTap
            theme="filled_black"
            shape="pill"
          />
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
