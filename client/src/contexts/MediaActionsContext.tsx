import React, { createContext, useContext } from "react";

type MediaControllerActions = {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seekToMs: (ms: number) => void;
  setDurationMs: (ms: number) => void;
  setAccentColor: (color: string) => void;
  setUiLang: (lang: "en" | "ar") => void;
  setPrimaryAudioElement: (el: HTMLAudioElement | null) => void;
  setPrimaryAudioSources: (candidates: string[], loop: boolean) => void;
  setPrimaryAudioVolume: (volume: number) => void;
  setPrimaryAudioMuted: (muted: boolean) => void;
  registerMedia: (el: HTMLMediaElement) => () => void;
  on: (eventName: "state" | "tick" | "play" | "pause" | "seek" | "duration", handler: (state: any) => void) => () => void;
};

export const MediaActionsContext = createContext<MediaControllerActions | null>(null);

export function useMediaActions() {
  const ctx = useContext(MediaActionsContext);
  if (!ctx) throw new Error("useMediaActions must be used within MediaActionsProvider");
  return ctx;
}
