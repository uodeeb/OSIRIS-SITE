import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url);
const ARABIC_SCRIPT = new URL('../script/OSIRIS_Final_Interactive_Script.md', import.meta.url);
const RECON = JSON.parse(readFileSync(new URL('../docs/phase2-scene-reconciliation.json', import.meta.url), 'utf8'));
const SECONDARY = JSON.parse(readFileSync(new URL('../docs/phase2-secondary-english-candidates.json', import.meta.url), 'utf8'));
const OUT_JSON = new URL('../client/src/content/osirisCanonicalStory.seed.json', import.meta.url);
const REPORT_JSON = new URL('../docs/phase3-canonical-seed-report.json', import.meta.url);
const REPORT_MD = new URL('../docs/PHASE3_CANONICAL_SEED.md', import.meta.url);

const historicalRef = RECON.authorities.englishAuthority.match(/^git:(.+):client\/src\/lib\/sceneSystem\.ts$/)?.[1];
if (!historicalRef) throw new Error(`Cannot parse historical ref: ${RECON.authorities.englishAuthority}`);
const historicalSource = execFileSync('git', ['show', `${historicalRef}:client/src/lib/sceneSystem.ts`], {
  cwd: ROOT,
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
});
const arabicMarkdown = readFileSync(ARABIC_SCRIPT, 'utf8');

const ARABIC_SCENE_HEADING = /^###\s+\*\*\u0627\u0644\u0645\u0634\u0647\u062f\s+([\d.]+):\s*(.+?)\*\*/gmu;

const unquoteTs = (value = '') => value
  .replace(/\\'/g, "'")
  .replace(/\\n/g, '\n')
  .replace(/\\"/g, '"');

const toDurationMs = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3500;
};

function findMatching(text, openIndex, openChar, closeChar) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = openIndex; index < text.length; index += 1) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }
    if (char === openChar) depth += 1;
    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error(`No matching ${closeChar} for index ${openIndex}`);
}

function extractString(block, field) {
  const pattern = new RegExp(`${field}:\\s*'((?:\\\\'|[^'])*)'`);
  return unquoteTs(block.match(pattern)?.[1] ?? '');
}

function extractArrayBlock(block, field) {
  const fieldMatch = new RegExp(`${field}:\\s*\\[`).exec(block);
  if (!fieldMatch) return '';
  const openIndex = block.indexOf('[', fieldMatch.index);
  return block.slice(openIndex + 1, findMatching(block, openIndex, '[', ']'));
}

function extractObjectBlocks(arrayBlock) {
  const blocks = [];
  for (let index = 0; index < arrayBlock.length; index += 1) {
    if (arrayBlock[index] !== '{') continue;
    const close = findMatching(arrayBlock, index, '{', '}');
    blocks.push(arrayBlock.slice(index, close + 1));
    index = close;
  }
  return blocks;
}

function extractHistoricalScenes(text) {
  const scenes = new Map();
  const matcher = /^\s{2}'([^']+)':\s*\{/gm;
  for (const match of text.matchAll(matcher)) {
    const openIndex = text.indexOf('{', match.index);
    const block = text.slice(openIndex, findMatching(text, openIndex, '{', '}') + 1);
    const dialogue = extractObjectBlocks(extractArrayBlock(block, 'dialogue')).map((lineBlock, index) => ({
      id: `line-${String(index + 1).padStart(3, '0')}`,
      character: extractString(lineBlock, 'character') || 'Narrator',
      content: {
        ar: extractString(lineBlock, 'arabicText'),
        en: extractString(lineBlock, 'text'),
        provenance: {
          ar: `git:${historicalRef}:client/src/lib/sceneSystem.ts#${match[1]}.dialogue.${index}.arabicText`,
          en: `git:${historicalRef}:client/src/lib/sceneSystem.ts#${match[1]}.dialogue.${index}.text`,
        },
      },
      durationMs: toDurationMs(lineBlock.match(/duration:\s*(\d+)/)?.[1]),
    }));
    const choices = extractObjectBlocks(extractArrayBlock(block, 'choices')).map((choiceBlock, index) => ({
      id: extractString(choiceBlock, 'id') || `choice-${String(index + 1).padStart(2, '0')}`,
      label: {
        ar: extractString(choiceBlock, 'arabicText'),
        en: extractString(choiceBlock, 'text'),
        provenance: {
          ar: `git:${historicalRef}:client/src/lib/sceneSystem.ts#${match[1]}.choices.${index}.arabicText`,
          en: `git:${historicalRef}:client/src/lib/sceneSystem.ts#${match[1]}.choices.${index}.text`,
        },
      },
      nextSceneId: extractString(choiceBlock, 'nextSceneId') || '',
    }));
    scenes.set(match[1], {
      id: match[1],
      titleEn: extractString(block, 'title'),
      titleAr: extractString(block, 'arabicTitle'),
      part: Number(block.match(/part:\s*(\d+)/)?.[1] ?? 0),
      dialogue,
      choices,
      defaultNextSceneId: extractString(block, 'defaultNextScene') || undefined,
    });
  }
  return scenes;
}

