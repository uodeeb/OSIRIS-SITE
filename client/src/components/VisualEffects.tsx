import React from 'react';
import { motion } from 'framer-motion';

interface VisualEffectsProps {
  type: 'glitch' | 'dissolve' | 'fade' | 'slideUp' | 'slideDown' | 'none';
  duration?: number;
  children?: React.ReactNode;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({ type, duration = 0.8, children }) => {
  const effectVariants = {
    glitch: {
      initial: { opacity: 0, x: -10 },
      animate: { 
        opacity: 1, 
        x: 0,
      },
      exit: { opacity: 0, x: 10 },
    },
    dissolve: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: { duration }
      },
      exit: { opacity: 0, scale: 1.05 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1,
        transition: { duration }
      },
      exit: { opacity: 0 },
    },
    slideUp: {
      initial: { y: 100, opacity: 0 },
      animate: { 
        y: 0, 
        opacity: 1,
        transition: { duration }
      },
      exit: { y: -100, opacity: 0 },
    },
    slideDown: {
      initial: { y: -100, opacity: 0 },
      animate: { 
        y: 0, 
        opacity: 1,
        transition: { duration }
      },
      exit: { y: 100, opacity: 0 },
    },
    none: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
    },
  };

  const variants = effectVariants[type];

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

// Glitch effect overlay
export const GlitchOverlay: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.1, 0] }}
      transition={{ duration: 0.3, repeat: 3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
    </motion.div>
  );
};

// Particle effect
export const ParticleEffect: React.FC<{ count?: number }> = ({ count = 20 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 1,
          }}
          animate={{
            y: Math.random() * window.innerHeight - 100,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};
