import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinemaModeProps {
  backgroundImage?: string;
  videoUrl?: string;
  children: React.ReactNode;
  audioUrl?: string;
  autoPlayAudio?: boolean;
}

export function CinemaMode({
  backgroundImage,
  videoUrl,
  children,
  audioUrl,
  autoPlayAudio = true,
}: CinemaModeProps) {
  const [audioPermission, setAudioPermission] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Request audio permission on first load
  useEffect(() => {
    const requestAudioPermission = async () => {
      try {
        // Try to play silent audio to get permission
        if (audioRef.current && autoPlayAudio && audioUrl) {
          await audioRef.current.play().catch(() => {
            // Permission denied or autoplay blocked
            setAudioPermission(false);
          });
          setAudioPermission(true);
        }
      } catch (error) {
        console.log('Audio permission denied');
      }
    };

    requestAudioPermission();
  }, [audioUrl, autoPlayAudio]);

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      if (autoPlayAudio && audioPermission) {
        audioRef.current.play().catch(() => {
          // Autoplay failed, user interaction required
          setAudioPlaying(false);
        });
        setAudioPlaying(true);
      }
    }
  }, [audioUrl, audioPermission, autoPlayAudio]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Background Image */}
      {backgroundImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      )}

      {/* Background Video */}
      {videoUrl && (
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={videoUrl} type="video/mp4" />
        </motion.video>
      )}

      {/* Audio Element */}
      {audioUrl && (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={() => setAudioPlaying(true)}
            onPause={() => setAudioPlaying(false)}
            onEnded={() => setAudioPlaying(false)}
          />
          
          {/* Audio Permission Prompt */}
          {!audioPermission && autoPlayAudio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 right-4 z-50 bg-primary/90 text-white px-6 py-3 rounded-lg backdrop-blur-sm"
            >
              <p className="text-sm font-medium">🔊 Click to enable audio</p>
            </motion.div>
          )}
        </>
      )}

      {/* Content - Centered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 w-full h-full flex items-center justify-center px-6 py-12"
      >
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
