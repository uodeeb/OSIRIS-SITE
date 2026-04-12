/**
 * MainPlayer Audio Manager Hook
 * Handles 4-channel audio system: Background, Scene, Voice, SFX
 * Integrates with Zustand store for state management
 */

import { useEffect, useRef, useCallback } from 'react';
import { useMainPlayerStore } from '@/store/mainPlayerStore';
import type { TrackUrlKey } from '@/lib/mainPlayerConfig';

// Audio channel types
export type AudioChannel = 'bg' | 'scene' | 'voice' | 'sfx';

// Audio element refs for each channel
export interface AudioRefs {
  bg: HTMLAudioElement | null;
  scene: HTMLAudioElement | null;
  voice: HTMLAudioElement | null;
  sfx: HTMLAudioElement | null;
}

// Track state for each channel
export interface AudioTrackState {
  bg: string | null;
  scene: string | null;
  voice: string | null;
  sfx: string | null;
}

export interface UseAudioManagerReturn {
  // Refs
  audioRefs: React.MutableRefObject<AudioRefs>;
  
  // State
  isPlaying: boolean;
  isMuted: boolean;
  bgVol: number;
  sceneVol: number;
  voiceVol: number;
  sfxVol: number;
  audioEnabled: boolean;
  showAudioPrompt: boolean;
  scriptTrackOverride: TrackUrlKey | null;
  
  // Actions
  setAudioEnabled: (enabled: boolean) => void;
  setShowAudioPrompt: (show: boolean) => void;
  setBgVol: (vol: number) => void;
  setSceneVol: (vol: number) => void;
  setVoiceVol: (vol: number) => void;
  setSfxVol: (vol: number) => void;
  setIsMuted: (muted: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setScriptTrackOverride: (track: TrackUrlKey | null) => void;
  toggleMute: () => void;
  togglePlayPause: () => void;
  
  // Audio control
  playChannel: (channel: AudioChannel) => void;
  pauseChannel: (channel: AudioChannel) => void;
  stopChannel: (channel: AudioChannel) => void;
  setChannelVolume: (channel: AudioChannel, volume: number) => void;
  
  // Master control
  enableAudio: () => void;
  disableAudio: () => void;
  pauseAll: () => void;
  resumeAll: () => void;
  stopAll: () => void;
}

export const useAudioManager = (): UseAudioManagerReturn => {
  // Audio element refs
  const audioRefs = useRef<AudioRefs>({
    bg: null,
    scene: null,
    voice: null,
    sfx: null,
  });

  // Get state from store
  const {
    audioEnabled,
    showAudioPrompt,
    bgVol,
    sceneVol,
    voiceVol,
    sfxVol,
    isMuted,
    isPlaying,
    scriptTrackOverride,
    setAudioEnabled,
    setShowAudioPrompt,
    setBgVol,
    setSceneVol,
    setVoiceVol,
    setSfxVol,
    setIsMuted,
    setIsPlaying,
    setScriptTrackOverride,
    toggleMute: storeToggleMute,
    togglePlayPause: storeTogglePlayPause,
  } = useMainPlayerStore();

  // Apply volume to audio element
  const applyVolume = useCallback((channel: AudioChannel) => {
    const audio = audioRefs.current[channel];
    if (!audio) return;

    const volMap: Record<AudioChannel, number> = {
      bg: bgVol,
      scene: sceneVol,
      voice: voiceVol,
      sfx: sfxVol,
    };

    audio.volume = isMuted ? 0 : volMap[channel];
  }, [bgVol, sceneVol, voiceVol, sfxVol, isMuted]);

  // Play specific channel
  const playChannel = useCallback((channel: AudioChannel) => {
    const audio = audioRefs.current[channel];
    if (!audio || !audioEnabled) return;
    
    applyVolume(channel);
    audio.play().catch(() => {
      // Audio play failed (browser autoplay policy)
    });
  }, [audioEnabled, applyVolume]);

  // Pause specific channel
  const pauseChannel = useCallback((channel: AudioChannel) => {
    const audio = audioRefs.current[channel];
    if (!audio) return;
    audio.pause();
  }, []);

  // Stop specific channel
  const stopChannel = useCallback((channel: AudioChannel) => {
    const audio = audioRefs.current[channel];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  // Set volume for specific channel
  const setChannelVolume = useCallback((channel: AudioChannel, volume: number) => {
    switch (channel) {
      case 'bg':
        setBgVol(volume);
        break;
      case 'scene':
        setSceneVol(volume);
        break;
      case 'voice':
        setVoiceVol(volume);
        break;
      case 'sfx':
        setSfxVol(volume);
        break;
    }
  }, [setBgVol, setSceneVol, setVoiceVol, setSfxVol]);

  // Enable audio system
  const enableAudio = useCallback(() => {
    setAudioEnabled(true);
    setShowAudioPrompt(false);
    
    // Try to resume all channels
    Object.keys(audioRefs.current).forEach((channel) => {
      const audio = audioRefs.current[channel as AudioChannel];
      if (audio) {
        audio.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    });
  }, [setAudioEnabled, setShowAudioPrompt]);

  // Disable audio system
  const disableAudio = useCallback(() => {
    setAudioEnabled(false);
    pauseAll();
  }, [setAudioEnabled]);

  // Pause all channels
  const pauseAll = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) audio.pause();
    });
    setIsPlaying(false);
  }, [setIsPlaying]);

  // Resume all channels
  const resumeAll = useCallback(() => {
    if (!audioEnabled) return;
    
    Object.keys(audioRefs.current).forEach((channel) => {
      const audio = audioRefs.current[channel as AudioChannel];
      if (audio) {
        audio.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    });
    setIsPlaying(true);
  }, [audioEnabled, setIsPlaying]);

  // Stop all channels
  const stopAll = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setIsPlaying(false);
  }, [setIsPlaying]);

  // Wrapper for toggleMute from store
  const toggleMute = useCallback(() => {
    storeToggleMute();
  }, [storeToggleMute]);

  // Wrapper for togglePlayPause from store
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseAll();
    } else {
      resumeAll();
    }
    storeTogglePlayPause();
  }, [isPlaying, pauseAll, resumeAll, storeTogglePlayPause]);

  // Apply volume changes to all channels
  useEffect(() => {
    (['bg', 'scene', 'voice', 'sfx'] as AudioChannel[]).forEach((channel) => {
      applyVolume(channel);
    });
  }, [bgVol, sceneVol, voiceVol, sfxVol, isMuted, applyVolume]);

  return {
    // Refs
    audioRefs,
    
    // State
    isPlaying,
    isMuted,
    bgVol,
    sceneVol,
    voiceVol,
    sfxVol,
    audioEnabled,
    showAudioPrompt,
    scriptTrackOverride,
    
    // Actions
    setAudioEnabled,
    setShowAudioPrompt,
    setBgVol,
    setSceneVol,
    setVoiceVol,
    setSfxVol,
    setIsMuted,
    setIsPlaying,
    setScriptTrackOverride,
    toggleMute,
    togglePlayPause,
    
    // Audio control
    playChannel,
    pauseChannel,
    stopChannel,
    setChannelVolume,
    
    // Master control
    enableAudio,
    disableAudio,
    pauseAll,
    resumeAll,
    stopAll,
  };
};
