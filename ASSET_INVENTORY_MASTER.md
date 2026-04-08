# OSIRIS Asset Inventory - Master Document
> **One Source of Truth for Asset Mapping**
> Generated: 2026-04-08
> Status: REVIEW REQUIRED

---

## EXECUTIVE SUMMARY

### Critical Issues Found
| Issue Type | Count | Impact |
|------------|-------|--------|
| **Missing ambient audio files** | 10+ | Console errors, missing atmosphere |
| **Missing scene background images** | 8+ | `sceneBg.*` keys not in manifest |
| **Case mismatches in audio** | All tracks | Code uses `TRACK-01`, files are `track-01` |
| **Wrong voice paths** | Multiple | Code: `new-voices/VOICE01.mp3`, Actual: `voices/voice-01.wav` |
| **Missing narrator.png** | 1 | Code uses `narrator.png`, actual: `narrator-visual.png` |
| **Manifest loading race condition** | 1 | Components use assets before manifest loads |

---

## PART 1: ACTUAL ASSET FILES

### 1.1 Characters (21 files)
| Filename | Mapped Key | Status |
|----------|------------|--------|
| `yahya-portrait.jpeg` | `character.yahya-portrait` | ✅ OK |
| `yahya-breakdown.jpeg` | `character.yahya-breakdown` | ✅ OK |
| `yahya-confront.jpeg` | `character.yahya-confront` | ✅ OK |
| `laila-portrait.jpeg` | `character.laila-portrait` | ✅ OK |
| `laila-faith.jpeg` | `character.laila-faith` | ✅ OK |
| `laila-witness.jpeg` | `character.laila-witness` | ✅ OK |
| `tarek-portrait.jpeg` | `character.tarek-portrait` | ✅ OK |
| `tarek-ghost.jpeg` | `character.tarek-ghost` | ✅ OK |
| `tarek-dream.jpeg` | `character.tarek-dream` | ✅ OK |
| `first-engineer-portrait.jpeg` | `character.first-engineer-portrait` | ✅ OK |
| `first-engineer-portrait-02.jpeg` | `character.first-engineer-portrait-02` | ✅ OK |
| `first-engineer-confront.jpeg` | `character.first-engineer-confront` | ✅ OK |
| `first-engineer-exposed.jpeg` | `character.first-engineer-exposed` | ✅ OK |
| `arius.jpeg` | `character.arius` | ✅ OK |
| `athanasius.jpeg` | `character.athanasius` | ✅ OK |
| `samiri-portrait.jpeg` | `character.samiri-portrait` | ✅ OK |
| `samiri-calf.png` | `character.samiri-calf` | ✅ OK |
| `constantine-portrait.jpeg` | `character.constantine-portrait` | ✅ OK |
| `ramses.jpg` | `character.ramses` | ✅ OK |
| `ramses-01.jpg` | `character.ramses-01` | ✅ OK |
| `narrator-visual.png` | `character.narrator-visual` | ✅ OK |

**⚠️ ISSUE:** Code references `character.narrator` but file is `narrator-visual.png` (alias exists in assets.ts)

---

### 1.2 Background Images (12 files)
| Filename | Mapped Key | Status |
|----------|------------|--------|
| `01.jpg` | `background.01` | ✅ OK |
| `02.jpg` | `background.02` | ✅ OK |
| `03.jpg` | `background.03` | ✅ OK |
| `04.jpg` | `background.04` | ✅ OK |
| `05.jpg` | `background.05` | ✅ OK |
| `06.jpg` | `background.06` | ✅ OK |
| `07.jpg` | `background.07` | ✅ OK |
| `egypt-nile-temple02.jpg` | `background.egypt-nile-temple02` | ✅ OK |
| `logo-new-flow01.png` | `background.logo-new-flow01` | ✅ OK |
| `logo-new-flow02.png` | `background.logo-new-flow02` | ✅ OK |
| `logo-new-flow01-upscayl-1x-digital-art-4x.png` | - | ⚠️ Unmapped |
| `logo-new-flow02-upscayl-1x-digital-art-4x.png` | - | ⚠️ Unmapped |

