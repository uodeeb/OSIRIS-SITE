# OSIRIS Asset Gap Analysis & Reconciliation
> **Complete analysis of GENERATED_ASSET_TIMELINE_MAPPING_PLAN.md vs. Current Implementation**

---

## 📊 EXECUTIVE SUMMARY

| Category | Mapping Plan | Current Code | Gap |
|----------|--------------|--------------|-----|
| **Scenes** | 20 mapped | 14 implemented | 6 missing |
| **Music Tracks** | 14 | 14 present | ✅ Complete |
| **Voice Files** | 18 | 3 present | 15 missing |
| **Video Files** | 16 | 5 present | 11 missing |
| **Images** | 7 | 7 present | ✅ Complete |
| **Ambient** | 22 types | 18 files | 4 missing refs |

---

## 🎬 SCENES: Mapping Plan vs. Current Implementation

### ✅ IMPLEMENTED (14 scenes)

| Mapping ID | Scene File | Scene ID | Status |
|------------|------------|----------|--------|
| 1.1 | `partZero.ts` | `zero-1-1-summons` | ✅ |
| 1.2 | `partZero.ts` | `zero-1-2-prosecution` | ✅ |
| 1.5.4 | `partOne.ts` | `one-1-5-4-sacrifice` | ✅ |
| 2.1 | `partOne.ts` | `one-1-5-1-promise` | ✅ |
| 2.2 | `partOne.ts` | `one-1-5-2-bitter-truth` | ✅ |
| 2.3 | `partOne.ts` | `one-1-5-3-no-escape` | ✅ |
| 3.1 | `partTwo.ts` | `two-2-1-escape` | ✅ |
| 3.2 | `partTwo.ts` | `two-2-2-osiris-launch` | ✅ |
| 4.1 | `partThree.ts` | `three-3-1-creation` | ✅ |
| 4.2 | `partThree.ts` | `three-3-2-virus` | ⚠️ ID mismatch |
| 8b.1 | `partSix.ts` | `six-4-1-warfare` | ⚠️ ID mismatch |
| 8b.2 | `partSix.ts` | `six-4-2-cage` | ⚠️ ID mismatch |
| Transition | `transition.ts` | `transition-real-to-sim` | ✅ |

### 🔴 MISSING FROM CODE (6 scenes from mapping plan)

| Mapping ID | Planned Scene ID | Description | Status |
|------------|------------------|-------------|--------|
| 5.1 | `four-5-1-tarek-message` | Tarek's recorded message to Yahya | 🔴 NOT FOUND |
| 6b.1 | `five-6b-1-constantine` | Nicaea Council - Emperor & Arius | 🔴 NOT FOUND |
| 6c.1 | `five-6c-1-laila-pain` | Laila's childhood trauma reveal | 🔴 NOT FOUND |
| 6c.2 | `five-6c-2-tarek-second` | Tarek's second message (Nicaea link) | 🔴 NOT FOUND |
| 8.1 | `six-8-1-andalusia` | Andalus brothers betrayal | 🔴 NOT FOUND |
| 8.2 | `six-8-2-last-tears` | Boabdil's mother "cry like women" | 🔴 NOT FOUND |
| 10.1 | `seven-10-1-karbala` | Karbala - Hussein alone | 🔴 NOT FOUND |
| 11.1 | `seven-11-1-temptation` | Engineer tempts Yahya | 🔴 NOT FOUND |
| 11.2 | `seven-11-2-decision` | Yahya's final choice | 🔴 NOT FOUND |
| 12.1 | `seven-12-1-truth-leak` | Yahya dies, truth leaks | 🔴 NOT FOUND |
| 13.1 | `seven-13-1-awakening` | World wakes up | 🔴 NOT FOUND |
| 13.2 | `seven-13-2-closing` | Closing the file | 🔴 NOT FOUND |

---

## 🎵 MUSIC TRACKS: Full Mapping Status

### ✅ ALL 14 TRACKS PRESENT & MAPPED

