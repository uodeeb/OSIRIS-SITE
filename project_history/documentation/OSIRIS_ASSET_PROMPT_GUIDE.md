# OSIRIS — Asset Prompt Guide (Timeline A–Z)

This guide extracts story beats from [OSIRIS.md](file:///e:/Books-library2025/mofsedon-novel/OSIRIS.md) and turns them into production-ready prompts for generating supporting multimedia assets (video backgrounds, still backgrounds, ambient audio, SFX, music cues, UI animations, and scene transitions).

## Global Prompt Rules (Apply to All Assets)

### Video Backgrounds
- Format: 16:9, 4K preferred (or 1080p minimum), seamless loop (6–12s), no hard cuts.
- Camera: slow cinematic motion only (dolly, drift, subtle handheld when intended).
- Readability: keep the lower third darker/cleaner for dialogue UI.
- Watermarks: no logos/watermarks; keep the bottom-right area visually simple in case a mask is needed.
- Color: high dynamic range look, but avoid crushed blacks behind text.
- Motion: avoid fast flicker; if “alarm/glitch” is requested, keep it in short pulses.

### Still Backgrounds (Fallback)
- Format: 16:9, 4K, same color palette as the video version.
- Provide variants: (A) clean, (B) darker lower-third for dialogue.

### Audio Layers
- Deliverables per scene when relevant:
  - Music (loopable stem, 30–90s) + optional intro sting (1–3s).
  - Ambience loop (10–30s seamless loop).
  - SFX one-shots (0.2–2.5s) for key events (ping, siren, wind gust, door slam, gunshot, keypress, code burst).
- Mixing guidance:
  - Ambience should sit under dialogue (subtle, wide stereo).
  - SFX transient peaks only; never overpower narration/dialogue.

### UI / Animation Vocabulary
- “Scanlines / CCTV”: subtle overlay, slight vignette, mild chromatic aberration.
- “Glitch”: micro-jitter, RGB split for 150–300ms bursts, not continuous noise.
- “Alarm”: red pulse vignette + subtle screen shake (small).
- “Montage”: fast crossfades + brief white flashes synced to notification SFX.

### Naming Convention (Recommended)
- Video: `vid_bg_scene_<num>_<slug>.mp4`
- Image: `bg_scene_<num>_<slug>.png`
- Music: `mus_scene_<num>_<slug>.wav`
- Ambience: `amb_scene_<num>_<slug>.wav`
- SFX: `sfx_<event>_<variant>.wav`

## Timeline Prompts (Per Scene)

Each scene lists:
- Story intent (visual + audio)
- Suggested assets to generate
- Prompt text you can reuse in a generator

---

## Part 0 — The Cosmic Courtroom

### Scene 1.1 — الاستدعاء (The Summons)
- Location: Yahya’s London apartment (present), rain at window, multi-monitor data streams.
- Visual intent:
  - Cold, lonely, cyber-realism; sudden red alert/ping; “normal desktop” becomes uncanny.
- Audio intent:
  - Rain + device hum bed; sharp unfamiliar encrypted ping.
- Assets to generate:
  - Video BG: rainy London apartment, monitors with blue/green data, sudden red flash area.
  - Ambience: rain + subtle computer hum.
  - SFX: “encrypted ping” (distinct, sharp, branded).
  - UI animation: red alert flash + brief scanline pulse.
- Prompt (Video BG):
  - “Cinematic night interior, London apartment, rain streaks on window, moody desk lamp, multiple monitors showing blue and green data streams, subtle camera drift, occasional red alert glow from a side monitor, realistic cyberpunk minimalism, 16:9, loopable, no text, no logos.”
- Prompt (SFX):
  - “A sharp encrypted notification ping, high clarity, slightly metallic, short tail, modern sci‑fi, not cartoonish.”

### Scene 1.2 — المرافعة الافتتاحية (The Opening Argument)
- Location: OSIRIS interface, timeless digital void; cosmic scale.
- Visual intent:
  - Black infinity + faint starlike dust; UI elements feel ancient and inevitable.
- Audio intent:
  - Low cosmic drone; distant sub pulses; minimal UI blips.
- Assets to generate:
  - Video BG: cosmic void with subtle particles, slow parallax.
  - Music: low drone “cosmic court”.
  - Ambience: vacuum / distant resonance.
  - UI: scanlines overlay + gentle vignette.
- Prompt (Video BG):
  - “Infinite dark cosmic void, subtle star dust, slow drifting particles, faint geometric interface reflections (no readable text), solemn and ancient mood, slow parallax, 16:9 loop.”

---

## Part 1 — The First Crime (Source Code)

### Scene 1.5.1 — الوعد الكاذب (The False Promise)
- Location: quiet London café memory; First Engineer recruiting Tarek.
- Visual intent:
  - Warm inviting café, but with a subtle uncanny “face shifts” feeling for the Engineer.
- Audio intent:
  - Café murmur; cups clink; seductive light jazz that later feels “poisoned”.
- Assets to generate:
  - Video BG: warm café, shallow depth of field, slow camera drift.
  - Music: “café jazz with hidden dissonance” loop.
  - SFX: cup clink, soft chair scrape.
- Prompt (Music):
  - “Warm café jazz loop (piano + brushed drums), subtle uneasy dissonant notes underneath, seductive but unsettling.”

### Scene 1.5.2 — الحقيقة المرة (The Bitter Truth)
- Location: underground corporate lab, neon harsh lighting.
- Visual intent:
  - Sterile corridor + harsh overhead lights; cold techno-dread.
- Audio intent:
  - Server hum, fluorescent buzz; distant mechanical door.
- Assets to generate:
  - Video BG: lab corridor, harsh neon, slow push-in.
  - Ambience: server room hum + faint electrical buzz.
  - UI: scanlines + slight chromatic edge.
- Prompt (Video BG):
  - “Underground corporate lab corridor, harsh neon lights, sterile walls, reflective floor, slow forward camera movement, oppressive atmosphere, 16:9 loop.”

### Scene 1.5.3 — لا مفر (No Escape)
- Location: Tarek’s apartment, paranoia, surveillance.
- Visual intent:
  - CCTV vibe, corner vignetting, subtle timestamp feel (no readable timestamp text).
- Audio intent:
  - Distant footsteps outside; phone ring; heartbeat undertone.
- Assets to generate:
  - Video BG: apartment with security-camera feel.
  - Ambience: footsteps outside + distant sirens.
  - UI: CCTV overlay/scanlines.
- Prompt (VFX overlay):
  - “CCTV scanlines overlay, subtle rolling flicker, mild vignette, slight lens distortion.”

### Scene 1.5.4 — التضحية الأخيرة (The Final Sacrifice)
- Location: London rooftop at night; final choice.
- Visual intent:
  - Wind, city lights bokeh, lonely silhouette, slow tragic beauty.
- Audio intent:
  - Strong wind; cello+piano elegy; distant traffic.
- Assets to generate:
  - Video BG: rooftop with wind + drifting rain mist.
  - Music: cello/piano tragic loop.
  - Ambience: wind gusts.
- Prompt (Video BG):
  - “Night rooftop in London, strong wind, moody skyline bokeh, slow cinematic drift, melancholy, 16:9 seamless loop, no people faces visible.”

### Scene 2.1 — الهروب واللقاء (Escape and Meeting)
- Location: London back alleys → secret underground hideout.
- Visual intent:
  - Fast danger → sudden safe shelter transition.
- Audio intent:
  - Running steps; distant sirens; door clang; breathing.
- Assets to generate:
  - Video BG: wet alley chase (subtle motion).
  - SFX: door clang, footsteps, distant siren.
  - Transition: “slam cut” audio-only + fade-to-safe.

### Scene 2.2 — تشغيل أوزيريس (Launching OSIRIS)
- Location: secret hideout; OSIRIS boot.
- Visual intent:
  - Interface boot sequence, scanning lines, holographic “awakening”.
- Audio intent:
  - Boot chime; server spin-up; UI blips.
- Assets to generate:
  - SFX: OSIRIS boot.
  - Ambience: server room.
  - UI animation: “boot scanline sweep”.

### Scene 3.1 — لحظة الخلق والرفض (Creation and Refusal)
- Location: outside time/space; primal ego birth.
- Visual intent:
  - Mythic cosmic courtroom; abstract light; sacred dread.
- Audio intent:
  - Deep sub drones; distant choir texture (very subtle).
- Assets to generate:
  - Video BG: abstract cosmic ritual space.
  - Music: sacred drone.

### Scene 3.2 — تصميم الفيروس (Designing the Virus)
- Location: OSIRIS simulation; code becomes metaphysics.
- Visual intent:
  - “Code as geometry”: faint glyph patterns, fractal structures (no readable text).
- Audio intent:
  - Analytical pulses; low bass drone.
- Assets to generate:
  - Motion overlay: faint geometric scan.

---

## Part 2 — The Golden Calf

### Scene 4.1 — نشوة النجاة وقلق الفراغ
- Location: Sinai desert, post-escape; freedom panic.
- Visual intent:
  - Vast desert emptiness; heat haze; fragile camp.
- Audio intent:
  - Desert wind; far crowd murmur; sand grit.
- Assets to generate:
  - Video BG: Sinai desert, heat haze loop.
  - Ambience: desert wind + distant crowd.
- Prompt (Video BG):
  - “Sinai desert, vast dunes, heat haze shimmer, distant camp silhouettes, slow drifting camera, cinematic realism, loopable 16:9.”

### Scene 4.2 — هندسة الحشود (Crowd Engineering)
- Location: night camp; golden calf interface engineered.
- Visual intent:
  - Firelight, gold glow, mass hypnosis; the “UI designer” moment.
- Audio intent:
  - Low drums; crowd chant; metal melt; ritual pulse.
- Assets to generate:
  - Video BG: molten gold + firelight + crowd silhouettes.
  - SFX: low calf “hum”, metal pour.
  - UI overlay: subtle hypnosis pulse.
- Prompt (Video BG):
  - “Night desert camp, firelight, molten gold being poured, crowd silhouettes in hypnotic trance, gold reflections, cinematic slow motion, loopable 16:9, no explicit religious icons in close-up.”

---

## Part 3 — The Council of Nicaea

### Scene 5.1 — رسالة من الماضي (Message from the Past)
- Location: hideout; OSIRIS interface; Tarek voice recording.
- Visual intent:
  - Dim interface; emotional stillness; file playback UI.
- Audio intent:
  - Tarek recorded voice; sad bed music; server hum.
- Assets to generate:
  - Music: “sad background (low strings)”.
  - Ambience: server hum.
  - UI: “audio playback waveform” animation (non-literal).

### Scene 5.2 — دموع المحلل (The Analyst’s Tears)
- Location: hideout; Yahya breaks.
- Visual intent:
  - Close, intimate darkness; human fragility.
- Audio intent:
  - Silence + server hum; subdued sob; no music (or minimal).
- Assets to generate:
  - Ambience: silence bed (room tone).

### Scene 6أ.1 — لاهوت معقد، لا نوايا سيئة
- Location: Rome/Alexandria corridors; scholars debate (325 AD lead-up).
- Visual intent:
  - Warm manuscript lighting; intellectual tension; nobody is a “villain” yet.
- Audio intent:
  - Ancient language murmurs; page flips; soft strings.
- Assets to generate:
  - Video BG: candlelit library manuscripts.
  - Ambience: quiet scholarly murmurs.

### Scene 6ب.1 — الإمبراطور والحكيم
- Location: grand council hall; empire pressure.
- Visual intent:
  - Cold blue/gold marble; footsteps echo; power spectacle.
- Audio intent:
  - Hall reverb; heavy guard steps.
- Assets to generate:
  - Video BG: grand council hall.
  - SFX: heavy steps, distant crowd hush.

### Scene 6ج.1 — ألم ليلى
- Location: hideout; personal confession; faith repair.
- Visual intent:
  - Softened lighting; stillness; vulnerability.
- Audio intent:
  - Quiet room tone; distant server.
- Assets to generate:
  - Music: near-silent ambient pad (optional).

### Scene 6ج.2 — رسالة طارق الثانية
- Location: hideout; connecting religion theft → tech theft.
- Visual intent:
  - Interface overlays hinting “recommendation algorithm church”.
- Audio intent:
  - Recorded voice; subtle “notification” motifs.
- Assets to generate:
  - SFX: subtle notification texture.

---

## Part 4 — Andalusia & the 20th Century

### Scene 8.1 — خيانة الإخوة
- Location: Córdoba/Granada; beauty decays into betrayal.
- Visual intent:
  - Rich Andalusian architecture gradually desaturating.
- Audio intent:
  - Andalusian sad music (oud + violin); distant swords; whisper plots.
- Assets to generate:
  - Video BG: Andalusian palace courtyards, fountains, arches.
  - Music: oud+violin lament loop.
- Prompt (Video BG):
  - “Andalusian Islamic architecture courtyard, arches, fountain reflections, gold-blue-green palette slowly fading, cinematic drift, 16:9 seamless loop, no text, no logos.”

### Scene 8.2 — دموع لا تنفع
- Location: “Last Sigh of the Arab” hill, 1492.
- Visual intent:
  - Final look at Alhambra; slow horse departure; crushing shame.
- Audio intent:
  - Wind soft; single-string lament; silence after mother’s line.
- Assets to generate:
  - Video BG: hill overlook, distant palace, slow movement.
  - SFX: horse steps (distant), wind.

### Scene 8ب.1 — وهم العرق الأسمى (Berlin 1933)
- Visual intent:
  - Industrial gray/black; harsh light; systematic evil.
- Audio intent:
  - Distant German rally; boots rhythm.
- Assets to generate:
  - Video BG: Berlin cold interior + mirror vibe (no real faces needed).
  - Ambience: boots march loop (distant).

### Scene 8ج.1 — التوقيع على الموت (Moscow 1937 / Cambodia 1975)
- Visual intent:
  - Split-screen montage: bureaucratic killing vs killing fields.
- Audio intent:
  - Typewriter, paper, distant screams (very subtle), cold drone.
- Assets to generate:
  - Video BG: montage textures, not graphic.
  - SFX: typewriter, stamp, paper.

### Scene 8د.1 — اختراق المخبأ (Hideout Breach)
- Visual intent:
  - Red alarm strobe; dust; door explosion; smoke.
- Audio intent:
  - Explosion; siren; gunfire; heavy footsteps.
- Assets to generate:
  - SFX pack: explosion, siren loop, gunshots (distant), footsteps.
  - UI: “alarm pulse” overlay, micro shake.

### Scene 8د.2 — التحديث النهائي (Final Update)
- Visual intent:
  - Ambulance interior; blood + laptop glow; countdown urgency.
- Audio intent:
  - Heartbeat slow; rising tension pulse.
- Assets to generate:
  - Video BG: ambulance dim interior, laptop light.
  - Music: tension build loop (no melody).

### Scene الانتقالي — لقاء خارج الزمن (The Dream)
- Visual intent:
  - Pure white infinite, comforting; no UI, no tech.
- Audio intent:
  - Almost silence; slow breath; gentle ambient.
- Assets to generate:
  - Video BG: white space, floating dust motes.
  - Music: ambient peace (barely there).

---

## Part 5 — Karbala

### Scene 10.1 — الحق الأعزل
- Location: Karbala desert 680 AD.
- Visual intent:
  - Burning sun; vast sand; massive army vs tiny camp.
- Audio intent:
  - Dry wind; distant horses; solemn silence around the small camp.
- Assets to generate:
  - Video BG: Karbala desert, heat haze, distant army silhouettes.
  - Ambience: wind + distant horse.

---

## Part 6 — Witnesses for the Defense (Digital Age + Ending)

### Scene 11.1 — إغراء المهندس
- Location: cold artificial white digital space.
- Visual intent:
  - The dream’s white space, but synthetic and sterile; “perfect prison”.
- Audio intent:
  - Electronic hum; no nature; subtle UI tone.
- Assets to generate:
  - Video BG: sterile white infinity with faint geometry.
  - Ambience: electronic hum loop.

### Scene 11.2 — قرار يحيى
- Visual intent:
  - The “choice moment”: reality typing overlays with digital space.
- Audio intent:
  - Keypress build; tension swell; single “Enter” impact.
- Assets to generate:
  - SFX: mechanical Enter keypress (hero).
  - UI: scanline + micro glitch on impact.

### Scene 12.1 — تسريب الحقيقة
- Visual intent:
  - White flash; code storm; “digital rosetta stone” broadcast.
- Audio intent:
  - High alarms; epic orchestral rise; electric shock hit.
- Assets to generate:
  - Music: epic orchestral crescendo (short + loop stem).
  - SFX: electric shock, notification swarm.
  - UI: montage flash, code rain overlay.

### Scene 13.1 — الاستيقاظ (Global Montage)
- Visual intent:
  - People everywhere seeing the message; mixed reactions; not utopia.
- Audio intent:
  - Notification cascade → gradual silence.
- Assets to generate:
  - Video BG: montage of city streets/cafés/homes (no identifiable faces).
  - SFX: layered phone notifications (tasteful).

### Scene 13.2 — إغلاق الملف (Cosmic Closing)
- Visual intent:
  - Return to cosmic courtroom black void + white pulse; final words appear.
- Audio intent:
  - Deep cosmic narrator bed; calm finality.
- Assets to generate:
  - Video BG: cosmic void with subtle pulse.
  - Music: cosmic end drone.

---

## Priority Asset Backlog (If You Generate Assets Incrementally)

### Tier 1 (Highest Narrative Impact)
- Scene 1.1 apartment rain + ping + UI red flash
- Scene 4.1 Sinai desert + ambience
- Scene 4.2 molten gold / hypnosis crowd + low drums + calf hum
- Scene 8.1 Andalusia beauty→fade + oud/violin
- Scene 8د.1 breach alarm pack (explosion/siren/gunfire) + red pulse overlay
- Scene 10.1 Karbala desert + solemn wind
- Scene 12.1 code storm + epic rise + notification swarm

### Tier 2 (Context + Tone)
- Scene 1.5.1 café recruitment jazz
- Scene 1.5.3 CCTV paranoia overlay
- Scene 6أ.1 library murmurs
- Scene 6ب.1 council hall footsteps
- Scene 13.1 global montage notifications
