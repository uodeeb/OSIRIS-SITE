# OSIRIS Asset Sync Engine — Restoration Plan

## Architecture Overview

The sync engine has **3 layers** that must work together:

### Layer 1: Master Cinematic Timeline
- **File**: `generated-assets/master/OSIRIS_CINEMATIC_MASTER_CUES.json`
- **Purpose**: 127-second continuous cinematic with video segments, voice cues, image overlays, and music bed
- **Status**: ⚠️ EXISTS but has broken absolute Windows paths and overlapping voice timestamps

### Layer 2: Interactive Scene Player
- **File**: `client/src/components/MainPlayer.tsx`
- **Purpose**: Scene-by-scene interactive playthrough with voice/image/character sync per dialogue line
- **Status**: ⚠️ PARTIALLY WORKING — only 2 scenes have voice cues mapped

### Layer 3: Asset Override System
- **Files**: `client/src/lib/assetUrls.ts` + `client/src/lib/assetOverrides.ts`
- **Purpose**: Runtime URL resolution with override proxy
- **Status**: ✅ WORKING — loads overrides.json at startup

---

## Current Asset Inventory

### Videos (17 files)
| File | Path |
|------|------|
| VIDEO 01 | `/generated-assets/video-bg/VIDEO 01 — الشاشة الرئيسية (Intro).mp4` |
| VIDEO 02 | `/generated-assets/video-bg/VIDEO 02 — غرفة يحيى (المشهد الافتتاحي).mp4` |
| VIDEO 03 | `/generated-assets/video-bg/VIDEO 03 — الفضاء الكوني (المرافعة الافتتاحية).mp4` |
| VIDEO 04 | `/generated-assets/video-bg/VIDEO 04 — سطح المبنى (وداع طارق).mp4` |
| VIDEO 05 | `/generated-assets/video-bg/VIDEO 05 — صحراء سيناء (العجل الذهبي).mp4` |
| VIDEO 06 | `/generated-assets/video-bg/VIDEO 06 — صهر الذهب (هندسة الحشود).mp4` |
| VIDEO 07 | `/generated-assets/video-bg/VIDEO 07 — مجمع نيقية (الإمبراطور والحكيم).mp4` |
| VIDEO 08 | `/generated-assets/video-bg/VIDEO 08 — الأندلس (جمال يتلاشى).mp4` |
| VIDEO 09 | `/generated-assets/video-bg/VIDEO 09 — دموع أبو عبد الله (زفرة العربي الأخيرة).mp4` |
| VIDEO 10 | `/generated-assets/video-bg/VIDEO 10 — برلين 1933 (الكبر يصبح نظاماً).mp4` |
| VIDEO 11 | `/generated-assets/video-bg/VIDEO 11 — كربلاء (الحق الأعزل).mp4` |
| VIDEO 12 | `/generated-assets/video-bg/VIDEO 12 — الفضاء الرقمي (المواجهة مع المهندس).mp4` |
| VIDEO 13 | `/generated-assets/video-bg/VIDEO 13 — ضغطة Enter (التضحية النهائية).mp4` |
| andalus | `/generated-assets/video-bg/andalus.mp4` |
| desert | `/generated-assets/video-bg/desert.mp4` |
| karblaa | `/generated-assets/video-bg/karblaa.mp4` |
| yehya-office | `/generated-assets/video-bg/yehya-office-vid.mp4` |

