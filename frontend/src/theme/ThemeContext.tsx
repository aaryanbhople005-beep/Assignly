import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeDefinition } from './types';
import { themes } from './registry';

interface ThemeContextType {
  currentTheme: ThemeDefinition;
  setTheme: (themeId: string) => void;
  availableThemes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem('assignly-theme') || 'light';
  });

  const currentTheme = themes[currentThemeId] || themes.light;

  useEffect(() => {
    localStorage.setItem('assignly-theme', currentThemeId);
    applyTheme(currentTheme);
  }, [currentThemeId]);

  const applyTheme = (theme: ThemeDefinition) => {
    const root = document.documentElement;
    
    // Set colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Set typography
    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Set animations & others
    root.style.setProperty('--theme-transition', theme.animations.transition);
    root.style.setProperty('--theme-hover-scale', theme.animations.hoverScale.toString());
    root.style.setProperty('--theme-hover-glow', theme.animations.hoverGlow);
    root.style.setProperty('--theme-blur', theme.blur);
    root.style.setProperty('--theme-atmosphere', theme.atmosphere);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        currentTheme, 
        setTheme: setCurrentThemeId, 
        availableThemes: Object.values(themes) 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
