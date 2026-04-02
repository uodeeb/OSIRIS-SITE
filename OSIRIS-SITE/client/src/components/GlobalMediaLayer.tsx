import { useEffect, useMemo, useRef } from "react";
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
  const audioSrc = primaryAudioSources[0] || "";
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
    setPrimaryAudioSources(primaryAudioSources, true);
    setPrimaryAudioVolume(0.22);
  }, [primaryAudioSources, setPrimaryAudioSources, setPrimaryAudioVolume]);

  const accent = state.accentColor || "#c9a96e";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      {allowVideo ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.55) saturate(1.08) contrast(1.12)" }}
        />
      ) : (
        <img
          src={posterSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.55) saturate(1.08) contrast(1.12)" }}
        />
      )}

      {audioSrc && <audio ref={audioRef} src={audioSrc} preload="metadata" />}

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${withAlpha(accent, 0.22)} 0%, rgba(0,0,0,0.86) 58%, rgba(0,0,0,0.98) 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0) 2px, rgba(0,0,0,0) 6px)",
          mixBlendMode: "screen",
          opacity: 0.12,
        }}
      />
    </div>
  );
}
