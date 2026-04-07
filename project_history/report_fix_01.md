# Asset Path Migration Report - Fix 01

## Date
April 7, 2026

## Problem Summary
Production website was showing 404 errors for all assets loaded from `/generated-assets/` paths. The site was trying to load images, videos, audio files, and character portraits from incorrect URLs.

## Root Cause
The `assets-manifest.json` file had `"baseUrl": "/generated-assets"` which was being used by the static asset resolver to construct all asset URLs. Since the Vercel deployment only serves assets from `/assets/`, all requests to `/generated-assets/` were returning 404 errors.

## Files Modified

### 1. assets-manifest.json (ROOT CAUSE)
**Path:** `assets-manifest.json`
**Change:** 
- `"baseUrl": "/generated-assets"` → `"baseUrl": "/assets"`

**Impact:** This fixes the base URL used by `assetUrls-static.ts` to resolve all asset URLs.

### 2. narrativeData.json
**Path:** `client/src/data/narrativeData.json`
**Lines:** 311-315
**Changes:**
- `"backgroundImage": "/generated-assets/images/EGYPT-NILE-TEMPLE02.jpg"` → `"backgroundImage": "/assets/images/EGYPT-NILE-TEMPLE02.jpg"`
- `"backgroundVideo": "/generated-assets/video-bg/egypt-nile-temple.mp4"` → `"backgroundVideo": "/assets/video-bg/egypt-nile-temple.mp4"`
- `"Ramses": "/generated-assets/characters/RAMSIS.jpg"` → `"Ramses": "/assets/characters/RAMSIS.jpg"`
- `"RamsesAlt": "/generated-assets/characters/RAMSIS01.jpg"` → `"RamsesAlt": "/assets/characters/RAMSIS01.jpg"`

### 3. OSIRISNovelApp.tsx
**Path:** `client/src/components/OSIRISNovelApp.tsx`
**Lines:** 73-92
**Changes:** All music track URLs:
- `/generated-assets/music-tracks/TRACK-02.m4a` → `/assets/music-tracks/TRACK-02.m4a`
- `/generated-assets/music-tracks/TRACK 02.m4a` → `/assets/music-tracks/TRACK 02.m4a`
- `/generated-assets/music-tracks/TRACK 03.mp3` → `/assets/music-tracks/TRACK 03.mp3`
- `/generated-assets/music-tracks/TRACK-04.m4a` → `/assets/music-tracks/TRACK-04.m4a`
- `/generated-assets/music-tracks/TRACK-05.m4a` → `/assets/music-tracks/TRACK-05.m4a`
- `/generated-assets/music-tracks/TRACK-06.m4a` → `/assets/music-tracks/TRACK-06.m4a`
- `/generated-assets/music-tracks/TRACK-07.m4a` → `/assets/music-tracks/TRACK-07.m4a`
- `/generated-assets/music-tracks/TRACK-08.m4a` → `/assets/music-tracks/TRACK-08.m4a`
- `/generated-assets/music-tracks/TRACK-09.m4a` → `/assets/music-tracks/TRACK-09.m4a`
- `/generated-assets/music-tracks/TRACK-10.m4a` → `/assets/music-tracks/TRACK-10.m4a`
- `/generated-assets/music-tracks/TRACK-11.m4a` → `/assets/music-tracks/TRACK-11.m4a`
- `/generated-assets/music-tracks/TRACK-12.m4a` → `/assets/music-tracks/TRACK-12.m4a`
- `/generated-assets/music-tracks/TRACK-13.m4a` → `/assets/music-tracks/TRACK-13.m4a`
- `/generated-assets/music-tracks/TRACK-14.m4a` → `/assets/music-tracks/TRACK-14.m4a`

**Voice Assets:**
- `/generated-assets/voices/VOICE-01.wav` → `/assets/voices/VOICE-01.wav`
- `/generated-assets/voices/VOICE-02.wav` → `/assets/voices/VOICE-02.wav`
- `/generated-assets/voices/VOICE-03.wav` → `/assets/voices/VOICE-03.wav`

