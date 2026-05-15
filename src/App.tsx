import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import HeroCard from './components/dashboard/HeroCard';
import AssignmentSection from './components/dashboard/AssignmentSection';
import FocusCard from './components/dashboard/FocusCard';
import CourseOverview from './components/dashboard/CourseOverview';
import StatsSection from './components/dashboard/StatsSection';
import Login from './components/auth/Login';
import ProfileSetupForm from './components/auth/ProfileSetupForm';
import './styles/theme.css';
import './App.css';

type OnboardingStep = 'login' | 'profile_setup' | 'dashboard';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('login');
  const [googleUserData, setGoogleUserData] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser?.googleId) {
        setUser(parsedUser);
        setOnboardingStep('dashboard');
      } else {
        localStorage.removeItem('user');
        setUser(null);
        setOnboardingStep('login');
      }
    } else {
      setOnboardingStep('login');
    }
  }, []);

  const handleLoginSuccess = (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.googleId === decoded.sub) {
          setUser(parsedUser);
          setOnboardingStep('dashboard');
          return;
        }
      }

      setGoogleUserData({
        googleId: decoded.sub,
        googleName: decoded.name,
        googlePictureUrl: decoded.picture,
        googleEmail: decoded.email,
      });
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
    setOnboardingStep('login');
    localStorage.removeItem('user');
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
        <Sidebar user={user} onLogout={handleLogout} />
        
        <main className="main-content">
          <Navbar user={user} />
          
          <div className="dashboard-content">
            <div className="content-left">
              <HeroCard user={user} />
              <AssignmentSection />
            </div>
            
            <div className="content-right">
              <FocusCard />
              <CourseOverview />
              <StatsSection />
            </div>
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
