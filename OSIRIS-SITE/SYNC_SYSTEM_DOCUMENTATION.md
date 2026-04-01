# OSIRIS Sync System - Complete Documentation

## Overview

This document describes the complete sync system in OSIRIS-SITE that synchronizes script text with media elements (video, audio, images, music, voices, characters).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MediaControllerContext                             │
│  - Central state: isPlaying, elapsedMs, durationMs                  │
│  - Event system: "state", "tick", "play", "pause", "seek"       │
│  - 250ms tick interval for time tracking                          │
└─────────────────────────────────────────────────────────────────────┘
                              │
    ┌─────────────────────────┼─────────────────────────┐
    ▼                         ▼                         ▼
MainPlayer              CinematicStage           GlobalMediaLayer
(dialogueIndex)         (video/image)          (music tracks)
    │                         │                         │
    ▼                         │                         │
Voice Cues                  │                    SCENE_MUSIC_TRACKS
Image Overlays              │                         │
Character States             │                         ▼
Osiris Effects         Background Video          Music Crossfade
```

---

## 1. Voice Sync System

### Location
`client/src/components/MainPlayer.tsx` - Lines 22-135

### Data Structure
```typescript
interface VoiceCue {
  voice: number;      // Voice file number (1-20)
  at: number;        // Dialogue index to trigger
  lock?: boolean;    // Lock advance until voice ends
  dialogueStartMs?: number;  // Cumulative timing (for debugging)
}
```

### How It Works
1. When `dialogueIndex` changes, the effect searches for matching cue
2. If found, loads voice file: `/generated-assets/voices/VOICE-${NN}.wav`
3. Plays voice and optionally locks user advance (`lock: true`)
4. On `onended`, unlocks and advances (in auto mode)

### Adding New Voice Cues
```typescript
// In SCENE_VOICE_CUES:
'your-scene-id': [
  { voice: 5, at: 2, lock: true, dialogueStartMs: 15000 },
  { voice: 6, at: 7 },
],
```

---

## 2. Osiris AI Effect Layer

### Location
`client/src/components/MainPlayer.tsx` - Line 1076
`client/src/lib/osirisEffects.ts`

### Available Effects
| Effect ID | Description | Opacity |
|-----------|-------------|---------|
| FX-01-SUMMONS-EYE | Falcon eye for summons | 0.24 |
| FX-02-INTERFACE-SCANLINES | CRT scanlines | 0.22 |
| FX-03-HOLOGRAM-DATA | Hologram data stream | 0.22 |
| FX-04-NEURAL-ANALYSIS | Neural pattern analysis | 0.22 |
| FX-05-HOLOGRAM-ORBIT | Slow orbit hologram | 0.22 |
| FX-06-ALERT-RED | Red alert flash | 0.28 |
| FX-07-TRUTH-LEAK | Glitch burst | 0.26 |
| FX-08-SOLEMN-DUST | Desaturated dust | 0.20 |

### Auto-Detection
Effects are auto-detected based on scene content:
- Scene ID contains "osiris" → FX-05
- Text contains "تحذير" or "اختراق" → FX-06
- Text contains "تسريب" or "100%" → FX-07
- `visualEffect: "scanlines"` or "cctv" → FX-02

---

## 3. Character Emotion System

### Location
`client/src/components/MainPlayer.tsx` - Lines 420-510

### Emotion Types
```typescript
type CharacterEmotion = 
  | 'neutral' 
  | 'fearful' 
  | 'sad' 
  | 'angry' 
  | 'shocked' 
  | 'dying' 
  | 'determined' 
  | 'ghost' 
  | 'breakdown';

type CharacterEffect = 
  | 'pulse'     // Gentle breathing
  | 'glitch'    // Horizontal shake
  | 'flash'     // Bright flash
  | 'ghost'     // Fading opacity
  | 'none';