| Track | Mapped Scene | File | Status |
|-------|--------------|------|--------|
| TRACK 01 | Global bed (all scenes) | `TRACK-01.mp3` | ✅ |
| TRACK 02 | `zero-1-1-summons`, `zero-1-2-prosecution` | `TRACK-02.mp3` | ✅ |
| TRACK 03 | `three-3-1-creation`, Iblis scenes | `TRACK-03.mp3` | ✅ |
| TRACK 04 | `one-1-5-1-promise` → `one-1-5-4-sacrifice` | `TRACK-04.mp3` | ✅ |
| TRACK 05 | `four-4-1-desert`, `four-4-2-crowd-engineering` | `TRACK-05.mp3` | ✅ |
| TRACK 06 | `five-6a-1-nicaea-debate`, `five-6b-1-constantine` | `TRACK-06.mp3` | ✅ |
| TRACK 07 | `six-8-1-andalusia`, `six-8-2-last-tears` | `TRACK-07.mp3` | ✅ |
| TRACK 08 | `six-8b-1-berlin`, `six-8c-1-death-signatures` | `TRACK-08.mp3` | ✅ |
| TRACK 09 | `seven-10-1-karbala` | `TRACK-09.mp3` | ✅ |
| TRACK 10 | `seven-11-1-temptation`, `seven-11-2-decision` | `TRACK-10.mp3` | ✅ |
| TRACK 11 | `seven-12-1-truth-leak`, `seven-13-1-awakening` | `TRACK-11.mp3` | ✅ |
| TRACK 12 | `two-2-1-escape`, action scenes | `TRACK-12.mp3` | ✅ |
| TRACK 13 | `transition-dream` | `TRACK-13.mp3` | ✅ |
| TRACK 14 | `seven-13-2-closing` + credits | `TRACK-14.mp3` | ✅ |

**Note:** Music is mapped but NOT YET triggered from script. Need cue system implementation.

---

## 🎙️ VOICE FILES: Mapping vs. Reality

### ✅ PRESENT (3 voices)

| Voice | Mapped Scene | File | Content |
|-------|--------------|------|---------|
| VOICE 01 | `zero-1-2-prosecution` | `voice-01.mp3` | "الملف رقم... واحد" (Opening) |
| VOICE 02 | `three-3-2-virus` | `voice-02.mp3` | "المحور الأول... الكبر" (6 axes) |
| VOICE 07 | `six-8-1-andalusia` | `voice-07.mp3` | "أتذكرون؟ هذا ما قلته..." |

### 🔴 MISSING (15 voices need generation)

| Voice | Mapped Scene | Content Description | Priority |
|-------|--------------|---------------------|----------|
| VOICE 03 | `four-5-1-tarek-message` | Tarek's recorded message | HIGH |
| VOICE 04 | `one-1-5-4-sacrifice` | Tarek's farewell whisper | HIGH |
| VOICE 05 | `three-3-2-virus` | Yahya's realization | MEDIUM |
| VOICE 06 | `six-8-2-last-tears` | Mother of Boabdil | MEDIUM |
| VOICE 08 | `seven-10-1-karbala` | Hussein at Karbala | HIGH |
| VOICE 09 | `transition-dream` | Tarek in dream | MEDIUM |
| VOICE 10 | `seven-11-2-decision` | Yahya's final choice | HIGH |
| VOICE 11 | `seven-13-2-closing` | Closing the file | HIGH |
| VOICE 12 | `seven-12-1-truth-leak` | Yahya dies | HIGH |
| VOICE 13 | `seven-10-1-karbala` | Laila explains Hussein | MEDIUM |
| VOICE 14 | `seven-11-1-temptation` | Engineer tempts Yahya | HIGH |
| VOICE 15 | `five-6c-1-laila-pain` | Laila's childhood pain | MEDIUM |
| VOICE 16 | `five-6c-2-tarek-second` | Tarek links Nicaea to present | MEDIUM |
| VOICE 17 | `four-4-2-crowd-engineering` | Yahya understands Samiri | LOW |
| VOICE 18 | `seven-13-2-closing` | Final words to reader | MEDIUM |

