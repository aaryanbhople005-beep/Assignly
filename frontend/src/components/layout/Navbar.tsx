import React from 'react';
import { Bell, LogOut, Search } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <nav className="h-24 px-10 flex items-center justify-between border-b border-theme-glass bg-theme-background/30 backdrop-blur-2xl sticky top-0 z-40 transition-all duration-500">
      <div className="flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-theme-text-secondary">System Online</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-black tracking-tight"
        >
          {getGreeting()}, <span className="text-gradient">{user.fullName || user.googleName || user.name}</span>
        </motion.h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Luxury Search Bar */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-theme-glass/5 border border-theme-glass rounded-2xl text-theme-text-secondary focus-within:border-theme-accent/50 focus-within:bg-theme-glass/10 transition-all duration-500 w-80 group">
          <Search size={18} className="group-focus-within:text-theme-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Command Search..." 
            className="bg-transparent border-none outline-none text-sm font-bold w-full text-theme-text-primary placeholder:text-theme-text-secondary/40"
          />
          <kbd className="text-[10px] font-black px-1.5 py-0.5 rounded border border-theme-glass bg-theme-glass/10">⌘K</kbd>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-4 rounded-2xl glass-card hover:bg-theme-glass transition-all duration-500 relative group border-theme-glass/50 hover:border-theme-accent/30">
            <Bell size={20} className="text-theme-text-secondary group-hover:text-theme-accent transition-colors" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-theme-accent rounded-full border-2 border-theme-background shadow-[0_0_10px_rgba(var(--theme-accent),0.5)]"></span>
          </button>

          <button 
            className="p-4 rounded-2xl glass-card hover:bg-theme-glass transition-all duration-500 group border-theme-glass/50 hover:border-red-500/30" 
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={20} className="text-theme-text-secondary group-hover:text-red-500 transition-colors" />
          </button>

          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="relative ml-2"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-theme-accent to-theme-primary rounded-full blur opacity-40 group-hover:opacity-100 transition-opacity"></div>
            <img 
              src={user.googlePictureUrl || user.picture} 
              alt={user.fullName || user.name} 
              className="w-12 h-12 rounded-full border-2 border-theme-background relative z-10 p-0.5 object-cover shadow-2xl" 
            />
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
