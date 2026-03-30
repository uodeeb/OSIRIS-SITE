import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SoundDesignProps {
  sceneId: string;
  emotionalTone?: string;
  isPlaying: boolean;
}

// Sound design mapping for different scenes and emotional tones
const SOUND_EFFECTS: Record<string, string> = {
  // Ambient backgrounds
  'dark': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_intro_narration.wav',
  'intense': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_intro_narration_v1.wav',
  'hopeful': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_yahya_monologue.wav',
  'tragic': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_intro_narration.wav',
  'contemplative': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_intro_narration_v1.wav',
  'urgent': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663180701130/YMNaFYPNBVUKvJbdDwnwD8/aud_yahya_monologue.wav',
};

export const SoundDesign: React.FC<SoundDesignProps> = ({ sceneId, emotionalTone = 'dark', isPlaying }) => {
  const ambientRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);

  // Play ambient sound based on emotional tone
  useEffect(() => {
    if (!ambientRef.current) return;

    const soundUrl = SOUND_EFFECTS[emotionalTone] || SOUND_EFFECTS['dark'];
    
    if (isPlaying && !isMuted) {
      ambientRef.current.src = soundUrl;
      ambientRef.current.volume = volume;
      ambientRef.current.loop = true;
      
      // Request permission for autoplay
      ambientRef.current.play().catch((err) => {
        console.log('Ambient sound autoplay prevented:', err);
      });
    } else {
      ambientRef.current.pause();
    }

    return () => {
      if (ambientRef.current) ambientRef.current.pause();
    };
  }, [sceneId, emotionalTone, isPlaying, isMuted, volume]);

  return (
    <>
      {/* Ambient audio */}
      <audio ref={ambientRef} />

      {/* Sound control */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm border border-primary/20 rounded-lg"
      >
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-primary/60 hover:text-primary transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
          disabled={isMuted}
          className="w-20 h-1 bg-primary/20 rounded cursor-pointer"
          title="Volume"
        />
      </motion.div>
    </>
  );
};
