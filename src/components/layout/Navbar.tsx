import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <nav className="navbar">
      <div className="navbar-greeting">
        <h1>{getGreeting()}, {user.fullName || user.googleName}</h1>
        <p>Ready to tackle your tasks today?</p>
      </div>

      <div className="navbar-actions">
        <button className="action-btn glass-card">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <button 
          className="action-btn glass-card logout-action-btn" 
          onClick={onLogout}
          title="Logout"
        >
          <LogOut size={20} />
        </button>

        <img 
          src={user.googlePictureUrl} 
          alt={user.fullName} 
          className="user-avatar-img glass-card" 
        />
      </div>
    </nav>
  );
};

export default Navbar;
