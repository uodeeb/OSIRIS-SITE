export type StoryLanguage = 'ar' | 'en';

export interface ProvenancedText {
  ar: string;
  en: string;
  provenance: {
    ar: string;
    en: string;
  };
}

export interface CanonicalDialogueLine {
  id: string;
  character: string;
  content: ProvenancedText;
  durationMs: number;
}

export interface CanonicalChoice {
  id: string;
  label: ProvenancedText;
  nextSceneId: string;
}

export interface EnglishCandidateBlock {
  sourceKey: string;
  confidence: string;
  title: string;
  dialogue: Array<{
    character: string;
    text: string;
    duration: number | null;
  }>;
  choices: Array<{
    id: string;
    text: string;
    nextSceneId: string | null;
  }>;
}

export interface CanonicalScene {
  id: string;
  part: number;
  chapter: number;
  sceneNumber: string;
  title: ProvenancedText;
  alignmentStatus?: 'paired-dialogue' | 'needs-line-alignment';
  sourceStatus?: string;
  sourceNotes?: string[];
  arabicMasterBody?: {
    text: string;
    provenance: string;
  };
  englishCandidateBlocks?: EnglishCandidateBlock[];
  dialogue: CanonicalDialogueLine[];
  choices: CanonicalChoice[];
  defaultNextSceneId?: string;
}

export interface CanonicalStory {
  schemaVersion: 1;
  storyId: 'osiris';
  generatedAt?: string;
  authorities?: {
    arabicAuthority: string;
    englishAuthority: string;
    policy: string;
  };
  scenes: CanonicalScene[];
}

export interface StoryValidationIssue {
  code: 'duplicate-scene-id' | 'broken-scene-link' | 'missing-arabic' | 'missing-english' | 'mirrored-language';
  path: string;
  message: string;
}

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

export function validateCanonicalStory(story: CanonicalStory): StoryValidationIssue[] {
  const issues: StoryValidationIssue[] = [];
  const ids = new Set<string>();

  for (const scene of story.scenes) {
    if (ids.has(scene.id)) {
      issues.push({ code: 'duplicate-scene-id', path: `scenes.${scene.id}`, message: `Duplicate scene id: ${scene.id}` });
    }
    ids.add(scene.id);
  }

  for (const scene of story.scenes) {
    const targets = [scene.defaultNextSceneId, ...scene.choices.map((choice) => choice.nextSceneId)].filter(Boolean) as string[];
    for (const target of targets) {
      if (!ids.has(target)) {
        issues.push({ code: 'broken-scene-link', path: `scenes.${scene.id}`, message: `Unknown next scene: ${target}` });
      }
    }

    scene.dialogue.forEach((line, index) => {
      const path = `scenes.${scene.id}.dialogue.${index}`;
      const ar = normalize(line.content.ar);
      const en = normalize(line.content.en);
      if (!ar && scene.alignmentStatus !== 'needs-line-alignment') issues.push({ code: 'missing-arabic', path, message: 'Arabic dialogue is empty' });
      if (!en) issues.push({ code: 'missing-english', path, message: 'English dialogue is empty' });
      if (ar && en && ar === en) issues.push({ code: 'mirrored-language', path, message: 'Arabic and English dialogue are identical' });
    });
  }

  return issues;
}