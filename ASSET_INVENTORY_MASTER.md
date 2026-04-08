# OSIRIS Asset Inventory - Master Document
> **One Source of Truth for Asset Mapping**
> Generated: 2026-04-09 (Updated after polish)
> Status: ✅ ASSETS POLISHED - MAPPING CLEANUP NEEDED

---

## EXECUTIVE SUMMARY

### ✅ RESOLVED - User Asset Polish Complete
| Issue Type | Status | Notes |
|------------|--------|-------|
| **Ambient audio files** | ✅ FIXED | 18 files added to `ambient/` folder |
| **Music track case** | ✅ FIXED | All tracks renamed to UPPERCASE (TRACK-01.mp3) |
| **Voice file duplicates** | ✅ FIXED | Duplicates removed, now 18 clean files |
| **Image names** | ✅ RENAMED | Descriptive names (cosmic-bg.jpg, etc.) |

### 🔧 REMAINING - Mapping Cleanup Required
| Issue Type | Status | Action Needed |
|------------|--------|---------------|
| **Background aliases outdated** | 🔴 | Update `KEY_ALIASES` in `assets.ts` - maps to old `01.jpg` style |
| **Scene background keys** | 🔴 | Add `sceneBg.*` keys to manifest or aliases |
| **Songs folder** | 🟡 | New `songs/` folder with `ya-rab.m4a` - needs mapping |
| **Manifest race condition** | 🟡 | Consider preloading in App.tsx |

---

## ASSET SUMMARY (Post-Polish)

| Folder | Count | Status |
|--------|-------|--------|
| `ambient/` | 18 | ✅ NEW - All ambient/sfx/music files |
| `characters/` | 21 | ✅ OK |
| `images/` | 12 | ✅ RENAMED - Descriptive names |
| `music-tracks/` | 14 | ✅ CLEANED - Uppercase, no duplicates |
| `songs/` | 2 | 🆕 NEW - `ya-rab.m4a` + lyrics |
| `video-bg/` | 19 | ✅ OK |
| `voices/` | 18 | ✅ CLEANED - No duplicates, mixed mp3/wav |

**Total: 104 assets (polished and organized)**

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

### 1.2 Background Images (12 files) - RENAMED
| Filename | Old Name | Suggested Key Mapping |
|----------|----------|----------------------|
| `cosmic-bg.jpg` | `06.jpg` | `background.cosmic-bg` / `background.osiris_cosmic` |
| `dessert.jpg` | `02.jpg` | `background.dessert` / `background.cambodia_1975` |
| `explode-basement.jpg` | `04.jpg` | `background.explode-basement` / `background.granada_fall` |
| `fire-worship.jpg` | `03.jpg` | `background.fire-worship` / `background.corporate_lab` |
| `hamara-palace.jpg` | `05.jpg` | `background.hamara-palace` / `background.moscow_1937` |
| `sun-and-desert.jpg` | `07.jpg` | `background.sun-and-desert` / `background.osiris_interface` |
| `yehia-room.jpg` | `01.jpg` | `background.yehia-room` / `background.berlin_1933` |
| `egypt-nile-temple02.jpg` | - | `background.egypt-nile-temple02` |
| `logo-new-flow01.png` | - | `background.logo-new-flow01` / `background.white_space` |
| `logo-new-flow02.png` | - | `background.logo-new-flow02` / `background.yahya_apartment` |
| `logo-new-flow01-upscayl-1x-digital-art-4x.png` | - | ⚠️ Unmapped |
| `logo-new-flow02-upscayl-1x-digital-art-4x.png` | - | ⚠️ Unmapped |

**⚠️ ACTION NEEDED:** Update `KEY_ALIASES` in `client/src/lib/assets.ts` (lines 147-162) to map to new descriptive filenames instead of old `01.jpg` style.

---

### 1.3 Music Tracks (14 files) - CLEANED & UPPERCASE
✅ **FIXED:** User renamed all tracks to UPPERCASE to match code references.

| Filename | Manifest Key | Status |
|----------|--------------|--------|
| `TRACK-01.mp3` | `audio.TRACK-01` | ✅ OK |
| `TRACK-02.mp3` | `audio.TRACK-02` | ✅ OK |
| `TRACK-03.mp3` | `audio.TRACK-03` | ✅ OK |
| `TRACK-04.mp3` | `audio.TRACK-04` | ✅ OK |
| `TRACK-05.mp3` | `audio.TRACK-05` | ✅ OK |
| `TRACK-06.mp3` | `audio.TRACK-06` | ✅ OK |
| `TRACK-07.mp3` | `audio.TRACK-07` | ✅ OK |
| `TRACK-08.mp3` | `audio.TRACK-08` | ✅ OK |
| `TRACK-09.mp3` | `audio.TRACK-09` | ✅ OK |
| `TRACK-10.mp3` | `audio.TRACK-10` | ✅ OK |
| `TRACK-11.mp3` | `audio.TRACK-11` | ✅ OK |
| `TRACK-12.mp3` | `audio.TRACK-12` | ✅ OK |
| `TRACK-13.mp3` | `audio.TRACK-13` | ✅ OK |
| `TRACK-14.mp3` | `audio.TRACK-14` | ✅ OK |

**Note:** Code in `MainPlayer.tsx` uses `track01`, `track02` keys which map to these files via aliases or manifest.

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

### 1.5 Voice Files (18 files) - CLEANED
✅ **FIXED:** Duplicates removed. Some converted to MP3.

