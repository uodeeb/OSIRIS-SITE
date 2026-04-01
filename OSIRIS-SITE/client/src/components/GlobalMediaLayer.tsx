import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import styles from "./GlobalMediaLayer.module.css";
import { OSIRIS_EFFECTS, getOsirisMediaUrl } from "@/lib/osirisEffects";
import { useBandwidthStrategy } from "@/lib/mediaStrategy";
import { useMediaController } from "@/contexts/MediaControllerContext";

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}` : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface GlobalMediaLayerProps {
  primaryAudioSources?: string[];
  sceneTrack?: string | null;
  voiceTrack?: string | null;
  onVoiceEnded?: () => void;
  isMuted?: boolean;
  bgVolume?: number;
  sceneVolume?: number;
  voiceVolume?: number;
  isPaused?: boolean;
  onBgVolumeChange?: (volume: number) => void;
  onSceneVolumeChange?: (volume: number) => void;
  onVoiceVolumeChange?: (volume: number) => void;
  onMuteChange?: (muted: boolean) => void;
  onAudioRefsReady?: (refs: {
    bg: HTMLAudioElement | null;
    scene: HTMLAudioElement | null;
    voice: HTMLAudioElement | null;
  }) => void;
}

export function GlobalMediaLayer({ 
  primaryAudioSources, 
  sceneTrack,
  voiceTrack,
  onVoiceEnded,
  isMuted = false,
  bgVolume = 0.15,
  sceneVolume = 0.25,
  voiceVolume = 0.85,
  isPaused = false,
  onBgVolumeChange,
  onSceneVolumeChange,
  onVoiceVolumeChange,
  onMuteChange,
  onAudioRefsReady,
}: GlobalMediaLayerProps) {
  const { allowVideo } = useBandwidthStrategy();
  const { state, registerMedia, setPrimaryAudioElement } = useMediaController();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const sceneAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const [localBgVolume, setLocalBgVolume] = useState(bgVolume);
  const [localSceneVolume, setLocalSceneVolume] = useState(sceneVolume);
  const [localVoiceVolume, setLocalVoiceVolume] = useState(voiceVolume);
  const [localMuted, setLocalMuted] = useState(isMuted);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);

  const effect = OSIRIS_EFFECTS["FX-03-HOLOGRAM-DATA"];
  const videoSrc = useMemo(() => getOsirisMediaUrl(effect.base), [effect.base]);
  const posterSrc = useMemo(() => getOsirisMediaUrl(effect.fallback), [effect.fallback]);

  useEffect(() => {
    if (!videoRef.current) return;
    return registerMedia(videoRef.current);
  }, [registerMedia]);

  useEffect(() => {
    if (!bgAudioRef.current) return;
    setPrimaryAudioElement(bgAudioRef.current);
    return registerMedia(bgAudioRef.current);
  }, [registerMedia, setPrimaryAudioElement]);

  useEffect(() => {
    if (onAudioRefsReady) {
      onAudioRefsReady({
        bg: bgAudioRef.current,
        scene: sceneAudioRef.current,
        voice: voiceAudioRef.current,
      });
    }
  }, [onAudioRefsReady]);

  useEffect(() => { setLocalBgVolume(bgVolume); }, [bgVolume]);
  useEffect(() => { setLocalSceneVolume(sceneVolume); }, [sceneVolume]);
  useEffect(() => { setLocalVoiceVolume(voiceVolume); }, [voiceVolume]);
  useEffect(() => { setLocalMuted(isMuted); }, [isMuted]);

  // When paused or muted, all audio is effectively muted
  const effectiveBgVolume = (localMuted || isPaused) ? 0 : localBgVolume;
  const effectiveSceneVolume = (localMuted || isPaused) ? 0 : localSceneVolume;
  const effectiveVoiceVolume = (localMuted || isPaused) ? 0 : localVoiceVolume;

  // Directly set muted property on audio elements when isMuted or isPaused changes
  useEffect(() => {
    const shouldMute = localMuted || isPaused;
    if (bgAudioRef.current) bgAudioRef.current.muted = shouldMute;
    if (sceneAudioRef.current) sceneAudioRef.current.muted = shouldMute;
    if (voiceAudioRef.current) voiceAudioRef.current.muted = shouldMute;
  }, [localMuted, isPaused]);

  // BG Music - always TRACK-01.mp3 from primaryAudioSources or fallback
  // Note: Do not autoplay TRACK-01 when muted/paused to avoid background playback leaks
  const bgMusicSrc = primaryAudioSources?.[0] || '/generated-assets/music-tracks/TRACK-01.mp3';

  // Background music layer - always plays at low volume
  useEffect(() => {
    const a = bgAudioRef.current;
    if (!a) return;
    a.loop = true;
    a.preload = "metadata";
    // If muted or paused, ensure we do not play the track at all
    const shouldMute = localMuted || isPaused;
    a.volume = shouldMute ? 0 : effectiveBgVolume;
    a.src = bgMusicSrc;
    a.load();
    if (!shouldMute && state.isPlaying && !isPaused) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
    // Keep the element muted flag in sync as additional guard
    a.muted = shouldMute;
  }, [bgMusicSrc, state.isPlaying, effectiveBgVolume, isPaused, localMuted]);
  // Scene overlay music - plays over background
  useEffect(() => {
    const a = sceneAudioRef.current;
    if (!a) return;
    a.loop = true;
    a.preload = "metadata";
    const shouldMute = localMuted || isPaused;
    a.volume = shouldMute ? 0 : effectiveSceneVolume;
    a.muted = shouldMute;
    
    if (sceneTrack) {
      a.src = sceneTrack;
      a.load();
      if (! (localMuted || isPaused) && state.isPlaying && !isPaused) {
        a.play().catch(() => {});
      } else {
        a.pause();
      }
    } else {
      a.pause();
      a.src = '';
    }
  }, [sceneTrack, state.isPlaying, effectiveSceneVolume, isPaused]);

  // Voice track - plays over everything
  useEffect(() => {
    const a = voiceAudioRef.current;
    if (!a) return;
    
    if (voiceTrack && !(localMuted || isPaused)) {
      a.volume = effectiveVoiceVolume;
      a.src = voiceTrack;
      a.load();
      setIsVoicePlaying(true);
      
      if (state.isPlaying) {
        a.play().catch(() => {});
      }
    } else {
      setIsVoicePlaying(false);
      a.pause();
    }
  }, [voiceTrack, state.isPlaying, effectiveVoiceVolume, isPaused]);

  // Handle voice end
  useEffect(() => {
    const a = voiceAudioRef.current;
    if (!a) return;
    
    const handleEnded = () => {
      setIsVoicePlaying(false);
      onVoiceEnded?.();
    };
    
    a.addEventListener('ended', handleEnded);
    return () => a.removeEventListener('ended', handleEnded);
  }, [onVoiceEnded]);

  useEffect(() => {
    if (bgAudioRef.current) bgAudioRef.current.volume = effectiveBgVolume;
  }, [effectiveBgVolume]);

  useEffect(() => {
    if (sceneAudioRef.current) sceneAudioRef.current.volume = effectiveSceneVolume;
  }, [effectiveSceneVolume]);

  useEffect(() => {
    if (voiceAudioRef.current) voiceAudioRef.current.volume = effectiveVoiceVolume;
  }, [effectiveVoiceVolume]);

  const handleBgVolumeChange = useCallback((v: number) => {
    setLocalBgVolume(v);
    onBgVolumeChange?.(v);
  }, [onBgVolumeChange]);

  const handleSceneVolumeChange = useCallback((v: number) => {
    setLocalSceneVolume(v);
    onSceneVolumeChange?.(v);
  }, [onSceneVolumeChange]);

  const handleVoiceVolumeChange = useCallback((v: number) => {
    setLocalVoiceVolume(v);
    onVoiceVolumeChange?.(v);
  }, [onVoiceVolumeChange]);

  const handleMuteToggle = useCallback(() => {
    const newMuted = !localMuted;
    setLocalMuted(newMuted);
    onMuteChange?.(newMuted);
  }, [localMuted, onMuteChange]);

  const accent = state.accentColor || "#c9a96e";

  useEffect(() => {
    const accentHex = withAlpha(accent, 0.22);
    const existing = document.head.querySelector('#media-accent-style');
    if (!existing) {
      const accentStyle = document.createElement('style');
      accentStyle.id = 'media-accent-style';
      accentStyle.innerHTML = `:root { --media-accent: ${accentHex}; }`;
      document.head.appendChild(accentStyle);
    } else {
      (existing as HTMLStyleElement).innerHTML = `:root { --media-accent: ${accentHex}; }`;
    }
  }, [accent]);

  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none ${styles.mediaAccent}`}
      aria-hidden="true"
    >
      {allowVideo ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover ${styles.mediaVideo}`}
        />
      ) : (
        <img
          src={posterSrc}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover ${styles.mediaImage}`}
        />
      )}

      <audio ref={bgAudioRef} preload="metadata" />
      <audio ref={sceneAudioRef} preload="metadata" />
      <audio ref={voiceAudioRef} preload="metadata" />

      <div className={`absolute inset-0 ${styles.mediaRadial}`} />
      <div className={`absolute inset-0 ${styles.mediaPattern}`} />
    </div>
  );
}

export type { GlobalMediaLayerProps };
