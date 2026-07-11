import type { CanonicalStory } from '../content/storySchema';
import storySeed from '../content/osirisCanonicalStory.seed.json';
import type { DialogueLine } from './sceneSystem';
import { SCENES } from './sceneSystem';

const SEMANTIC_CONFLICT_SCENE_IDS = new Set<string>();

function normalizeSeedCharacter(character: string) {
  const c = (character || '').trim();
  if (!c) return 'Narrator';
  const runtimeAliases: Record<string, string> = {
    narrator: 'Narrator',
    yahya: 'yahya',
    laila: 'laila',
    tarek: 'tarek',
    osiris: 'OSIRIS',
    iblis: 'Iblis',
    ramses: 'ramses',
    priest: 'Priest',
    samaritan: 'samiri',
    samiri: 'samiri',
    'the sage': 'The Sage',
    'first engineer': 'first_engineer',
    abraham: 'Abraham',
    bilal: 'Bilal',
    child: 'child',
    'old woman': 'old_woman',
    'aisha al-hurra': 'aisha',
  };
  return runtimeAliases[c.toLowerCase()] || c;
}

function buildSeedDialogueMap(): Record<string, DialogueLine[]> {
  const story = storySeed as CanonicalStory;
  const out: Record<string, DialogueLine[]> = {};

  for (const scene of story.scenes) {
    if (SEMANTIC_CONFLICT_SCENE_IDS.has(scene.id)) continue;
    if (!SCENES[scene.id]) continue;

    const lines = scene.dialogue
      .map((line): DialogueLine | null => {
        const en = (line.content.en || '').trim();
        const ar = (line.content.ar || '').trim();
        if (!en && !ar) return null;
        return {
          character: normalizeSeedCharacter(line.character),
          text: en || ar,
          arabicText: ar || en,
          duration: line.durationMs,
        };
      })
      .filter((line): line is DialogueLine => Boolean(line));

    if (lines.length) out[scene.id] = lines;
  }

  return out;
}

let canonicalCache: Promise<Record<string, DialogueLine[]>> | null = null;

export function loadCanonicalDialogueMap(): Promise<Record<string, DialogueLine[]>> {
  if (canonicalCache) return canonicalCache;
  canonicalCache = Promise.resolve(buildSeedDialogueMap());
  return canonicalCache;
}
