import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoInterludeProps {
  videoUrl?: string;
  sceneId: string;
  onComplete: () => void;
  autoPlay?: boolean;
}

export const VideoInterlude: React.FC<VideoInterludeProps> = ({
  videoUrl,
  sceneId,
  onComplete,
  autoPlay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;

    const video = videoRef.current;
    video.src = videoUrl;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setTimeout(onComplete, 500);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    if (autoPlay) {
      video.play().catch((err) => console.log('Video autoplay prevented:', err));
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl, sceneId, onComplete, autoPlay]);

  if (!videoUrl) return null;

  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls={false}
            muted
          />

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Skip button */}
          <motion.button
            onClick={() => {
              setIsPlaying(false);
              onComplete();
            }}
            className="absolute top-4 right-4 px-4 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skip ⏭️
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
