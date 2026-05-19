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
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'classroom', icon: BookOpen, label: 'Classroom' },
    { id: 'assignments', icon: FileText, label: 'Assignments' },
    { id: 'focus', icon: Zap, label: 'Focus Mode' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="sidebar glass-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">A</div>
        <span className="logo-text">Assignly</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button 
            key={item.id} 
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
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