### 4. OSIRISCompleteExperience.tsx
**Path:** `client/src/components/OSIRISCompleteExperience.tsx`
**Lines:** 200-213
**Changes:** All music track mappings:
- `/generated-assets/music-tracks/TRACK-02.m4a` → `/assets/music-tracks/TRACK-02.m4a`
- `/generated-assets/music-tracks/TRACK 02.m4a` → `/assets/music-tracks/TRACK 02.m4a`
- `/generated-assets/music-tracks/TRACK 03.mp3` → `/assets/music-tracks/TRACK 03.mp3`
- `/generated-assets/music-tracks/TRACK-04.m4a` → `/assets/music-tracks/TRACK-04.m4a`
- `/generated-assets/music-tracks/TRACK-05.m4a` → `/assets/music-tracks/TRACK-05.m4a`
- `/generated-assets/music-tracks/TRACK-06.m4a` → `/assets/music-tracks/TRACK-06.m4a`
- `/generated-assets/music-tracks/TRACK-07.m4a` → `/assets/music-tracks/TRACK-07.m4a`
- `/generated-assets/music-tracks/TRACK-08.m4a` → `/assets/music-tracks/TRACK-08.m4a`
- `/generated-assets/music-tracks/TRACK-09.m4a` → `/assets/music-tracks/TRACK-09.m4a`
- `/generated-assets/music-tracks/TRACK-10.m4a` → `/assets/music-tracks/TRACK-10.m4a`
- `/generated-assets/music-tracks/TRACK-11.m4a` → `/assets/music-tracks/TRACK-11.m4a`
- `/generated-assets/music-tracks/TRACK-12.m4a` → `/assets/music-tracks/TRACK-12.m4a`
- `/generated-assets/music-tracks/TRACK-13.m4a` → `/assets/music-tracks/TRACK-13.m4a`
- `/generated-assets/music-tracks/TRACK-14.m4a` → `/assets/music-tracks/TRACK-14.m4a`

### 5. MainPlayer.tsx
**Path:** `client/src/components/MainPlayer.tsx`
**Changes:**

**Image Paths (Lines 522-531):**
- `/generated-assets/images/01.jpg` → `/assets/images/01.jpg`
- `/generated-assets/images/02.jpg` → `/assets/images/02.jpg`
- `/generated-assets/images/03.jpg` → `/assets/images/03.jpg`
- `/generated-assets/images/04.jpg` → `/assets/images/04.jpg`
- `/generated-assets/images/05.jpg` → `/assets/images/05.jpg`
- `/generated-assets/images/06.jpg` → `/assets/images/06.jpg`
- `/generated-assets/images/07.jpg` → `/assets/images/07.jpg`

**Character Image (Line 524):**
- `/generated-assets/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png` → `/assets/ui/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png`

**Voice Paths (Lines 625-636):**
- `/generated-assets/voices/new-voices/VOICE${padded}.mp3` → `/assets/voices/new-voices/VOICE${padded}.mp3`
- `/generated-assets/voices/new-voices/VOICE${voiceNumber}.mp3` → `/assets/voices/new-voices/VOICE${voiceNumber}.mp3`
- `/generated-assets/voices/VOICE-${padded}.wav` → `/assets/voices/VOICE-${padded}.wav`
- `/generated-assets/voices/new-voices/main-devil.wav` → `/assets/voices/new-voices/main-devil.wav`

## Previous Fixes (Already Applied)

### assetUrls.ts
- `getFallbackAssetUrl()` function updated
- `getFallbackAssetsByKind()` function updated with all character images and audio tracks

### musicIntegrationEngine.ts
- `loadMusicTrack()` function updated
- `getMusicPath()` function updated
- `getTrackAudioPath()` function updated

### EnhancedCinematicIntegration.tsx
- `MUSIC_ASSET_URLS` constant updated
- `VOICE_ASSET_URLS` constant updated

### MainPlayer.tsx (Previous)
- `TRACK_URL_CANDIDATES` for all 15 tracks updated

## Verification

### Build Status
- ✅ Build successful
- ✅ All 106 assets verified present
- ✅ Asset mapping completed successfully
- ✅ Git commit: `4ebddd7`

### Expected Behavior After Fix
All assets should now load correctly from `/assets/` paths:
- Character images: `/assets/ui/characters/`
- Video backgrounds: `/assets/video-bg/`
- Music tracks: `/assets/music-tracks/`
- Voice files: `/assets/voices/`
- Scene images: `/assets/images/`

## Testing Recommendations
1. Clear browser cache and hard reload
2. Check browser Network tab for any remaining 404 errors
3. Verify character portraits load in dialogue scenes
4. Verify video backgrounds play correctly
5. Verify music tracks play without errors
6. Verify voice narration plays correctly

## Notes for Next Conversation
- The `/api/trpc/system.assets` endpoint 404 error may still need investigation
- Consider implementing a client-side redirect from `/generated-assets/*` to `/assets/*` as a safety net
- Monitor production logs for any remaining asset 404 errors
- The asset manifest system is now correctly configured for production deployment
