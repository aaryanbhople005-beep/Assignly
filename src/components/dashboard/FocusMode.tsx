import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap, Sparkles } from 'lucide-react';

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

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
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

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-12 relative overflow-hidden rounded-3xl p-8 bg-theme-background/30 border border-theme-glass backdrop-blur-sm">
      {/* Background Ambient Motion */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-theme-accent/5 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 270, 180, 90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-theme-primary/5 blur-[120px] rounded-full"
        />
      </div>

      <div className="text-center space-y-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 text-theme-accent mb-2"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-[0.3em]">Zen Protocol Active</span>
        </motion.div>
        
        <div className="flex bg-theme-glass/10 p-1 rounded-2xl border border-theme-glass backdrop-blur-md">
          {(['pomodoro', 'shortBreak', 'longBreak'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                mode === m 
                ? 'bg-theme-accent text-theme-background shadow-lg shadow-theme-accent/20' 
                : 'text-theme-text-secondary hover:text-theme-text-primary'
              }`}
            >
              {m === 'pomodoro' ? 'Deep Work' : m === 'shortBreak' ? 'Short Rest' : 'Long Rest'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="relative group">
        <motion.div 
          animate={isActive ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-theme-glass flex items-center justify-center relative shadow-2xl shadow-theme-accent/5"
        >
          <div className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-theme-text-primary drop-shadow-2xl">
            {formatTime(timeLeft)}
          </div>
          
          {/* Progress Ring Overlay */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="var(--theme-accent)"
              strokeWidth="8"
              strokeDasharray="100 100"
              strokeDashoffset={100 - (timeLeft / DURATIONS[mode] * 100)}
              className="transition-all duration-1000 ease-linear opacity-20"
              style={{ strokeDasharray: '283', strokeDashoffset: `${283 - (timeLeft / DURATIONS[mode] * 283)}` }}
            />
          </svg>
        </motion.div>

        {isActive && (
          <div className="absolute -inset-8 bg-theme-accent/5 blur-3xl rounded-full -z-10 animate-pulse"></div>
        )}
      </div>

      <div className="flex items-center gap-6 relative z-10">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: -30 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleReset}
          className="p-4 rounded-2xl glass-card text-theme-text-secondary hover:text-theme-accent transition-colors"
        >
          <RotateCcw size={24} />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className={`px-12 py-5 rounded-3xl font-black text-xl transition-all duration-500 flex items-center gap-3 shadow-xl ${
            isActive 
            ? 'bg-theme-glass/20 text-theme-text-primary border border-theme-glass' 
            : 'bg-theme-accent text-theme-background shadow-theme-accent/30'
          }`}
        >
          {isActive ? (
            <><Pause size={24} fill="currentColor" /> PAUSE</>
          ) : (
            <><Play size={24} fill="currentColor" /> FOCUS</>
          )}
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.1, rotate: 30 }}
          whileTap={{ scale: 0.9 }}
          className="p-4 rounded-2xl glass-card text-theme-text-secondary hover:text-theme-accent transition-colors"
        >
          <Zap size={24} />
        </motion.button>
      </div>

      {/* Floating Status */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-8 text-theme-accent font-bold tracking-widest text-xs flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-theme-accent rounded-full animate-ping"></span>
            SYNCING WITH BIORHYTHM...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusMode;
