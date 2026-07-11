import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(new URL('../', import.meta.url).pathname.replace(/^\/(.:\/)/, '$1'));
const read = (file) => readFileSync(join(ROOT, file), 'utf8');
const sceneDir = 'client/src/lib/scenes';
const sceneFiles = readdirSync(join(ROOT, sceneDir)).filter((name) => name.endsWith('.ts')).map((name) => `${sceneDir}/${name}`);

function extractCharacterMapKeys(source) {
  const keys = new Set();
  const block = source.match(/CHARACTER_MAP[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) return keys;
  for (const match of block[1].matchAll(/^\s{2}(?:'([^']+)'|"([^"]+)"|([A-Za-z0-9_]+)):\s*\{/gm)) {
    keys.add(match[1] || match[2] || match[3]);
  }
  return keys;
}

function extractTimeline(source) {
  const timeline = new Map();
  const block = source.match(/SCENE_CHARACTER_TIMELINE[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) return timeline;
  for (const match of block[1].matchAll(/['"]([^'"]+)['"]:\s*['"]([^'"]+)['"]/g)) timeline.set(match[1], match[2]);
  return timeline;
}

function extractSceneBlocks() {
  const scenes = [];
  for (const file of sceneFiles) {
    const source = read(file);
    const matches = [...source.matchAll(/^\s{2}'([^']+)':\s*\{/gm)];
    for (let index = 0; index < matches.length; index += 1) {
      const start = matches[index].index;
      const end = matches[index + 1]?.index ?? source.length;
      scenes.push({ id: matches[index][1], file, block: source.slice(start, end) });
    }
  }
  return scenes;
}

const mainPlayer = read('client/src/components/MainPlayer.tsx');
const config = read('client/src/lib/mainPlayerConfig.ts');
const mainKeys = extractCharacterMapKeys(mainPlayer);
const configKeys = extractCharacterMapKeys(config);
const mainTimeline = extractTimeline(mainPlayer);
const configTimeline = extractTimeline(config);
const scenes = extractSceneBlocks();
const sceneIds = new Set(scenes.map((scene) => scene.id));

const dialogueUsage = [];
for (const scene of scenes) {
  for (const match of scene.block.matchAll(/character:\s*['"]([^'"]+)['"]/g)) {
    dialogueUsage.push({ sceneId: scene.id, file: scene.file, character: match[1] });
  }
}

const uniqueDialogueCharacters = [...new Set(dialogueUsage.map((entry) => entry.character))].sort();
const missingDialogueInMainPlayer = uniqueDialogueCharacters.filter((character) => !mainKeys.has(character));
const missingDialogueInConfig = uniqueDialogueCharacters.filter((character) => !configKeys.has(character));
const timelineMismatches = [...new Set([...mainTimeline.keys(), ...configTimeline.keys()])]
  .map((sceneId) => ({ sceneId, mainPlayer: mainTimeline.get(sceneId) ?? null, mainPlayerConfig: configTimeline.get(sceneId) ?? null }))
  .filter((entry) => entry.mainPlayer !== entry.mainPlayerConfig);
const missingTimelineInMainPlayer = [...sceneIds].filter((sceneId) => !mainTimeline.has(sceneId)).sort();
const missingTimelineInConfig = [...sceneIds].filter((sceneId) => !configTimeline.has(sceneId)).sort();
const timelineTargetsMissingInMainPlayer = [...mainTimeline.entries()].filter(([, character]) => !mainKeys.has(character)).map(([sceneId, character]) => ({ sceneId, character }));
const timelineTargetsMissingInConfig = [...configTimeline.entries()].filter(([, character]) => !configKeys.has(character)).map(([sceneId, character]) => ({ sceneId, character }));
const dialogueByCharacter = Object.fromEntries(uniqueDialogueCharacters.map((character) => [character, dialogueUsage.filter((entry) => entry.character === character).length]));

const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  summary: {
    runtimeScenes: scenes.length,
    uniqueDialogueCharacters: uniqueDialogueCharacters.length,
    missingDialogueInMainPlayer: missingDialogueInMainPlayer.length,
    missingDialogueInConfig: missingDialogueInConfig.length,
    missingTimelineInMainPlayer: missingTimelineInMainPlayer.length,
    missingTimelineInConfig: missingTimelineInConfig.length,
    timelineMismatches: timelineMismatches.length,
    timelineTargetsMissingInMainPlayer: timelineTargetsMissingInMainPlayer.length,
    timelineTargetsMissingInConfig: timelineTargetsMissingInConfig.length,
  },
  dialogueByCharacter,
  missingDialogueInMainPlayer,
  missingDialogueInConfig,
  missingTimelineInMainPlayer,
  missingTimelineInConfig,
  timelineMismatches,
  timelineTargetsMissingInMainPlayer,
  timelineTargetsMissingInConfig,
};

const md = `# Character Mapping Audit\n\n## Summary\n\n- Runtime scenes: ${report.summary.runtimeScenes}\n- Unique dialogue characters: ${report.summary.uniqueDialogueCharacters}\n- Dialogue characters missing in MainPlayer map: ${report.summary.missingDialogueInMainPlayer}\n- Dialogue characters missing in mainPlayerConfig map: ${report.summary.missingDialogueInConfig}\n- Scenes missing MainPlayer timeline focus: ${report.summary.missingTimelineInMainPlayer}\n- Scenes missing mainPlayerConfig timeline focus: ${report.summary.missingTimelineInConfig}\n- Timeline mismatches: ${report.summary.timelineMismatches}\n- Timeline targets missing in MainPlayer map: ${report.summary.timelineTargetsMissingInMainPlayer}\n- Timeline targets missing in mainPlayerConfig map: ${report.summary.timelineTargetsMissingInConfig}\n\n## Dialogue characters missing in maps\n\n### MainPlayer\n\n${missingDialogueInMainPlayer.map((item) => `- ${item}`).join('\n') || 'None'}\n\n### mainPlayerConfig\n\n${missingDialogueInConfig.map((item) => `- ${item}`).join('\n') || 'None'}\n\n## Scenes missing timeline focus\n\n### MainPlayer\n\n${missingTimelineInMainPlayer.map((item) => `- ${item}`).join('\n') || 'None'}\n\n### mainPlayerConfig\n\n${missingTimelineInConfig.map((item) => `- ${item}`).join('\n') || 'None'}\n\n## Timeline mismatches\n\n${timelineMismatches.map((item) => `- ${item.sceneId}: MainPlayer=${item.mainPlayer ?? 'missing'}, mainPlayerConfig=${item.mainPlayerConfig ?? 'missing'}`).join('\n') || 'None'}\n`;

writeFileSync(join(ROOT, 'docs/phase5-character-mapping-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(ROOT, 'docs/PHASE5_CHARACTER_MAPPING_AUDIT.md'), md, 'utf8');
process.stdout.write(`${JSON.stringify(report.summary, null, 2)}\n`);
