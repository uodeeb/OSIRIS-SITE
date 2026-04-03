Build a robust, fully interactive OSIRIS cinematic experience as a web app.
Port the narrative into a clean, data-driven project structure.
Implement a fully controlled streaming system: each scene has 1) script, 2) video BG, 3) audio BG, 4) image overlay, 5) music overlay, 6) voice overlay; all globally controlled with:
forward/back script (typewriter) with click-to-complete behavior
auto-navigate with three speeds
audio control (mute/unmute)
generic play/stop to freeze all assets
voice-triggered segments lock script navigation until end
clear separation between speaker and mentioned person in dialogue
Move step-by-step toward a testable site.
Instructions
Create a production branch and work on a clean, new project structure.
Migrate assets (video, audio, images, voices) into a new project (osiris-novel) with consistent naming.
Build core architecture:
State management for the player
Audio engine (bg, scene, voice, SFX) with crossfades
Script engine (typewriter, cues, voice triggers)
Sync/locking for voice overlays
Cinematic render layers (VideoLayer, ScriptDisplay, EffectLayer, Controls, Portrait)
Port a complete scene dataset into a clean, data-driven scenes.ts
Wire everything together (engine connect, data references, UI)
Boot dev server, fix environment issues, and verify the app renders
Commit work incrementally and maintain a clean production branch
Do not skip documentation or status updates; ensure future agents can continue from this point
Plan/specs for next steps (high level):

Re-run the dev server with extended timeout to resolve compile/runtime issues.
Finalize the scene data port (complete SCENES with all dialogues, cues, assets, and transitions).
Connect AudioEngine, ScriptEngine, SyncEngine to the Scenes data and ensure voice lock works.
Implement global freeze behavior (freeze all assets) and ensure navigation is disabled during voice playback.
Validate the first scene renders (zero-1-1-summons) and that assets load correctly.
Iterate on UI: speaker highlighting, RTL support, and explicit entered/complete states for typewriter.
Commit the full, production-ready structure in a single final pass.
Discoveries
Branching and current state:
Production branch exists and is the main working branch.
A clean OSIRIS-novel project scaffold has been created, including:
Package.json, vite.config.ts, tsconfig.json, index.html
src/ with App.tsx, main.tsx, index.css
Core engines: AudioEngine.ts, ScriptEngine.ts, SyncEngine.ts
Data layer: assets.ts, characters.ts, scenes.ts
UI components: VideoLayer.tsx, ScriptDisplay.tsx, EffectLayer.tsx, Controls.tsx, CharacterPortrait.tsx, Player.tsx
Store: playerStore.ts
Asset migration progress:
Videos: migrated (17 files)
Music: migrated (14 tracks)
Voices: migrated (18 files; later aligned with simple voice-01.wav naming)
Images: migrated (bg-01..bg-07 and some others)
Environment and build:
Node upgraded to v22.12.0
Initial attempt to run Vite encountered Tailwind plugin import issues; resolved by installing @tailwindcss/vite
Dev server boot required longer timeouts; some issues persisted (module/plugin compatibility and timeout)
Data port status:
Partial port of scenes.ts implemented; started with a data-driven model but needs full completion (all scenes, dialogues, cues, image cues, and transitions)
Current blockers:
Dev server boot failures due to plugin/config; environment dependency alignment (Tailwind/Vite/React versions)
Complete port of the entire scene graph (30+ scenes) remains to be finished
Final wiring of engines to scenes and ensuring the global controls behave exactly as specified
Accomplished
Branch and repo hygiene:
Production branch created and used
Clean project scaffold created for osiris-novel
Core code and assets:
Implemented core components: VideoLayer, ScriptDisplay, EffectLayer, Controls, CharacterPortrait, Player
Implemented core engines: AudioEngine, ScriptEngine, SyncEngine
Implemented data types and skeletons (assets.ts, characters.ts, scenes.ts)
Asset migration progress:
Video assets moved and mapped
Music and voice assets moved
Basic image assets moved
Basic app scaffold wired:
App.tsx, main.tsx, index.css, and initial Home UI scaffold created
Left to do (next milestones)

Re-run dev server successfully:
Resolve any remaining plugin/env issues and confirm a stable boot
Complete scene data port:
Port all 30+ scenes into a cohesive SCENES structure
Ensure every scene has: bg video/Image, audio, UI cues, dialogue lines, and transitions
Add voice cues per scene and exact timing
Wire up the engines to the scenes:
Connect AudioEngine, ScriptEngine, SyncEngine to the scene data
Implement voice-trigger lock behavior and typewriter integration
Implement global controls precisely as specified:
Freeze all assets on pause; disallow user actions during voice cue
Auto-mode with three speeds; 3 auto-navigations per scene
Speaker vs mentioned separation in UI
Global mute and per-layer volume controls
Validation and iteration:
Smoke tests on first scenes (zero-1-1-summons, 1.2 Opening Argument)
Ensure UI RTL, accessibility, and keyboard navigation
Documentation and handoff:
Produce a clean progress doc (this file) and a final “production-ready” branch description
Relevant files / directories
Production scaffold and assets
osiris-novel/
index.html
package.json
tsconfig.json
vite.config.ts
src/
App.tsx
main.tsx
index.css
data/
assets.ts
characters.ts
scenes.ts
engine/
AudioEngine.ts
ScriptEngine.ts
SyncEngine.ts
store/
playerStore.ts
components/
VideoLayer.tsx
ScriptDisplay.tsx
EffectLayer.tsx
Controls.tsx
CharacterPortrait.tsx
Player.tsx
Old assets reference guides (OSIRIS-SITE)
OSIRIS-SITE/OSIRIS_ASSET_PROMPT_GUIDE.md
OSIRIS-SITE/OSIRIS_ASSET_PROMPTS.md
OSIRIS-SITE/OSIRIS_CINEMATIC_TIMELINE.md
OSIRIS-SITE/CINEMATIC_EXPERIENCE_SYSTEM.md
OSIRIS-SITE/script/OSIRIS_Final_Interactive_Script.md
OSIRIS-SITE/generated-assets
Current repo context
production branch (active)
audit-progress (separate)
OSIRIS-SITE/OSIRIS_CINEMATIC_TIMELINE.md
OSIRIS-SITE/OSIRIS_ASSET_PROMPTS.md
OSIRIS-SITE/OSIRIS_ASSET_PROMPT_GUIDE.md