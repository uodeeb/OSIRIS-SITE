# Generated Assets → Live Timeline Mapping Plan

## Scope
- Source spec: `OSIRIS_ASSET_PROMPTS.md`
- Source media: `generated-assets/` (images, music-tracks, video-bg, voices)
- Live player timeline: `client/src/lib/sceneSystem.ts` + `MainPlayer.tsx`
- Goal: map every generated asset to clear placement points and define trigger plan so tracks are fired from script timeline like voices.

## Live Timeline Canonical Scene Map
- 1.1 → `zero-1-1-summons`
- 1.2 → `zero-1-2-prosecution`
- 1.5.4 → `one-1-5-4-sacrifice`
- 3.2 → `three-3-2-virus-design`
- 4.1 → `four-4-1-desert`
- 4.2 → `four-4-2-crowd-engineering`
- 5.1 → `four-5-1-tarek-message`
- 6b.1 → `five-6b-1-constantine`
- 6c.1 → `five-6c-1-laila-pain`
- 6c.2 → `five-6c-2-tarek-second`
- 8.1 → `six-8-1-andalusia`
- 8.2 → `six-8-2-last-tears`
- 8b.1 → `six-8b-1-berlin`
- 10.1 → `seven-10-1-karbala`
- 11.1 → `seven-11-1-temptation`
- 11.2 → `seven-11-2-decision`
- 12.1 → `seven-12-1-truth-leak`
- 13.1 → `seven-13-1-awakening`
- 13.2 → `seven-13-2-closing`
- Transition dream → `transition-dream`

## Inventory Coverage vs Prompt Doc

### Music tracks
- Present in `generated-assets/music-tracks`: TRACK 01 → TRACK 14
- Status: covered

### Voice assets
- Present: VOICE 01 → VOICE 16
- Missing vs prompt sections: VOICE 17, VOICE 18

### Video assets
- Present: VIDEO 01 → VIDEO 13 + extra alternates (`andalus`, `desert`, `karblaa`, `yehya-office-vid`)
- Missing vs prompt sections: VIDEO 14, VIDEO 15, VIDEO 16

### Images
- Present: `images/01.jpg` → `images/07.jpg`
- Status: covered

## Mapping Plan — Music Tracks (script-driven triggers)

- TRACK 01: global bed from first playable scene; keep running at base level
  - Start trigger: first interaction + first scene load (`zero-1-1-summons`)
  - Stop trigger: app exit only
- TRACK 02: `zero-1-1-summons`, `zero-1-2-prosecution`
- TRACK 03: `three-3-1-creation`, `three-3-2-virus-design`, and any line tagged engineer/iblis
- TRACK 04: `one-1-5-1-promise` → `one-1-5-4-sacrifice`
- TRACK 05: `four-4-1-desert`, `four-4-2-crowd-engineering`
- TRACK 06: `five-6a-1-nicaea-debate`, `five-6b-1-constantine`, `five-6c-1-laila-pain`, `five-6c-2-tarek-second`
- TRACK 07: `six-8-1-andalusia`, `six-8-2-last-tears`
- TRACK 08: `six-8b-1-berlin`, `six-8c-1-death-signatures`
- TRACK 09: `seven-10-1-karbala`
- TRACK 10: `seven-11-1-temptation`, `seven-11-2-decision`
- TRACK 11: `seven-12-1-truth-leak`, `seven-13-1-awakening`
- TRACK 12: `two-2-1-escape`, `six-8d-1-attack`, `six-8d-2-final-update`
- TRACK 13: `transition-dream`
- TRACK 14: `seven-13-2-closing` + credits/share state

## Mapping Plan — Voice Assets (timestamped cue placement)

