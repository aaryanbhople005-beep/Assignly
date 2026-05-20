import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Zap, 
  Calendar, 
  BookOpen, 
  BarChart2, 
  Settings,
  LogOut,
  Palette
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    { id: 'theme', icon: Palette, label: 'Marketplace' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-72 h-screen border-r border-theme-glass bg-theme-background/20 backdrop-blur-3xl flex flex-col z-50 transition-all duration-500">
      <div className="p-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-theme-accent to-theme-primary flex items-center justify-center text-theme-background font-black text-2xl shadow-2xl shadow-theme-accent/30 ring-4 ring-theme-accent/10">
            A
          </div>
          <span className="text-3xl font-black tracking-tighter text-gradient">Assignly</span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button 
              key={item.id} 
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 relative group overflow-hidden ${
                isActive 
                ? 'text-theme-text-primary bg-theme-accent/5' 
                : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-glass/10'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebarActiveBg"
                  className="absolute inset-0 bg-gradient-to-r from-theme-accent/10 to-transparent -z-10"
                />
              )}
              <item.icon size={22} className={`transition-all duration-500 ${isActive ? 'text-theme-accent scale-110' : 'group-hover:scale-110 group-hover:text-theme-accent'}`} />
              <span className={`font-bold text-sm tracking-wide ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform duration-500`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="sidebarActiveIndicator"
                  className="absolute left-0 w-1.5 h-8 bg-theme-accent rounded-r-full shadow-[4px_0_15px_rgba(var(--theme-accent),0.5)]"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="fancy-glass p-5 flex items-center gap-4 bg-theme-accent/5 border-theme-accent/10">
          <div className="relative">
            <div className="absolute -inset-1 bg-theme-accent rounded-full blur opacity-20 animate-pulse"></div>
            <img 
              src={user.googlePictureUrl || user.picture} 
              alt={user.googleName || user.name} 
              className="w-12 h-12 rounded-full border-2 border-theme-background relative z-10" 
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-black truncate text-theme-text-primary tracking-tight">{user.googleName || user.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-accent"></span>
              <p className="text-[10px] font-black uppercase tracking-widest text-theme-accent">Elite Member</p>
            </div>
          </div>
          <button 
            className="p-3 rounded-xl hover:bg-red-500/10 text-theme-text-secondary hover:text-red-500 transition-all duration-500"
            onClick={onLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
