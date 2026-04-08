# OSIRIS Asset Trigger Mapping — Full Implementation Guide
> **Based on OSIRIS_ASSET_PROMPTS.md**
> **48 Assets: 14 Music + 18 Voices + 16 Videos**

---

## OSIRIS MODEL CONCEPT
**OSIRIS is the AI Model that leads the simulation.** It's the interface between the cosmic court and human understanding.

**Video Trigger Rule:** When OSIRIS is mentioned to "start simulation" or "open the file" → **Trigger cosmic/digital video background**

---

# 🎵 MUSIC TRACKS (14 tracks)

| Track | Prompt Ref | File Name | Trigger Scene | Trigger Point | Duration |
|-------|------------|-----------|---------------|---------------|----------|
| **TRACK 01** | Main Theme | `TRACK-01.mp3` | Main Menu / Loading | On app start | 3 min |
| **TRACK 02** | Zero: The Summons | `TRACK-02.mp3` | `zero-1-1-summons` | Scene enter + OSIRIS opens | 3.5 min |
| **TRACK 03** | Iblis/Engineer Theme | `TRACK-03.mp3` | Any Iblis scene | When Iblis speaks | 2.5 min |
| **TRACK 04** | Tarek's Story | `TRACK-04.mp3` | `one-1-5-1-promise` to `one-1-5-4-sacrifice` | Tarek memories start | 4 min |
| **TRACK 05** | Golden Calf / Sinai | `TRACK-05.mp3` | `four-4-1-ecstasy` | Flashback to golden calf | 3 min |
| **TRACK 06** | Nicaea Council | `TRACK-06.mp3` | `six-6b-1-emperor` | Imperial throne scene | 3.5 min |
| **TRACK 07** | Andalus Lost | `TRACK-07.mp3` | `eight-8-1-betrayal` | Boabdil leaves Granada | 4 min |
| **TRACK 08** | 20th Century (Hitler/Stalin/Pol Pot) | `TRACK-08.mp3` | `six-4-1-warfare` | Modern warfare montage | 3 min |
| **TRACK 09** | Karbala | `TRACK-09.mp3` | `ten-10-1-truth-alone` | Hussein stands alone | 4 min |
| **TRACK 10** | Digital Confrontation (Climax) | `TRACK-10.mp3` | `eleven-11-1-temptation` | Final confrontation | 5 min |
| **TRACK 11** | Closing the File (Ending) | `TRACK-11.mp3` | `thirteen-13-1-awakening` | World wakes up | 4 min |
| **TRACK 12** | Escape/Action | `TRACK-12.mp3` | `eight-8d-1-hideout-breach` | Chase/action scenes | 2.5 min |
| **TRACK 13** | Dream Before Battle | `TRACK-13.mp3` | Transition scene | Meeting Tarek beyond time | 3 min |
| **TRACK 14** | Final Credits | `TRACK-14.mp3` | Credits screen | End of story | 3.5 min |

### Current Status: ✅ All 14 tracks exist in `music-tracks/`

---

# 🎙️ VOICE CLIPS (18 voices)

