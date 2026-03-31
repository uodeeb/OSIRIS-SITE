# OSIRIS Generated Video Background Assets — Technical + Creative Analysis

Source directory:
- `OSIRIS-SITE/generated-assets/video-bg/osiris-vid-bg`

Verified technical metadata:
- `OSIRIS-SITE/generated-assets/video-bg/osiris-vid-bg/_asset_specs.csv`

## Asset inventory (7 files)

### 1) Egyptian_falcon_eye_202603301359.mp4
- Technical: 1280×720, 24fps, H.264 (avc1), 8s
- Visual characteristics (inferred from filename): macro “falcon eye” focus; high-intensity central gaze motif; ideal for “system awakening / summons”
- Narrative relevance:
  - Inciting triggers (“افتح أوزيريس / Open OSIRIS”)
  - Moments of being watched / surveillance dread
- Used by composition: `FX-01-SUMMONS-EYE`

### 2) Falcon_hologram_data_202603301414.mp4
- Technical: 1280×720, 24fps, H.264 (avc1), 8s
- Visual characteristics (inferred): holographic falcon + flowing data overlays; “analysis output” feel
- Narrative relevance:
  - Evidence presentation, dashboards, pattern recognition, courtroom “proof”
  - “OSIRIS shows / reads / displays”
- Used by composition: `FX-03-HOLOGRAM-DATA`, `FX-07-TRUTH-LEAK`

### 3) Neural_network_forms_202603301407.mp4
- Technical: 1280×720, 24fps, H.264 (avc1), 8s
- Visual characteristics (inferred): abstract neural topology; synaptic structures; pattern matching vibe
- Narrative relevance:
  - Virus decomposition (six axes), correlation, “التطابق: 100%”
  - OSIRIS “reasoning layer” and verification framing (from the PDF’s architecture)
- Used by composition: `FX-04-NEURAL-ANALYSIS`, `FX-08-SOLEMN-DUST`

### 4) OSIRIS_falcon_hologram_202603301403.mp4
- Technical: 1280×720, 24fps, H.264 (avc1), 8s
- Visual characteristics (inferred): central falcon hologram; “system avatar” / identity mark
- Narrative relevance:
  - “entering simulation” ambience; inter-scene travel; OSIRIS presence without explicit speech
  - Red-alert overlays for breach moments
- Used by composition: `FX-05-HOLOGRAM-ORBIT`, `FX-06-ALERT-RED`, `FX-07-TRUTH-LEAK` fallback

### 5) OSIRIS_falcon_logo_202603301401.mp4
- Technical: 1280×720, 24fps, H.264 (avc1), 8s
- Visual characteristics (inferred): logo-forward identity shot; clean emblematic framing
- Narrative relevance:
  - Courtroom “interface identity”; OSIRIS voice lines; UI beats and scanlines
- Used by composition: `FX-02-INTERFACE-SCANLINES`

### 6) Medium_wide_shot_of_the_osiris_falcon_logo_re.gif
- Technical: 480×270 GIF (16:9)
- Visual characteristics (inferred): medium/wide logo framing; readable at small sizes
- Narrative relevance:
  - Low-bandwidth/reduced-motion fallback for logo/interface identity
- Used as fallback: `FX-02-INTERFACE-SCANLINES`

### 7) Slow_orbit_osiris_falcon_hologram_floating_i.gif
- Technical: 480×270 GIF (16:9), parsed fps estimate ~15.6 (GIF frame timing varies per file)
- Visual characteristics (inferred): slow orbit hologram; continuous ambient loop
- Narrative relevance:
  - Low-bandwidth/reduced-motion fallback for most OSIRIS “presence” effects
- Used as fallback: `FX-01`, `FX-03`, `FX-05`, `FX-08`

## Compatibility notes

- Aspect ratio: all assets are 16:9; safe to render with cover scaling + center-safe cropping.
- Frame rate: MP4s are 24fps; keep effects time-based (not frame-count based) to avoid drift.
- Audio: treat all background MP4s as muted layers.