- VOICE 01 → `zero-1-2-prosecution`
- VOICE 02 → `three-3-2-virus-design`
- VOICE 03 → `four-5-1-tarek-message`
- VOICE 04 → `one-1-5-4-sacrifice`
- VOICE 05 → `three-3-2-virus-design`
- VOICE 06 → `six-8-2-last-tears`
- VOICE 07 → `six-8-1-andalusia`
- VOICE 08 → `seven-10-1-karbala`
- VOICE 09 → `transition-dream`
- VOICE 10 → `seven-11-2-decision`
- VOICE 11 → `seven-13-2-closing`
- VOICE 12 → `seven-12-1-truth-leak`
- VOICE 13 → `seven-10-1-karbala`
- VOICE 14 → `seven-11-1-temptation`
- VOICE 15 → `five-6c-1-laila-pain`
- VOICE 16 → `five-6c-2-tarek-second`
- VOICE 17 (missing file) planned → `four-4-2-crowd-engineering`
- VOICE 18 (missing file) planned → `seven-13-2-closing`

## Mapping Plan — Video Assets

- VIDEO 01 → Home intro + preload at app start
- VIDEO 02 → `zero-1-1-summons`
- VIDEO 03 → `zero-1-2-prosecution`
- VIDEO 04 → `one-1-5-4-sacrifice`
- VIDEO 05 → `four-4-1-desert`
- VIDEO 06 → `four-4-2-crowd-engineering`
- VIDEO 07 → `five-6b-1-constantine`
- VIDEO 08 → `six-8-1-andalusia`
- VIDEO 09 → `six-8-2-last-tears`
- VIDEO 10 → `six-8b-1-berlin`
- VIDEO 11 → `seven-10-1-karbala`
- VIDEO 12 → `seven-11-1-temptation`
- VIDEO 13 → `seven-11-2-decision`, `seven-12-1-truth-leak`
- VIDEO 14 (missing file) planned → `seven-13-1-awakening`
- VIDEO 15 (missing file) planned → `seven-13-2-closing`
- VIDEO 16 (missing file) planned → share/final branch after `seven-13-2-share`

## Mapping Plan — Image Overlays

- `images/01.jpg` → `zero-1-1-summons`
- `images/02.jpg` → `four-4-1-desert`
- `images/03.jpg` → `four-4-2-crowd-engineering`
- `images/04.jpg` → `six-8-1-andalusia`, `six-8-2-last-tears`
- `images/05.jpg` → `seven-10-1-karbala`
- `images/06.jpg` → `seven-12-1-truth-leak`
- `images/07.jpg` → `six-8d-1-attack`

## Trigger Model for Script-like Execution

### Dialogue tag syntax to add in scene content
- `[[TRACK:07:START]]`
- `[[TRACK:07:STOP]]`
- `[[VOICE:03:PLAY]]`
- `[[VIDEO:05:CUT]]`
- `[[IMAGE:02:OVERLAY:0.35]]`

### Runtime behavior
- Parse tags per dialogue line at display start.
- Keep TRACK 01 always alive.
- On `TRACK:X:START`: duck TRACK 01 to -12 dB over 1.5s and fade TRACK X to 0 dB over 1.5s.
- On `TRACK:X:STOP` or scene exit: fade TRACK X out and restore TRACK 01 to 0 dB over 1.5s.
- Voices run one-shot with scene-local queue and optional interrupt policy.

## Missing Asset Actions
- Generate/import VOICE 17, VOICE 18.
- Generate/import VIDEO 14, VIDEO 15, VIDEO 16.
- Add direct URLs into `assetUrls.ts` + mapping table once files exist.

## Implementation File Plan (after approval)
- `client/src/lib/sceneSystem.ts`
  - add cue blocks (`audioCues`, `videoCues`, `imageCues`) per scene/dialogue
- `client/src/components/MainPlayer.tsx`
  - cue parser + trigger scheduler
  - dual-track mixer (bed + active scene layer)
  - voice queue and line-accurate trigger execution
- `client/src/lib/assetUrls.ts`
  - finalize canonical references for all 14 tracks + 18 voices + 16 videos
- `generated-assets/overrides.json`
  - keep scene-level image/video override map aligned to cue plan

## Acceptance Criteria
- Every existing generated asset is either mapped to live scene placement or marked as pending source gap.
- Every track can be triggered from dialogue tags and actually plays in timeline.
- Track 01 bed + scene-layer duck/fade behavior follows required 1.5s transitions.
- Voice cue playback aligns with mapped scene dialogue points.
- No unresolved media path in runtime logs.
