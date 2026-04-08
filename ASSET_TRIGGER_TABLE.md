# OSIRIS Asset Trigger Mapping Table
> **When each asset plays during the novel**
> Use this to verify and fix all asset triggers

---

## Legend
| Column | Description |
|--------|-------------|
| **Scene ID** | Unique scene identifier |
| **Trigger Point** | When the asset plays (Scene Start, Dialogue #, etc.) |
| **Asset Type** | video, bg-image, ambient, sfx, music, voice |
| **Asset Key** | Key used in code |
| **Actual File** | Physical filename in public/assets/ |
| **Status** | ✅ = Mapped, 🔴 = Missing/Needs Fix |

---

## PART 0: Prologue

### Scene: `zero-1-1-summons` (The Summons / الاستدعاء)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Video | `videoBg.yahya_room` | `video-bg/yahya-room.mp4` | ✅ |
| Scene Enter | Background | `sceneBg.zero-1-1-summons` | ⚠️ **NEEDS MAPPING** | 🔴 |
| Scene Enter | Music | `audio.main_theme` | `music-tracks/main-theme.mp3` | ✅ |
| Scene Enter | Ambient | `amb.rain` | `ambient/amb.rain.mp3` | ✅ |
| Scene Enter | Ambient | `amb.device_hum` | `ambient/amb.device_hum.mp3` | ✅ |
| Scene Enter | SFX | `sfx.ping` | `ambient/sfx.ping.mp3` | ✅ |

**Dialogue Lines (10 lines):**
1. Yahya - "كان يحيى يحدق في الشاشات..." (14.4s)
2. Laila - "يحيى، هل أنت بخير؟" (10.4s)
3. Yahya - "أجاب بصوت جاف..." (7.6s)
4. Laila - "صمتت ليلى للحظة..." (6.8s)
5. Laila - "يحيى، أرجوك..." (4s)
6. Yahya - "قاطعها يحيى..." (4.4s)
7. Laila - "قبل أن تجيب ليلى..." (7.6s)
8. Yahya - "توقف نبض يحيى..." (2.5s)
9. Yahya - "ليلى... سأحدثك لاحقاً" (3.2s)
10. Yahya - "اقترب من الشاشة..." (4.4s)
11. Yahya - "فتح الرسالة..." (11.2s)

---

### Scene: `zero-1-2-prosecution` (The Opening Argument / المرافعة الافتتاحية)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Video | `videoBg.cosmic_opening` | `video-bg/cosmic-opening.mp4` | ✅ |
| Scene Enter | Background | `background.osiris_interface` | `images/sun-and-desert.jpg` | ⚠️ Check mapping |
| Scene Enter | Audio | `audio.intro_narration` | `music-tracks/TRACK-02.mp3` | ⚠️ Check alias |
| Scene Enter | Ambient | `amb.vacuum` | `ambient/amb.vacuum.mp3` | ✅ |
| Scene Enter | Ambient | `amb.bass_drone_low` | `ambient/amb.bass_drone_low.mp3` | ✅ |

**Dialogue Lines (15 lines):**
1. Narrator - "تلاشت غرفة يحيى..." (10.8s)
2. Narrator - "ظهرت الكلمات..." (7.6s)
3. Narrator - "الملف رقم: واحد..." (7.2s)
4. Yahya - "تراجع يحيى..." (6s)
5. Yahya - "كتب يحيى على لوحة..." (4s)
6. Narrator - "توقف النبض الأبيض..." (2.8s)
7. Narrator - "أنا المحامي الكوني..." (19.2s)
8. Narrator - "ظهرت ابتسامة رقمية..." (4.4s)
9. Narrator - "لذلك، قررت أن أثبت..." (13.2s)
10. Yahya - "شعر يحيى ببرودة..." (8.4s)
11. Narrator - "استمرت الكلمات..." (2.5s)
12. Narrator - "هذا السطر البرمجي..." (18s)
13. Tarek - "طارق رأى النمط..." (4.8s)
14. Yahya - "ضرب يحيى بقبضته..." (3.2s)
15. Narrator - "أنا؟ لم أفعل شيئاً..." (??s)

---

## PART 1: The Code

### Scene: `one-1-5-1-promise` (The False Promise / الوعد الكاذب)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Background | `background.corporate_lab` | `images/fire-worship.jpg` | ⚠️ Check mapping |
| Scene Enter | Music | `music.cafe_jazz` | `ambient/music.cafe_jazz.mp3` | ✅ |
| Scene Enter | Ambient | `amb.cafe_murmur` | `ambient/amb.cafe_murmur.mp3` | ✅ |
| Scene Enter | SFX | `sfx.cups_clink` | `ambient/sfx.cups_clink.mp3` | ✅ |

**Dialogue Lines (4 lines):**
1. Tarek - "كان طارق يقلب ملعقة..." (19.2s)
2. First Engineer - "نحن لا نبحث عن مجرد مبرمج..." (14s)
3. Tarek - "ابتسم طارق..." (6.8s)
4. First Engineer - "بالضبط..." (4.4s)

---

### Scene: `one-1-5-2-bitter-truth` (The Bitter Truth / الحقيقة المرة)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Background | `background.corporate_lab` | `images/fire-worship.jpg` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.server_hum` | `ambient/amb.server_hum.mp3` | ✅ |
| Scene Enter | Ambient | `amb.heartbeat_fast` | `ambient/amb.heartbeat_fast.mp3` | ✅ |

**Dialogue Lines (5 lines):**
1. Tarek - "طارق يجلس وحيداً..." (7.6s)
2. Yahya - "كان يحيى يراقب..." (2.8s)
3. Tarek - "يا إلهي..." (6.8s)
4. Tarek - "فتح طارق ملفاً سرياً..." (13.2s)
5. Tarek - "أدرك طارق الحقيقة..." (14.4s)

---

### Scene: `one-1-5-3-no-escape` (No Escape / لا مفر)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Background | `background.yahya_apartment` | `images/logo-new-flow02.png` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.phone_ring` | ⚠️ **FILE NOT FOUND** | 🔴 |
| Scene Enter | Ambient | `amb.footsteps_outside` | ⚠️ **FILE NOT FOUND** | 🔴 |

**Dialogue Lines (3 lines):**
1. Tarek - "كان طارق يجمع أقراصاً..." (7.6s)
2. Tarek - "وفجأة، أضاءت شاشة..." (10s)
3. Tarek - "تراجع طارق..." (12.8s)

---

### Scene: `one-1-5-4-sacrifice` (The Final Sacrifice / التضحية الأخيرة)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Video | `videoBg.tarek_rooftop` | `video-bg/tarek-rooftop.mp4` | ✅ |
| Scene Enter | Background | `background.osiris_cosmic` | `images/cosmic-bg.jpg` | ⚠️ Check mapping |
| Scene Enter | Music | `music.rooftop_cello_piano` | ⚠️ **FILE NOT FOUND** | 🔴 |
| Scene Enter | Ambient | `amb.wind_strong` | ⚠️ **FILE NOT FOUND** | 🔴 |

**Dialogue Lines (7 lines):**
1. Tarek - "وقف طارق على حافة..." (4.8s)
2. Tarek - "أخرج هاتفه..." (6.4s)
3. Yahya - "أخي..." (14.8s)
4. Tarek - "ضغط على زر الإرسال..." (3.6s)
5. Tarek - "أغلق طارق عينيه..." (3.2s)
6. Yahya - "انتهت المحاكاة..." (8.8s)

---

## PART 2: The Golden Calf

### Scene: `two-2-1-escape` (Escape and Meeting / الهروب واللقاء)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Background | `background.yahya_apartment` | `images/logo-new-flow02.png` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.sirens_distant` | `ambient/amb.sirens_distant.mp3` | ✅ |
| Scene Enter | Ambient | `amb.running_steps` | `ambient/amb.running_steps.mp3` | ✅ |
| Scene Enter | SFX | `sfx.door_clang` | `ambient/sfx.door_clang.mp3` | ✅ |

**Dialogue Lines (9 lines):**
1. Yahya - "كان يحيى يركض..." (13.2s)
2. Yahya - "انعطف يحيى في زقاق..." (5.2s)
3. Yahya - "كاد يحيى أن يصرخ..." (3.6s)
4. Laila - "اصمت إذا كنت تريد..." (3.2s)
5. Laila - "كانت فتاة شابة..." (8.4s)
6. Yahya - "من أنتِ؟" (2.5s)
7. Laila - "اسمي ليلى..." (4.4s)
8. Yahya - "نظر إليها يحيى بشك..." (5.2s)
9. Laila - "الأرقام التي تعبدها..." (15.6s)

---

### Scene: `two-2-2-osiris-launch` (Launching OSIRIS / تشغيل أوزيريس)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Background | `background.osiris_interface` | `images/sun-and-desert.jpg` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.server_room` | `ambient/amb.server_room.mp3` | ✅ |

---

## PART 3: The Sacred Corruption

### Scene: `three-3-1-creation` (The Moment of Creation / لحظة الخلق والرفض)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Background | `background.osiris_cosmic` | `images/cosmic-bg.jpg` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.bass_drone_low` | `ambient/amb.bass_drone_low.mp3` | ✅ |

**Dialogue Lines (10 lines):**
1. Yahya - "وجد يحيى وليلى نفسيهما..." (8s)
2. Laila - "أين نحن؟" (3.6s)
3. Yahya - "نحن في نقطة الصفر..." (8.4s)
4. Narrator - "فجأة، اهتز الفضاء..." (7.6s)
5. Narrator - "رأيا موجات من النور..." (4.4s)
6. Narrator - "لكن... في وسط هذا الانسجام..." (4.4s)
7. Narrator - "لم يكن وحشاً..." (3.2s)
8. Narrator - "ترجم أوزيريس هذا الرفض..." (7.2s)
9. Yahya - "اتسعت عينا يحيى..." (9.2s)
10. Laila - "قالت ليلى بصوت مرتجف..." (5.2s)

---

### Scene: `three-3-1b-devil-song` (Devil Tongue Song / نشيد لسان الشيطان)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Background | `background.osiris_cosmic` | `images/cosmic-bg.jpg` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.low_hum` | `ambient/amb.low_hum.mp3` | ✅ |
| Scene Enter | Ambient | `amb.bass_drone_low` | `ambient/amb.bass_drone_low.mp3` | ✅ |

---

### Scene: `three-3-2-virus` (Designing the Virus / تصميم الفيروس)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Background | `background.osiris_cosmic` | `images/cosmic-bg.jpg` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.bass_drone_low` | `ambient/amb.bass_drone_low.mp3` | ✅ |

---

## PART 4: The New Blood

### Scene: `six-4-1-warfare` (Modern Warfare / الحرب الحديثة)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Video | `videoBg.berlin_1933` | `video-bg/berlin-1933.mp4` | ✅ |
| Scene Enter | Background | `background.berlin_1933` | `images/yehia-room.jpg` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.war_march` | `ambient/amb.war_march.mp3` | ✅ |
| Scene Enter | Ambient | `amb.drums_hypnosis` | `ambient/amb.drums_hypnosis.mp3` | ✅ |
| Scene Enter | SFX | `sfx.cannon_fire` | `ambient/sfx.cannon_fire.mp3` | ✅ |

---

### Scene: `six-4-2-cage` (The Digital Cage / السجن الرقمي)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Video | `videoBg.digital_space` | `video-bg/digital-space.mp4` | ✅ |
| Scene Enter | Background | `background.osiris_interface` | `images/sun-and-desert.jpg` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.server_room` | `ambient/amb.server_room.mp3` | ✅ |

---

## PART 7: The End

### Scene: `seven-final-confrontation` (The Final Confrontation / المواجهة النهائية)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Video | `videoBg.digital_space` | `video-bg/digital-space.mp4` | ✅ |
| Scene Enter | Background | `background.osiris_interface` | `images/sun-and-desert.jpg` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.bass_drone_low` | `ambient/amb.bass_drone_low.mp3` | ✅ |

---

### Scene: `seven-the-end` (The End / النهاية)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Background | `background.white_space` | `images/logo-new-flow01.png` | ⚠️ Check mapping |
| Scene Enter | Ambient | `amb.vacuum` | `ambient/amb.vacuum.mp3` | ✅ |

---

## TRANSITION SCENE

### Scene: `transition-real-to-sim` (Entering the Simulation)

| Trigger Point | Asset Type | Asset Key | Actual File | Status |
|---------------|------------|-----------|-------------|--------|
| Scene Enter | Video | `videoBg.cosmic_opening` | `video-bg/cosmic-opening.mp4` | ✅ |
| Scene Enter | Ambient | `amb.server_room` | `ambient/amb.server_room.mp3` | ✅ |
| Scene Enter | Ambient | `amb.low_hum` | `ambient/amb.low_hum.mp3` | ✅ |

---

## MISSING ASSETS SUMMARY

### 🔴 Missing Ambient Files (Not in ambient/ folder)
| Asset Key | Used In Scene | Suggested Action |
|-----------|---------------|------------------|
| `amb.phone_ring` | `one-1-5-3-no-escape` | Add file or remove from scene |
| `amb.footsteps_outside` | `one-1-5-3-no-escape` | Add file or remove from scene |
| `amb.wind_strong` | `one-1-5-4-sacrifice` | Add file or remove from scene |

### 🔴 Missing Music Files (Not in ambient/ folder)
| Asset Key | Used In Scene | Suggested Action |
|-----------|---------------|------------------|
| `music.rooftop_cello_piano` | `one-1-5-4-sacrifice` | Add file or use TRACK-XX |

### 🔴 Missing Background Mappings
| Asset Key | Used In Scene | Suggested File |
|-----------|---------------|----------------|
| `sceneBg.zero-1-1-summons` | `zero-1-1-summons` | Map to `yehia-room.jpg` or create alias |

---

## VOICE MAPPING

**Note:** The current scene files do NOT use `voiceCues` array. If you want to add voice narration:

| Voice File | Content Suggestion |
|------------|-------------------|
| `voice-01.mp3` | Scene zero-1-1-summons - Laila's first line |
| `voice-02.mp3` | Scene zero-1-1-summons - Yahya's reaction |
| `voice-03.mp3` | Scene zero-1-2-prosecution - Narrator opening |
| ... | ... |

To add voice cues, edit scene files and add `voiceCues` array to dialogue lines:
```typescript
dialogue: [
  {
    character: 'laila',
    text: "...",
    arabicText: "...",
    duration: 14400,
    voiceCues: [{ at: 0, voice: 1 }] // Triggers voice-01.mp3 at start
  }
]
```

---

## QUICK FIX CHECKLIST

- [ ] Add missing ambient files OR remove from scenes
- [ ] Add missing music file OR remove from scene
- [ ] Fix `sceneBg.zero-1-1-summons` mapping
- [ ] Verify all `background.*` aliases point to correct files
- [ ] Add voice cues if desired
- [ ] Regenerate manifest after all changes

---

**Total Scenes:** 14+  
**Total Assets Referenced:** 50+  
**Missing:** 4 audio files, 1 background mapping
