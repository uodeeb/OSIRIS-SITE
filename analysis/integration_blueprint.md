# OSIRIS Interactive Effects — Integration Blueprint

## 1) Scope and baseline assumptions

- Target runtime: OSIRIS-SITE client “cinema-mode” presentation (MainPlayer + CinematicStage).
- Effect sources: generated background assets in `OSIRIS-SITE/generated-assets/video-bg/osiris-vid-bg` plus CDN assets already referenced by scenes.
- Cue authority (highest → lowest):
  - Voice-over timestamp (when voice-sync mode is active).
  - Dialogue progression (on each dialogue index change).
  - Explicit interaction events (clicking interactive elements).
  - Scroll position (for any scroll-driven reading mode).

## 2) Inputs and data products

- Master mapping spreadsheet: `analysis/osiris_master_mapping.csv`
  - Each row maps an OSIRIS reference (line/timestamp/text) to an effect composition and full render parameters.
- Effect catalog: `analysis/osiris_effect_compositions.json`
  - Composition definitions: base asset, fallback asset, palette, shader preset + params, particle preset + params, compatibility notes.

## 3) Runtime cue resolution

### 3.1 Cue keys

- Scene-level key: `sceneId` from `Scene` in `sceneSystem.ts`.
- Dialogue-level key: `(sceneId, dialogueIndex)`.
- Voice-level key: `(sceneId, voiceTimeMs)` (quantized to a tolerance window).

### 3.2 Resolution algorithm

1. If voice-sync is active:
   - Use voice time as the primary clock.
   - Select the newest cue where `abs(voiceTimeMs - cueTimeMs) ≤ 50ms`.
2. Else:
   - On `dialogueIndex` change, select effect by scanning current dialogue text for OSIRIS mentions and/or using a precomputed `(sceneId, dialogueIndex) -> effectId` table.
3. If user triggers an explicit interaction:
   - Temporarily override the current effect for a short “beat window” (e.g., 400–1200ms), then return to the scene’s baseline effect.

## 4) Layering model (z-order rules)

This matches existing `CinematicStage` layering conventions and extends them with one additional “OSIRIS Effect Layer”.

- z0: Background image (`bgImageSrc`)
- z1: Background video (`bgVideoSrc`, muted, looped, single decoder)
- z2: Emotional gradient overlay (`overlay`)
- z3: Film grain + vignette
- z5: Scanlines/CCTV overlay (`scene.visualEffect === "scanlines" | "cctv"`)
- z6: OSIRIS watermark/logo (already present)
- z7: OSIRIS Effect Layer (new; driven by composition mapping)
- z8: Tech overlays (existing `techBoost` screen tints / sweeps)
- z9: Flash/glitch burst overlays (existing `fx.flash`, `scene.visualEffect === "glitch" | "alarm"`)
- z10: Letterbox bars
- z20+: UI text, dialogue, controls, prompts

Rule: never run more than one full-resolution (720p+) background video + one additional video overlay on mobile Safari; prefer GIF/CPU overlays for the effect layer on constrained devices.

## 5) Effect compositions → engine primitives

Each effect composition resolves to a bundle:

- Base media: MP4 (preferred) or GIF fallback.
- Visual modifiers:
  - CSS filters (brightness/saturate/contrast), vignette, scanlines (existing).
  - Optional WebGL shader pass (recommended as a second phase).
- Particles:
  - Phase 1: DOM/Framer particles (low count).
  - Phase 2: GPU particles (single WebGL layer), capped by GPU memory budget.

Recommended mapping of composition presets to existing engine switches:

- `FX-02-INTERFACE-SCANLINES` → `scene.visualEffect="scanlines"` + OSIRIS Effect Layer set to base asset.
- `FX-06-ALERT-RED` → `scene.visualEffect="alarm"` + `burstFx({ flash, shake, ui })` beat + red grade.
- `FX-07-TRUTH-LEAK` → `scene.visualEffect="glitch"` + flash beats + high-intensity techBoost sweep.

## 6) Trigger events and transitions

### 6.1 Trigger events

- Scene entry:
  - On `currentSceneId` change: set baseline effect from the scene’s emotional tone.
- Dialogue progression:
  - On `dialogueIndex` change: apply the mapped effect for OSIRIS mentions, otherwise keep baseline.
- Voice-over timestamp:
  - On `timeupdate`/`rAF` loop for narration audio: apply mapped cue when within ±50ms.
- User click:
  - Click to advance dialogue: also triggers short “UI pulse” beat when the new line references OSIRIS.
- Scroll position (optional mode):
  - For scroll presentation, create anchors per paragraph/line; effect triggers at anchor activation and eases out between anchors.

### 6.2 Transition curves

- Fade (default):
  - Duration: 800ms
  - Curve: `easeOut` (Framer default)
- Glitch cut (alerts / truth leak):
  - Duration: 350–450ms
  - Curve: `easeInOut`
  - Add 1–2 flash pulses (`fx.flash`) inside the window
- Morph / “enter simulation”:
  - Duration: 1100–1400ms
  - Curve: `cubic-bezier(0.2, 0.9, 0.2, 1)`
  - Use scanlines and a slow zoom (Ken Burns motion already present)

## 7) Responsive scaling and breakpoints

Breakpoints (align to Tailwind defaults):

- Mobile: `<640px`
  - Prefer a single background video; effect layer uses GIF or CSS overlay.
  - Particle count ÷ 2.
- Tablet: `640–1024px`
  - Allow video effect overlays when `allowVideo=true`.
- Desktop: `>1024px`
  - Allow full composition (video + shader + particles) within GPU budget.

Scaling rules:

- Always render media with “cover” semantics (center-safe crop).
- Preserve a “center-safe region” of ~15% margin; keep critical UI away from edges.
- Avoid `background-attachment: fixed` for mobile Safari.

## 8) Low-bandwidth and reduced-motion fallbacks

Use existing `useBandwidthStrategy()`:

- If `allowVideo=false`:
  - Use GIF fallback asset if available.
  - If GIF unavailable/unreliable: use CSS gradient + OSIRIS logo watermark + scanlines at low opacity.
- If `prefers-reduced-motion: reduce`:
  - Disable flicker/glitch, reduce scanlines intensity, disable particle drift, keep only a static grade.

## 9) Deliverables that plug into the codebase

- Data:
  - `analysis/osiris_master_mapping.csv` for editorial review and tuning.
  - Optionally generate a runtime-friendly JSON cue table:
    - Keyed by `(sceneId, dialogueIndex)` and `(sceneId, timeMs)`.
- UI layer:
  - Add a dedicated OSIRIS Effect Layer component rendered at z7.
  - Drive it from the cue table and the current playback state.
