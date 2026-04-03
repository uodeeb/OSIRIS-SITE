# OSIRIS Implementation Issues Analysis

**Date:** April 2, 2026  
**Scope:** Audio Control, Scene Control, Auto Mode, Voice Sync, Media Sync  
**Status:** Critical Issues Identified

---

## 1. Audio Control Issues

### Issue 1.1: State Synchronization Gap
**Location:** `MainPlayer.tsx:924-947`, `MediaControllerContext.tsx:266-285`

**Problem:** The local `isMuted` state in MainPlayer is not fully synchronized with the MediaController context state. When `handleToggleMute` is called, it updates local state and calls `setPrimaryAudioMuted()`, but there's no listener to sync changes back from the context.

**Code:**
```typescript
// MainPlayer.tsx
const [isMuted, setIsMuted] = useState(false);  // Local state

const handleToggleMute = useCallback(() => {
  const newMuted = !isMuted;
  setIsMuted(newMuted);  // Updates local
  setPrimaryAudioMuted(newMuted);  // Updates context
  // ...but no effect listens for context state changes
}, [isMuted, musicVol, sfxVol, setPrimaryAudioMuted, setPrimaryAudioVolume, voiceSyncLock]);
```

**Impact:** If external code changes mute state via MediaController, UI won't reflect it.

**Fix:** Add useEffect to sync context state to local:
```typescript
useEffect(() => {
  setIsMuted(globalMediaState.isMuted);
}, [globalMediaState.isMuted]);
```

---

### Issue 1.2: Volume Control UI Doesn't Affect Active Audio
**Location:** `MainPlayer.tsx:924-938`

**Problem:** Volume sliders update state but the actual audio elements may not receive updates immediately. The ambient audio fade uses RAF but the primary audio through MediaController may lag.

**Issue:** When voiceSyncLock is active, the volume calculation applies a 0.46 factor, but this is only applied when handlers are called, not continuously.

**Fix:** Ensure volume changes propagate to all active audio elements immediately:
```typescript
useEffect(() => {
  // Apply volume to all registered media when voiceSyncLock changes
  if (ambientRef.current) {
    ambientRef.current.volume = isMuted ? 0 : sfxVol * (voiceSyncLock ? 0.55 : 1);
  }
}, [voiceSyncLock, sfxVol, isMuted]);
```

---

### Issue 1.3: Missing Volume Persistence
**Location:** `MediaControllerContext.tsx`

**Problem:** Volume settings are not persisted to localStorage like other media state.

**Current persistence:**
```typescript
window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
  isPlaying: nextState.isPlaying,
  elapsedMs: nextState.elapsedMs,
  durationMs: nextState.durationMs,
  accentColor: nextState.accentColor,
  uiLang: nextState.uiLang,
  isMuted: nextState.isMuted,
  primaryVolume: nextState.primaryVolume,  // Only this is saved
}));
```

**Missing:** Music volume (`musicVol`) and SFX volume (`sfxVol`) from MainPlayer are not persisted.

**Fix:** Add volumes to MediaController state or persist separately in MainPlayer.

---

## 2. Scene Control & Auto Mode Issues

### Issue 2.1: Auto Mode Timer Not Reset on Scene Change
**Location:** `MainPlayer.tsx:1318-1343`

**Problem:** When `currentSceneId` changes, the auto mode timer continues running but the action callback still references the old scene's closure.

**Code:**
```typescript
useEffect(() => {
  if (autoMode === 'off') return;
  // ... timer setup
  autoSceneTimerRef.current = setTimeout(() => {
    action?.();  // References stale closure
  }, delay);
}, [autoMode, sceneTransitioning, voiceSyncLock, showChoices, currentScene?.id, ...]);
```

**Impact:** Auto-advance may execute actions on wrong scene or with stale data.

