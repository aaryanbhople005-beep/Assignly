import React from 'react';
import { Search, Bell } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <nav className="navbar">
      <div className="navbar-greeting">
        <h1>{getGreeting()}, {user.given_name || user.name}</h1>
        <p>Ready to tackle your tasks today?</p>
      </div>

      <div className="navbar-actions">
        <div className="search-container glass-card">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search anything..." />
        </div>

        <button className="action-btn glass-card">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <img src={user.picture} alt={user.name} className="user-avatar-img glass-card" />
      </div>
    </nav>
  );
};

export default Navbar;
