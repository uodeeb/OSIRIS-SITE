import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENES } from '../client/src/lib/sceneSystem.ts';
import { getAsset } from '../client/src/lib/assets.ts';
import {
  SCENE_TRACK_SEQUENCE,
  TRACK_URL_CANDIDATES,
  VOICE_DEFINITIONS,
  SCENE_VOICE_CUES,
  getVoiceCandidates,
} from '../client/src/lib/mainPlayerConfig.ts';

const ROOT = resolve(fileURLToPath(new URL('../', import.meta.url)));
const DOCS_DIR = join(ROOT, 'docs');

function publicPathExists(url) {
  if (!url || !url.startsWith('/')) return false;
  const clean = url.split(/[?#]/)[0];
  return existsSync(join(ROOT, 'public', clean));
}

function resolveMediaReference(reference) {
  if (!reference) return { requested: reference, resolved: '', exists: false };
  const resolved = reference.includes('://') || reference.startsWith('/') ? reference : getAsset(reference);
  return { requested: reference, resolved, exists: publicPathExists(resolved) };
}

function addIssue(issues, severity, scope, id, message, detail = {}) {
  issues.push({ severity, scope, id, message, ...detail });
}

const sceneEntries = Object.entries(SCENES);
const sceneIdSet = new Set(sceneEntries.map(([id]) => id));
const issues = [];
const dialogueRows = [];
const mediaRows = [];

for (const [sceneId, scene] of sceneEntries) {
  if (!scene.title?.trim()) addIssue(issues, 'error', 'scene', sceneId, 'Missing English scene title');
  if (!scene.arabicTitle?.trim()) addIssue(issues, 'error', 'scene', sceneId, 'Missing Arabic scene title');
  if (!Array.isArray(scene.dialogue) || scene.dialogue.length === 0) {
    addIssue(issues, 'error', 'dialogue', sceneId, 'Scene has no dialogue lines');
  }

  scene.dialogue?.forEach((line, index) => {
    const row = {
      sceneId,
      index,
      character: line.character || '',
      hasEnglish: Boolean(line.text?.trim()),
      hasArabic: Boolean(line.arabicText?.trim()),
      audioUrl: line.audioUrl || null,
    };
    dialogueRows.push(row);
    if (!row.hasEnglish) addIssue(issues, 'error', 'dialogue', sceneId, 'Missing English dialogue text', { index, character: row.character });
    if (!row.hasArabic) addIssue(issues, 'error', 'dialogue', sceneId, 'Missing Arabic dialogue text', { index, character: row.character });
    if (line.audioUrl) {
      const audio = resolveMediaReference(line.audioUrl);
      mediaRows.push({ sceneId, kind: 'dialogueAudio', index, ...audio });
      if (!audio.resolved || !audio.exists) addIssue(issues, 'error', 'media', sceneId, 'Dialogue audio does not resolve to an existing public file', { index, requested: audio.requested, resolved: audio.resolved });
    }
  });

  if (scene.defaultNextScene && !sceneIdSet.has(scene.defaultNextScene)) {
    addIssue(issues, 'error', 'route', sceneId, 'defaultNextScene points to a missing scene', { target: scene.defaultNextScene });
  }
  scene.choices?.forEach((choice) => {
    if (!choice.text?.trim()) addIssue(issues, 'error', 'choice', sceneId, 'Choice missing English text', { choiceId: choice.id });
    if (!choice.arabicText?.trim()) addIssue(issues, 'error', 'choice', sceneId, 'Choice missing Arabic text', { choiceId: choice.id });
    if (!sceneIdSet.has(choice.nextSceneId)) addIssue(issues, 'error', 'route', sceneId, 'Choice points to a missing scene', { choiceId: choice.id, target: choice.nextSceneId });
  });

  for (const [kind, ref] of [
    ['backgroundVideo', scene.backgroundVideo],
    ['backgroundImage', scene.backgroundImage],
    ['audioUrl', scene.audioUrl],
    ['musicKey', scene.musicKey],
  ]) {
    if (!ref) continue;
    const media = resolveMediaReference(ref);
    mediaRows.push({ sceneId, kind, ...media });
    if (!media.resolved || !media.exists) addIssue(issues, 'error', 'media', sceneId, `${kind} does not resolve to an existing public file`, { requested: media.requested, resolved: media.resolved });
  }

  for (const key of scene.ambientKeys ?? []) {
    const media = resolveMediaReference(key);
    mediaRows.push({ sceneId, kind: 'ambient', ...media });
    if (!media.resolved || !media.exists) addIssue(issues, 'error', 'media', sceneId, 'Ambient key does not resolve to an existing public file', { requested: media.requested, resolved: media.resolved });
  }

  for (const key of scene.enterSfxKeys ?? []) {
    const media = resolveMediaReference(key);
    mediaRows.push({ sceneId, kind: 'enterSfx', ...media });
    if (!media.resolved || !media.exists) addIssue(issues, 'error', 'media', sceneId, 'Entry SFX key does not resolve to an existing public file', { requested: media.requested, resolved: media.resolved });
  }

  const trackKey = SCENE_TRACK_SEQUENCE[sceneId];
  if (trackKey) {
    const candidates = TRACK_URL_CANDIDATES[trackKey] ?? [];
    const existing = candidates.filter(publicPathExists);
    mediaRows.push({ sceneId, kind: 'sceneTrack', requested: trackKey, resolved: candidates.join(', '), exists: existing.length > 0 });
    if (existing.length === 0) addIssue(issues, 'error', 'music', sceneId, 'Scene music track has no existing candidate file', { trackKey, candidates });
  }
}

const voiceNumbers = VOICE_DEFINITIONS.map((definition) => definition.voice);
for (let voice = 1; voice <= 18; voice += 1) {
  const definitions = VOICE_DEFINITIONS.filter((definition) => definition.voice === voice);
  if (definitions.length !== 1) addIssue(issues, 'error', 'voice', `voice-${String(voice).padStart(2, '0')}`, 'Voice number must have exactly one definition', { definitions: definitions.length });
  const candidates = getVoiceCandidates(voice);
  const existing = candidates.filter(publicPathExists);
  mediaRows.push({ sceneId: definitions[0]?.sceneId ?? null, kind: 'voice', requested: `voice-${String(voice).padStart(2, '0')}`, resolved: candidates.join(', '), exists: existing.length > 0 });
  if (existing.length === 0) addIssue(issues, 'error', 'voice', `voice-${String(voice).padStart(2, '0')}`, 'Voice has no existing candidate file', { candidates });
}

for (const definition of VOICE_DEFINITIONS) {
  const scene = SCENES[definition.sceneId];
  if (!scene) {
    addIssue(issues, 'error', 'voice', `voice-${definition.voice}`, 'Voice definition points to missing scene', { sceneId: definition.sceneId });
    continue;
  }
  const cues = SCENE_VOICE_CUES[definition.sceneId]?.filter((cue) => cue.voice === definition.voice) ?? [];
  if (cues.length !== 1) addIssue(issues, 'error', 'voice', `voice-${definition.voice}`, 'Voice definition must produce exactly one runtime cue', { sceneId: definition.sceneId, cues: cues.length });
  for (const cue of cues) {
    if (!Number.isInteger(cue.at) || cue.at < 0 || cue.at >= scene.dialogue.length) {
      addIssue(issues, 'error', 'voice', `voice-${definition.voice}`, 'Voice cue index is outside scene dialogue bounds', { sceneId: definition.sceneId, cueAt: cue.at, dialogueLines: scene.dialogue.length });
    }
  }
}

const duplicateVoiceNumbers = [...new Set(voiceNumbers.filter((voice, index) => voiceNumbers.indexOf(voice) !== index))];
if (duplicateVoiceNumbers.length) addIssue(issues, 'error', 'voice', 'voice-definitions', 'Duplicate voice numbers found', { duplicateVoiceNumbers });

const sceneTrackCoverageMissing = sceneEntries
  .map(([sceneId]) => sceneId)
  .filter((sceneId) => !SCENE_TRACK_SEQUENCE[sceneId]);

const summary = {
  runtimeScenes: sceneEntries.length,
  dialogueLines: dialogueRows.length,
  missingEnglishDialogue: dialogueRows.filter((row) => !row.hasEnglish).length,
  missingArabicDialogue: dialogueRows.filter((row) => !row.hasArabic).length,
  scenesWithMusicTracks: Object.keys(SCENE_TRACK_SEQUENCE).filter((sceneId) => sceneIdSet.has(sceneId)).length,
  scenesWithoutMusicTracks: sceneTrackCoverageMissing.length,
  mediaReferences: mediaRows.length,
  unresolvedMediaReferences: mediaRows.filter((row) => !row.exists).length,
  voiceDefinitions: VOICE_DEFINITIONS.length,
  voiceCueScenes: Object.keys(SCENE_VOICE_CUES).length,
  issues: issues.length,
  errors: issues.filter((issue) => issue.severity === 'error').length,
};

const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  summary,
  sceneTrackCoverageMissing,
  voiceDefinitions: VOICE_DEFINITIONS.map((definition) => ({
    voice: definition.voice,
    sceneId: definition.sceneId,
    cueAt: SCENE_VOICE_CUES[definition.sceneId]?.find((cue) => cue.voice === definition.voice)?.at ?? null,
    candidates: getVoiceCandidates(definition.voice),
    existingCandidates: getVoiceCandidates(definition.voice).filter(publicPathExists),
  })),
  issues,
  mediaRows,
};

const voiceTable = report.voiceDefinitions
  .map((voice) => `| ${String(voice.voice).padStart(2, '0')} | ${voice.sceneId} | ${voice.cueAt ?? 'missing'} | ${voice.existingCandidates.join('<br>') || 'missing'} |`)
  .join('\n');
const issueLines = issues.length
  ? issues.map((issue) => `- ${issue.severity.toUpperCase()} [${issue.scope}] ${issue.id}: ${issue.message}${issue.requested ? ` (${issue.requested} -> ${issue.resolved || 'unresolved'})` : ''}`).join('\n')
  : 'None';
const md = `# Script and Media Alignment Audit\n\nGenerated: ${report.generatedAt}\n\n## Summary\n\n- Runtime scenes: ${summary.runtimeScenes}\n- Dialogue lines: ${summary.dialogueLines}\n- Missing English dialogue: ${summary.missingEnglishDialogue}\n- Missing Arabic dialogue: ${summary.missingArabicDialogue}\n- Scenes with mapped music tracks: ${summary.scenesWithMusicTracks}\n- Scenes without mapped music tracks: ${summary.scenesWithoutMusicTracks}\n- Media references checked: ${summary.mediaReferences}\n- Unresolved media references: ${summary.unresolvedMediaReferences}\n- Voice definitions: ${summary.voiceDefinitions}\n- Voice cue scenes: ${summary.voiceCueScenes}\n- Errors: ${summary.errors}\n\n## Voice cue alignment\n\n| Voice | Scene | Dialogue index | Existing file candidates |\n| --- | --- | ---: | --- |\n${voiceTable}\n\n## Scenes without explicit music mapping\n\n${sceneTrackCoverageMissing.map((sceneId) => `- ${sceneId}`).join('\n') || 'None'}\n\n## Issues\n\n${issueLines}\n`;

mkdirSync(DOCS_DIR, { recursive: true });
writeFileSync(join(DOCS_DIR, 'script-media-alignment-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(DOCS_DIR, 'SCRIPT_MEDIA_ALIGNMENT_AUDIT.md'), md, 'utf8');
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (summary.errors > 0) process.exitCode = 1;