**Fix:** Cancel and restart auto timer when scene changes:
```typescript
useEffect(() => {
  // Clear existing timers when scene changes
  if (autoSceneTimerRef.current) {
    clearTimeout(autoSceneTimerRef.current);
    autoSceneTimerRef.current = null;
  }
  if (autoProgressIntervalRef.current) {
    clearInterval(autoProgressIntervalRef.current);
    autoProgressIntervalRef.current = null;
  }
  setAutoProgress(100); // Reset progress
}, [currentSceneId]);
```

---

### Issue 2.2: Auto Mode Doesn't Pause During Voice Sync
**Location:** `MainPlayer.tsx:1278-1289`

**Problem:** Auto mode checks `voiceSyncLock` to determine if it should wait, but it doesn't actually pause the timer - it just delays the action.

**Code:**
```typescript
const shouldWaitForVoice = isVoicedDialogue && voiceSyncLock && !isDialogueComplete;
if (shouldWaitForVoice) return;  // Just returns, doesn't pause existing timer
```

**Impact:** Timer continues running in background while voice plays, causing immediate advance when voice ends.

**Fix:** Properly pause/resume auto timer based on voice state.

---

### Issue 2.3: Missing Auto Mode State Persistence
**Location:** `MainPlayer.tsx:731`

**Problem:** Auto mode preference is not persisted across sessions.

**Code:**
```typescript
const [autoMode, setAutoMode] = useState<'off' | 'very-slow' | 'slow' | 'normal'>('off');
```

**Fix:** Persist to localStorage like media controller state.

---

## 3. Voice & Media Sync Issues

### Issue 3.1: Voice Audio Can Fail Silently
**Location:** `MainPlayer.tsx:1485-1636`

**Problem:** Voice audio loading has multiple failure points but doesn't always clean up properly.

**Code issues:**
1. `voice.onerror` tries next candidate but doesn't handle total failure well
2. If all candidates fail, `setVoiceSyncLock(false)` is called but `voiceSyncRafRef` may not be cleaned
3. No user feedback when voice fails to load

**Critical Code:**
```typescript
voice.onerror = () => tryCandidate(index + 1);  // No handling for final failure

// Later...
if (cancelled || index >= candidates.length) {
  disabledVoiceTokensRef.current.add(token);
  setVoiceSyncLock(false);
  setActiveVoiceNumber(null);
  return;  // Returns without completing dialogue
}
```

**Impact:** Dialogue may get stuck if voice fails to load.

**Fix:** Add fallback to text-only mode when all voice candidates fail:
```typescript
if (cancelled || index >= candidates.length) {
  disabledVoiceTokensRef.current.add(token);
  setVoiceSyncLock(false);
  setActiveVoiceNumber(null);
  // Fall back to text typewriter
  startTypewriterFallback();
  return;
}
```

---

### Issue 3.2: RAF Loop Continues After Voice Ends
**Location:** `MainPlayer.tsx:1520-1565`

**Problem:** The `syncDisplayedTextToVoice` RAF loop may continue running if cleanup doesn't happen properly.

**Code:**
```typescript
const syncDisplayedTextToVoice = () => {
  if (cancelled) return;
  // ...
  if (!voice.paused && !voice.ended) {
    voiceSyncRafRef.current = requestAnimationFrame(syncDisplayedTextToVoice);
  }
};
```

**Issue:** If voice ends while RAF is queued but before it executes, the check `!voice.ended` may still pass.

**Fix:** Add explicit check for ended state and cancel RAF:
```typescript
const syncDisplayedTextToVoice = () => {
  if (cancelled || voice.ended) {
    if (voiceSyncRafRef.current) {
      cancelAnimationFrame(voiceSyncRafRef.current);
      voiceSyncRafRef.current = null;
    }
    return;
  }
  // ... rest of sync logic
};
```

---

### Issue 3.3: Image Cues Not Synced with Dialogue Timing
**Location:** `MainPlayer.tsx:1363-1375`