---

### 1.3 Music Tracks (28 files)
All files use **lowercase naming** (`track-01.mp3`), but code references **uppercase** (`TRACK-01.mp3`)

| Filename | Manifest Key | Code Reference | Status |
|----------|--------------|----------------|--------|
| `main-theme.mp3` | `audio.main-theme` | - | ✅ OK |
| `track-01.mp3` | `audio.track-01` | `TRACK-01.mp3` | ⚠️ CASE MISMATCH |
| `track-01-alt.mp3` | `audio.track-01-alt` | - | ✅ OK |
| `track-02.m4a` | `audio.track-02` | `TRACK-02.m4a` | ⚠️ CASE MISMATCH |
| `track-03.mp3` | `audio.track-03` | - | ✅ OK |
| `track-04.m4a` | `audio.track-04` | - | ✅ OK |
| `track-04-alt.m4a` | `audio.track-04-alt` | - | ✅ OK |
| `track-04-mp3.mp3` | `audio.track-04-mp3` | - | ✅ OK |
| `track-05.m4a` | `audio.track-05` | - | ✅ OK |
| `track-05-alt.m4a` | `audio.track-05-alt` | - | ✅ OK |
| `track-06.m4a` | `audio.track-06` | - | ✅ OK |
| `track-06-alt.m4a` | `audio.track-06-alt` | - | ✅ OK |
| `track-07.m4a` | `audio.track-07` | - | ✅ OK |
| `track-07-alt.m4a` | `audio.track-07-alt` | - | ✅ OK |
| `track-08.m4a` | `audio.track-08` | - | ✅ OK |
| `track-08-alt.m4a` | `audio.track-08-alt` | - | ✅ OK |
| `track-09.m4a` | `audio.track-09` | - | ✅ OK |
| `track-09-alt.m4a` | `audio.track-09-alt` | - | ✅ OK |
| `track-10.m4a` | `audio.track-10` | - | ✅ OK |
| `track-10-alt.m4a` | `audio.track-10-alt` | - | ✅ OK |
| `track-11.m4a` | `audio.track-11` | - | ✅ OK |
| `track-11-alt.m4a` | `audio.track-11-alt` | - | ✅ OK |
| `track-12.m4a` | `audio.track-12` | - | ✅ OK |
| `track-12-alt.m4a` | `audio.track-12-alt` | - | ✅ OK |
| `track-13.m4a` | `audio.track-13` | - | ✅ OK |
| `track-13-alt.m4a` | `audio.track-13-alt` | - | ✅ OK |
| `track-14.m4a` | `audio.track-14` | - | ✅ OK |
| `track-14-alt.m4a` | `audio.track-14-alt` | - | ✅ OK |

---

### 1.4 Video Backgrounds (19 files)
| Filename | Manifest Key | Status |
|----------|--------------|--------|
| `intro.mp4` | `videoBg.intro` | ✅ OK |
| `yahya-room.mp4` | `videoBg.yahya-room` | ✅ OK |
| `cosmic-opening.mp4` | `videoBg.cosmic-opening` | ✅ OK |
| `tarek-rooftop.mp4` | `videoBg.tarek-rooftop` | ✅ OK |
| `sinai-desert.mp4` | `videoBg.sinai-desert` | ✅ OK |
| `molten-gold.mp4` | `videoBg.molten-gold` | ✅ OK |
| `nicaea.mp4` | `videoBg.nicaea` | ✅ OK |
| `granada-fall.mp4` | `videoBg.granada-fall` | ✅ OK |
| `abu-abdullah-tears.mp4` | `videoBg.abu-abdullah-tears` | ✅ OK |
| `berlin-1933.mp4` | `videoBg.berlin-1933` | ✅ OK |
| `karbala.mp4` | `videoBg.karbala` | ✅ OK |
| `digital-space.mp4` | `videoBg.digital-space` | ✅ OK |
| `enter-key.mp4` | `videoBg.enter-key` | ✅ OK |
| `desert.mp4` | `videoBg.desert` | ✅ OK |
| `andalus.mp4` | `videoBg.andalus` | ✅ OK |
| `egypt-nile-temple.mp4` | `videoBg.egypt-nile-temple` | ✅ OK |
| `yehya-office-vid.mp4` | `videoBg.yehya-office-vid` | ✅ OK |
| `karblaa.mp4` | `videoBg.karblaa` | ✅ OK |
| `clean-modern-logo-animation.mp4` | `videoBg.clean-modern-logo-animation` | ✅ OK |

