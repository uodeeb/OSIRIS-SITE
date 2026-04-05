import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

export interface AudioTrack {
  id: string;
  url: string;
  volume?: number;
  loop?: boolean;
}

export const useAudioManager = () => {
  const soundsRef = useRef<Record<string, Howl>>({});
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (track: AudioTrack) => {
    // Stop current track if playing
    if (currentTrack && soundsRef.current[currentTrack]) {
      soundsRef.current[currentTrack].stop();
    }

    // Create or reuse sound
    if (!soundsRef.current[track.id]) {
      soundsRef.current[track.id] = new Howl({
        src: [track.url],
        volume: track.volume ?? 0.8,
        loop: track.loop ?? false,
        onplay: () => setIsPlaying(true),
        onstop: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
      });
    }

    soundsRef.current[track.id].play();
    setCurrentTrack(track.id);
  };

  const pause = () => {
    if (currentTrack && soundsRef.current[currentTrack]) {
      soundsRef.current[currentTrack].pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (currentTrack && soundsRef.current[currentTrack]) {
      soundsRef.current[currentTrack].play();
      setIsPlaying(true);
    }
  };

  const stop = () => {
    if (currentTrack && soundsRef.current[currentTrack]) {
      soundsRef.current[currentTrack].stop();
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  const setVolume = (trackId: string, volume: number) => {
    if (soundsRef.current[trackId]) {
      soundsRef.current[trackId].volume(volume);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(soundsRef.current).forEach(sound => sound.unload());
    };
  }, []);

  return {
    play,
    pause,
    resume,
    stop,
    setVolume,
    currentTrack,
    isPlaying,
  };
};
