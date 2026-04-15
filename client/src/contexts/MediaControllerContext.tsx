import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MediaStateContext } from "./MediaStateContext";
import { MediaActionsContext } from "./MediaActionsContext";

type MediaControllerEventName = "state" | "tick" | "play" | "pause" | "seek" | "duration";

export type MediaControllerState = {
  isPlaying: boolean;
  elapsedMs: number;
  durationMs: number;
  accentColor: string;
  uiLang: "en" | "ar";
  isMuted: boolean;
  primaryVolume: number;
};

type MediaControllerApi = {
  state: MediaControllerState;
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
  on: (eventName: MediaControllerEventName, handler: (state: MediaControllerState) => void) => () => void;
};

const STORAGE_KEY = "osiris-media-controller";

const defaultState: MediaControllerState = {
  isPlaying: false,
  elapsedMs: 0,
  durationMs: 25 * 60 * 1000,
  accentColor: "#c9a96e",
  uiLang: "ar",
  isMuted: false,
  primaryVolume: 0.2,
};

const MediaControllerContext = createContext<MediaControllerApi | null>(null);

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function nowMs() {
  return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}

export function MediaControllerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MediaControllerState>(() => {
    if (typeof window === "undefined") return defaultState;
    const saved = safeJsonParse<Partial<MediaControllerState>>(window.localStorage.getItem(STORAGE_KEY));
    return {
      ...defaultState,
      ...saved,
      elapsedMs: typeof saved?.elapsedMs === "number" ? Math.max(0, saved.elapsedMs) : defaultState.elapsedMs,
      durationMs: typeof saved?.durationMs === "number" ? Math.max(10_000, saved.durationMs) : defaultState.durationMs,
      isPlaying: typeof saved?.isPlaying === "boolean" ? saved.isPlaying : defaultState.isPlaying,
      accentColor: typeof saved?.accentColor === "string" && saved.accentColor ? saved.accentColor : defaultState.accentColor,
      uiLang: typeof saved?.uiLang === "string" && saved.uiLang ? saved.uiLang : defaultState.uiLang,
    };
  });

  const targetRef = useRef<EventTarget | null>(null);
  const stateRef = useRef<MediaControllerState>(state);
  const mediaSetRef = useRef<Set<HTMLMediaElement>>(new Set());
  const resumeSetRef = useRef<Set<HTMLMediaElement>>(new Set());
  const lastTickRef = useRef<number | null>(null);
  const primaryAudioRef = useRef<HTMLAudioElement | null>(null);
  const primaryAudioCandidatesRef = useRef<string[]>([]);
  const primaryAudioTryIndexRef = useRef<number>(0);
  const lastPersistRef = useRef<number>(0);
  const PERSIST_THROTTLE_MS = 5000; // Only persist to localStorage every 5 seconds

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const emit = useCallback((eventName: MediaControllerEventName, nextState: MediaControllerState) => {
    if (!targetRef.current) targetRef.current = new EventTarget();
    targetRef.current.dispatchEvent(new CustomEvent(eventName, { detail: nextState }));
  }, []);

  const persist = useCallback((nextState: MediaControllerState) => {
    if (typeof window === "undefined") return;
    const now = Date.now();
    if (now - lastPersistRef.current < PERSIST_THROTTLE_MS) return; // Throttle localStorage writes
    lastPersistRef.current = now;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isPlaying: nextState.isPlaying,
          elapsedMs: nextState.elapsedMs,
          durationMs: nextState.durationMs,
          accentColor: nextState.accentColor,
          uiLang: nextState.uiLang,
          isMuted: nextState.isMuted,
          primaryVolume: nextState.primaryVolume,
        }),
      );
    } catch {
      // localStorage may fail (quota exceeded, private mode) — ignore silently
    }
  }, []);

  const pauseAll = useCallback(() => {
    for (const el of mediaSetRef.current) {
      try {
        el.pause();
      } catch {
        // ignore
      }
    }
    resumeSetRef.current = new Set(mediaSetRef.current);
  }, []);

  const playAll = useCallback(() => {
    if (resumeSetRef.current.size === 0 && mediaSetRef.current.size > 0) {
      resumeSetRef.current = new Set(mediaSetRef.current);
    }
    for (const el of resumeSetRef.current) {
      try {
        const r = el.play();
        if (r && typeof (r as any).catch === "function") (r as any).catch(() => undefined);
      } catch {
        // ignore
      }
    }
  }, []);

  const play = useCallback(() => {
    setState((prev) => {
      const next: MediaControllerState = { ...prev, isPlaying: true };
      emit("play", next);
      persist(next);
      return next;
    });
  }, [emit, persist]);

  const pause = useCallback(() => {
    setState((prev) => {
      const next: MediaControllerState = { ...prev, isPlaying: false };
      emit("pause", next);
      persist(next);
      return next;
    });
  }, [emit, persist]);

  const toggle = useCallback(() => {
    setState((prev) => {
      const next: MediaControllerState = { ...prev, isPlaying: !prev.isPlaying };
      emit(next.isPlaying ? "play" : "pause", next);
      persist(next);
      return next;
    });
  }, [emit, persist]);

  const syncRegisteredMediaTo = useCallback((elapsed: number) => {
    const seconds = elapsed / 1000;
    for (const el of mediaSetRef.current) {
      const d = el.duration;
      if (!Number.isFinite(d) || d <= 0) continue;
      try {
        el.currentTime = seconds % d;
      } catch {
        // ignore
      }
    }
  }, []);

  const seekToMs = useCallback(
    (ms: number) => {
      syncRegisteredMediaTo(ms);
      setState((prev) => {
        const nextElapsed = clamp(ms, 0, Math.max(0, prev.durationMs));
        const next: MediaControllerState = { ...prev, elapsedMs: nextElapsed };
        emit("seek", next);
        persist(next);
        return next;
      });
    },
    [emit, persist, syncRegisteredMediaTo],
  );

  const setDurationMs = useCallback(
    (ms: number) => {
      setState((prev) => {
        const nextDuration = Math.max(10_000, ms);
        const nextElapsed = clamp(prev.elapsedMs, 0, nextDuration);
        const next: MediaControllerState = { ...prev, durationMs: nextDuration, elapsedMs: nextElapsed };
        emit("duration", next);
        persist(next);
        return next;
      });
    },
    [emit, persist],
  );

  const setAccentColor = useCallback(
    (color: string) => {
      setState((prev) => {
        if (!color || color === prev.accentColor) return prev;
        const next: MediaControllerState = { ...prev, accentColor: color };
        emit("state", next);
        persist(next);
        return next;
      });
    },
    [emit, persist],
  );

  const setUiLang = useCallback(
    (lang: "en" | "ar") => {
      setState((prev) => {
        if (lang === prev.uiLang) return prev;
        const next: MediaControllerState = { ...prev, uiLang: lang };
        emit("state", next);
        persist(next);
        return next;
      });
    },
    [emit, persist],
  );

  const registerMedia = useCallback((el: HTMLMediaElement) => {
    mediaSetRef.current.add(el);
    if (!stateRef.current.isPlaying) {
      try {
        el.pause();
      } catch {
        // ignore
      }
    } else {
      try {
        const d = el.duration;
        if (Number.isFinite(d) && d > 0) {
          el.currentTime = (stateRef.current.elapsedMs / 1000) % d;
        }
      } catch {
        // ignore
      }
      try {
        const r = el.play();
        if (r && typeof (r as any).catch === "function") (r as any).catch(() => undefined);
      } catch {
        // ignore
      }
    }
    return () => {
      mediaSetRef.current.delete(el);
      resumeSetRef.current.delete(el);
    };
  }, []);

  const setPrimaryAudioElement = useCallback((el: HTMLAudioElement | null) => {
    primaryAudioRef.current = el;
  }, []);

  const setPrimaryAudioMuted = useCallback((muted: boolean) => {
    const a = primaryAudioRef.current;
    if (a) a.muted = muted;
    setState((prev) => {
      const next = { ...prev, isMuted: muted };
      persist(next);
      return next;
    });
  }, [persist]);

  const setPrimaryAudioVolume = useCallback((volume: number) => {
    const v = clamp(volume, 0, 1);
    const a = primaryAudioRef.current;
    if (a) a.volume = v;
    setState((prev) => {
      const next = { ...prev, primaryVolume: v };
      persist(next);
      return next;
    });
  }, [persist]);

  const setPrimaryAudioSources = useCallback((candidates: string[], loop: boolean) => {
    const a = primaryAudioRef.current;
    if (!a) return;
    const normalized = candidates.filter(Boolean);
    if (!normalized.length) return;
    const current = a.currentSrc || a.src;
    if (current && normalized.includes(current)) {
      a.loop = loop;
      return;
    }
    primaryAudioCandidatesRef.current = normalized;
    primaryAudioTryIndexRef.current = 0;
    a.loop = loop;
    const tryNext = () => {
      const list = primaryAudioCandidatesRef.current;
      const idx = primaryAudioTryIndexRef.current++;
      if (!a || idx >= list.length) return;
      const next = list[idx];
      a.onerror = () => tryNext();
      a.src = next;
      a.load();
      if (stateRef.current.isPlaying) {
        const r = a.play();
        if (r && typeof (r as any).catch === "function") (r as any).catch(() => undefined);
      }
    };
    tryNext();
  }, []);

  const on = useCallback((eventName: MediaControllerEventName, handler: (state: MediaControllerState) => void) => {
    if (!targetRef.current) targetRef.current = new EventTarget();
    const target = targetRef.current;
    const listener = (e: Event) => handler((e as CustomEvent<MediaControllerState>).detail);
    target.addEventListener(eventName, listener as any);
    return () => target.removeEventListener(eventName, listener as any);
  }, []);

  useEffect(() => {
    if (!state.isPlaying) {
      lastTickRef.current = null;
      pauseAll();
      return;
    }
    playAll();
  }, [pauseAll, playAll, state.isPlaying]);

  useEffect(() => {
    if (!state.isPlaying) return;
    const id = window.setInterval(() => {
      setState((prev) => {
        if (!prev.isPlaying) return prev;
        const t = nowMs();
        const last = lastTickRef.current ?? t;
        lastTickRef.current = t;
        const delta = Math.max(0, t - last);
        const nextElapsed = clamp(prev.elapsedMs + delta, 0, Math.max(0, prev.durationMs));
        const next = nextElapsed === prev.elapsedMs ? prev : { ...prev, elapsedMs: nextElapsed };
        emit("tick", next);
        persist(next);
        return next;
      });
    }, 1000); // Tick every 1 second (sufficient for elapsed time tracking)
    return () => window.clearInterval(id);
  }, [emit, persist, state.isPlaying]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") pause();
      else if (document.visibilityState === "visible") {
        // Auto-resume when user returns to tab
        const ref = stateRef.current;
        if (ref.isPlaying) {
          setState((prev) => {
            const next = { ...prev, isPlaying: true };
            emit("play", next);
            persist(next);
            return next;
          });
        }
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [pause, emit, persist]);

  const actions = useMemo(
    () => ({
      play,
      pause,
      toggle,
      seekToMs,
      setDurationMs,
      setAccentColor,
      setUiLang,
      setPrimaryAudioElement,
      setPrimaryAudioSources,
      setPrimaryAudioVolume,
      setPrimaryAudioMuted,
      registerMedia,
      on,
    }),
    [
      on,
      pause,
      play,
      registerMedia,
      seekToMs,
      setAccentColor,
      setDurationMs,
      setPrimaryAudioElement,
      setPrimaryAudioMuted,
      setPrimaryAudioSources,
      setPrimaryAudioVolume,
      setUiLang,
      toggle,
    ],
  );

  return (
    <MediaStateContext.Provider value={state}>
      <MediaActionsContext.Provider value={actions}>
        {children}
      </MediaActionsContext.Provider>
    </MediaStateContext.Provider>
  );
}

export function useMediaController() {
  const state = useContext(MediaStateContext);
  const actions = useContext(MediaActionsContext);
  if (!state || !actions) throw new Error("useMediaController must be used within MediaControllerProvider");
  return { state, ...actions } as MediaControllerApi;
}

export { MediaControllerContext };
