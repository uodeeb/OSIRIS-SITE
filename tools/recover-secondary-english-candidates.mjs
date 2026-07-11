import { readFileSync, writeFileSync } from 'node:fs';

const NARRATIVE = JSON.parse(readFileSync(new URL('../client/src/data/narrativeData.json', import.meta.url), 'utf8'));
const NARRATIVE_FULL = JSON.parse(readFileSync(new URL('../client/src/data/narrativeDataFull.json', import.meta.url), 'utf8'));
const RECONCILIATION = JSON.parse(readFileSync(new URL('../docs/phase2-scene-reconciliation.json', import.meta.url), 'utf8'));
const JSON_OUT = new URL('../docs/phase2-secondary-english-candidates.json', import.meta.url);
const MD_OUT = new URL('../docs/PHASE2_SECONDARY_ENGLISH_CANDIDATES.md', import.meta.url);

function flattenScenes(source, sourcePath) {
  const scenes = [];
  for (const part of source.parts ?? []) {
    for (const scene of part.scenes ?? []) {
      scenes.push({
        sourcePath,
        partId: part.id,
        partTitle: part.title,
        id: scene.id,
        title: scene.title,
        arabicTitle: scene.arabicTitle,
        dialogue: scene.dialogue ?? [],
        choices: scene.choices ?? [],
      });
    }
  }
  return scenes;
}

const scenePool = [
  ...flattenScenes(NARRATIVE, 'client/src/data/narrativeData.json'),
  ...flattenScenes(NARRATIVE_FULL, 'client/src/data/narrativeDataFull.json'),
];
const byId = new Map(scenePool.map((scene) => [`${scene.sourcePath}#${scene.id}`, scene]));

const candidates = [
  {
    sceneNumber: '5.1',
    sourceKey: 'client/src/data/narrativeData.json#two-mirror-scene',
    confidence: 'high',
    note: 'Exact English title match for The Mirror of the Nile; Arabic in this source is mojibake, use Arabic master for Arabic.',
  },
  {
    sceneNumber: '5.2',
    sourceKey: 'client/src/data/narrativeData.json#two-divine-declaration',
    confidence: 'high',
    note: 'Exact English title match for The Declaration of Divinity; Arabic in this source is mojibake, use Arabic master for Arabic.',
  },
  {
    sceneNumber: '17.1',
    sourceKey: 'client/src/data/narrativeDataFull.json#six-digital-intro',
    confidence: 'medium',
    note: 'Contains Facebook/algorithm outrage summary, but scene title differs from Arabic master.',
  },
  {
    sceneNumber: '17.1',
    sourceKey: 'client/src/data/narrativeDataFull.json#six-algorithm-revealed',
    confidence: 'medium',
    note: 'Contains supporting algorithm/profit lines for the Facebook leak scene.',
  },
  {
    sceneNumber: '21.1',
    sourceKey: 'client/src/data/narrativeDataFull.json#seven-witnesses-intro',
    confidence: 'medium',
    note: 'Covers Abraham, Bilal, and Saladin defense witnesses; Arabic master also includes additional witnesses, so this is partial.',
  },
  {
    sceneNumber: '21.1',
    sourceKey: 'client/src/data/narrativeDataFull.json#seven-scholars-of-baghdad',
    confidence: 'medium',
    note: 'Covers House of Wisdom scholars, matching part of the Arabic master defense witness review.',
  },
];

const missingByNumber = new Map(RECONCILIATION.missingArabicScenes.map((entry) => [entry.arabicScene.number, entry.arabicScene]));
const enriched = candidates.map((candidate) => {
  const sourceScene = byId.get(candidate.sourceKey);
  if (!sourceScene) throw new Error(`Candidate source not found: ${candidate.sourceKey}`);
  return {
    ...candidate,
    arabicMasterScene: missingByNumber.get(candidate.sceneNumber),
    sourceScene: {
      sourcePath: sourceScene.sourcePath,
      id: sourceScene.id,
      title: sourceScene.title,
      dialogueLineCount: sourceScene.dialogue.length,
      choiceCount: sourceScene.choices.length,
      dialogue: sourceScene.dialogue.map((line) => ({
        character: line.character ?? 'Narrator',
        text: line.text,
        duration: line.duration ?? null,
      })),
      choices: sourceScene.choices.map((choice) => ({
        id: choice.id,
        text: choice.text,
        nextSceneId: choice.nextSceneId ?? null,
      })),
    },
  };
});

const grouped = [...missingByNumber.values()].map((scene) => ({
  sceneNumber: scene.number,
  titleAr: scene.titleAr,
  candidates: enriched.filter((candidate) => candidate.sceneNumber === scene.number),
}));

const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  policy: 'Secondary English candidates may recover English only. Arabic remains sourced from script/OSIRIS_Final_Interactive_Script.md.',
  summary: {
    missingScenes: missingByNumber.size,
    candidateRecords: enriched.length,
    scenesWithCandidates: grouped.filter((group) => group.candidates.length > 0).length,
    scenesStillNeedingTranslation: grouped.filter((group) => group.candidates.length === 0).length,
  },
  grouped,
};

const md = `# Phase 2 - Secondary English candidates\n\n## Summary\n\n- Missing scenes after historical recovery: ${report.summary.missingScenes}\n- Candidate records found: ${report.summary.candidateRecords}\n- Missing scenes with at least one English candidate: ${report.summary.scenesWithCandidates}\n- Scenes still requiring fresh translation: ${report.summary.scenesStillNeedingTranslation}\n\n## Policy\n\n${report.policy}\n\n## Candidates\n\n${grouped.map((group) => {
  const rows = group.candidates.map((candidate) => `- ${candidate.confidence}: ${candidate.sourceKey} (${candidate.sourceScene.dialogueLineCount} dialogue lines) - ${candidate.note}`).join('\n') || '- None';
  return `### ${group.sceneNumber} - ${group.titleAr}\n\n${rows}`;
}).join('\n\n')}\n`;

writeFileSync(JSON_OUT, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(MD_OUT, md, 'utf8');
process.stdout.write(`${JSON.stringify(report.summary, null, 2)}\n`);