### Voices (18 files)
| File | Description |
|------|-------------|
| VOICE 01 | المرافعة الافتتاحية (الأيقونية الكبرى) |
| VOICE 02 | قسم إبليس (الشيفرة المصدرية) |
| VOICE 03 | رسالة طارق الأولى (صوت الأخ الميت) |
| VOICE 04 | وداع طارق على السطح |
| VOICE 05 | إدراك يحيى (الخوارزمية والشيطان) |
| VOICE 06 | أم أبو عبد الله (الجملة التاريخية) |
| VOICE 07 | صوت إبليس يعلق على الأندلس |
| VOICE 08 | الحسين في كربلاء |
| VOICE 09 | طارق في الحلم (الوداع الأخير) |
| VOICE 10 | قرار يحيى (الجملة الأخيرة قبل الضغط) |
| VOICE 11 | إغلاق الملف (الراوي الكوني) |
| VOICE 12 | يحيى يموت (آخر كلماته لليلى) |
| VOICE 13 | ليلى تفسر الحسين |
| VOICE 14 | المهندس الأول يعرض على يحيى |
| VOICE 15 | ليلى تكشف جرحها (ألم الطفولة) |
| VOICE 16 | طارق يربط نيقية بالحاضر |
| VOICE 17 | (exists as VOICE-17.wav) |
| VOICE 18 | (exists as VOICE-18.wav) |

### Music (14 tracks)
| Track | Path |
|-------|------|
| TRACK 01 | الثيم الرئيسي للرواية |
| TRACK 02 | الجزء الصفر-غرفة المحاكمة الكونية |
| TRACK 03-14 | Various scene tracks |

### Images (7 files)
| File | Path |
|------|------|
| 01.jpg | Summons scene |
| 02.jpg | Desert scene |
| 03.jpg | Crowd engineering |
| 04.jpg | Andalusia |
| 05.jpg | Karbala |
| 06.jpg | Truth leak |
| 07.jpg | Attack scene |

---

## What Was Broken

### 1. Voice Cue Mapping (CRITICAL)
**File**: `MainPlayer.tsx` lines 18-26
```typescript
const SCENE_VOICE_CUES: Record<string, { voice: number; at: number; lock?: boolean }[]> = {
  'zero-1-1-summons': [
    { voice: 1, at: 0, lock: true }, 
    { voice: 17, at: 1 }, 
    { voice: 18, at: 3 },
    { voice: 2, at: 5, lock: true }
  ],
  'four-4-1-desert': [{ voice: 21, at: 0 }], // VOICE 21 DOESN'T EXIST!
};
```
**Problem**: Only 2 scenes mapped! 30+ scenes have NO voice cues. Voice 21 doesn't exist.

### 2. Voice URL Resolution
**File**: `MainPlayer.tsx` lines 106-112
```typescript
if (vNum === 1) {
  voiceUrl = '/music/VOICE%2001%20%E2%80%94%20...wav'; // WRONG PATH
} else if (vNum === 2) {
  voiceUrl = '/music/devil-voice-to-clone.wav'; // WRONG PATH
} else {
  voiceUrl = `/generated-assets/voices/VOICE-${vNum.toString().padStart(2, '0')}.wav`;
}
```
**Problem**: Voice 1 and 2 paths are wrong. Actual files are at `/generated-assets/voices/VOICE-01.wav` and `/generated-assets/voices/VOICE-02.wav`.

### 3. Master Cues File Uses Absolute Paths
**File**: `OSIRIS_CINEMATIC_MASTER_CUES.json`
**Problem**: All paths are absolute Windows paths like `E:\Books-library2025\...` instead of relative URLs like `/generated-assets/...`

### 4. Overlapping Voice Timestamps in Master Cues
**Problem**: VOICE 01 at 17.778s and VOICE 02 at 17.8s (0.022s apart, both 6s duration) — they overlap!

### 5. Missing Scene-to-Track Mapping
**File**: `musicIntegrationEngine.ts`
**Problem**: Scene-to-music-track mapping exists but is incomplete for the full narrative.

---

## Restoration Steps

### Step 1: Fix Voice URL Resolution
Update `MainPlayer.tsx` to use correct paths for all voices:
```typescript
// All voices now use consistent path pattern
voiceUrl = `/generated-assets/voices/VOICE-${vNum.toString().padStart(2, '0')}.wav`;
```

### Step 2: Expand SCENE_VOICE_CUES to All Scenes
Map all 30+ scenes to their appropriate voice cues based on:
- Scene context (which character is speaking)
- Voice descriptions (VOICE 01 = opening, VOICE 02 = devil, etc.)
- Narrative flow

