import React from 'react';
import './HeroCard.css';

interface HeroCardProps {
  user: any;
}

const HeroCard: React.FC<HeroCardProps> = ({ user }) => {
  return (
    <div className="hero-card">
      <div className="hero-content">
        <span className="hero-badge">Welcome Back</span>
        <h2>Hello, {user.given_name || user.name}! <br />You're on a roll.</h2>
        <p>You have 5 assignments due this week. <br />Keep up the great momentum!</p>
        
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">85%</span>
            <span className="stat-label">Completion</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-value">12</span>
            <span className="stat-label">Tasks Done</span>
          </div>
        </div>
      </div>
      
      <div className="hero-visual">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
    </div>
  );
};

export default HeroCard;
