import type { ThemeDefinition } from './types';

export const lightTheme: ThemeDefinition = {
  id: 'light',
  name: 'Light Mode',
  pack: 'Core',
  vibe: 'Clean and bright.',
  colors: {
    primary: '#007AFF',
    secondary: '#ffffff',
    accent: '#5856D6',
    background: '#fbfbfd',
    cardBg: 'rgba(255, 255, 255, 0.4)',
    textPrimary: '#1d1d1f',
    textSecondary: '#86868b',
    border: 'rgba(0, 0, 0, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.6)',
    shadow: '0 20px 80px rgba(0,0,0,0.05)',
    glow: '0 0 40px rgba(88, 86, 214, 0.15)',
  },
  typography: {
    fontFamily: '"SF Pro Text", "Plus Jakarta Sans", sans-serif',
    headingFont: '"SF Pro Display", "Outfit", sans-serif',
    monoFont: '"SF Mono", "JetBrains Mono", monospace',
  },
  animations: {
    transition: 'all 0.3s ease',
    hoverScale: 1.02,
    hoverGlow: '0 10px 30px rgba(88, 86, 214, 0.2)',
  },
  blur: '32px',
  atmosphere: '#fbfbfd',
};

export const darkTheme: ThemeDefinition = {
  id: 'dark',
  name: 'Dark Mode',
  pack: 'Core',
  vibe: 'Sleek and immersive.',
  colors: {
    primary: '#ffffff',
    secondary: '#111111',
    accent: '#3b82f6',
    background: '#000000',
    cardBg: 'rgba(20, 20, 20, 0.5)',
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    border: '#27272a',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    shadow: '0 0 0 1px rgba(255,255,255,0.05)',
    glow: '0 0 30px rgba(59, 130, 246, 0.2)',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    headingFont: '"Outfit", sans-serif',
    monoFont: '"JetBrains Mono", monospace',
  },
  animations: {
    transition: 'all 0.3s ease',
    hoverScale: 1.02,
    hoverGlow: '0 0 20px rgba(59, 130, 246, 0.4)',
  },
  blur: '16px',
  atmosphere: '#000000',
};

export const themes: Record<string, ThemeDefinition> = {
  light: lightTheme,
  dark: darkTheme,
};
