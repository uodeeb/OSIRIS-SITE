# OSIRIS Interactive Effects — Technical Implementation Brief

## 1) Technical asset specifications (verified from local files)

Source: `OSIRIS-SITE/generated-assets/video-bg/osiris-vid-bg/_asset_specs.csv`

- MP4 set (5 files)
  - Resolution: 1280×720 (16:9)
  - Frame rate: 24 fps
  - Video codec: H.264 (avc1)
  - Duration: 8s
  - Audio track: present (mp4a) in at least one file; keep `muted` in all background layers
- GIF set (2 files)
  - Resolution: 480×270 (16:9)
  - Used as low-bandwidth fallback and/or “reduced motion” mode

Color space note:
- MP4 `colr` box not detected in parsed metadata; treat the display pipeline as BT.709/sRGB and avoid aggressive grading that assumes HDR.

## 2) OSIRIS technical model specs (from the PDF)

Extracted to: `analysis/osiris_technical_guide.txt`

Key points that should influence UX/visual language:
- OSIRIS meaning: “Omniscient System for Historical Pattern Recognition and Intelligent Synthesis”
- Five-layer architecture:
  - Data ingestion (OCR, image extraction, metadata)
  - Processing (NLP via LLMs; vision-language models)
  - Temporal knowledge graph construction (TKG)
  - Reasoning (RLVR, PRMs, agentic reasoning)
  - Verification & output (multimodal verification + evidence-backed reports)
- Named technology examples inside the document:
  - LLMs: Llama 4, DeepSeek R1
  - VLMs: Qwen2.5-VL, Gemma 3, Kimi-VL
  - Temporal Graph Neural Networks (TGNs), TKG, RLVR, PRMs

Narrative relevance:
- Visually distinguish “analysis” vs “judgement”:
  - Analysis: neural/data motifs (FX-03/FX-04)
  - Judgement/courtroom voice: interface scanlines + austere palette (FX-02)
  - Verification/broadcast: glitch burst + white flash (FX-07)

## 3) Runtime libraries (recommended)

Phase 1 (no new dependencies; aligns with current codebase):
- React (already)
- Framer Motion (already) for fades, pulses, beats, and transitions
- Existing bandwidth gating (`useBandwidthStrategy`) (already)

Phase 2 (optional, to implement true shader-based effects):
- WebGL2 via a minimal in-house wrapper (recommended to avoid large deps)
  - One fullscreen quad, one fragment shader per preset
  - Uniforms driven by the composition mapping (palette + params)
- If a helper library is desired:
  - twgl.js (small) for shader/program/buffer boilerplate

## 4) Asset preload and scheduling

Preload order (highest priority first):
1. UI-critical: watermark/logo + core background image for first scene
2. Fallbacks: both GIFs for OSIRIS effect layer
3. First-scene base MP4 (1 video)
4. Next-scene background image + metadata for next MP4 (only if `allowVideo=true`)
5. Effect MP4s (cap concurrency; keep at most 2 prefetches ahead)

Caching:
- Prefer browser cache (HTTP) for CDN assets.
- For local/public assets, rely on Vite static serving; add `<link rel="preload" as="video">` selectively.

## 5) GPU memory budget (<128 MB per effect)

Budget model:
- One 1280×720 RGBA texture ≈ 3.5 MB
- Double buffer + 1–2 auxiliary textures stays comfortably below 128 MB if:
  - Only one shader pass is active per frame
  - No more than 2 simultaneous 720p video-backed layers on desktop

Mobile Safari guardrails:
- Prefer: background video + CSS overlays OR background image + GIF effect
- Avoid stacking multiple video elements; some devices throttle or fail decode.

## 6) Synchronization and timing

Tolerance requirement: ±50ms.

Implementation approach:
- Voice-synced mode:
  - Use `requestAnimationFrame` loop that reads `audio.currentTime`
  - Trigger cues when entering a time window and de-bounce per cue id
- Dialogue mode:
  - Trigger on `(sceneId, dialogueIndex)` transitions and use Framer Motion for deterministic animation timing

## 7) Accessibility requirements

- Background media:
  - Mark decorative layers as `aria-hidden="true"` and keep `alt=""` for decorative `<img>`
  - Do not trap focus in any overlay layers
- OSIRIS effect overlays:
  - Provide alt-text for meaningful overlays when shown as interactive content (e.g., “OSIRIS interface scanlines overlay”)
  - Respect `prefers-reduced-motion: reduce`:
    - Disable flicker/glitch, reduce particle drift to zero, and avoid rapid flashes
- Flash safety:
  - Cap flash opacity and frequency; avoid sequences that resemble strobe patterns

## 8) Testing matrix (visual coherence + narrative impact)

Desktop:
- Chrome (latest): baseline performance, WebGL2 path (if enabled)
- Edge (latest): baseline performance, video decode stability
- Firefox (latest): blend modes + CSS filters + WebGL2 shader correctness
- Safari (macOS): H.264 decode, autoplay policies, color rendering differences

Mobile:
- iOS Safari:
  - `playsInline`, autoplay gating, reduced-motion behavior
  - memory pressure behavior when switching scenes quickly
- Android Chrome:
  - network throttling (2G/slow-2g), save-data mode, thermal throttling

Test cases (run on each browser/device):
- Scene transitions: fade, glitch, alarm, montage
- OSIRIS mentions:
  - “Open OSIRIS” → FX-01 mapping fires and returns to baseline cleanly
  - “Security breach warning” → FX-06 mapping triggers flash+shake without over-flashing
  - “Truth leak” climax → FX-07 mapping triggers once, no loop thrash
- Bandwidth fallback:
  - `allowVideo=false` switches to GIF/CSS fallback without layout shift
- Reduced motion:
  - All motion effects disabled; readability preserved
- Audio sync:
  - Voice cue timestamps align within ±50ms (spot-check at least 5 cues)
