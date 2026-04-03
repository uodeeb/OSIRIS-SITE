import { useEffect, useRef, useState } from 'react';
import { useSingleAsset } from '@/hooks/useAssets';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  assetId: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

/**
 * Audio player component for narration and background music
 */
export function AudioPlayer({
  assetId,
  title = 'Audio',
  autoplay = false,
  loop = false,
  showControls = true,
  className = '',
  onPlay,
  onPause,
  onEnd,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { url, isLoading, error } = useSingleAsset(assetId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Update audio element when URL changes
  useEffect(() => {
    if (audioRef.current && url) {
      audioRef.current.src = url;
      if (autoplay) {
        audioRef.current.play().catch((err) => {
          console.error('Autoplay failed:', err);
        });
        setIsPlaying(true);
      }
    }
  }, [url, autoplay]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    }
  };

  // Handle mute
  const handleMute = () => {
    if (!audioRef.current) return;
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Format time
  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className={`bg-destructive/10 border border-destructive/30 rounded-lg p-3 ${className}`}>
        <p className="text-xs text-destructive">Failed to load audio</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-card/50 border border-primary/20 rounded-lg p-3 animate-pulse ${className}`}>
        <div className="h-4 bg-primary/20 rounded w-full" />
      </div>
    );
  }

  if (!url) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card/50 border border-primary/20 rounded-lg p-4 space-y-3 ${className}`}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        loop={loop}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          onEnd?.();
        }}
      />

      {/* Title */}
      {title && <p className="text-sm font-semibold text-foreground">{title}</p>}

      {/* Controls */}
      {showControls && (
        <div className="space-y-3">
          {/* Play/Pause and Time */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPause}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-primary-foreground transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </motion.button>

            {/* Time display */}
            <div className="flex-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{formatTime(currentTime)}</span>
              <div className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
                  }}
                />
              </div>
              <span className="font-mono">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMute}
              className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-primary/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </motion.button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-primary/20 rounded-full cursor-pointer accent-primary"
            />

            <span className="text-xs text-muted-foreground font-mono w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Background music player (no visible controls)
 */
export function BackgroundMusic({
  assetId,
  autoplay = true,
  loop = true,
  volume = 0.3,
}: {
  assetId: string;
  autoplay?: boolean;
  loop?: boolean;
  volume?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { url } = useSingleAsset(assetId);

  useEffect(() => {
    if (audioRef.current && url) {
      audioRef.current.src = url;
      audioRef.current.volume = volume;
      if (autoplay) {
        audioRef.current.play().catch((err) => {
          console.error('Background music autoplay failed:', err);
        });
      }
    }
  }, [url, autoplay, volume]);

  return (
    <audio
      ref={audioRef}
      loop={loop}
      style={{ display: 'none' }}
    />
  );
}
