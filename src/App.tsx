import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import HeroCard from './components/dashboard/HeroCard';
import Classroom from './components/dashboard/Classroom';
import FocusMode from './components/dashboard/FocusMode';
import Login from './components/auth/Login';
import ProfileSetupForm from './components/auth/ProfileSetupForm';
import './styles/theme.css';
import './App.css';

type OnboardingStep = 'login' | 'profile_setup' | 'dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('login');
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('google_token');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setAccessToken(savedToken);
      setOnboardingStep('dashboard');
    } else {
      setOnboardingStep('login');
    }
  }, []);

  const handleLoginSuccess = async (tokenResponse: any) => {
    try {
      const token = tokenResponse.access_token;
      setAccessToken(token);
      localStorage.setItem('google_token', token);

      // Fetch user info from Google using the access token
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const decoded = await userInfoResponse.json();

      const googleInfo = {
        googleId: decoded.sub,
        googleName: decoded.name,
        googlePictureUrl: decoded.picture,
        googleEmail: decoded.email,
      };

      // Try to log in first
      try {
        const loginResponse = await fetch('http://127.0.0.1:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(googleInfo),
        });

        if (loginResponse.ok) {
          const userData = await loginResponse.json();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setOnboardingStep('dashboard');
          return;
        }
      } catch (e) {
        // Ignore error, proceed to signup
      }

      // If not found or error, proceed to signup
      setGoogleUserData(googleInfo);
      setOnboardingStep('profile_setup');
    } catch (error) {
      console.error('Error processing Google login:', error);
    }
  };

  const handleSubmitProfileData = async (profileData: any) => {
    try {
      const completeUserData = {
        ...googleUserData,
        ...profileData,
        fullName: profileData.fullName,
      };

      const response = await fetch('http://127.0.0.1:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile data');
      }

      const userDataFromAPI = await response.json();
      setUser(userDataFromAPI);
      localStorage.setItem('user', JSON.stringify(userDataFromAPI));
      setOnboardingStep('dashboard');
    } catch (error: any) {
      console.error('Profile submission error:', error);
      alert(`Error saving profile: ${error.message}. Please try again.`);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setGoogleUserData(null);
    setAccessToken(null);
    setOnboardingStep('login');
    localStorage.removeItem('user');
    localStorage.removeItem('google_token');
  };

  if (onboardingStep === 'login') {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  if (onboardingStep === 'profile_setup' && googleUserData) {
    return (
      <ProfileSetupForm
        googleId={googleUserData.googleId}
        googleName={googleUserData.googleName}
        googlePictureUrl={googleUserData.googlePictureUrl}
        googleEmail={googleUserData.googleEmail}
        onSubmitProfileData={handleSubmitProfileData}
      />
    );
  }

  if (onboardingStep === 'dashboard' && user) {
    return (
      <div className="app-container">
        <Sidebar 
          user={user} 
          onLogout={handleLogout} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <main className="main-content">
          <Navbar user={user} onLogout={handleLogout} />
          
          <div className="dashboard-content id-layout">
            {activeTab === 'dashboard' && (
              <>
                <HeroCard user={user} />
              </>
            )}
            {activeTab === 'classroom' && (
              <Classroom accessToken={accessToken} />
            )}
            {activeTab === 'focus' && (
              <FocusMode />
            )}
            {activeTab !== 'dashboard' && activeTab !== 'classroom' && activeTab !== 'focus' && (
              <div className="placeholder-view">
                <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} coming soon!</h2>
              </div>
            )}
          </div>
        </main>

        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
      </div>
    );
  }

  return <div>Loading or Error...</div>;
};

export default App;
