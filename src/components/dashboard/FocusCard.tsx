import React from 'react';
import { Play, Coffee, Zap } from 'lucide-react';
import './FocusCard.css';

const FocusCard: React.FC = () => {
  return (
    <div className="focus-card glass-card">
      <div className="focus-info">
        <div className="focus-header">
          <Zap size={20} className="focus-icon" />
          <h3>Focus Mode</h3>
        </div>
        <p>Distraction-free session for deep work.</p>
        
        <div className="timer-preview">
          <span className="timer-val">25:00</span>
          <span className="timer-label">Pomodoro</span>
        </div>
      </div>

      <div className="focus-actions">
        <button className="start-btn">
          <Play size={18} fill="currentColor" />
          Start Session
        </button>
        <button className="break-btn glass-card">
          <Coffee size={18} />
        </button>
      </div>
    </div>
  );
};

export default FocusCard;
