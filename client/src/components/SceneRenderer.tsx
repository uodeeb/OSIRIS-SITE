import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export interface SceneProps {
  backgroundImage?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * SceneRenderer: Core component for rendering OSIRIS scenes
 * Handles background images, parallax effects, and cinematic transitions
 */
export const SceneRenderer = ({
  backgroundImage,
  title,
  subtitle,
  children,
  className = '',
}: SceneProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={`relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background Layer */}
      {backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: 'brightness(0.7)',
          }}
        />
      )}

      {/* Cosmic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 py-12">
        {/* Title Section */}
        {(title || subtitle) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-12 max-w-3xl"
          >
            {title && (
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary drop-shadow-lg">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xl md:text-2xl text-muted-foreground drop-shadow-md">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Main Content */}
        {children && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
