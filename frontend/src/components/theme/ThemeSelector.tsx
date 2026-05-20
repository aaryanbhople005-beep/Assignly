import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../theme/ThemeContext';
import type { ThemeDefinition, ThemePack } from '../../theme/types';
import { Check, Sparkles, Palette, Zap, Book, Shield, Ghost } from 'lucide-react';

const ThemeCard: React.FC<{ 
  theme: ThemeDefinition; 
  isActive: boolean; 
  onSelect: () => void 
}> = ({ theme, isActive, onSelect }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'appleGlass': return <Shield className="w-5 h-5" />;
      case 'cyberpunk': return <Zap className="w-5 h-5" />;
      case 'darkAcademia': return <Book className="w-5 h-5" />;
      case 'animeNeon': return <Sparkles className="w-5 h-5" />;
      case 'hackerGreen': return <Ghost className="w-5 h-5" />;
      case 'minimalWhite': return <Palette className="w-5 h-5" />;
      default: return <Palette className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative group cursor-pointer overflow-hidden rounded-3xl p-6 h-64 flex flex-col justify-between border-2 transition-all duration-500 ${
        isActive ? 'border-theme-accent shadow-2xl' : 'border-theme-glass hover:border-theme-accent/50'
      }`}
      style={{ 
        background: theme.colors.background,
        boxShadow: isActive ? theme.colors.glow : 'none'
      }}
    >
      {/* Background Decor */}
      <div 
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: theme.atmosphere }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div 
            className="p-3 rounded-2xl"
            style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.glassBorder}` }}
          >
            <span style={{ color: theme.colors.accent }}>
              {getIcon(theme.id)}
            </span>
          </div>
          {isActive && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-theme-accent p-1.5 rounded-full text-theme-background"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="text-xl font-bold" style={{ color: theme.colors.textPrimary }}>
            {theme.name}
          </h3>
          <p className="text-sm mt-1 line-clamp-2" style={{ color: theme.colors.textSecondary }}>
            {theme.vibe}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex gap-2">
        {Object.values(theme.colors).slice(0, 4).map((color, i) => (
          <div 
            key={i}
            className="w-6 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Selected Indicator Glow */}
      {isActive && (
        <motion.div 
          layoutId="activeGlow"
          className="absolute inset-0 z-0 opacity-10"
          style={{ backgroundColor: theme.colors.accent, filter: 'blur(40px)' }}
        />
      )}
    </motion.div>
  );
};

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [activePack, setActivePack] = React.useState<ThemePack | 'All'>('Core Premium');

  const packs: (ThemePack | 'All')[] = [
    'All',
    'Core Premium',
    'Aesthetic',
    'Focus',
    'Hacker',
    'Futuristic',
    'Scholar',
    'Space',
    'Nature',
    'Gaming',
    'Luxury'
  ];

  const filteredThemes = activePack === 'All' 
    ? availableThemes 
    : availableThemes.filter(t => t.pack === activePack);

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-theme-accent/10 border border-theme-accent/20 w-fit"
          >
            <Sparkles className="w-4 h-4 text-theme-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-accent">Identity System</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            The <span className="text-gradient">Marketplace</span>
          </motion.h1>
        </div>

        {/* Pack Selector */}
        <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto no-scrollbar max-w-full">
          {packs.map((pack) => (
            <button
              key={pack}
              onClick={() => setActivePack(pack)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                activePack === pack 
                ? 'bg-theme-accent text-theme-background shadow-lg shadow-theme-accent/20' 
                : 'bg-theme-glass/5 text-theme-text-secondary hover:bg-theme-glass/10 border border-theme-glass/20'
              }`}
            >
              {pack}
            </button>
          ))}
        </div>
      </header>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
            >
              <ThemeCard 
                theme={theme} 
                isActive={currentTheme.id === theme.id}
                onSelect={() => setTheme(theme.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Luxury Preview Section */}
      <motion.section 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="fancy-glass p-12 md:p-20 relative overflow-hidden group"
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
              Cinematic <br />
              <span className="text-gradient">Immersion</span>
            </h2>
            <p className="text-theme-text-secondary text-lg font-medium leading-relaxed max-w-lg">
              Experience the <span className="text-theme-text-primary font-bold italic">{currentTheme.name}</span> protocol. 
              Our engine dynamically recomputes lighting, blur depth, and motion curves to match your selected identity.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <button className="premium-button group scale-110">
                <Zap className="w-5 h-5" /> Activate Protocol
              </button>
              <button className="px-8 py-4 rounded-2xl border-2 border-theme-glass hover:bg-theme-glass transition-all duration-500 font-bold hover:scale-105">
                Explore Core
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-xl">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-theme-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="fancy-glass p-8 space-y-8 rotate-2 group-hover:rotate-0 transition-all duration-700 scale-105 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-theme-accent/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-theme-accent/20 flex items-center justify-center text-theme-accent border border-theme-accent/30">
                      <Check className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="h-5 w-40 bg-theme-text-primary/10 rounded-full mb-3"></div>
                      <div className="h-4 w-28 bg-theme-text-secondary/10 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-theme-glass/20 border border-theme-glass"></div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="h-4 w-full bg-theme-text-secondary/5 rounded-full"></div>
                  <div className="h-4 w-full bg-theme-text-secondary/5 rounded-full"></div>
                  <div className="h-4 w-4/5 bg-theme-text-secondary/5 rounded-full"></div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 rounded-2xl bg-theme-accent/5 border border-theme-glass"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-accent/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-theme-primary/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </motion.section>
    </div>
  );
};

export default ThemeSelector;