function extractArabicSceneSections(markdown) {
  const matches = [...markdown.matchAll(ARABIC_SCENE_HEADING)];
  const sections = new Map();
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const next = matches[index + 1];
    sections.set(current[1], {
      sceneNumber: current[1],
      titleAr: current[2].trim(),
      body: markdown.slice(current.index, next?.index ?? markdown.length).trim(),
    });
  }
  return sections;
}

function sceneNumberToChapter(sceneNumber) {
  return Number(sceneNumber.split('.')[0]);
}

function sceneNumberToPart(sceneNumber) {
  const chapter = sceneNumberToChapter(sceneNumber);
  if (chapter <= 1) return 0;
  if (chapter <= 4) return 1;
  if (chapter <= 7) return 2;
  if (chapter <= 10) return 3;
  if (chapter <= 16) return 4;
  if (chapter <= 19) return 5;
  return 6;
}

function fallbackId(sceneNumber) {
  return `scene-${sceneNumber.replace(/\./g, '-')}`;
}

function buildSecondaryScene(mapping, secondaryGroup, arabicSection) {
  const candidates = secondaryGroup?.candidates ?? [];
  const firstCandidate = candidates[0];
  const englishLines = candidates.flatMap((candidate) => candidate.sourceScene.dialogue.map((line) => ({
    ...line,
    provenance: `${candidate.sourceKey}.dialogue`,
  })));
  return {
    id: firstCandidate?.sourceScene.id ?? fallbackId(mapping.arabicScene.number),
    part: sceneNumberToPart(mapping.arabicScene.number),
    chapter: sceneNumberToChapter(mapping.arabicScene.number),
    sceneNumber: mapping.arabicScene.number,
    title: {
      ar: arabicSection?.titleAr ?? mapping.arabicScene.titleAr,
      en: firstCandidate?.sourceScene.title ?? '',
      provenance: {
        ar: `script/OSIRIS_Final_Interactive_Script.md#scene-${mapping.arabicScene.number}.title`,
        en: firstCandidate ? `${firstCandidate.sourceKey}.title` : 'missing',
      },
    },
    alignmentStatus: 'needs-line-alignment',
    sourceStatus: 'secondary-english-candidate',
    sourceNotes: candidates.map((candidate) => candidate.note),
    arabicMasterBody: {
      text: arabicSection?.body ?? '',
      provenance: `script/OSIRIS_Final_Interactive_Script.md#scene-${mapping.arabicScene.number}`,
    },
    englishCandidateBlocks: candidates.map((candidate) => ({
      sourceKey: candidate.sourceKey,
      confidence: candidate.confidence,
      title: candidate.sourceScene.title,
      dialogue: candidate.sourceScene.dialogue,
      choices: candidate.sourceScene.choices,
    })),
    dialogue: englishLines.map((line, index) => ({
      id: `candidate-line-${String(index + 1).padStart(3, '0')}`,
      character: line.character || 'Narrator',
      content: {
        ar: '',
        en: line.text,
        provenance: {
          ar: `script/OSIRIS_Final_Interactive_Script.md#scene-${mapping.arabicScene.number}.body-needs-line-alignment`,
          en: line.provenance,
        },
      },
      durationMs: toDurationMs(line.duration),
    })),
    choices: [],
  };
}

const historicalScenes = extractHistoricalScenes(historicalSource);
const arabicSections = extractArabicSceneSections(arabicMarkdown);
const secondaryByScene = new Map(SECONDARY.grouped.map((group) => [group.sceneNumber, group]));

