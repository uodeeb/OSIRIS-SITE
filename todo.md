# OSIRIS — المفسدون في الأرض
# Project TODO

## Core Architecture
- [x] Initialize project with web-db-user (database + backend + auth)
- [x] Setup tRPC routing and Express server
- [x] Configure Drizzle ORM with MySQL schema
- [x] Push database schema with pnpm db:push

## Scene System
- [x] Create sceneSystem.ts with all 21 scenes across 8 parts
- [x] Part Zero: The Cosmic Courtroom (2 scenes)
- [x] Part One: The First Crime (3 scenes)
- [x] Part Two: Pharaoh (3 scenes)
- [x] Part Three: Nicaea (2 scenes)
- [x] Part Four: Andalus (2 scenes)
- [x] Part Five: 20th Century (3 scenes)
- [x] Part Six: Digital Pride (2 scenes)
- [x] Part Seven: Witnesses for the Defense (3 scenes)
- [x] All scenes use real verified CDN URLs (no placeholders)
- [x] Interactive choices with countdown timers
- [x] defaultNextScene for narrative flow

## Multimedia Assets
- [x] Upload all 41 assets to CloudFront CDN
- [x] Verify all CDN URLs return HTTP 200
- [x] Create assetUrls.ts with all verified CDN URLs
- [x] Characters: Ramses, Constantine, Laila, Tarek, Yahya, Abu Abdullah, Iblis, Bilal
- [x] Backgrounds: 11 environments (pharaoh, nicaea, berlin, granada, etc.)
- [x] Documents: 5 artifacts (scrolls, KGB orders, Facebook leak, etc.)
- [x] Audio: 3 files (intro narration, Yahya monologue, intro v1)
- [x] Video: 2 files (logo reveal, Qabil scene)
- [x] UI: Logo icon, patterns

## MainPlayer Component
- [x] Full-screen cinema-mode (no scroll)
- [x] Background video playback (logo_reveal for Part Zero)
- [x] Background image per scene
- [x] Typewriter dialogue effect (English + Arabic)
- [x] Character portrait display with animations
- [x] Multi-path choices with countdown timer
- [x] Smooth cinematic transitions (fade, dissolve)
- [x] Audio playback with user interaction gate
- [x] Progress tracking via localStorage
- [x] Visual effects (vignette, film grain, particles)
- [x] Emotional tone-based color overlays
- [x] Navigation: next dialogue, next scene, back to home

## Home Page
- [x] Cinematic landing page with background video
- [x] Animated logo and title (OSIRIS + Arabic)
- [x] Parts grid (8 parts with thumbnails and hover effects)
- [x] Direct scene access from parts grid
- [x] Play button to start from beginning
- [x] Floating particles and visual effects
- [x] Letterbox cinema borders
- [x] Stats display (8 parts, 6000 years, 41 assets)

## Routing
- [x] / → Home page
- [x] /play → MainPlayer (starts at zero-1)
- [x] /play?scene=xxx → MainPlayer at specific scene
- [x] /404 → NotFound

## Bug Fixes
- [x] Fixed "Cannot read properties of undefined (reading 'choices')" error
- [x] Fixed "Objects are not valid as a React child" error
- [x] Removed intrusive "Start Experience" button blocking navigation
- [x] Fixed broken character image URLs (Laila, Tarek, Yahya)
- [x] Fixed sceneSystem to use narrativeDataFull.json
- [x] Fixed ALL_SCENES initialization
- [x] Zero TypeScript errors

## Pending Enhancements
- [ ] Add chapter navigation menu (jump to any scene)
- [ ] Implement reading statistics (choice tracking)
- [ ] Add fullscreen toggle button
- [ ] Add subtitle/caption sync with audio
- [ ] Expand to 40+ scenes with full OSIRIS script dialogue
- [ ] Add sound effects (footsteps, wind, heartbeats)
- [ ] Mobile responsive optimization

## Critical UX Fixes (User Reported)
- [x] Remove all auto-advance timers — user controls ALL progression manually
- [x] Add clear "Click to continue" / "Next" prompt so user knows when to advance
- [x] Fix narration audio repeating across all scenes — each scene gets unique audio
- [x] Add background ambient music (tension-building, looping, separate from narration)
- [x] Add volume controls: separate sliders for narration and background music
- [x] Slow down scene transition speed (currently too fast)
- [x] Slow down typewriter effect to match reading pace
- [x] Add keyboard navigation (Space/Enter = next, Arrow keys = prev/next)
- [x] Add pause/resume button for narration audio
- [x] Fix narration not stopping when scene changes
- [x] Fix narration audio repeating "الملف رقم واحد" on every scene (all scenes share same audioUrl)
- [x] Fix background music not playing (ambient music was using narration files, not music)
- [x] Separate bilingual UI: language toggle (EN/AR) instead of mixing both languages at once
- [x] Add 30-second auto-advance timer for choices with visible countdown number
