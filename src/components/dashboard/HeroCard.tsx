import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, GraduationCap, Mail, Calendar } from 'lucide-react';

interface HeroCardProps {
  user: any;
}

const HeroCard: React.FC<HeroCardProps> = ({ user }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 50, damping: 20 }}
      className="relative group perspective-2000 py-10"
    >
      <motion.div
        whileHover={{ rotateY: 8, rotateX: -5, scale: 1.02 }}
        className="fancy-glass overflow-hidden border-2 border-theme-glass shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative z-10 backdrop-blur-3xl bg-theme-background/10"
      >
        {/* Card Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out"></div>

        {/* Card Header */}
        <div className="p-8 md:p-12 flex justify-between items-start border-b border-theme-glass/20 bg-theme-accent/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-theme-accent to-theme-primary flex items-center justify-center text-theme-background font-black text-3xl shadow-2xl ring-8 ring-theme-accent/10">
              A
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-theme-text-primary tracking-tighter">
                {user.universityName || 'Assignly Elite Academy'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-theme-accent animate-pulse"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-theme-accent">
                  Verified Identity Protocol
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-theme-accent/10 border border-theme-accent/20 text-[10px] font-black text-theme-accent flex items-center gap-2 tracking-widest shadow-inner">
            <ShieldCheck size={14} className="animate-bounce" />
            ELITE STATUS
          </div>
        </div>

        {/* Card Body */}
        <div className="p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center md:items-start relative">
          {/* Photo Section */}
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] overflow-hidden border-8 border-theme-glass shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-theme-accent/5"
            >
              <img 
                src={user.googlePictureUrl || user.picture} 
                alt={user.fullName || user.name} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-theme-accent to-theme-primary px-8 py-2 rounded-full text-xs font-black text-theme-background shadow-2xl tracking-[0.2em]">
              ACTIVE
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-8 text-center md:text-left pt-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-theme-text-secondary opacity-60">Legal Name</label>
              <h2 className="text-4xl md:text-6xl font-black text-gradient mt-2 tracking-tighter">
                {user.fullName || user.googleName || user.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-theme-text-secondary">
                  <GraduationCap size={18} className="text-theme-accent" />
                  <label className="text-[10px] font-black uppercase tracking-[0.3em]">Major</label>
                </div>
                <p className="text-xl font-black text-theme-text-primary tracking-tight">{user.courseBranch || 'Quantum Engineering'}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-theme-text-secondary">
                  <Calendar size={18} className="text-theme-accent" />
                  <label className="text-[10px] font-black uppercase tracking-[0.3em]">Class</label>
                </div>
                <p className="text-xl font-black text-theme-text-primary tracking-tight">{user.graduationYear || '2026'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-theme-text-secondary justify-center md:justify-start">
                <Mail size={18} className="text-theme-accent" />
                <label className="text-[10px] font-black uppercase tracking-[0.3em]">Network Address</label>
              </div>
              <p className="text-lg font-bold text-theme-text-primary/80 truncate font-mono italic">
                {user.studentEmail || user.googleEmail}
              </p>
            </div>
          </div>

          {/* Holographic Watermark */}
          <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
            <ShieldCheck size={200} />
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-12 py-10 flex justify-between items-center bg-white/5 border-t border-theme-glass/10">
          <div className="flex gap-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className={`w-1 bg-theme-text-primary/20 rounded-full ${i % 4 === 0 ? 'h-10 bg-theme-accent/40' : i % 2 === 0 ? 'h-6' : 'h-4'}`}></div>
            ))}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-theme-text-secondary tracking-[0.3em]">ACCESS PROTOCOL ID</p>
            <p className="font-mono text-lg font-black text-theme-text-primary tracking-widest mt-1">
              {user._id?.substring(15).toUpperCase() || 'SYS-ELITE-99X'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Luxury Background Glows */}
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-theme-accent/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-theme-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </motion.div>
  );
};

export default HeroCard;