---

### 1.5 Voice Files (18 files)
| Filename | Status | Notes |
|----------|--------|-------|
| `voice-01-.wav` / `voice-01.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-02-.wav` / `voice-02.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-03-.wav` / `voice-03.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-04-.wav` / `voice-04.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-05-.wav` / `voice-05.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-06-.wav` / `voice-06.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-07-.wav` / `voice-07.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-08-.wav` / `voice-08.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-09-.wav` / `voice-09.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-10-.wav` / `voice-10.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-11-.wav` / `voice-11.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-12-.wav` / `voice-12.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-13-.wav` / `voice-13.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-14-.wav` / `voice-14.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-15-.wav` / `voice-15.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-16-.wav` / `voice-16.wav` | ⚠️ DUPLICATE | Two versions with/without trailing dash |
| `voice-17.wav` | ✅ OK | Single version |
| `voice-18.wav` | ✅ OK | Single version |

**⚠️ ISSUE:** Code references `new-voices/VOICE01.mp3` but actual files are `voices/voice-01.wav`

---

## PART 2: ASSET KEYS REFERENCED IN CODE (BUT NOT IN MANIFEST)

### 2.1 Scene Background Images (REQUIRED)
These keys are used in scene files but **NOT in asset-manifest.json**:

| Key | Used In Scene | Suggested Mapping |
|-----|---------------|-------------------|
| `sceneBg.zero-1-1-summons` | partZero.ts | ⚠️ NEEDS FILE OR ALIAS |
| `background.yahya_apartment` | partTwo.ts | ⚠️ NEEDS MAPPING |
| `background.osiris_interface` | partTwo.ts, partThree.ts | ⚠️ NEEDS MAPPING |
| `background.osiris_cosmic` | partThree.ts | ⚠️ NEEDS MAPPING |
| `background.corporate_lab` | partOne.ts | ⚠️ NEEDS MAPPING |
| `background.berlin_1933` | partSix.ts | ⚠️ NEEDS MAPPING |
| `background.white_space` | partSeven.ts | ⚠️ NEEDS MAPPING |

**Current Mappings in assets.ts (may not work):**
```typescript
'background.yahya_apartment': 'background.logo-new-flow02',  // ← Alias exists
'background.osiris_interface': 'background.07',              // ← Alias exists
'background.osiris_cosmic': 'background.06',                 // ← Alias exists
'background.corporate_lab': 'background.03',                 // ← Alias exists
'background.berlin_1933': 'background.01',                   // ← Alias exists
'background.white_space': 'background.logo-new-flow01',      // ← Alias exists
```

---

### 2.2 Ambient Audio (CRITICAL - ALL MISSING)
These ambient keys are used in scenes but **NO FILES EXIST**:

| Key | Used In | Status |
|-----|---------|--------|
| `amb.server_room` | transition.ts, partTwo.ts, partSeven.ts | 🔴 NO FILE |
| `amb.low_hum` | transition.ts, partThree.ts | 🔴 NO FILE |
| `amb.rain` | partZero.ts | 🔴 NO FILE |
| `amb.device_hum` | partZero.ts | 🔴 NO FILE |
| `amb.vacuum` | partZero.ts, partSeven.ts | 🔴 NO FILE |
| `amb.bass_drone_low` | partZero.ts, partThree.ts, partSeven.ts | 🔴 NO FILE |
| `amb.sirens_distant` | partTwo.ts | 🔴 NO FILE |
| `amb.running_steps` | partTwo.ts | 🔴 NO FILE |
| `amb.war_march` | partSix.ts | 🔴 NO FILE |
| `amb.drums_hypnosis` | partSix.ts | 🔴 NO FILE |
| `amb.cafe_murmur` | partOne.ts | 🔴 NO FILE |
| `amb.server_hum` | partOne.ts | 🔴 NO FILE |
| `amb.heartbeat_fast` | partOne.ts | 🔴 NO FILE |
| `sfx.ping` | partZero.ts | 🔴 NO FILE |
| `sfx.door_clang` | partTwo.ts | 🔴 NO FILE |
| `sfx.cannon_fire` | partSix.ts | 🔴 NO FILE |
| `sfx.cups_clink` | partOne.ts | 🔴 NO FILE |
| `music.cafe_jazz` | partOne.ts | 🔴 NO FILE |

**SOLUTION OPTIONS:**
1. **Add actual ambient audio files** to `public/assets/ambient/`
2. **Create silent placeholder files** (1-2 second silent audio)
3. **Remove ambient keys** from scenes temporarily

---

### 2.3 Audio Case Mismatches
Code in MainPlayer.tsx uses hardcoded paths:

| Code Path | Actual File | Status |
|-----------|-------------|--------|
| `/assets/music-tracks/TRACK-01.mp3` | `/assets/music-tracks/track-01.mp3` | 🔴 CASE MISMATCH |
| `/assets/music-tracks/TRACK-02.m4a` | `/assets/music-tracks/track-02.m4a` | 🔴 CASE MISMATCH |

**File:** `client/src/components/MainPlayer.tsx` lines 394-430

```typescript
const TRACK_URL_CANDIDATES: Record<string, string[]> = {
  track01: [
    '/assets/music-tracks/TRACK-01.mp3',  // ← WRONG CASE
    '/assets/music-tracks/TRACK-01.m4a',
  ],
  // ... more
};
```

---

### 2.4 Voice File Path Issues
Code references wrong paths:

| Code Path | Actual Path | Status |
|-----------|-------------|--------|
| `/assets/voices/new-voices/VOICE01.mp3` | `/assets/voices/voice-01.wav` | 🔴 WRONG PATH & EXTENSION |
| `/assets/voices/VOICE-01.wav` | `/assets/voices/voice-01.wav` | 🔴 CASE MISMATCH |

---

## PART 3: REQUIRED ACTIONS

### Priority 1: Critical (Fix First)

#### 3.1 Fix Audio Case Mismatches
**Option A:** Rename files to uppercase (easiest)
- Rename `track-01.mp3` → `TRACK-01.mp3`
- Rename `track-02.m4a` → `TRACK-02.m4a`

**Option B:** Fix code to use lowercase
- Update `MainPlayer.tsx` line 397: `TRACK-01.mp3` → `track-01.mp3`
- Update `MainPlayer.tsx` line 401: `TRACK-02.m4a` → `track-02.m4a`

#### 3.2 Fix Voice File Paths
- Update code references from `new-voices/VOICE01.mp3` → `voices/voice-01.wav`
- Update code references from `VOICE-01.wav` → `voice-01.wav`

#### 3.3 Fix Manifest Loading Race Condition
Add manifest preloading before app render:
```typescript
// In App.tsx or main.tsx
await loadAssetManifest();
```

---

### Priority 2: Add Missing Assets