const scenes = RECON.mappings.map((mapping) => {
  const number = mapping.arabicScene.number;
  const arabicSection = arabicSections.get(number);
  if (mapping.historicalScene) {
    const source = historicalScenes.get(mapping.historicalScene.id);
    if (!source) throw new Error(`Historical scene not found: ${mapping.historicalScene.id}`);
    return {
      id: source.id,
      part: sceneNumberToPart(number),
      chapter: sceneNumberToChapter(number),
      sceneNumber: number,
      title: {
        ar: arabicSection?.titleAr ?? mapping.arabicScene.titleAr,
        en: source.titleEn,
        provenance: {
          ar: `script/OSIRIS_Final_Interactive_Script.md#scene-${number}.title`,
          en: `git:${historicalRef}:client/src/lib/sceneSystem.ts#${source.id}.title`,
        },
      },
      alignmentStatus: 'paired-dialogue',
      sourceStatus: mapping.status,
      sourceNotes: mapping.aliasReason ? [mapping.aliasReason] : [],
      dialogue: source.dialogue,
      choices: source.choices,
      defaultNextSceneId: source.defaultNextSceneId,
      arabicMasterBody: {
        text: arabicSection?.body ?? '',
        provenance: `script/OSIRIS_Final_Interactive_Script.md#scene-${number}`,
      },
    };
  }
  return buildSecondaryScene(mapping, secondaryByScene.get(number), arabicSection);
});

const story = {
  schemaVersion: 1,
  storyId: 'osiris',
  generatedAt: new Date().toISOString(),
  authorities: RECON.authorities,
  scenes,
};

const ids = new Set(scenes.map((scene) => scene.id));
const issues = [];
for (const scene of scenes) {
  if (!scene.title.ar) issues.push({ code: 'missing-arabic-title', sceneId: scene.id });
  if (!scene.title.en) issues.push({ code: 'missing-english-title', sceneId: scene.id });
  for (const [index, line] of scene.dialogue.entries()) {
    if (!line.content.en) issues.push({ code: 'missing-english-dialogue', sceneId: scene.id, index });
    if (!line.content.ar && scene.alignmentStatus === 'paired-dialogue') issues.push({ code: 'missing-arabic-dialogue', sceneId: scene.id, index });
    if (line.content.ar && line.content.en && line.content.ar.trim() === line.content.en.trim()) issues.push({ code: 'mirrored-language', sceneId: scene.id, index });
  }
  for (const choice of scene.choices) {
    if (choice.nextSceneId && !ids.has(choice.nextSceneId)) {
      issues.push({ code: 'broken-choice-link', sceneId: scene.id, choiceId: choice.id, nextSceneId: choice.nextSceneId });
    }
  }
  if (scene.defaultNextSceneId && !ids.has(scene.defaultNextSceneId)) {
    issues.push({ code: 'broken-default-link', sceneId: scene.id, nextSceneId: scene.defaultNextSceneId });
  }
}

const report = {
  version: 1,
  generatedAt: story.generatedAt,
  summary: {
    scenes: scenes.length,
    pairedDialogueScenes: scenes.filter((scene) => scene.alignmentStatus === 'paired-dialogue').length,
    needsLineAlignmentScenes: scenes.filter((scene) => scene.alignmentStatus === 'needs-line-alignment').length,
    dialogueLines: scenes.reduce((sum, scene) => sum + scene.dialogue.length, 0),
    validationIssues: issues.length,
  },
  needsLineAlignment: scenes.filter((scene) => scene.alignmentStatus === 'needs-line-alignment').map((scene) => ({
    id: scene.id,
    sceneNumber: scene.sceneNumber,
    title: scene.title,
    englishCandidateBlocks: scene.englishCandidateBlocks?.length ?? 0,
  })),
  issues,
};

const md = `# Phase 3 - Canonical story seed\n\n## Summary\n\n- Scenes: ${report.summary.scenes}\n- Paired bilingual dialogue scenes: ${report.summary.pairedDialogueScenes}\n- Scenes needing line alignment: ${report.summary.needsLineAlignmentScenes}\n- Dialogue candidate lines: ${report.summary.dialogueLines}\n- Validation issues: ${report.summary.validationIssues}\n\n## Outputs\n\n- client/src/content/osirisCanonicalStory.seed.json\n- docs/phase3-canonical-seed-report.json\n\n## Scenes needing line alignment\n\n${report.needsLineAlignment.map((scene) => `- ${scene.sceneNumber}: ${scene.title.ar} / ${scene.title.en} (${scene.id})`).join('\n') || 'None'}\n`;

writeFileSync(OUT_JSON, `${JSON.stringify(story, null, 2)}\n`, 'utf8');
writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(REPORT_MD, md, 'utf8');
process.stdout.write(`${JSON.stringify(report.summary, null, 2)}\n`);