| Voice | Prompt Ref | File Name | Trigger Scene | Dialogue Line | Duration |
|-------|------------|-----------|---------------|---------------|----------|
| **VOICE 01** | Opening Prosecution | `voice-01.mp3` | `zero-1-2-prosecution` | "الملف رقم... واحد..." (Opening statement) | ~45s |
| **VOICE 02** | Iblis Oath / The Algorithm | `voice-02.mp3` | `three-3-2-virus` | "المحور الأول... الكبر" (6 axes explained) | ~60s |
| **VOICE 03** | Tarek's First Message | `voice-03.mp3` | `five-5-1-message-past` | "يحيى... إذا كنت تستمع لهذا..." | ~60s |
| **VOICE 04** | Tarek's Farewell | `voice-04.mp3` | `one-1-5-4-sacrifice` | "أخي... إذا وصلت إليك هذه الرسالة..." | ~45s |
| **VOICE 05** | Yahya's Realization | `voice-05.mp3` | `three-3-2-virus` | "طارق كان محقاً... الشيطان لم يحتاج..." | ~30s |
| **VOICE 06** | Mother of Boabdil | `voice-06.mp3` | `eight-8-2-tears-useless` | "ابكِ كالنساء... ملكاً..." | ~15s |
| **VOICE 07** | Iblis on Andalus | `voice-07.mp3` | `eight-8-1-betrayal` | "أتذكرون؟ هذا ما قلته..." | ~20s |
| **VOICE 08** | Hussein at Karbala | `voice-08.mp3` | `ten-10-1-truth-alone` | "هذا هو مضاد الفيروسات..." | ~30s |
| **VOICE 09** | Tarek in Dream | `voice-09.mp3` | Transition | "الخوارزمية لا تستطيع حساب التضحية..." | ~40s |
| **VOICE 10** | Yahya's Final Choice | `voice-10.mp3` | `eleven-11-2-decision` | "أنا أرفض جنتك المزيفة..." | ~35s |
| **VOICE 11** | Closing the File | `voice-11.mp3` | `thirteen-13-2-close-file` | "الدفاع قدم شهوده..." | ~60s |
| **VOICE 12** | Yahya Dies | `voice-12.mp3` | `twelve-12-1-truth-leak` | "لا تفصليه... دعي الكود يصل..." | ~20s |
| **VOICE 13** | Laila Explains Hussein | `voice-13.mp3` | `ten-10-1-truth-alone` | "لأن الاستسلام ليزيد يعني..." | ~25s |
| **VOICE 14** | Engineer Tempts Yahya | `voice-14.mp3` | `eleven-11-1-temptation` | "البشر غير مؤهلين للحرية..." | ~50s |
| **VOICE 15** | Laila's Childhood Pain | `voice-15.mp3` | `six-6c-1-laila-pain` | "أمي كانت ضحية للمؤسسة..." | ~45s |
| **VOICE 16** | Tarek Links Nicaea to Present | `voice-16.mp3` | `six-6c-2-message-two` | "يحيى... إذا رأيت نيقية..." | ~50s |
| **VOICE 17** | Yahya Understands Samiri | `voice-17.mp3` | `four-4-2-crowd-engineering` | "السامري هو أول مهندس واجهات..." | ~25s |
| **VOICE 18** | Final Words to Reader | `voice-18.mp3` | `thirteen-13-2-close-file` | "القضية مستمرة... والخيار الآن... لك" | ~10s |

### Current Status: ✅ 3 voices exist (`voice-01.mp3`, `voice-02.mp3`, `voice-07.mp3`)
### 🔴 Missing: 15 voice files need generation

---

# 🎬 VIDEO BACKGROUNDS (16 videos)