**Problem:** Image cues (`activeImageCue`) are triggered based on `dialogueIndex` alone, not synced with actual dialogue display timing.

**Code:**
```typescript
useEffect(() => {
  const cue = SCENE_IMAGE_CUES[currentSceneId];
  if (!cue || !cue.points.includes(dialogueIndex)) return;
  setActiveImageCue({ ... });
}, [currentSceneId, dialogueIndex]);
```

**Impact:** Image appears immediately when dialogue index changes, not when text is fully displayed.

**Fix:** Trigger image cue when `isDialogueComplete` is true for the relevant dialogue.

---

## 4. Audio Stop/Start Issues

### Issue 4.1: Initial Audio Requires Double Interaction
**Location:** `MainPlayer.tsx:918-922`, `1861-1910`

**Problem:** The audio prompt shows and requires click, but `enableAudio()` calls `globalPlay()` which may not properly initialize all audio systems.

**Code:**
```typescript
const enableAudio = useCallback(() => {
  setAudioEnabled(true);
  setShowAudioPrompt(false);
  globalPlay();  // May not trigger immediate playback
}, [globalPlay]);
```

**Issue:** `globalPlay()` sets state but doesn't ensure media elements are ready. The `registerMedia` effect in MediaController tries to play, but timing may be off.

**Impact:** User clicks "Begin" but audio doesn't start immediately - requires second interaction.

**Fix:** Ensure audio elements are loaded before attempting playback:
```typescript
const enableAudio = useCallback(async () => {
  setAudioEnabled(true);
  setShowAudioPrompt(false);
  // Pre-load audio before playing
  await Promise.all([
    preloadAudioCandidates(normalizedSceneCandidates),
  ]);
  globalPlay();
}, [globalPlay, normalizedSceneCandidates]);
```

---

### Issue 4.2: Background Video Doesn't Resume After Pause
**Location:** `MainPlayer.tsx:1638-1653`

**Problem:** Background video pauses when `globalMediaState.isPlaying` is false, but doesn't always resume properly.

**Code:**
```typescript
useEffect(() => {
  const bgVideoSrc = resolveAsset(currentScene?.backgroundVideo);
  if (!allowVideo) {
    if (bgVideoRef.current) bgVideoRef.current.pause();
    return;
  }
  if (!globalMediaState.isPlaying) {
    if (bgVideoRef.current) bgVideoRef.current.pause();
    return;
  }
  if (bgVideoRef.current && bgVideoSrc) {
    bgVideoRef.current.load();
    bgVideoRef.current.play().catch(() => {});
  }
}, [allowVideo, globalMediaState.isPlaying, ...]);
```

**Issue:** When resuming play, `bgVideoRef.current.load()` is called which resets the video, causing a visible jump.

**Fix:** Only load if source changed, otherwise just play:
```typescript
if (bgVideoRef.current && bgVideoSrc) {
  const currentSrc = bgVideoRef.current.src;
  const newSrc = resolveAsset(currentScene?.backgroundVideo);
  if (currentSrc !== newSrc) {
    bgVideoRef.current.src = newSrc;
    bgVideoRef.current.load();
  }
  bgVideoRef.current.play().catch(() => {});
}
```

---

### Issue 4.3: Ambient Audio Volume Jump on Scene Change
**Location:** `MainPlayer.tsx:1400-1468`

**Problem:** When scene changes, ambient audio fades out but the new ambient starts at full volume before fading in.

**Code:**
```typescript
if (desiredAmbientUrl) {
  if (!ambientRef.current) {
    ambientRef.current = new Audio(normalize(desiredAmbientUrl));
    ambientRef.current.volume = isMuted ? 0 : 0;  // Starts at 0
    // ...
  } else {
    const nextSrc = normalize(desiredAmbientUrl);
    if (ambientRef.current.src !== nextSrc) {
      ambientRef.current.pause();
      ambientRef.current.src = nextSrc;
      ambientRef.current.volume = 0;  // Resets to 0
      // No fade in here!
    }
  }
}
// Fade only happens after this block
fade(ambientRef.current, (isMuted ? 0 : sfxVol) * (voiceSyncLock ? 0.55 : 1), ambientFadeRef);
```

