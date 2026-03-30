/**
 * generateFullScript.mjs — fixed
 * ==============================
 * Parses OSIRIS_Final_Interactive_Script.kateb.md and replaces
 * the dialogue array in each scene of sceneSystem.ts.
 *
 * Run:  node scripts/generateFullScript.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT    = path.join(__dirname, "..");
const MD_PATH = path.join(ROOT, "script", "OSIRIS_Final_Interactive_Script.kateb.md");
const TS_PATH = path.join(ROOT, "client", "src", "lib", "sceneSystem.ts");

// ── helpers ──────────────────────────────────────────────────────────────────

function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isStructural(line) {
  const t = line.trim();
  if (!t) return true;
  if (t === "---") return true;
  if (/^#{1,3}\s/.test(t)) return true;
  if (t.startsWith("**") && (/\*\*:/.test(t) || t.endsWith("**"))) return true;
  if (t.startsWith("*") && !/الآن/.test(t)) return true;
  if (/^\*\*\[/.test(t)) return true;
  if (t.startsWith("**الموقع:**")) return true;
  if (t.startsWith("**الشخصيات:**")) return true;
  if (t.startsWith("**الحالة النفسية")) return true;
  if (t.startsWith("**[UI/UX")) return true;
  if (t.startsWith("**[Interactive")) return true;
  if (t.startsWith("**نوع التفاعل:**")) return true;
  if (t.startsWith("**الوصف:**")) return true;
  if (t.startsWith("**الخيارات:**")) return true;
  if (t.startsWith("**النتيجة:**")) return true;
  if (/^\d+\.\s/.test(t)) return true;
  if (t.startsWith("- ")) return true;
  return false;
}

function estimateDuration(text) {
  const w = text.trim().split(/\s+/).length;
  return Math.max(2500, Math.round((w / 2.5) * 1000));
}

// ── parse markdown → [{ arabicTitle, paragraphs[] }] ─────────────────────────

function parseScript(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const scenes = [];
  let cur = null;
  let buf = [];

  const flush = () => {
    if (!cur) return;
    const paras = [];
    let b = [];
    const push = () => {
      const t = b.join(" ").replace(/\s+/g, " ").trim();
      if (t) paras.push(t);
      b = [];
    };
    for (const l of buf) {
      const lt = l.trim();
      if (!lt)       { push(); continue; }
      if (lt === "---") { push(); continue; }
      if (isStructural(lt)) { push(); continue; }
      b.push(lt);
    }
    push();
    cur.paragraphs = paras;
    buf = [];
  };

  for (const raw of lines) {
    const m = raw.trim().match(/^###\s+\*\*المشهد\s+[\d.]+:\s+(.+?)\*\*/);
    if (m) { flush(); cur = { arabicTitle: m[1].trim(), paragraphs: [] }; scenes.push(cur); continue; }
    if (cur) buf.push(raw);
  }
  flush();
  return scenes;
}

// ── title → sceneId (hand-verified against sceneSystem.ts) ───────────────────

const TITLE_MAP = {
  "الاستدعاء":                        "zero-1-1-summons",
  "المرافعة الافتتاحية":                  "zero-1-2-prosecution",
  "الوعد الكاذب":                      "one-1-5-1-promise",
  "الحقيقة المرة":                        "one-1-5-2-bitter-truth",
  "لا مفر":                           "one-1-5-3-no-escape",
  "التضحية الأخيرة":                      "one-1-5-4-sacrifice",
  "الهروب واللقاء":                       "two-2-1-escape",
  "تشغيل أوزيريس":                        "two-2-2-osiris-launch",
  "لحظة الخلق والرفض":                    "three-3-1-creation",
  "تصميم الفيروس":                        "three-3-2-virus-design",
  "مرآة النيل":                          "four-4-1-desert",
  "إعلان الألوهية":                        "four-4-2-crowd-engineering",
  "هندسة الحشود":                         "four-4-2-crowd-engineering",
  "نشوة النجاة وقلق الفراغ":                "four-5-1-tarek-message",
  "رسالة من الماضي":                        "four-5-1-tarek-message",
  "دموع المحلل":                          "four-5-2-analyst-tears",
  "لاهوت معقد، لا نوايا سيئة":               "five-6a-1-nicaea-debate",
  "الإمبراطور والحكيم":                     "five-6b-1-constantine",
  "ألم ليلى":                            "five-6c-1-laila-pain",
  "رسالة طارق الثانية":                      "five-6c-2-tarek-second",
  "ملوك الطوائف":                          "six-8-1-andalusia",
  "ملوك الطوائف (أنا خير من أخي)":              "six-8-1-andalusia",
  "زفرة العربي الأخيرة":                      "six-8-2-last-tears",
  "هتلر أمام المرآة":                       "six-8b-1-berlin",
  "بيروقراطية القتل":                        "six-8c-1-death-signatures",
  "اختراق المخبأ":                          "six-8d-1-attack",
  "التحديث النهائي":                         "six-8d-2-final-update",
  "التحديث النهائي (إ</minimax:tool_call> يحيى والهروب)":  "six-8d-2-final-update",
  "لقاء خارج الزمن":                         "transition-dream",
  "وثائق فيسبوك المسرّبة":                    "seven-10-1-karbala",
  "كربلاء":                              "seven-10-1-karbala",
  "كربلاء (مضاد الفيروسات)":                "seven-10-1-karbala",
  "إغراء المهندس الأول":                      "seven-11-1-temptation",
  "قرار يحيى":                            "seven-11-2-decision",
  "تسريب الحقيقة":                          "seven-12-1-truth-leak",
  "استعراض سريع لشهود الدفاع":                 "seven-13-1-awakening",
  "الاستيقاظ":                            "seven-13-1-awakening",
  "إغلاق الملف مؤقتاً":                      "seven-13-2-closing",
};

