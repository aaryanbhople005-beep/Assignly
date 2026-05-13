import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Zap, 
  Calendar, 
  BookOpen, 
  BarChart2, 
  Settings,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  user: any;
  onLogout: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FileText, label: 'Assignments' },
  { icon: Zap, label: 'Focus Mode' },
  { icon: Calendar, label: 'Calendar' },
  { icon: BookOpen, label: 'Courses' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <aside className="sidebar glass-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">A</div>
        <span className="logo-text">Assignly</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <button 
            key={index} 
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <img src={user.picture} alt={user.name} className="avatar" />
          <div className="user-info">
            <span className="user-name">{user.given_name || user.name}</span>
            <span className="user-plan">Pro Plan</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