| Video | Prompt Ref | File Name | Trigger Scene | Trigger Point | Mood |
|-------|------------|-----------|---------------|---------------|------|
| **VIDEO 01** | Main Screen Intro | `main-intro.mp4` | Main Menu | App start | Beginning of everything |
| **VIDEO 02** | Yahya's Room | `yahya-room.mp4` | `zero-1-1-summons` | Scene enter | Digital paranoia, rain |
| **VIDEO 03** | Cosmic Void | `cosmic-opening.mp4` | `zero-1-2-prosecution` | **OSIRIS starts simulation** | Ancient cosmic authority |
| **VIDEO 04** | Rooftop | `tarek-rooftop.mp4` | `one-1-5-4-sacrifice` | Tarek's sacrifice | Finality, decision |
| **VIDEO 05** | Sinai Desert | `sinai-desert.mp4` | `four-4-1-ecstasy` | Flashback starts | Spiritual void |
| **VIDEO 06** | Molten Gold | `molten-gold.mp4` | `four-4-2-crowd-engineering` | Golden calf forming | Seductive idolatry |
| **VIDEO 07** | Nicaea Council | `nicaea-council.mp4` | `six-6b-1-emperor` | Emperor's throne | Power corrupts |
| **VIDEO 08** | Andalus Fading | `andalus-fading.mp4` | `eight-8-1-betrayal` | Colors desaturate | Death of civilization |
| **VIDEO 09** | Boabdil's Tear | `boabdil-tear.mp4` | `eight-8-2-tears-useless` | Last look at Granada | Paradise lost |
| **VIDEO 10** | Berlin 1933 | `berlin-1933.mp4` | `six-4-1-warfare` | Modern warfare | Banality of evil |
| **VIDEO 11** | Karbala | `karbala-desert.mp4` | `ten-10-1-truth-alone` | Hussein stands | Absolute stillness |
| **VIDEO 12** | Digital Space | `digital-space.mp4` | `eleven-11-1-temptation` | Meeting Engineer | Beautiful prison |
| **VIDEO 13** | Enter Key | `enter-key.mp4` | `eleven-11-2-decision` | Yahya presses Enter | Moment of change |
| **VIDEO 14** | World Awakens | `world-awakens.mp4` | `thirteen-13-1-awakening` | Truth spreads | Complicated morning |
| **VIDEO 15** | Closing File | `closing-file.mp4` | `thirteen-13-2-close-file` | File closes | Pause, not ending |
| **VIDEO 16** | Share the Code | `share-code.mp4` | Share screen | User shares story | Spreading truth |

### Current Status: ✅ 5 videos exist (cosmic-opening, yahya-room, tarek-rooftop, digital-space, berlin-1933)
### 🔴 Missing: 11 video files

---

# 🖼️ STATIC IMAGES (Visual Effects)

| Image File | Scene Used | Visual Effect | Description |
|------------|------------|---------------|-------------|
| `yehia-room.jpg` | `zero-1-1-summons` | Background | Yahya's apartment interior |
| `sun-and-desert.jpg` | Multiple | Background | OSIRIS interface / cosmic |
| `fire-worship.jpg` | `one-1-5-1-promise` | Background | Corporate lab / golden calf scene |
| `cosmic-bg.jpg` | Multiple | Background | Creation moment / cosmic scenes |
| `logo-new-flow01.png` | `seven-the-end` | Background | White space ending |
| `logo-new-flow02.png` | `two-2-1-escape` | Background | Yahya's apartment |

---

# 🔴 GAPS I CAN'T FIGURE OUT — Need Your Input

## 1. Missing Scenes in Current Code
The prompts reference scenes that don't exist in the current scene files:

| Scene ID | Description | Status |
|----------|-------------|--------|
| `five-5-1-message-past` | Tarek's first recorded message | ❌ NOT FOUND |
| `four-4-1-ecstasy` | Golden calf flashback | ❌ NOT FOUND |
| `four-4-2-crowd-engineering` | Samiri engineers the crowd | ❌ NOT FOUND |
| `six-6b-1-emperor` | Emperor and Arius at Nicaea | ❌ NOT FOUND |
| `six-6c-1-laila-pain` | Laila's childhood trauma reveal | ❌ NOT FOUND |
| `six-6c-2-message-two` | Tarek's second message (Nicaea link) | ❌ NOT FOUND |
| `eight-8-1-betrayal` | Andalus - betrayal of brothers | ❌ NOT FOUND |
| `eight-8-2-tears-useless` | Boabdil's mother "cry like women" | ❌ NOT FOUND |
| `eight-8d-1-hideout-breach` | Action escape scene | ❌ NOT FOUND |
| `ten-10-1-truth-alone` | Karbala - Hussein alone | ❌ NOT FOUND |
| `eleven-11-1-temptation` | Engineer tempts Yahya | ❌ NOT FOUND |
| `eleven-11-2-decision` | Yahya's final choice | ❌ NOT FOUND |
| `twelve-12-1-truth-leak` | Yahya dies, truth leaks | ❌ NOT FOUND |
| `thirteen-13-1-awakening` | World wakes up | ❌ NOT FOUND |
| `thirteen-13-2-close-file` | Closing the file | ❌ NOT FOUND |

