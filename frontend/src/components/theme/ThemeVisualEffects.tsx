import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../theme/ThemeContext';

const RainEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, x: Math.random() * 100 + '%' }}
          animate={{ y: '110vh' }}
          transition={{
            duration: Math.random() * 1 + 0.5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2
          }}
          className="absolute w-[1px] h-8 bg-theme-accent/50 blur-[0.5px]"
        />
      ))}
    </div>
  );
};

const ParticleEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%'
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: ['-10%', '110%']
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 10
          }}
          className="absolute w-2 h-2 bg-theme-accent rounded-full blur-md"
        />
      ))}
    </div>
  );
};

const ScanlineEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
    </div>
  );
};

const StarEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: Math.random() }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{ 
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
          }}
        />
      ))}
    </div>
  );
};

const ThemeVisualEffects: React.FC = () => {
  const { currentTheme } = useTheme();
  const effects = currentTheme.effects || [];

  return (
    <>
      <AnimatePresence>
        {effects.includes('rain') && <RainEffect />}
        {effects.includes('particles') && <ParticleEffect />}
        {effects.includes('scanlines') && <ScanlineEffect />}
        {effects.includes('stars') && <StarEffect />}
      </AnimatePresence>
    </>
  );
};

export default ThemeVisualEffects;