// ── build TS dialogue array string ─────────────────────────────────────────────

function dialogueTS(paragraphs) {
  const items = paragraphs.map((p) =>
    `      {\n        character: 'Narrator',\n        text: ${JSON.stringify(p)},\n        duration: ${estimateDuration(p)}\n      }`
  );
  return `[\n${items.join(",\n")}\n    ]`;
}

// ── bracket-aware array boundary finder ───────────────────────────────────────

function findMatchingClose(text, openPos) {
  let depth = 0;
  let inStr = false;
  let strChar = null;
  for (let i = openPos; i < text.length; i++) {
    const c = text[i];
    if (!inStr) {
      if (c === '"' || c === "'" || c === "`") { inStr = true; strChar = c; }
      else if (c === "[") depth++;
      else if (c === "]") { if (depth === 0) return i; depth--; }
    } else {
      if (c === strChar && text[i - 1] !== "\\") { inStr = false; strChar = null; }
    }
  }
  return -1;
}

// ── patch one scene ────────────────────────────────────────────────────────────

function patchScene(ts, sceneId, arrTS) {
  // Find the scene object key (single-quoted)
  const keyPat = new RegExp(`'${sceneId}':\\s*\\{`);
  const keyMatch = ts.match(keyPat);
  if (!keyMatch) return { ts, found: false };

  // Find "dialogue: [" after the key (no quotes around dialogue)
  const afterKey = ts.slice(keyMatch.index);
  const diagMatch = afterKey.match(/dialogue:\s*\[\s*/);
  if (!diagMatch) return { ts, found: false };

  const bracketPos = keyMatch.index + diagMatch.index + diagMatch[0].length;
  const closePos   = findMatchingClose(ts, bracketPos - 1);
  if (closePos === -1) return { ts, found: false };

  const before = ts.slice(0, keyMatch.index + diagMatch.index + diagMatch[0].length);
  const after  = ts.slice(closePos + 1);
  return { ts: before + arrTS + after, found: true };
}

// ── main ─────────────────────────────────────────────────────────────────────

const md = fs.readFileSync(MD_PATH, "utf8");
const ts = fs.readFileSync(TS_PATH, "utf8");

const canonical = parseScript(md);
let   updated   = ts;
let   patched   = 0;
const warns     = [];

for (const scene of canonical) {
  const sid = TITLE_MAP[scene.arabicTitle] ||
              TITLE_MAP[norm(scene.arabicTitle)] ||
              Object.entries(TITLE_MAP).find(([k]) => norm(k) === norm(scene.arabicTitle))?.[1];

  if (!sid)  { warns.push(`No sceneId: "${scene.arabicTitle}"`); continue; }
  if (!scene.paragraphs.length) { warns.push(`No paragraphs: "${scene.arabicTitle}"`); continue; }

  const arr    = dialogueTS(scene.paragraphs);
  const result = patchScene(updated, sid, arr);
  if (!result.found) { warns.push(`Could not patch ${sid}: "${scene.arabicTitle}"`); continue; }
  updated = result.ts;
  patched++;
  console.error(`✓ ${sid} → ${scene.paragraphs.length} paragraphs`);
}

fs.writeFileSync(TS_PATH, updated, "utf8");
const out = JSON.stringify({ ok: true, patched, warns }, null, 2);
process.stdout.write(out + "\n");
console.error(`\nWrote ${updated.length} chars  |  ${patched}/${canonical.length} scenes`);
if (warns.length) warns.forEach(w => console.error(" ⚠", w));
