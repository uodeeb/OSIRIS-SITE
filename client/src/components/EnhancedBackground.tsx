import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedBackgroundProps {
  imageUrl?: string;
  videoUrl?: string;
  emotionalTone?: string;
  sceneId?: string;
}

export const EnhancedBackground: React.FC<EnhancedBackgroundProps> = ({
  imageUrl,
  videoUrl,
  emotionalTone = 'dark',
  sceneId,
}) => {
  // Overlay colors based on emotional tone
  const overlayColors: Record<string, string> = {
    dark: 'from-black/40 via-black/20 to-black/40',
    intense: 'from-red-900/30 via-black/20 to-red-900/30',
    hopeful: 'from-blue-900/20 via-transparent to-blue-900/20',
    tragic: 'from-gray-900/50 via-black/30 to-gray-900/50',
    contemplative: 'from-purple-900/20 via-black/10 to-purple-900/20',
    urgent: 'from-orange-900/30 via-black/20 to-orange-900/30',
  };

  const overlayClass = overlayColors[emotionalTone] || overlayColors.dark;

  return (
    <>
      {/* Background Image */}
      {imageUrl && !videoUrl && (
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
      )}

      {/* Background Video */}
      {videoUrl && (
        <video
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
      )}

      {/* Gradient Overlay - Emotional Tone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 bg-gradient-to-b ${overlayClass}`}
      />

      {/* Animated Particles/Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0,
            }}
            animate={{
              y: -50,
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30 pointer-events-none" />

      {/* Film Grain Effect */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='400' height='400' fill='%23fff' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
    </>
  );
};