```

### Character Filters
```typescript
const CHARACTER_FILTERS: Record<CharacterEmotion, string> = {
  neutral: 'none',
  fearful: 'brightness(0.9) contrast(1.1)',
  sad: 'saturate(0.7) brightness(0.85)',
  angry: 'brightness(1.1) contrast(1.2) saturate(1.2)',
  shocked: 'brightness(1.3) contrast(1.3)',
  dying: 'saturate(0.5) brightness(0.7) sepia(0.3)',
  determined: 'brightness(1.05) contrast(1.1)',
  ghost: 'saturate(0.3) brightness(1.2) opacity(0.7)',
  breakdown: 'saturate(0.6) brightness(0.8) blur(0.5px)',
};
```

### Scene-to-Character Mapping
```typescript
const SCENE_CHARACTER_STATES: Record<string, CharacterState> = {
  'zero-1-1-summons': { emotion: 'fearful', effect: 'pulse' },
  'one-1-5-4-sacrifice': { emotion: 'sad', effect: 'ghost' },
  // ... 32+ scenes mapped
};
```

---

## 4. Image Overlay System

### Location
`client/src/components/MainPlayer.tsx` - Lines 137-418

### Animation Types
```typescript
type ImageAnimationType = 'fade' | 'zoom' | 'glitch' | 'pulse' | 'scan' | 'warp';
```

### Data Structure
```typescript
interface ImageCue {
  src: string;           // Image path
  points: number[];      // Dialogue indices to show
  opacity?: number;      // 0-1, default 0.4
  blend?: string;       // CSS blend mode
  token: string;         // Unique identifier
  animation?: ImageAnimationType;
}
```

### Scene Mappings
Each scene has image overlays at specific dialogue points with animations:
- `zero-1-1-summons`: 01.jpg at [0,4], pulse animation
- `one-1-5-4-sacrifice`: 03.jpg at [2,5], zoom animation
- `three-3-1b-devil-song`: 04.jpg at [0,4], glitch animation
- etc.

---

## 5. Music BG Overlay System

### Location
`client/src/components/MainPlayer.tsx` - Lines 526-710

### Data Structure
```typescript
interface MusicTrack {
  primary: string;        // Main music track path
  secondary?: string[];  // Layer tracks
  volume?: number;        // 0-1
  fadeDuration?: number; // Crossfade duration in ms
}
```

### Available Tracks
| Track | File | Use Case |
|-------|------|----------|
| TRACK-01.mp3 | Main Theme | Default/intro |
| TRACK 02 | Cosmic Courtroom | Part 0 scenes |
| TRACK 03 | Iblis Theme | Cosmic/demonic |
| TRACK-04.m4a | Tariq Tragedy | Sad/memoriam |
| TRACK 05 | Golden Calf | Egypt/desert |
| TRACK 06 | Nicaea | Byzantine/church |
| TRACK 07 | Andalus Elegy | Andalusia |
| TRACK 08 | Totalitarian Horror | 20th century |
| TRACK 09 | Karbala Spiritual | Sacrifice |
| TRACK 10 | Digital Confrontation | Final battle |
| TRACK 12 | Action Escape | Chase/danger |
| TRACK 13 | Dream Before Battle | Transition |
| TRACK 14 | Credits Finale | Ending |

### Scene Music Mappings
```typescript
const SCENE_MUSIC_TRACKS: Record<string, MusicTrack> = {
  'zero-1-1-summons': { primary: '/music/TRACK-01.mp3', volume: 0.25 },
  'zero-1-2-prosecution': { 
    primary: '/music/TRACK 02 — الجزء الصفر-غرفة المحاكمة الكونية.m4a',
    secondary: ['/music/TRACK-01.mp3'],
    volume: 0.3, fadeDuration: 3000
  },
  // ... 30+ scenes mapped
};
```

### Crossfade Implementation
- 15 fade steps over configurable duration (default 2000ms)
- Track switches at midpoint of fade
- Smooth transition between scenes

---

## 6. Media Controller Context

### Location
`client/src/contexts/MediaControllerContext.tsx`

### State
```typescript
type MediaControllerState = {
  isPlaying: boolean;
  elapsedMs: number;
  durationMs: number;
  accentColor: string;
  uiLang: "en" | "ar";
  isMuted: boolean;
  primaryVolume: number;
};
```

### API
```typescript
type MediaControllerApi = {
  state: MediaControllerState;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seekToMs: (ms: number) => void;
  registerMedia: (el: HTMLMediaElement) => () => void;
  on: (eventName, handler) => () => void;
  // ... audio controls
};
```

### Events
- `"state"` - Any state change
- `"tick"` - 250ms interval update
- `"play"` - Play started
- `"pause"` - Play paused
- `"seek"` - Seek performed
- `"duration"` - Duration changed

---

## 7. Source Data

### Script Location
`script/OSIRIS_Final_Interactive_Script.md` (1183 lines)

### Scene System
`client/src/lib/sceneSystem.ts` (2488 lines)

Contains all scenes with:
- Dialogue lines with timing
- Character assignments
- Background media
- Visual effects
- Music keys

---

## How to Modify

### Add Voice to Scene
```typescript
// In SCENE_VOICE_CUES:
'zero-1-1-summons': [
  ...existing cues...
  { voice: 19, at: 5 },  // Add at dialogue index 5
],
```

### Add Image Overlay
```typescript
// In SCENE_IMAGE_CUES:
'zero-1-1-summons': { 
  src: '/generated-assets/images/NEW.jpg',
  points: [3, 7],  // Show at dialogue 3 and 7
  opacity: 0.25,
  blend: 'screen',
  token: 'cue-new',
  animation: 'glitch'
},
```

### Add Character Emotion
```typescript
// In SCENE_CHARACTER_STATES:
'zero-1-1-summons': { emotion: 'fearful', effect: 'pulse' },
```

### Add Scene Music
```typescript
// In SCENE_MUSIC_TRACKS:
'your-scene': {
  primary: '/music/YOUR-TRACK.m4a',
  volume: 0.4,
  fadeDuration: 2000
},
```

### Add Osiris Effect
Effects are auto-detected, or use:
```typescript
<OsirisEffectLayer effectId="FX-06-ALERT-RED" allowVideo={true} />
```

---

## Testing Checklist

- [ ] Voices play at correct dialogue index
- [ ] Voice timing logs appear in console
- [ ] Image overlays appear with correct animation
- [ ] Character portrait shows emotion filter
- [ ] Character glow effect activates
- [ ] Music crossfades between scenes
- [ ] Osiris effect layer renders
- [ ] No console errors on scene transitions

---

## Performance Notes

- Voices lazy-loaded on demand
- Images use `decoding="async"`
- Videos use `preload="metadata"`
- Osiris effects preload in background
- Music crossfade uses 15 steps (configurable)

---

## Future Improvements

1. **Time-based sync**: Replace dialogueIndex with elapsedMs for more precise timing
2. **Lip sync**: Match voice audio to character portrait mouth movement
3. **Procedural music**: Generate music layers based on emotional profile
4. **Subtitle sync**: Sync subtitles with voice audio duration
5. **Ambient audio layers**: Add environmental sounds that blend with music
