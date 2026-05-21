import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../theme/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const isDark = currentTheme.id === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-theme-cardBg border border-theme-glassBorder">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-theme-textPrimary">Appearance</h3>
        <p className="text-sm text-theme-textSecondary">
          Select your preferred theme mode.
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="flex items-center gap-3 px-6 py-3 rounded-full bg-theme-background border border-theme-border shadow-sm transition-all hover:border-theme-accent"
      >
        {isDark ? (
          <>
            <Moon className="w-5 h-5 text-theme-accent" />
            <span className="font-bold text-theme-textPrimary">Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-5 h-5 text-theme-accent" />
            <span className="font-bold text-theme-textPrimary">Light</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ThemeSelector;
