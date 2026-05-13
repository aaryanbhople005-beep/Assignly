import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import HeroCard from './components/dashboard/HeroCard';
import AssignmentSection from './components/dashboard/AssignmentSection';
import FocusCard from './components/dashboard/FocusCard';
import CourseOverview from './components/dashboard/CourseOverview';
import StatsSection from './components/dashboard/StatsSection';
import Login from './components/auth/Login';
import './styles/theme.css';
import './App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (credentialResponse: any) => {
    const token = credentialResponse.credential;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    setUser(decoded);
    localStorage.setItem('user', JSON.stringify(decoded));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

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

      {/* Background Decor */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
    </div>
  );
};

export default App;
