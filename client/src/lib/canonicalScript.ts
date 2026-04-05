import type { DialogueLine, Scene } from './sceneSystem';
import { SCENES } from './sceneSystem';

type CanonicalSceneBlock = {
  arabicTitle: string;
  paragraphs: string[];
};

function normArabic(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/[^0-9a-z\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff\s]+/gi, ' ')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitParagraphs(lines: string[]) {
  const out: string[] = [];
  let buf: string[] = [];
  const flush = () => {
    const t = buf.join(' ').replace(/\s+/g, ' ').trim();
    buf = [];
    if (t) out.push(t);
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line === '---') {
      flush();
      continue;
    }
    if (line.startsWith('**[UI/UX')) continue;
    if (line.startsWith('**[Interactive')) continue;
    if (line.startsWith('**نوع التفاعل:**')) continue;
    if (line.startsWith('**الوصف:**')) continue;
    if (line.startsWith('**الخيارات:**')) continue;
    if (line.startsWith('**الموقع:**')) continue;
    if (line.startsWith('**الشخصيات:**')) continue;
    if (line.startsWith('**الحالة النفسية')) continue;
    if (line.startsWith('-')) continue;
    if (line.startsWith('*')) continue;
    if (line.startsWith('#')) continue;
    if (line.startsWith('**[')) continue;
    buf.push(line);
  }
  flush();
  return out;
}

function extractCanonicalScenes(md: string) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const scenes: CanonicalSceneBlock[] = [];
  let current: CanonicalSceneBlock | null = null;
  let inDialogue = false;
  let buffer: string[] = [];

  const flush = () => {
    if (!current) return;
    const paragraphs = splitParagraphs(buffer);
    current.paragraphs = paragraphs;
    scenes.push(current);
    current = null;
    buffer = [];
    inDialogue = false;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    const m = line.match(/^###\s+\*\*المشهد\s+\d+\.\d+:\s*(.+?)\*\*/u);
    if (m) {
      flush();
      current = { arabicTitle: (m[1] || '').trim(), paragraphs: [] };
      continue;
    }

    if (!current) continue;

    if (line.trim() === '**[النص السردي والحواري]**') {
      inDialogue = true;
      continue;
    }

    if (!inDialogue) continue;

    if (line.startsWith('### ')) {
      flush();
      continue;
    }

    buffer.push(line);
  }
  flush();
  return scenes;
}

function buildArabicTitleToSceneId() {
  const map = new Map<string, string>();
  for (const s of Object.values(SCENES)) {
    map.set(normArabic(s.arabicTitle), s.id);
  }
  return map;
}

function computeDurationMs(ar: string) {
  const n = ar.trim().length;
  const ms = 600 + n * 38;
  return Math.max(1400, Math.min(12000, ms));
}

function bestMatchIndex(query: string, candidates: Array<{ i: number; n: string }>, startAt: number) {
  const q = normArabic(query);
  if (!q) return null;
  const qTokens = q.split(' ').filter(Boolean);
  const qLen = qTokens.length || 1;
  let best: { i: number; score: number } | null = null;

  for (const c of candidates) {
    if (c.i < startAt) continue;
    if (c.n === q) return { i: c.i, score: 1 };
    if (q.length >= 28 && (c.n.includes(q) || q.includes(c.n))) return { i: c.i, score: 0.95 };
    const tokens = new Set(c.n.split(' ').filter(Boolean));
    let overlap = 0;
    for (const t of qTokens) if (tokens.has(t)) overlap += 1;
    const score = overlap / qLen;
    if (!best || score > best.score) best = { i: c.i, score };
    if (best && best.score >= 0.9) break;
  }
  return best;
}

function mergeCanonicalIntoScene(scene: Scene, canonicalParagraphs: string[]): DialogueLine[] {
  const existing = scene.dialogue || [];
  const indexed = existing
    .map((d, i) => ({ i, n: normArabic(d.arabicText || d.text || '') }))
    .filter((x) => x.n);

  const out: DialogueLine[] = [];
  let cursor = 0;

  for (const p of canonicalParagraphs) {
    const m = bestMatchIndex(p, indexed, cursor);
    if (m && m.score >= 0.72) {
      while (cursor <= m.i && cursor < existing.length) {
        out.push(existing[cursor]);
        cursor += 1;
      }
      continue;
    }
    out.push({
      character: 'Narrator',
      text: p,
      arabicText: p,
      duration: computeDurationMs(p),
    });
  }

  while (cursor < existing.length) {
    out.push(existing[cursor]);
    cursor += 1;
  }

  return out;
}

let canonicalCache: Promise<Record<string, DialogueLine[]>> | null = null;

export function loadCanonicalDialogueMap(): Promise<Record<string, DialogueLine[]>> {
  if (canonicalCache) return canonicalCache;
  canonicalCache = fetch('/script/OSIRIS_Final_Interactive_Script.kateb.md')
    .then((r) => (r.ok ? r.text() : Promise.reject()))
    .then((md) => {
      const blocks = extractCanonicalScenes(md);
      const titleMap = buildArabicTitleToSceneId();
      const out: Record<string, DialogueLine[]> = {};

      for (const b of blocks) {
        const id = titleMap.get(normArabic(b.arabicTitle));
        if (!id) continue;
        const scene = SCENES[id];
        if (!scene) continue;
        out[id] = mergeCanonicalIntoScene(scene, b.paragraphs);
      }

      return out;
    })
    .catch(() =>
      fetch('/script/OSIRIS_Final_Interactive_Script.md')
        .then((r) => (r.ok ? r.text() : Promise.reject()))
        .then((md) => {
          const blocks = extractCanonicalScenes(md);
          const titleMap = buildArabicTitleToSceneId();
          const out: Record<string, DialogueLine[]> = {};

          for (const b of blocks) {
            const id = titleMap.get(normArabic(b.arabicTitle));
            if (!id) continue;
            const scene = SCENES[id];
            if (!scene) continue;
            out[id] = mergeCanonicalIntoScene(scene, b.paragraphs);
          }

          return out;
        })
        .catch(() => ({})),
    );
  return canonicalCache;
}
