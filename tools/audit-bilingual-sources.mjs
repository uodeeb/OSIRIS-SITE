import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);
const ARABIC_MASTER = new URL('../script/OSIRIS_Final_Interactive_Script.md', import.meta.url);
const HISTORICAL_REFS = [
  '95f75a14285a07d114fc5100159d5b78c65cef45',
  'a232e22^',
  'c00d361',
];

const count = (text, pattern) => [...text.matchAll(pattern)].length;
const sceneIdsFromSource = (text) => [
  ...text.matchAll(/^\s{2}'([^']+)':\s*\{/gm),
].map((match) => match[1]);

const ARABIC_HEADING = {
  chapterOne: /^##\s+\*\*\u0627\u0644\u0641\u0635\u0644\s+1:/gmu,
  numberedChapter: /^##\s+\*\*\u0627\u0644\u0641\u0635\u0644\s+(\d+):/gmu,
  transitionChapter: /^##\s+\*\*\u0627\u0644\u0641\u0635\u0644\s+\u0627\u0644\u0627\u0646\u062a\u0642\u0627\u0644\u064a:/gmu,
  scene: /^###\s+\*\*\u0627\u0644\u0645\u0634\u0647\u062f\s+([\d.]+):\s*(.+?)\*\*/gmu,
};

function readHistoricalSceneSystem() {
  const failures = [];
  for (const ref of HISTORICAL_REFS) {
    try {
      const content = execFileSync(
        'git',
        ['show', `${ref}:client/src/lib/sceneSystem.ts`],
        { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 },
      );
      const sceneEntries = sceneIdsFromSource(content).length;
      const englishTextFields = count(content, /^\s*text:\s*['"]\s*[A-Za-z]/gm);
      const arabicTextFields = count(content, /^\s*arabicText:\s*['"]\s*[\u0600-\u06ff]/gmu);
      if (sceneEntries < 20 || englishTextFields < 20 || arabicTextFields < 20) {
        failures.push({
          ref,
          message: `Rejected: scenes=${sceneEntries}, englishTextFields=${englishTextFields}, arabicTextFields=${arabicTextFields}`,
        });
        continue;
      }
      return { ref, content, failures };
    } catch (error) {
      failures.push({ ref, message: error.message.split('\n')[0] });
    }
  }
  throw new Error(`Unable to recover historical bilingual sceneSystem.ts: ${JSON.stringify(failures)}`);
}

function auditArabicMaster(markdown) {
  const chapterOneHeadings = [...markdown.matchAll(ARABIC_HEADING.chapterOne)];
  const storyStart = chapterOneHeadings[1]?.index ?? chapterOneHeadings[0]?.index ?? 0;
  const storyBody = markdown.slice(storyStart);
  const chapters = [...storyBody.matchAll(ARABIC_HEADING.numberedChapter)].map((match) => Number(match[1]));
  const transitionChapters = count(storyBody, ARABIC_HEADING.transitionChapter);
  const scenes = [...storyBody.matchAll(ARABIC_HEADING.scene)].map((match) => ({
    number: match[1],
    titleAr: match[2].trim(),
  }));
  return {
    bytes: Buffer.byteLength(markdown),
    arabicCharacters: count(markdown, /[\u0600-\u06ff]/gu),
    replacementCharacters: count(markdown, /\uFFFD/gu),
    mojibakePairs: count(markdown, /(?:\u00d8.|\u00d9.)/gu),
    chapters: [...new Set(chapters)],
    transitionChapters,
    totalChapters: new Set(chapters).size + transitionChapters,
    sceneCount: scenes.length,
    scenes,
  };
}

function auditHistoricalSource(ref, source, failures) {
  const ids = sceneIdsFromSource(source);
  return {
    ref,
    recoveryFailures: failures,
    bytes: Buffer.byteLength(source),
    sceneEntries: ids.length,
    uniqueSceneIds: new Set(ids).size,
    duplicateSceneIds: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))],
    englishTextFields: count(source, /^\s*text:\s*['"]\s*[A-Za-z]/gm),
    arabicTextFields: count(source, /^\s*arabicText:\s*['"]\s*[\u0600-\u06ff]/gmu),
    replacementCharacters: count(source, /\uFFFD/gu),
    mojibakePairs: count(source, /(?:\u00d8.|\u00d9.)/gu),
  };
}

const arabicMarkdown = readFileSync(ARABIC_MASTER, 'utf8');
const historical = readHistoricalSceneSystem();
const arabicMaster = auditArabicMaster(arabicMarkdown);
const historicalBilingualSource = auditHistoricalSource(historical.ref, historical.content, historical.failures);
const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  decision: {
    arabicAuthority: 'script/OSIRIS_Final_Interactive_Script.md',
    englishAuthority: `git:${historical.ref}:client/src/lib/sceneSystem.ts`,
    policy: 'Never copy Arabic into English fields. Reconcile by stable scene identity and retain field-level provenance.',
  },
  arabicMaster,
  historicalBilingualSource,
  reconciliation: {
    arabicSceneCount: arabicMaster.sceneCount,
    historicalSceneEntries: historicalBilingualSource.sceneEntries,
    sceneCountDelta: arabicMaster.sceneCount - historicalBilingualSource.sceneEntries,
    englishDialogueLineCandidates: historicalBilingualSource.englishTextFields,
    arabicDialogueLineCandidates: historicalBilingualSource.arabicTextFields,
    nextStep: 'Map historical scene IDs to Arabic master scene numbers and fill the four-scene source gap before runtime generation.',
  },
};

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);