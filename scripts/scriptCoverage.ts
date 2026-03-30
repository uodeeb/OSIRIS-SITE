import fs from "node:fs";
import path from "node:path";
import { SCENES } from "../client/src/lib/sceneSystem";

function normArabic(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isStructuralLine(line: string) {
  const t = line.trim();
  if (!t) return true;
  if (t === "---") return true;
  if (t.startsWith("#")) return true;
  if (t.startsWith("*")) return true;
  if (t.startsWith("-")) return true;
  if (t.startsWith("**[")) return true;
  if (t.startsWith("**الموقع:**")) return true;
  if (t.startsWith("**الشخصيات:**")) return true;
  if (t.startsWith("**الحالة النفسية")) return true;
  if (t.startsWith("**[UI/UX")) return true;
  if (t.startsWith("**[Interactive")) return true;
  if (t.startsWith("**نوع التفاعل:**")) return true;
  if (t.startsWith("**الوصف:**")) return true;
  if (t.startsWith("**الخيارات:**")) return true;
  return false;
}

function extractParagraphs(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: Array<{ kind: string; text: string; lineStart: number; lineEnd: number }> = [];

  let buf: string[] = [];
  let start = 1;
  const flush = (end: number) => {
    if (!buf.length) return;
    const text = buf.join(" ").replace(/\s+/g, " ").trim();
    if (text) out.push({ kind: "paragraph", text, lineStart: start, lineEnd: end });
    buf = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i] ?? "";
    const lineNo = i + 1;
    if (isStructuralLine(raw)) {
      flush(lineNo - 1);
      continue;
    }
    if (!buf.length) start = lineNo;
    buf.push(raw.trim());
  }
  flush(lines.length);
  return out;
}

function buildSceneTextIndex() {
  const sceneLines: Array<{ sceneId: string; idx: number; lang: "ar" | "en"; text: string; norm: string }> = [];
  for (const scene of Object.values(SCENES)) {
    scene.dialogue.forEach((d, idx) => {
      if (d.arabicText) {
        const n = normArabic(d.arabicText);
        if (n) sceneLines.push({ sceneId: scene.id, idx, lang: "ar", text: d.arabicText, norm: n });
      }
      if (d.text) {
        const n = normArabic(d.text);
        if (n) sceneLines.push({ sceneId: scene.id, idx, lang: "en", text: d.text, norm: n });
      }
    });
  }
  return sceneLines;
}

function bestMatch(queryNorm: string, hay: Array<{ norm: string; sceneId: string; idx: number; text: string; lang: string }>) {
  let best: any = null;
  let bestScore = 0;
  const qTokens = queryNorm.split(" ").filter(Boolean);
  const qLen = qTokens.length || 1;

  for (const h of hay) {
    if (h.norm === queryNorm) return { ...h, score: 1 };
    if (queryNorm.length >= 40 && (h.norm.includes(queryNorm) || queryNorm.includes(h.norm))) return { ...h, score: 0.98 };
    const hTokens = new Set(h.norm.split(" ").filter(Boolean));
    let overlap = 0;
    for (const t of qTokens) if (hTokens.has(t)) overlap += 1;
    const score = overlap / qLen;
    if (score > bestScore) {
      bestScore = score;
      best = h;
    }
  }
  if (!best) return null;
  return { ...best, score: bestScore };
}

function main() {
  const scriptDir = path.resolve(process.argv[2] || path.resolve(import.meta.dirname, "..", "script"));
  const finalPath = path.join(scriptDir, "OSIRIS_Final_Interactive_Script.md");
  const markdown = fs.readFileSync(finalPath, "utf8");

  const paragraphs = extractParagraphs(markdown);
  const sceneLines = buildSceneTextIndex();

  let matchedStrong = 0;
  let matchedWeak = 0;
  const missing: any[] = [];
  const mapped: any[] = [];

  for (const p of paragraphs) {
    const n = normArabic(p.text);
    if (!n) continue;
    const m = bestMatch(n, sceneLines);
    if (m && m.score >= 0.75) {
      matchedStrong += 1;
      mapped.push({ ...p, match: { sceneId: m.sceneId, idx: m.idx, score: m.score, lang: m.lang } });
      continue;
    }
    if (m && m.score >= 0.45) {
      matchedWeak += 1;
      mapped.push({ ...p, match: { sceneId: m.sceneId, idx: m.idx, score: m.score, lang: m.lang } });
      continue;
    }
    missing.push(p);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    input: finalPath,
    totals: {
      scriptParagraphs: paragraphs.length,
      sceneDialogueLines: sceneLines.length,
      matchedStrong,
      matchedWeak,
      missing: missing.length,
      coverageStrongPct: Math.round((matchedStrong / Math.max(1, paragraphs.length)) * 1000) / 10,
    },
    missingSample: missing.slice(0, 120),
  };

  const outDir = path.resolve(import.meta.dirname, "..", "..", "analysis");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "script_coverage_report.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(outDir, "script_missing_paragraphs.json"), JSON.stringify(missing, null, 2));
  fs.writeFileSync(
    path.join(outDir, "script_missing_paragraphs.txt"),
    missing.map((m) => `L${m.lineStart}-${m.lineEnd}: ${m.text}`).join("\n\n"),
  );

  process.stdout.write(JSON.stringify({ ok: true, ...report.totals, outDir }, null, 2) + "\n");
}

main();

