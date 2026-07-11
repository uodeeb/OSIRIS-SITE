import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);
const AUDIT_PATH = new URL('../docs/phase1-bilingual-source-audit.json', import.meta.url);
const JSON_OUT = new URL('../docs/phase2-scene-reconciliation.json', import.meta.url);
const MD_OUT = new URL('../docs/PHASE2_SCENE_RECONCILIATION.md', import.meta.url);

const audit = JSON.parse(readFileSync(AUDIT_PATH, 'utf8'));
const historicalRef = audit.decision.englishAuthority.match(/^git:(.+):client\/src\/lib\/sceneSystem\.ts$/)?.[1];
if (!historicalRef) throw new Error(`Cannot parse historical ref from ${audit.decision.englishAuthority}`);

const source = execFileSync('git', ['show', `${historicalRef}:client/src/lib/sceneSystem.ts`], {
  cwd: ROOT,
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
});

const normalize = (value = '') => value
  .normalize('NFKC')
  .replace(/[\u064b-\u065f\u0670]/gu, '')
  .replace(/[إأآا]/gu, 'ا')
  .replace(/[ىي]/gu, 'ي')
  .replace(/[ة]/gu, 'ه')
  .replace(/\s+/g, ' ')
  .trim();

const unquoteTs = (value = '') => value
  .replace(/\\'/g, "'")
  .replace(/\\n/g, '\n')
  .replace(/\\"/g, '"');

function findMatchingBrace(text, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = openIndex; index < text.length; index += 1) {
    const char = text[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error(`No matching brace found at ${openIndex}`);
}

function extractString(block, field) {
  const pattern = new RegExp(`${field}:\\s*'((?:\\\\'|[^'])*)'`);
  return unquoteTs(block.match(pattern)?.[1] ?? '');
}

function extractHistoricalScenes(text) {
  const scenes = [];
  const matcher = /^\s{2}'([^']+)':\s*\{/gm;
  for (const match of text.matchAll(matcher)) {
    const openIndex = text.indexOf('{', match.index);
    const closeIndex = findMatchingBrace(text, openIndex);
    const block = text.slice(openIndex, closeIndex + 1);
    const before = text.slice(Math.max(0, match.index - 300), match.index);
    const commentMatches = [...before.matchAll(/\u0627\u0644\u0645\u0634\u0647\u062f\s+([^:]+):/gu)];
    const commentScene = commentMatches.at(-1)?.[1]?.trim() ?? null;
    scenes.push({
      id: match[1],
      commentScene,
      titleEn: extractString(block, 'title'),
      titleAr: extractString(block, 'arabicTitle'),
      part: Number(block.match(/part:\s*(\d+)/)?.[1] ?? -1),
      dialogueLines: [...block.matchAll(/^\s*text:\s*['"]/gm)].length,
      arabicDialogueLines: [...block.matchAll(/^\s*arabicText:\s*['"]/gm)].length,
      choices: [...block.matchAll(/^\s*id:\s*['"]/gm)].length - 1,
      defaultNextScene: extractString(block, 'defaultNextScene') || null,
    });
  }
  return scenes;
}

const arabicScenes = audit.arabicMaster.scenes.map((scene) => ({
  ...scene,
  normalizedTitleAr: normalize(scene.titleAr),
}));
const historicalScenes = extractHistoricalScenes(source).map((scene) => ({
  ...scene,
  normalizedTitleAr: normalize(scene.titleAr),
}));

const historicalByTitle = new Map();
const historicalById = new Map();
for (const scene of historicalScenes) {
  historicalById.set(scene.id, scene);
  if (!historicalByTitle.has(scene.normalizedTitleAr)) historicalByTitle.set(scene.normalizedTitleAr, []);
  historicalByTitle.get(scene.normalizedTitleAr).push(scene);
}

const manualSceneAliases = new Map([
  ['6.1', { id: 'four-4-1-desert', reason: 'Renamed from desert void to Samiri crowd psychology scene.' }],
  ['11.1', { id: 'six-8-1-andalusia', reason: 'Renamed from Andalusia betrayal title to kings of taifas title.' }],
  ['12.1', { id: 'six-8-2-last-tears', reason: 'Renamed from last tears to last sigh of the last Arab.' }],
  ['13.1', { id: 'six-8b-1-berlin', reason: 'Renamed from supreme race illusion to Hitler mirror scene.' }],
  ['14.1', { id: 'six-8c-1-death-signatures', reason: 'Renamed from signing death orders to bureaucracy of killing.' }],
  ['16.1', { id: 'transition-dream', reason: 'Transition dream scene title differs from master scene title.' }],
  ['18.1', { id: 'seven-10-1-karbala', reason: 'Renamed from unarmed truth to Karbala antivirus scene.' }],
]);

const matchedHistoricalIds = new Set();
const mappings = arabicScenes.map((arabicScene) => {
  const manualAlias = manualSceneAliases.get(arabicScene.number);
  if (manualAlias) {
    const manualScene = historicalById.get(manualAlias.id);
    if (!manualScene) throw new Error(`Manual alias target not found: ${manualAlias.id}`);
    matchedHistoricalIds.add(manualScene.id);
    return { status: 'matched-manual-title-alias', aliasReason: manualAlias.reason, arabicScene, historicalScene: manualScene };
  }

  const exactCandidates = historicalByTitle.get(arabicScene.normalizedTitleAr) ?? [];
  const exact = exactCandidates.find((scene) => !matchedHistoricalIds.has(scene.id));
  if (exact) {
    matchedHistoricalIds.add(exact.id);
    return { status: 'matched-title', arabicScene, historicalScene: exact };
  }

  const partial = historicalScenes.find((scene) => {
    if (matchedHistoricalIds.has(scene.id)) return false;
    if (!arabicScene.normalizedTitleAr || !scene.normalizedTitleAr) return false;
    return arabicScene.normalizedTitleAr.includes(scene.normalizedTitleAr) || scene.normalizedTitleAr.includes(arabicScene.normalizedTitleAr);
  });
  if (partial) {
    matchedHistoricalIds.add(partial.id);
    return { status: 'matched-partial-title', arabicScene, historicalScene: partial };
  }

  return { status: 'missing-historical-english', arabicScene, historicalScene: null };
});

const unmatchedHistoricalScenes = historicalScenes.filter((scene) => !matchedHistoricalIds.has(scene.id));
const missingArabicScenes = mappings.filter((mapping) => mapping.status === 'missing-historical-english');
const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  authorities: audit.decision,
  summary: {
    arabicMasterScenes: arabicScenes.length,
    historicalRecoveredScenes: historicalScenes.length,
    matchedByTitle: mappings.filter((mapping) => mapping.status === 'matched-title').length,
    matchedByPartialTitle: mappings.filter((mapping) => mapping.status === 'matched-partial-title').length,
    matchedByManualAlias: mappings.filter((mapping) => mapping.status === 'matched-manual-title-alias').length,
    missingHistoricalEnglish: missingArabicScenes.length,
    unmatchedHistoricalScenes: unmatchedHistoricalScenes.length,
  },
  missingArabicScenes,
  unmatchedHistoricalScenes,
  mappings,
};

const mdRows = mappings.map((mapping) => [
  mapping.arabicScene.number,
  mapping.arabicScene.titleAr,
  mapping.status,
  mapping.historicalScene?.id ?? '',
  mapping.historicalScene?.titleEn ?? '',
].map((value) => String(value).replace(/\|/g, '\\|')).join(' | '));

const missingRows = missingArabicScenes.map((mapping) => `- ${mapping.arabicScene.number}: ${mapping.arabicScene.titleAr}`);
const orphanRows = unmatchedHistoricalScenes.map((scene) => `- ${scene.id}: ${scene.titleEn} / ${scene.titleAr}`);

const md = `# Phase 2 - Scene reconciliation\n\n## Summary\n\n- Arabic master scenes: ${report.summary.arabicMasterScenes}\n- Historical recovered scenes: ${report.summary.historicalRecoveredScenes}\n- Matched by exact Arabic title: ${report.summary.matchedByTitle}\n- Matched by partial Arabic title: ${report.summary.matchedByPartialTitle}\n- Matched by manual title alias: ${report.summary.matchedByManualAlias}\n- Arabic scenes still missing recovered English: ${report.summary.missingHistoricalEnglish}\n- Historical scenes not mapped to Arabic master: ${report.summary.unmatchedHistoricalScenes}\n\n## Missing recovered English\n\n${missingRows.join('\n') || 'None'}\n\n## Unmapped historical scenes\n\n${orphanRows.join('\n') || 'None'}\n\n## Mapping table\n\nScene | Arabic title | Status | Historical ID | English title\n--- | --- | --- | --- | ---\n${mdRows.join('\n')}\n`;

writeFileSync(JSON_OUT, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(MD_OUT, md, 'utf8');
process.stdout.write(`${JSON.stringify(report.summary, null, 2)}\n`);