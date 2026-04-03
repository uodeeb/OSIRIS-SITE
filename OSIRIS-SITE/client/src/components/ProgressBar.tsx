import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { progressTracker, ReadingProgress } from '@/lib/progressTracker';

interface ProgressBarProps {
  totalScenes: number;
  currentSceneId: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ totalScenes, currentSceneId }) => {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const currentProgress = progressTracker.initProgress();
    setProgress(currentProgress);
    setIsBookmarked(currentProgress.bookmarks.includes(currentSceneId));
  }, [currentSceneId]);

  const progressPercentage = progress ? progressTracker.getProgressPercentage(totalScenes) : 0;

  const handleBookmark = () => {
    if (!progress) return;
    if (isBookmarked) {
      progressTracker.removeBookmark(currentSceneId);
      setIsBookmarked(false);
    } else {
      progressTracker.addBookmark(currentSceneId);
      setIsBookmarked(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between gap-4 px-6 py-3 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-lg"
    >
      {/* Progress bar */}
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs text-primary/60 whitespace-nowrap">Reading Progress</span>
        <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-primary to-primary/60"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-primary/60 whitespace-nowrap">{progressPercentage}%</span>
      </div>

      {/* Bookmark button */}
      <motion.button
        onClick={handleBookmark}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
          isBookmarked
            ? 'bg-primary text-background'
            : 'bg-primary/20 text-primary hover:bg-primary/30'
        }`}
      >
        {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
      </motion.button>
    </motion.div>
  );
};
