import React from 'react';
import { TrendingUp, CheckCircle, Clock, Award } from 'lucide-react';
import './StatsSection.css';

const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Weekly Tasks', value: '24', icon: CheckCircle, color: '#4caf50' },
    { label: 'Study Hours', value: '42h', icon: Clock, color: '#00f2fe' },
    { label: 'Current Streak', value: '15d', icon: Award, color: '#ffc107' },
    { label: 'Efficiency', value: '+12%', icon: TrendingUp, color: '#9d50bb' },
  ];

  return (
    <div className="stats-section">
      <div className="section-header">
        <h3>Productivity Stats</h3>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card glass-card">
            <div className="stat-icon-wrapper" style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="weekly-chart glass-card">
        <div className="chart-header">
          <span>Weekly Completion</span>
          <span className="chart-meta">Last 7 days</span>
        </div>
        <div className="chart-bars">
          {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
            <div key={i} className="chart-bar-wrapper">
              <div className="chart-bar" style={{ height: `${height}%` }}>
                <div className="chart-bar-glow"></div>
              </div>
              <span className="chart-day">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