---

## 🎬 VIDEO FILES: Mapping vs. Reality

### ✅ PRESENT (5 videos)

| Video | Mapped Scene | File | Description |
|-------|--------------|------|-------------|
| VIDEO 02 | `zero-1-1-summons` | `yahya-room.mp4` | Rain on window, London |
| VIDEO 03 | `zero-1-2-prosecution` | `cosmic-opening.mp4` | OSIRIS simulation start |
| VIDEO 04 | `one-1-5-4-sacrifice` | `tarek-rooftop.mp4` | Rooftop, wind, finality |
| VIDEO 10 | `six-8b-1-berlin` | `berlin-1933.mp4` | 1933 horror aesthetic |
| VIDEO 12 | `seven-11-1-temptation` | `digital-space.mp4` | Digital white room |

### 🔴 MISSING (11 videos need generation)

| Video | Mapped Scene | Description | Priority |
|-------|--------------|-------------|----------|
| VIDEO 01 | Home intro | Main screen intro | MEDIUM |
| VIDEO 05 | `four-4-1-desert` | Sinai desert, footprints | HIGH |
| VIDEO 06 | `four-4-2-crowd-engineering` | Molten gold forming calf | HIGH |
| VIDEO 07 | `five-6b-1-constantine` | Nicaea Council candlelight | HIGH |
| VIDEO 08 | `six-8-1-andalusia` | Andalus fading colors | HIGH |
| VIDEO 09 | `six-8-2-last-tears` | Boabdil's last look | HIGH |
| VIDEO 11 | `seven-10-1-karbala` | Karbala desert, shadows | HIGH |
| VIDEO 13 | `seven-11-2-decision`, `seven-12-1-truth-leak` | Enter key press | MEDIUM |
| VIDEO 14 | `seven-13-1-awakening` | World wakes up | MEDIUM |
| VIDEO 15 | `seven-13-2-closing` | Closing the file | MEDIUM |
| VIDEO 16 | Share screen | Spreading truth network | LOW |

---

## 🔴 CRITICAL GAPS TO CLOSE

### 1. MISSING AMBIENT REFERENCES (4 files)
These are referenced in scenes but files don't exist:

| Missing Reference | Used In | Action |
|-------------------|---------|--------|
| `amb.phone_ring` | `one-1-5-3-no-escape` | Remove from scene OR add file |
| `amb.footsteps_outside` | `one-1-5-3-no-escape` | Remove from scene OR add file |
| `amb.wind_strong` | `one-1-5-4-sacrifice` | Remove from scene OR add file |
| `music.rooftop_cello_piano` | `one-1-5-4-sacrifice` | Change to TRACK 04 |

### 2. SCENE ID MISMATCHES
Current code uses different IDs than mapping plan:

| Current ID | Should Be (Per Plan) | File |
|------------|----------------------|------|
| `three-3-2-virus` | `three-3-2-virus-design` | `partThree.ts` |
| `six-4-1-warfare` | `six-8b-1-berlin` | `partSix.ts` |
| `six-4-2-cage` | `six-8c-1-death-signatures` | `partSix.ts` |

### 3. MISSING SCENES (12 scenes from script not implemented)
These scenes are in the script but not in the code:

| Scene | Script Chapter | Status |
|-------|----------------|--------|
| `four-5-1-tarek-message` | Ch 7 | 🔴 NOT IN CODE |
| `four-4-1-desert` | Ch 6 | 🔴 NOT IN CODE |
| `four-4-2-crowd-engineering` | Ch 6 | 🔴 NOT IN CODE |
| `five-5-1-pharaoh` | Ch 5 | 🔴 NOT IN CODE |
| `five-6b-1-constantine` | Ch 9 | 🔴 NOT IN CODE |
| `five-6c-1-laila-pain` | Ch 10 | 🔴 NOT IN CODE |
| `five-6c-2-tarek-second` | Ch 10 | 🔴 NOT IN CODE |
| `six-8-1-andalusia` | Ch 11 | 🔴 NOT IN CODE |
| `six-8-2-last-tears` | Ch 12 | 🔴 NOT IN CODE |
| `seven-10-1-karbala` | Ch 18 | 🔴 NOT IN CODE |
| `seven-11-1-temptation` | Ch 19 | 🔴 NOT IN CODE |
| `seven-11-2-decision` | Ch 19 | 🔴 NOT IN CODE |
| `seven-12-1-truth-leak` | Ch 20 | 🔴 NOT IN CODE |
| `seven-13-1-awakening` | Ch 22 | 🔴 NOT IN CODE |
| `seven-13-2-closing` | Ch 22 | 🔴 NOT IN CODE |

### 4. VOICE CUE SYSTEM NOT IMPLEMENTED
The mapping plan specifies trigger tags like `[[VOICE:03:PLAY]]` but:
- No voice cues in current dialogue lines
- No parser in MainPlayer.tsx
- No voice queue system

### 5. MUSIC TRIGGER SYSTEM NOT IMPLEMENTED
Music tracks exist but are not triggered from script:
- No `[[TRACK:X:START]]` tags
- No ducking system for TRACK 01 bed
- No 1.5s fade transitions

### 6. `sceneBg.*` KEY MAPPING
In `zero-1-1-summons`:
```typescript
backgroundImage: 'sceneBg.zero-1-1-summons',  // 🔴 NOT MAPPED
```
This key doesn't exist in `KEY_ALIASES` or manifest.

---

## 📋 COMPLETE TO-DO LIST TO CLOSE ALL GAPS

### Phase 1: Fix Current Implementation (CRITICAL)
- [ ] Fix 4 missing ambient references (remove or add files)
- [ ] Fix `sceneBg.zero-1-1-summons` mapping
- [ ] Fix 3 scene ID mismatches
- [ ] Verify all `background.*` aliases work with new image names

### Phase 2: Add Missing Assets (HIGH PRIORITY)
- [ ] Generate 11 missing videos (or accept placeholders)
- [ ] Generate 15 missing voices (or reduce scope)
- [ ] Implement voice cue system in scenes
- [ ] Implement music trigger system with ducking

### Phase 3: Add Missing Scenes (MEDIUM PRIORITY)
- [ ] Create `four-5-1-tarek-message` scene
- [ ] Create `four-4-1-desert` and `four-4-2-crowd-engineering` scenes
- [ ] Create `five-6b-1-constantine` scene
- [ ] Create `five-6c-1-laila-pain` and `five-6c-2-tarek-second` scenes
- [ ] Create `six-8-1-andalusia` and `six-8-2-last-tears` scenes
- [ ] Create `seven-10-1-karbala` scene
- [ ] Create `seven-11-1-temptation` and `seven-11-2-decision` scenes
- [ ] Create `seven-12-1-truth-leak` scene
- [ ] Create `seven-13-1-awakening` and `seven-13-2-closing` scenes

### Phase 4: Polish (LOW PRIORITY)
- [ ] Add `ya-rab.m4a` to appropriate scene
- [ ] Final manifest regeneration
- [ ] End-to-end testing

---

## ❓ QUESTIONS FOR YOU

1. **Scope:** Should I implement the 12 missing scenes, or is the current 14-scope complete for launch?

2. **Voices:** Implement all 15 missing voices, or reduce to 4 key voices (01, 04, 10, 11)?

3. **Videos:** Generate all 11 missing videos, or proceed with current 5 for launch?

4. **Ambient:** Remove the 4 missing ambient references, or do you have files to add?

5. **Cue System:** Implement the full `[[TAG]]` trigger system, or keep simple scene-level triggers?

---

**Everything is documented. Awaiting your decisions to proceed!** 🎯
