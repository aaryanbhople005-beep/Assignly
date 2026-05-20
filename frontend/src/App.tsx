import React, { useState, useEffect } from 'react';
import { API_URL } from './config/api';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import HeroCard from './components/dashboard/HeroCard';
import Classroom from './components/dashboard/Classroom';
import FocusMode from './components/dashboard/FocusMode';
import CalendarView from './components/dashboard/Calendar';
import Login from './components/auth/Login';
import ProfileSetupForm from './components/auth/ProfileSetupForm';
import ThemeSelector from './components/theme/ThemeSelector';
import ThemeVisualEffects from './components/theme/ThemeVisualEffects';
import { ThemeProvider } from './theme/ThemeContext';
import './index.css';

type OnboardingStep = 'login' | 'profile_setup' | 'dashboard';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('login');
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handleLogout = () => {
    setUser(null);
    setGoogleUserData(null);
    setAccessToken(null);
    setOnboardingStep('login');
    localStorage.removeItem('user');
    localStorage.removeItem('google_token');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('google_token');
    
    // Sanitize token: if it's "undefined" or "null" strings, treat as null
    const effectiveToken = (savedToken === 'undefined' || savedToken === 'null') ? null : savedToken;

    if (savedUser && effectiveToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setAccessToken(effectiveToken);
      setOnboardingStep('dashboard');
    } else {
      // If user is saved but token is missing, force re-login
      if (savedUser) handleLogout();
    }
  }, []);

  const handleLoginSuccess = async (tokenResponse: any) => {
    try {
      const token = tokenResponse.access_token;
      setAccessToken(token);
      localStorage.setItem('google_token', token);

      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!userInfoResponse.ok) throw new Error('Failed to fetch Google user info');
      const decoded = await userInfoResponse.json();

      const googleInfo = {
        googleId: decoded.sub,
        googleName: decoded.name,
        googlePictureUrl: decoded.picture,
        googleEmail: decoded.email,
      };

      try {
        const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
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
      } catch (error) {
        console.error("Login API failure:", error);
      }

      setGoogleUserData(googleInfo);
      setOnboardingStep('profile_setup');
    } catch (error) {
      console.error('Google Auth Error:', error);
      alert('Authentication failed. Please check your connection.');
    }
  };

  const handleSubmitProfileData = async (profileData: any) => {
    try {
      const completeUserData = {
        ...googleUserData,
        ...profileData,
        fullName: profileData.fullName,
      };

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }

      const userDataFromAPI = await response.json();
      setUser(userDataFromAPI);
      localStorage.setItem('user', JSON.stringify(userDataFromAPI));
      setOnboardingStep('dashboard');
    } catch (error: any) {
      console.error('Profile API Error:', error);
      alert(`Error saving profile: ${error.message || 'Network unreachable'}`);
    }
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
      <div className="flex min-h-screen bg-theme-background theme-transition overflow-hidden">
        <ThemeVisualEffects />
        <Sidebar 
          user={user} 
          onLogout={handleLogout} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
          <Navbar user={user} onLogout={handleLogout} />
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {activeTab === 'dashboard' && (
              <div className="max-w-7xl mx-auto">
                <HeroCard user={user} />
              </div>
            )}
            {activeTab === 'classroom' && (
              <Classroom accessToken={accessToken} onReauthenticate={handleLogout} />
            )}
            {activeTab === 'calendar' && (
              <CalendarView accessToken={accessToken} onReauthenticate={handleLogout} />
            )}
            {activeTab === 'focus' && (
              <FocusMode />
            )}
            {activeTab === 'theme' && (
              <ThemeSelector />
            )}
            {['dashboard', 'classroom', 'focus', 'theme'].indexOf(activeTab) === -1 && (
              <div className="flex items-center justify-center h-full">
                <h2 className="text-2xl font-semibold text-theme-text-secondary">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} coming soon!
                </h2>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return <div className="flex items-center justify-center h-screen bg-theme-background text-theme-text-primary">Loading...</div>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