#### 3.4 Create Ambient Audio Files
Need to add these files to `public/assets/ambient/`:
- `amb/server-room.mp3` (or .m4a)
- `amb/low-hum.mp3`
- `amb/rain.mp3`
- `amb/device-hum.mp3`
- `amb/vacuum.mp3`
- `amb/bass-drone-low.mp3`
- `amb/sirens-distant.mp3`
- `amb/running-steps.mp3`
- `amb/war-march.mp3`
- `amb/drums-hypnosis.mp3`
- `amb/cafe-murmur.mp3`
- `amb/server-hum.mp3`
- `amb/heartbeat-fast.mp3`
- `sfx/ping.mp3`
- `sfx/door-clang.mp3`
- `sfx/cannon-fire.mp3`
- `sfx/cups-clink.mp3`
- `music/cafe-jazz.mp3`

**RECOMMENDATION:** Create 1-2 second silent placeholder files if real audio not available.

#### 3.5 Fix Scene Background Keys
Either:
- Add actual background images for `sceneBg.zero-1-1-summons`
- OR update scenes to use existing backgrounds

---

### Priority 3: Cleanup

#### 3.6 Consolidate Duplicate Voice Files
Remove duplicate voice files with trailing dash:
- Keep: `voice-01.wav`
- Remove: `voice-01-.wav`

#### 3.7 Remove Old Documentation
Consider removing conflicting doc files:
- `ASSET_MIGRATION_PROGRESS.md`
- `ASSET_PRESENTATION_REVISION_REPORT.md`
- `CHARACTER_ASSET_FIX_PLAN.md`
- `FIX_ASSETS_INSTRUCTIONS.md`
- `OSIRIS_ASSET_PROMPTS.md`
- `OSIRIS_ASSET_PROMPT_GUIDE.md`
- `ai-context/DEBUG_ASSET_404_DIAGNOSIS.md`
- `docs/ASSET_SYSTEM.md`
- `docs/ASSET_TROUBLESHOOTING.md`
- `docs/GENERATED_ASSET_TIMELINE_MAPPING_PLAN.md`

---

## PART 4: ASSET KEY NAMING CONVENTIONS

### Recommended Standard
```
character.{name}-{variant}     → character.yahya-portrait
background.{descriptor}        → background.berlin-1933
videoBg.{descriptor}           → videoBg.cosmic-opening
audio.{descriptor}             → audio.main-theme
voice.{number}                 → voice.01
ambient.{descriptor}           → ambient.server-room
sfx.{descriptor}               → sfx.door-clang
sceneBg.{scene-id}             → sceneBg.zero-1-1-summons
```

### Case Rules
- **Always lowercase** in filenames
- **Use hyphens** for word separators
- **No underscores** in new assets
- **Consistent extensions**: 
  - Audio: `.mp3` or `.m4a`
  - Video: `.mp4`
  - Images: `.jpg` or `.png`
  - Voice: `.wav` or `.mp3`

---

## APPENDIX: File Locations

### Source of Truth Files
| File | Purpose |
|------|---------|
| `public/asset-manifest.json` | Auto-generated manifest |
| `client/src/lib/assets.ts` | Asset resolution system |
| `client/src/lib/sceneSystem.ts` | Scene definitions |
| `client/src/lib/scenes/*.ts` | Individual scene files |

### Asset Directories
| Directory | Contents |
|-----------|----------|
| `public/assets/characters/` | Character portraits |
| `public/assets/images/` | Background images |
| `public/assets/music-tracks/` | Music tracks |
| `public/assets/video-bg/` | Video backgrounds |
| `public/assets/voices/` | Voice narration |

---

## REVIEW CHECKLIST

- [ ] Confirm character mappings are correct
- [ ] Confirm background image aliases
- [ ] Confirm video background mappings
- [ ] Confirm music track mappings
- [ ] **DECIDE:** Add real ambient audio or use placeholders?
- [ ] **DECIDE:** Add scene background images or update scene references?
- [ ] **DECIDE:** Fix case by renaming files or updating code?
- [ ] **DECIDE:** Remove duplicate voice files?
- [ ] **DECIDE:** Clean up old documentation files?

---

**NEXT STEP:** Review this document and confirm decisions. Then I will implement the fixes.
