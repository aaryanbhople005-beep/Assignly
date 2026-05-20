export type ThemeTypography = {
  fontFamily: string;
  headingFont: string;
  monoFont: string;
};

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  glassBorder: string;
  shadow: string;
  glow: string;
};

export type ThemeAnimations = {
  transition: string;
  hoverScale: number;
  hoverGlow: string;
};

export type ThemePack = 
  | 'Core Premium' 
  | 'Aesthetic' 
  | 'Focus' 
  | 'Hacker' 
  | 'Futuristic' 
  | 'Scholar' 
  | 'Space' 
  | 'Nature' 
  | 'Gaming' 
  | 'Luxury';

export type VisualEffect = 'rain' | 'particles' | 'scanlines' | 'glow' | 'matrix' | 'stars' | 'none';

export interface ThemeDefinition {
  id: string;
  name: string;
  vibe: string;
  pack: ThemePack;
  colors: ThemeColors;
  typography: ThemeTypography;
  animations: ThemeAnimations;
  blur: string;
  atmosphere: string; 
  effects?: VisualEffect[];
}