| Filename | Format | Status |
|----------|--------|--------|
| `voice-01.mp3` | MP3 | ✅ Converted from WAV |
| `voice-02.mp3` | MP3 | ✅ Converted from WAV |
| `voice-03.wav` | WAV | ✅ OK |
| `voice-04.wav` | WAV | ✅ OK |
| `voice-05.wav` | WAV | ✅ OK |
| `voice-06.wav` | WAV | ✅ OK |
| `voice-07.mp3` | MP3 | ✅ Converted from WAV |
| `voice-08.wav` | WAV | ✅ OK |
| `voice-09.wav` | WAV | ✅ OK |
| `voice-10.wav` | WAV | ✅ OK |
| `voice-11.wav` | WAV | ✅ OK |
| `voice-12.wav` | WAV | ✅ OK |
| `voice-13.wav` | WAV | ✅ OK |
| `voice-14.wav` | WAV | ✅ OK |
| `voice-15.wav` | WAV | ✅ OK |
| `voice-16.wav` | WAV | ✅ OK |
| `voice-17.wav` | WAV | ✅ OK |
| `voice-18.wav` | WAV | ✅ OK |

**Note:** `voice-01` and `voice-02` now MP3, rest remain WAV. All duplicates removed.

### 1.6 Ambient Audio (18 files) - ✅ NEW FOLDER
All ambient, sfx, and music files organized in one place.

| Filename | Type | Scene Usage |
|----------|------|-------------|
| `amb.bass_drone_low.mp3` | ambient | partZero.ts, partThree.ts, partSeven.ts |
| `amb.cafe_murmur.mp3` | ambient | partOne.ts |
| `amb.device_hum.mp3` | ambient | partZero.ts |
| `amb.drums_hypnosis.mp3` | ambient | partSix.ts |
| `amb.heartbeat_fast.mp3` | ambient | partOne.ts |
| `amb.low_hum.mp3` | ambient | transition.ts, partThree.ts |
| `amb.rain.mp3` | ambient | partZero.ts |
| `amb.running_steps.mp3` | ambient | partTwo.ts |
| `amb.server_hum.mp3` | ambient | partOne.ts |
| `amb.server_room.mp3` | ambient | transition.ts, partTwo.ts, partSix.ts, partSeven.ts |
| `amb.sirens_distant.mp3` | ambient | partTwo.ts |
| `amb.vacuum.mp3` | ambient | partZero.ts, partSeven.ts |
| `amb.war_march.mp3` | ambient | partSix.ts |
| `music.cafe_jazz.mp3` | music | partOne.ts |
| `sfx.cannon_fire.mp3` | sfx | partSix.ts |
| `sfx.cups_clink.mp3` | sfx | partOne.ts |
| `sfx.door_clang.mp3` | sfx | partTwo.ts |
| `sfx.ping.mp3` | sfx | partZero.ts |

---

### 1.7 Songs (2 files) - 🆕 NEW FOLDER
| Filename | Content |
|----------|---------|
| `ya-rab.m4a` | Audio track |
| `ya-rab-lyrics.md` | Lyrics markdown |

**Status:** Not yet mapped in asset system. Need to add key if used in scenes.

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

## PART 3: MAPPING CLEANUP (Post-Polish)

✅ **All asset files are now in place!** Only mapping updates needed.

### Priority 1: Update Background Aliases

**File:** `client/src/lib/assets.ts` lines 147-162

**Current (outdated):**
```typescript
'background.berlin_1933': 'background.01',        // ← old
'background.corporate_lab': 'background.03',     // ← old
'background.osiris_cosmic': 'background.06',       // ← old
```

**Update to new descriptive names:**
```typescript
'background.berlin_1933': 'background.yehia-room',         // was 01.jpg
'background.cambodia_1975': 'background.dessert',          // was 02.jpg
'background.corporate_lab': 'background.fire-worship',     // was 03.jpg
'background.granada_fall': 'background.explode-basement',  // was 04.jpg
'background.moscow_1937': 'background.hamara-palace',      // was 05.jpg
'background.osiris_cosmic': 'background.cosmic-bg',        // was 06.jpg
'background.osiris_interface': 'background.sun-and-desert', // was 07.jpg
```

---

### Priority 2: Add Ambient Asset Support

**Issue:** The `ambient/` folder is new. Need to:
1. Add `ambient` to `AssetCategory` type in `assets.ts`
2. Create helper function `ambient()` similar to `audio()`
3. Add ambient keys to manifest generation in `build-assets.mjs`

**New Categories to Add:**
- `ambient.{name}` → `/assets/ambient/amb.{name}.mp3`
- `sfx.{name}` → `/assets/ambient/sfx.{name}.mp3`
- `music.{name}` → `/assets/ambient/music.{name}.mp3`

---

### Priority 3: Add Scene Background Support

**Issue:** Scenes use `sceneBg.zero-1-1-summons` pattern

**Solution Options:**
- **A.** Add aliases in `KEY_ALIASES`: `'sceneBg.zero-1-1-summons': 'background.yehia-room'`
- **B.** Update scenes to use `background()` helper instead of `sceneBg.*`

**Affected scenes:**
- `partZero.ts`: `sceneBg.zero-1-1-summons`
- `partFour.ts`: `sceneBg.four-4-1-desert`, `sceneBg.four-4-2-crowd-engineering`

---

### Priority 4: Verify Songs Mapping

**New:** `songs/ya-rab.m4a`

**If used in scenes:**
- Add to manifest generation
- Add alias: `'song.ya_rab': 'songs/ya-rab.m4a'`

---

### Priority 5: Regenerate Manifest

After all mapping updates:
```bash
npm run build
```

This will regenerate `asset-manifest.json` with all new ambient assets and updated keys.

---

### Optional: Documentation Cleanup

Consider removing outdated docs:
- `ASSET_MIGRATION_PROGRESS.md`
- `CHARACTER_ASSET_FIX_PLAN.md`
- `FIX_ASSETS_INSTRUCTIONS.md`
- `ai-context/DEBUG_ASSET_404_DIAGNOSIS.md`

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
