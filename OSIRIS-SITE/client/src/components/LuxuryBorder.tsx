import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface LuxuryBorderProps {
  children: React.ReactNode;
  progress?: number; // 0 to 1
  accentColor?: string;
  className?: string;
  active?: boolean;
}

export const LuxuryBorder: React.FC<LuxuryBorderProps> = ({
  children,
  progress = 1,
  accentColor = '#c9a96e',
  className = '',
  active = true,
}) => {
  const goldGradient = useMemo(() => `linear-gradient(135deg, ${accentColor}dd, #FFD700 50%, ${accentColor}dd)`, [accentColor]);

  return (
    <div className={`relative group ${className}`}>
      {/* 3D Bevel Layer (Outer) */}
      <div 
        className="absolute -inset-[1px] rounded-[inherit] bg-gradient-to-br from-white/10 to-black/40 pointer-events-none" 
        style={{ borderRadius: 'inherit' }}
      />
      
      {/* Golden Base Border */}
      <div 
        className="absolute -inset-[1.5px] rounded-[inherit] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{ 
          background: goldGradient,
          borderRadius: 'inherit',
          boxShadow: `0 0 15px ${accentColor}33`
        }}
      />

      {/* Progress Animation Layer (Moving Border) */}
      {active && (
        <svg
          className="absolute -inset-[1.5px] w-[calc(100%+3px)] h-[calc(100%+3px)] pointer-events-none z-10"
          style={{ overflow: 'visible' }}
        >
          <motion.rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: progress,
              opacity: progress > 0 ? 0.9 : 0,
              filter: [`drop-shadow(0 0 2px ${accentColor})`, `drop-shadow(0 0 5px ${accentColor})`, `drop-shadow(0 0 2px ${accentColor})`]
            }}
            transition={{
              pathLength: { duration: 0.8, ease: "easeOut" },
              filter: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ borderRadius: 'inherit' }}
          />
        </svg>
      )}

      {/* Internal Content Container with Glow */}
      <div className="relative z-0 h-full w-full rounded-[inherit] overflow-hidden">
        {children}
        
        {/* Subtle Internal Glow */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-5 transition-opacity duration-700"
          style={{ 
            background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
};
