import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UnifiedAudioControlProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  lang: 'en' | 'ar';
  color?: string;
}

export function UnifiedAudioControl({
  isPlaying,
  volume,
  isMuted,
  onPlayPause,
  onVolumeChange,
  onMuteToggle,
  lang,
  color = '#c9a96e'
}: UnifiedAudioControlProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const texts = {
    en: {
      play: 'Play Audio',
      pause: 'Pause',
      mute: 'Mute',
      unmute: 'Unmute',
      volume: 'Volume'
    },
    ar: {
      play: 'تشغيل الصوت',
      pause: 'إيقاف',
      mute: 'صامت',
      unmute: 'صوت',
      volume: 'الصوت'
    }
  };

  const text = texts[lang];

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Play/Pause Button */}
      <motion.button
        onClick={onPlayPause}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-all"
        style={{ 
          borderColor: `${color}33`, 
          color: color, 
          background: 'rgba(0,0,0,0.35)' 
        }}
      >
        {isPlaying ? (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        {isPlaying ? (lang === 'ar' ? text.pause : text.pause) : (lang === 'ar' ? text.play : text.play)}
      </motion.button>

      {/* Volume Control */}
      <div className="relative">
        <motion.button
          onClick={onMuteToggle}
          onMouseEnter={() => setShowVolumeSlider(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-md border px-2 py-2 text-xs transition-all"
          style={{ 
            borderColor: isMuted ? 'rgba(239,68,68,0.3)' : `${color}33`, 
            color: isMuted ? '#ef4444' : color, 
            background: 'rgba(0,0,0,0.35)' 
          }}
        >
          {isMuted ? (
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </motion.button>

        {/* Volume Slider */}
        <AnimatePresence>
          {showVolumeSlider && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md border border-white/10 bg-black/90 p-2 shadow-lg"
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="h-20 w-2 cursor-pointer appearance-none rounded-full bg-white/10"
                style={{
                  background: `linear-gradient(to top, ${color} ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
              <div className="mt-1 text-center text-xs text-white/70">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}