### Step 3: Fix Master Cues File
Convert all absolute paths to relative URLs and fix overlapping timestamps.

### Step 4: Expand SCENE_IMAGE_CUES
Add image overlay cues for all scenes that have image backgrounds.

### Step 5: Expand SCENE_CHARACTER_TIMELINE
Map all scenes to their primary characters.

### Step 6: Verify Music Integration
Ensure `musicIntegrationEngine.ts` has complete scene-to-track mappings.

---

## Scene-to-Asset Mapping Reference

Based on `sceneSystem.ts` and `OSIRIS_ASSET_PROMPT_GUIDE.md`:

| Scene ID | Video | Image | Voices Needed | Music | Ambience |
|----------|-------|-------|---------------|-------|----------|
| zero-1-1-summons | yahya_room | 01.jpg | 1, 17, 18, 2 | main_theme | rain, device_hum |
| zero-1-2-prosecution | cosmic_opening | osiris_interface | 1, 2 | cosmic_drone | vacuum, bass_drone |
| one-1-5-1-promise | — | corporate_lab | 3 | cafe_jazz | cafe_murmur |
| one-1-5-2-bitter-truth | — | corporate_lab | 3, 5 | — | server_hum |
| one-1-5-3-no-escape | — | yahya_apartment | 4 | — | phone_ring |
| one-1-5-4-sacrifice | tarek_rooftop | white_space | 4 | rooftop_cello | wind_strong |
| two-2-1-escape | — | yahya_apartment | — | — | sirens, running |
| two-2-2-osiris-launch | — | osiris_interface | — | — | server_room |
| three-3-1-creation | — | osiris_cosmic | 2 | sacred_drone | bass_drone |
| three-3-1b-devil-song | — | osiris_cosmic | 2 | — | low_hum |
| three-3-2-virus-design | — | osiris_cosmic | 2, 5 | — | bass_drone |
| four-4-1-desert | sinai_desert | 02.jpg | 6, 7 | — | desert_wind |
| four-4-2-crowd-engineering | molten_gold | 03.jpg | 7 | — | metal_melt |
| four-5-1-tarek-message | — | corporate_lab | 3 | sad_background | server_room |
| four-5-2-analyst-tears | — | white_space | — | — | server_room |
| five-6a-1-nicaea-debate | — | nicaea_council | 16 | classical_thought | library_room |
| five-6b-1-constantine | nicaea | nicaea_council | 14, 16 | — | hall_reverb |
| five-6c-1-laila-pain | — | white_space | 15 | — | silence_low |
| five-6c-2-tarek-second | — | corporate_lab | 16 | — | recording_room |
| six-8-1-andalusia | andalusia | 04.jpg | 7 | andalusian_oud | city_night |
| six-8-2-last-tears | abu_abdullah_tears | 04.jpg | 6 | andalusian_sad | wind_soft |
| six-8b-1-berlin | berlin_1933 | berlin_1933 | — | — | city_cold |
| six-8c-1-death-signatures | — | moscow_1937 | — | — | typewriter |
| six-8d-1-attack | — | 07.jpg | — | — | smoke_alarm |
| six-8d-2-final-update | — | white_space | 10 | epic_orchestral | heartbeat |
| transition-dream | — | white_space | 9 | ambient_peace | breath_slow |
| seven-10-1-karbala | karbala | 05.jpg | 8, 13 | — | desert_wind |
| seven-11-1-temptation | digital_space | white_space | 14 | — | electronic_hum |
| seven-11-2-decision | enter_key | white_space | 10 | — | electronic_hum |
| seven-11-3-yahya-death | enter_key | white_space | 12 | tragic_sacrifice | heartbeat |
| seven-12-1-truth-leak | enter_key | 06.jpg | 11, 12 | — | notification_swarm |
| seven-13-1-awakening | — | qabil_habil_aftermath | 11 | contemplative_strings | city_day |
| seven-13-2-closing | — | osiris_cosmic | 11 | cosmic_end | vacuum |
