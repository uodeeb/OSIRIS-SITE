export type OsirisEffectId =
  | "FX-01-SUMMONS-EYE"
  | "FX-02-INTERFACE-SCANLINES"
  | "FX-03-HOLOGRAM-DATA"
  | "FX-04-NEURAL-ANALYSIS"
  | "FX-05-HOLOGRAM-ORBIT"
  | "FX-06-ALERT-RED"
  | "FX-07-TRUTH-LEAK"
  | "FX-08-SOLEMN-DUST";

export type OsirisMediaRef = {
  relativePath: string;
  width: number;
  height: number;
  fps?: number | null;
  durationSec?: number | null;
};

export type OsirisEffectComposition = {
  effectId: OsirisEffectId;
  label: string;
  base: OsirisMediaRef;
  fallback: OsirisMediaRef;
  palette: string[];
  shaderPreset: string;
  shaderParams: Record<string, unknown>;
  particlePreset: string;
  particleParams: Record<string, unknown>;
};

export const OSIRIS_EFFECTS: Record<OsirisEffectId, OsirisEffectComposition> = {
  "FX-01-SUMMONS-EYE": {
    effectId: "FX-01-SUMMONS-EYE",
    label: "Summons / Falcon Eye",
    base: {
      relativePath: "assets/video-bg/digital-space.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    fallback: {
      relativePath: "assets/video-bg/cosmic-opening.mp4",
      width: 480,
      height: 270,
      fps: 15.625,
      durationSec: 0.32,
    },
    palette: ["#05060a", "#00e5ff", "#2a5cff", "#d4af37", "#ff2d2d"],
    shaderPreset: "irisGlow+crtSubtle",
    shaderParams: {
      irisPulseHz: 0.8,
      glowIntensity: 0.55,
      glowColor: "#00e5ff",
      vignette: 0.45,
      scanlineIntensity: 0.1,
      chromaAberration: 0.002,
      noise: 0.08,
    },
    particlePreset: "microDust",
    particleParams: { count: 80, sizePx: [0.8, 1.6], speed: 0.12, opacity: [0.0, 0.18] },
  },
  "FX-02-INTERFACE-SCANLINES": {
    effectId: "FX-02-INTERFACE-SCANLINES",
    label: "OSIRIS Interface / Scanlines",
    base: {
      relativePath: "assets/video-bg/digital-space.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    fallback: {
      relativePath: "assets/video-bg/enter-key.mp4",
      width: 480,
      height: 270,
    },
    palette: ["#000814", "#00e5ff", "#2a5cff", "#0b132b", "#ffffff"],
    shaderPreset: "crtScanlines+vignette",
    shaderParams: {
      scanlineIntensity: 0.22,
      scanlineDensity: 1.35,
      bloom: 0.25,
      vignette: 0.5,
      noise: 0.12,
      flickerHz: 0.6,
    },
    particlePreset: "floatingPoints",
    particleParams: { count: 120, sizePx: [0.6, 1.4], speed: 0.08, opacity: [0.0, 0.22] },
  },
  "FX-03-HOLOGRAM-DATA": {
    effectId: "FX-03-HOLOGRAM-DATA",
    label: "Hologram Data Stream",
    base: {
      relativePath: "assets/video-bg/cosmic-opening.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    fallback: {
      relativePath: "assets/video-bg/digital-space.mp4",
      width: 480,
      height: 270,
      fps: 15.625,
      durationSec: 0.32,
    },
    palette: ["#02030a", "#00e5ff", "#00ff9d", "#2a5cff", "#c8fff4"],
    shaderPreset: "dataRain+edgeGlow",
    shaderParams: { dataDensity: 0.6, edgeGlow: 0.35, gamma: 1.08, contrast: 1.12, scanlineIntensity: 0.12 },
    particlePreset: "lineParticles",
    particleParams: { count: 160, lengthPx: [6, 18], speed: 0.22, opacity: [0.02, 0.18] },
  },
  "FX-04-NEURAL-ANALYSIS": {
    effectId: "FX-04-NEURAL-ANALYSIS",
    label: "Neural Analysis / Pattern Match",
    base: {
      relativePath: "assets/video-bg/digital-space.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    fallback: {
      relativePath: "assets/video-bg/enter-key.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    palette: ["#05060a", "#6cf0ff", "#9b5cff", "#00ff9d", "#ffffff"],
    shaderPreset: "neuralPulse+colorShift",
    shaderParams: { pulseHz: 0.9, pulseIntensity: 0.45, hueShift: 0.06, vignette: 0.38, noise: 0.1 },
    particlePreset: "synapseNodes",
    particleParams: { count: 220, linkProb: 0.12, speed: 0.15, opacity: [0.03, 0.2] },
  },
  "FX-05-HOLOGRAM-ORBIT": {
    effectId: "FX-05-HOLOGRAM-ORBIT",
    label: "Falcon Hologram / Slow Orbit",
    base: {
      relativePath: "assets/video-bg/cosmic-opening.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    fallback: {
      relativePath: "assets/video-bg/digital-space.mp4",
      width: 480,
      height: 270,
      fps: 15.625,
      durationSec: 0.32,
    },
    palette: ["#000000", "#00e5ff", "#2a5cff", "#00ff9d", "#0b132b"],
    shaderPreset: "hologramFlicker",
    shaderParams: { flickerHz: 0.35, flickerAmp: 0.18, bloom: 0.32, scanlineIntensity: 0.18 },
    particlePreset: "ionMist",
    particleParams: { count: 90, sizePx: [2, 8], speed: 0.05, opacity: [0.01, 0.12] },
  },
  "FX-06-ALERT-RED": {
    effectId: "FX-06-ALERT-RED",
    label: "Security Breach / Red Alert",
    base: {
      relativePath: "assets/video-bg/digital-space.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    fallback: {
      relativePath: "assets/video-bg/enter-key.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    palette: ["#05060a", "#ff2d2d", "#ff7a00", "#00e5ff", "#ffffff"],
    shaderPreset: "uiRedFlash+glitchMinor",
    shaderParams: { flashHz: 2.4, flashIntensity: 0.85, glitch: 0.25, shakePx: 6, vignette: 0.55 },
    particlePreset: "sparks",
    particleParams: { count: 140, sizePx: [1, 3], speed: 0.35, opacity: [0.05, 0.3] },
  },
  "FX-07-TRUTH-LEAK": {
    effectId: "FX-07-TRUTH-LEAK",
    label: "Truth Leak / Glitch Burst",
    base: {
      relativePath: "assets/video-bg/cosmic-opening.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    fallback: {
      relativePath: "assets/video-bg/digital-space.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    palette: ["#000000", "#ffffff", "#00e5ff", "#2a5cff", "#ff2d2d"],
    shaderPreset: "glitchBurst+whiteFlash",
    shaderParams: { burstEverySec: 1.6, burstIntensity: 0.75, whiteFlash: 0.6, scanlineIntensity: 0.25, noise: 0.2 },
    particlePreset: "fragmentShards",
    particleParams: { count: 260, sizePx: [1, 6], speed: 0.28, opacity: [0.02, 0.22] },
  },
  "FX-08-SOLEMN-DUST": {
    effectId: "FX-08-SOLEMN-DUST",
    label: "Solemn / Desaturated Dust",
    base: {
      relativePath: "assets/video-bg/enter-key.mp4",
      width: 1280,
      height: 720,
      fps: 24,
      durationSec: 8,
    },
    fallback: {
      relativePath: "assets/video-bg/cosmic-opening.mp4",
      width: 480,
      height: 270,
      fps: 15.625,
      durationSec: 0.32,
    },
    palette: ["#0b0b0d", "#8a8a8f", "#d4af37", "#3b3b43", "#ffffff"],
    shaderPreset: "desaturate+filmGrain+slowZoom",
    shaderParams: { desat: 0.82, grain: 0.18, vignette: 0.62, zoom: 1.06, zoomSec: 18 },
    particlePreset: "dust",
    particleParams: { count: 220, sizePx: [0.8, 2.4], speed: 0.08, opacity: [0.02, 0.16] },
  },
};

function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/[^0-9a-z\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\s]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectOsirisEffectId(args: {
  sceneId: string;
  sceneTitle?: string;
  sceneArabicTitle?: string;
  visualEffect?: string;
  text?: string;
  arabicText?: string;
}): OsirisEffectId | null {
  const joined = norm(
    `${args.sceneId} ${args.sceneTitle || ""} ${args.sceneArabicTitle || ""} ${args.text || ""} ${args.arabicText || ""}`,
  );

  const hasOsiris = joined.includes("osiris") || joined.includes("اوزيريس") || joined.includes("أوزيريس") || joined.includes("اوزيرس") || joined.includes("أوزيرس");
  if (!hasOsiris) {
    if (args.sceneId.includes("osiris") || (args.sceneTitle || "").includes("OSIRIS") || (args.sceneArabicTitle || "").includes("أوزيريس")) {
      return "FX-05-HOLOGRAM-ORBIT";
    }
    return null;
  }

  if (joined.includes("افتح") && (joined.includes("أوزيريس") || joined.includes("اوزيريس") || joined.includes("osiris"))) return "FX-01-SUMMONS-EYE";
  if (joined.includes("تحذير") || joined.includes("اختراق") || joined.includes("breach") || joined.includes("alarm")) return "FX-06-ALERT-RED";
  if (joined.includes("التطابق") || joined.includes("100") || joined.includes("تفريغ") || joined.includes("تسريب") || joined.includes("broadcast")) return "FX-07-TRUTH-LEAK";
  if (joined.includes("محاكاة") || joined.includes("الفضاء الرقمي") || joined.includes("simulation")) return "FX-05-HOLOGRAM-ORBIT";
  if (joined.includes("تحليل") || joined.includes("بيانات") || joined.includes("قراءات") || joined.includes("تفكيك") || joined.includes("pattern")) return "FX-04-NEURAL-ANALYSIS";
  if (args.visualEffect === "scanlines" || args.visualEffect === "cctv") return "FX-02-INTERFACE-SCANLINES";
  return "FX-03-HOLOGRAM-DATA";
}

export function getOsirisMediaUrl(media: OsirisMediaRef) {
  return `/${media.relativePath.replace(/^\/+/, "")}`;
}

export function getOsirisEffectOpacity(effectId: OsirisEffectId) {
  if (effectId === "FX-06-ALERT-RED") return 0.28;
  if (effectId === "FX-07-TRUTH-LEAK") return 0.26;
  if (effectId === "FX-02-INTERFACE-SCANLINES") return 0.22;
  if (effectId === "FX-01-SUMMONS-EYE") return 0.24;
  if (effectId === "FX-08-SOLEMN-DUST") return 0.2;
  return 0.22;
}

export function preloadOsirisEffects(allowVideo: boolean) {
  if (typeof window === "undefined") return;
  const effects = Object.values(OSIRIS_EFFECTS);
  if (allowVideo) {
    for (const e of effects) {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.muted = true;
      v.playsInline = true as any;
      v.src = getOsirisMediaUrl(e.base);
    }
    return;
  }
  for (const e of effects) {
    const img = new Image();
    img.decoding = "async";
    img.src = getOsirisMediaUrl(e.fallback);
  }
}