**Impact:** Audio "pops" or cuts abruptly between scenes.

**Fix:** Cross-fade between old and new ambient audio.

---

## 5. Global Media Layer Issues

### Issue 5.1: Hardcoded Effect in GlobalMediaLayer
**Location:** `GlobalMediaLayer.tsx:26`

**Problem:** GlobalMediaLayer always shows "FX-03-HOLOGRAM-DATA" effect regardless of scene.

**Code:**
```typescript
const effect = OSIRIS_EFFECTS["FX-03-HOLOGRAM-DATA"];  // Hardcoded!
```

**Impact:** Wrong visual effect for many scenes.

**Fix:** Accept effect ID as prop or determine from scene context.

---

### Issue 5.2: Primary Audio Sources Not Deduplicated
**Location:** `MainPlayer.tsx:1379-1398`

**Problem:** `normalizedSceneCandidates` may contain duplicate URLs.

**Code:**
```typescript
const desiredSceneCandidates = [...sceneTrackCandidates];
if (sceneFallbackMusicUrl && !desiredSceneCandidates.includes(sceneFallbackMusicUrl)) {
  desiredSceneCandidates.push(sceneFallbackMusicUrl);
}
if (!desiredSceneCandidates.includes(ASSET_URLS.audio.main_theme)) {
  desiredSceneCandidates.push(ASSET_URLS.audio.main_theme);
}
```

**Impact:** Same audio may be loaded multiple times.

**Fix:** Use Set for deduplication:
```typescript
const desiredSceneCandidates = [...new Set([
  ...sceneTrackCandidates,
  sceneFallbackMusicUrl,
  ASSET_URLS.audio.main_theme
].filter(Boolean))];
```

---

## Summary of Critical Issues

| Priority | Issue | Location | Impact |
|----------|-------|----------|--------|
| 🔴 **HIGH** | Voice audio can fail silently | MainPlayer.tsx:1485+ | Dialogue stuck |
| 🔴 **HIGH** | Auto mode timer not reset on scene change | MainPlayer.tsx:1318+ | Wrong scene advance |
| 🔴 **HIGH** | Audio requires double interaction | MainPlayer.tsx:918+ | Poor UX |
| 🟡 **MEDIUM** | State sync gap (mute) | MainPlayer.tsx:924+ | UI out of sync |
| 🟡 **MEDIUM** | Background video jumps on resume | MainPlayer.tsx:1638+ | Visual glitch |
| 🟡 **MEDIUM** | Ambient volume jump | MainPlayer.tsx:1400+ | Audio pop |
| 🟢 **LOW** | Hardcoded effect | GlobalMediaLayer.tsx:26 | Wrong visuals |
| 🟢 **LOW** | Missing persistence | Various | Settings lost |

---

## Recommended Fixes (Priority Order)

### Immediate (Critical)
1. Add voice audio fallback to text mode
2. Reset auto mode timer on scene change
3. Pre-load audio before enabling to prevent double-click issue

### Short-term
4. Fix background video resume without reload
5. Implement ambient audio cross-fade
6. Sync mute state between MainPlayer and MediaController

### Long-term
7. Make GlobalMediaLayer effect dynamic
8. Add persistence for all user preferences
9. Add deduplication for audio candidates

---

## Testing Recommendations

1. **Voice Sync Test:** Disable network, verify text fallback works
2. **Auto Mode Test:** Enable auto, change scenes rapidly, verify correct advancement
3. **Audio Init Test:** Clear cache, first visit, verify single-click audio start
4. **Pause/Resume Test:** Pause during voice playback, resume, verify sync
5. **Scene Change Test:** Change scenes with ambient audio playing, verify smooth transition
