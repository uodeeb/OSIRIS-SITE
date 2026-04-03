import { useEffect, useMemo, useRef } from "react";
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
  primaryAudioSources: string[];
}

export function GlobalMediaLayer({ primaryAudioSources = [] }: GlobalMediaLayerProps) {
  const { allowVideo } = useBandwidthStrategy();
  const { state, registerMedia, setPrimaryAudioElement, setPrimaryAudioSources, setPrimaryAudioVolume } = useMediaController();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const effect = OSIRIS_EFFECTS["FX-03-HOLOGRAM-DATA"];
  const videoSrc = useMemo(() => getOsirisMediaUrl(effect.base), [effect.base]);
  const posterSrc = useMemo(() => getOsirisMediaUrl(effect.fallback), [effect.fallback]);
  const audioSrc = primaryAudioSources?.[0] || "";
  useEffect(() => {
    if (!videoRef.current) return;
    return registerMedia(videoRef.current);
  }, [registerMedia]);

  useEffect(() => {
    if (!audioRef.current) return;
    setPrimaryAudioElement(audioRef.current);
    return registerMedia(audioRef.current);
  }, [registerMedia, setPrimaryAudioElement]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = true;
    a.preload = "metadata";
    if (primaryAudioSources && primaryAudioSources.length > 0) {
      setPrimaryAudioSources(primaryAudioSources, true);
    }
    setPrimaryAudioVolume(0.22);
  }, [primaryAudioSources, setPrimaryAudioSources, setPrimaryAudioVolume]);

  const accent = state.accentColor || "#c9a96e";

  // Compute a dynamic class for accent color
  const accentHex = withAlpha(accent, 0.22);
  // Create a style element for the dynamic accent variable
  const accentStyle = document.createElement('style');
  accentStyle.innerHTML = `:root { --media-accent: ${accentHex}; }`;
  if (!document.head.querySelector('#media-accent-style')) {
    accentStyle.id = 'media-accent-style';
    document.head.appendChild(accentStyle);
  } else {
    document.head.querySelector('#media-accent-style').innerHTML = accentStyle.innerHTML;
  }
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

      {primaryAudioSources?.[0] ? (
        <audio ref={audioRef} src={primaryAudioSources[0]} preload="metadata" />
      ) : null}

      <div
        className={`absolute inset-0 ${styles.mediaRadial}`}
      />
      <div
        className={`absolute inset-0 ${styles.mediaPattern}`}
      />
    </div>
  );
}
