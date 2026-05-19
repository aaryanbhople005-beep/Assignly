import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap, Brain } from 'lucide-react';
import './FocusMode.css';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';

const DURATIONS: Record<Mode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const FocusMode: React.FC = () => {
  const [mode, setMode] = useState<Mode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.pomodoro);
  const [isActive, setIsActive] = useState(false);
  const [particles, setParticles] = useState<{ id: number; left: string; size: number; duration: number; delay: number }[]>([]);

  // Generate ambient particles
  useEffect(() => {
    const p = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
    }));
    setParticles(p);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a subtle chime or notification here
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleToggle = () => setIsActive(!isActive);
  
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const handleModeChange = (newMode: Mode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Candle melting logic
  const percentageRemaining = (timeLeft / DURATIONS[mode]) * 100;
  const candleHeight = 100 + (percentageRemaining * 2); // Ranges from 100px to 300px

  return (
    <div className="focus-mode-container">
      {/* Desk Surface */}
      <div className="desk-surface"></div>

      {/* Ambient Particles */}
      <div className="ambient-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              bottom: '-20px',
            }}
          ></div>
        ))}
      </div>

      {/* Candle System */}
      <div className="candle-wrapper" style={{ transform: `scale(${0.8 + (percentageRemaining / 500)})` }}>
        <div className="volumetric-glow"></div>
        <div className="flame"></div>
        <div className="candle-body" style={{ height: `${candleHeight}px` }}>
          <div className="candle-top-hollow"></div>
          
          {/* Dynamic Wax Drips */}
          <motion.div 
            className="wax-drip" 
            animate={{ height: [10, 40, 40], top: [20, 80, 80], opacity: [0, 0.8, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ left: '5px' }}
          />
          <motion.div 
            className="wax-drip" 
            animate={{ height: [15, 60, 60], top: [10, 120, 120], opacity: [0, 0.6, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
            style={{ right: '8px' }}
          />
        </div>
      </div>

      {/* UI Elements */}
      <div className="focus-ui">
        <div className="mode-selector">
          <button 
            className={`mode-btn ${mode === 'pomodoro' ? 'active' : ''}`}
            onClick={() => handleModeChange('pomodoro')}
          >
            Deep Work
          </button>
          <button 
            className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
            onClick={() => handleModeChange('shortBreak')}
          >
            Rest
          </button>
          <button 
            className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
            onClick={() => handleModeChange('longBreak')}
          >
            Long Rest
          </button>
        </div>

        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>

        <div className="focus-controls">
          <button className="control-btn" onClick={handleReset}>
            <RotateCcw size={20} />
          </button>
          
          <button 
            className={`control-btn ${isActive ? 'active' : ''}`} 
            onClick={handleToggle}
            style={{ width: '180px' }}
          >
            {isActive ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center' }}>
                <Pause size={20} fill="currentColor" />
                <span>Pause</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center' }}>
                <Play size={20} fill="currentColor" />
                <span>Focus</span>
              </div>
            )}
          </button>

          <button className="control-btn" style={{ opacity: 0.3, cursor: 'not-allowed' }}>
            <Zap size={20} />
          </button>
        </div>
      </div>

      {/* Cinematic Overlays */}
      <div className="vignette-overlay"></div>
      
      <AnimatePresence>
        {timeLeft < 60 && isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="final-minute-glow"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(204,85,0,0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 4
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusMode;