**Question:** Are these scenes in a different file? Or are they future scenes to be written?

---

## 2. OSIRIS Simulation Start Triggers
**OSIRIS is the AI Model.** Based on the script, OSIRIS starts the simulation at:

| Trigger Point | Current Code | Should Trigger |
|---------------|--------------|----------------|
| `zero-1-1-summons` | `backgroundVideo: videoBg('yahya_room')` | ✅ Correct |
| `zero-1-2-prosecution` | `backgroundVideo: videoBg('cosmic_opening')` | ✅ **OSIRIS starts cosmic simulation** |
| `transition-real-to-sim` | `backgroundVideo: videoBg('cosmic_opening')` | ✅ **OSIRIS transition** |
| Other scenes | Static images only | ❓ Should OSIRIS video appear in other simulation scenes? |

**Question:** Should the cosmic/digital video backgrounds appear in ALL simulation flashback scenes, or only specific ones?

---

## 3. Missing Ambient Files (4 files)
These ambient sounds are referenced but not in the `ambient/` folder:

| Missing File | Used In Scene | Suggested Fix |
|--------------|---------------|---------------|
| `amb.phone_ring` | `one-1-5-3-no-escape` | Add file OR remove reference |
| `amb.footsteps_outside` | `one-1-5-3-no-escape` | Add file OR remove reference |
| `amb.wind_strong` | `one-1-5-4-sacrifice` | Add file OR remove reference |
| `music.rooftop_cello_piano` | `one-1-5-4-sacrifice` | Should be `music.` not `amb.` - use TRACK-04? |

**Question:** Should I add these files or remove the references?

---

## 4. Voice Implementation Questions

### Current State:
- Scenes have `dialogue[]` array but NO `voiceCues`
- Only 3 of 18 voice files exist

### Options:
**A.** Add `voiceCues` to all scenes (major change)
**B.** Use voices only for iconic scenes (VOICE 01, 04, 10, 11)
**C.** Remove voice system entirely (simplify)

**Question:** Do you want full voice narration or just key moments?

---

## 5. Songs Folder
| File | Status | Suggested Use |
|------|--------|---------------|
| `ya-rab.m4a` | Present, not mapped | Background for spiritual scenes? |

**Question:** What is `ya-rab.m4a` for? Should it be mapped to a specific scene?

---

# 🎯 RECOMMENDED IMPLEMENTATION ORDER

## Phase 1: Fix Current Scenes (Critical)
1. ✅ Add missing ambient files OR remove references
2. ✅ Fix `sceneBg.zero-1-1-summons` mapping
3. ✅ Verify all background aliases work

## Phase 2: Add Missing Assets (High Priority)
4. Generate 11 missing videos (or use placeholders)
5. Generate 15 missing voices (or reduce to key voices only)
6. Map `ya-rab.m4a` to appropriate scene

## Phase 3: Expand Scenes (If Needed)
7. Add missing historical scenes from prompts
8. Add voice cues if desired
9. Add OSIRIS triggers to additional scenes

---

# 📋 QUICK CHECKLIST

- [ ] **GAPS TO RESOLVE:** Answer the 5 questions above
- [ ] Add 4 missing ambient files (or remove references)
- [ ] Fix `sceneBg.*` mapping in `zero-1-1-summons`
- [ ] Generate 11 missing videos (or accept current 5)
- [ ] Generate 15 missing voices (or reduce to 4 key voices)
- [ ] Decide: Full voice narration or key moments only?
- [ ] Decide: Add missing historical scenes or keep current scope?
- [ ] Map `ya-rab.m4a` to appropriate scene
- [ ] Regenerate manifest after all changes

---

**Awaiting your answers to the 5 GAP questions to proceed!** 🎯
