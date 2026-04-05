import React from 'react';
import { motion } from 'framer-motion';

interface CharacterAnimationProps {
  character?: string;
  position?: 'left' | 'right' | 'center';
  imageUrl?: string;
  name?: string;
  arabicName?: string;
}

// Character image mapping - Placeholder silhouettes
const CHARACTER_IMAGES: Record<string, string> = {
  'Yahya': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 400%22%3E%3Crect fill=%22%236366f1%22 width=%22200%22 height=%22400%22/%3E%3Ccircle cx=%22100%22 cy=%2280%22 r=%2240%22 fill=%22%23818cf8%22/%3E%3Crect x=%2270%22 y=%22130%22 width=%2260%22 height=%22120%22 fill=%22%23818cf8%22/%3E%3Crect x=%2250%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23818cf8%22/%3E%3Crect x=%22120%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23818cf8%22/%3E%3C/svg%3E',
  'Laila': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 400%22%3E%3Crect fill=%22%23ec4899%22 width=%22200%22 height=%22400%22/%3E%3Ccircle cx=%22100%22 cy=%2280%22 r=%2240%22 fill=%22%23f472b6%22/%3E%3Crect x=%2270%22 y=%22130%22 width=%2260%22 height=%22120%22 fill=%22%23f472b6%22/%3E%3Crect x=%2250%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23f472b6%22/%3E%3Crect x=%22120%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23f472b6%22/%3E%3C/svg%3E',
  'Tarek': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 400%22%3E%3Crect fill=%22%2306b6d4%22 width=%22200%22 height=%22400%22/%3E%3Ccircle cx=%22100%22 cy=%2280%22 r=%2240%22 fill=%22%2322d3ee%22/%3E%3Crect x=%2270%22 y=%22130%22 width=%2260%22 height=%22120%22 fill=%22%2322d3ee%22/%3E%3Crect x=%2250%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%2322d3ee%22/%3E%3Crect x=%22120%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%2322d3ee%22/%3E%3C/svg%3E',
  'Ramses': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 400%22%3E%3Crect fill=%22%23f59e0b%22 width=%22200%22 height=%22400%22/%3E%3Ccircle cx=%22100%22 cy=%2280%22 r=%2240%22 fill=%22%23fbbf24%22/%3E%3Crect x=%2270%22 y=%22130%22 width=%2260%22 height=%22120%22 fill=%22%23fbbf24%22/%3E%3Crect x=%2250%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23fbbf24%22/%3E%3Crect x=%22120%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23fbbf24%22/%3E%3C/svg%3E',
  'Constantine': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 400%22%3E%3Crect fill=%22%238b5cf6%22 width=%22200%22 height=%22400%22/%3E%3Ccircle cx=%22100%22 cy=%2280%22 r=%2240%22 fill=%22%23a78bfa%22/%3E%3Crect x=%2270%22 y=%22130%22 width=%2260%22 height=%22120%22 fill=%22%23a78bfa%22/%3E%3Crect x=%2250%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23a78bfa%22/%3E%3Crect x=%22120%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23a78bfa%22/%3E%3C/svg%3E',
  'Abu Abdullah': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 400%22%3E%3Crect fill=%22%2310b981%22 width=%22200%22 height=%22400%22/%3E%3Ccircle cx=%22100%22 cy=%2280%22 r=%2240%22 fill=%22%2334d399%22/%3E%3Crect x=%2270%22 y=%22130%22 width=%2260%22 height=%22120%22 fill=%22%2334d399%22/%3E%3Crect x=%2250%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%2334d399%22/%3E%3Crect x=%22120%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%2334d399%22/%3E%3C/svg%3E',
  'First Engineer': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 400%22%3E%3Crect fill=%22%23ef4444%22 width=%22200%22 height=%22400%22/%3E%3Ccircle cx=%22100%22 cy=%2280%22 r=%2240%22 fill=%22%23f87171%22/%3E%3Crect x=%2270%22 y=%22130%22 width=%2260%22 height=%22120%22 fill=%22%23f87171%22/%3E%3Crect x=%2250%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23f87171%22/%3E%3Crect x=%22120%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23f87171%22/%3E%3C/svg%3E',
  'Dictator': 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 400%22%3E%3Crect fill=%22%23dc2626%22 width=%22200%22 height=%22400%22/%3E%3Ccircle cx=%22100%22 cy=%2280%22 r=%2240%22 fill=%22%23991b1b%22/%3E%3Crect x=%2270%22 y=%22130%22 width=%2260%22 height=%22120%22 fill=%22%23991b1b%22/%3E%3Crect x=%2250%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23991b1b%22/%3E%3Crect x=%22120%22 y=%22250%22 width=%2230%22 height=%22150%22 fill=%22%23991b1b%22/%3E%3C/svg%3E',
};

export const CharacterAnimation: React.FC<CharacterAnimationProps> = ({
  character,
  position = 'left',
  imageUrl,
  name,
  arabicName,
}) => {
  const image = imageUrl || (character ? CHARACTER_IMAGES[character] : undefined);
  
  if (!image) return null;

  const positionVariants = {
    left: {
      initial: { x: -200, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -200, opacity: 0 },
    },
    right: {
      initial: { x: 200, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 200, opacity: 0 },
    },
    center: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
    },
  };

  const variants = positionVariants[position];

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`absolute bottom-0 h-96 flex flex-col items-center justify-end ${
        position === 'left' ? 'left-0' : position === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
      }`}
    >
      {/* Character Image */}
      <motion.img
        src={image}
        alt={`Character: ${character || name || "Unknown"}`}
        className="h-full object-contain drop-shadow-2xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
        onError={(e) => {
          console.error(`Failed to load character image: ${image}`);
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Character Name */}
      {(name || arabicName) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent p-4 text-center"
        >
          {name && <p className="text-lg font-bold text-primary">{name}</p>}
          {arabicName && <p className="text-lg font-bold text-primary font-arabic">{arabicName}</p>}
        </motion.div>
      )}
    </motion.div>
  );
};
