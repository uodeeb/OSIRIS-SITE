import fs from 'node:fs'
import path from 'node:path'

const DEFAULT_PATTERNS = [
  /OSIRIS/giu,
  /أوزيريس/giu,
  /اوزيريس/giu,
  /أُوزيريس/giu,
  /أوسيريس/giu,
]

function normalizeHeading(s) {
  return s.replace(/\*/g, '').replace(/\s+/g, ' ').trim()
}

function extractFromMarkdown(filePath, patterns = DEFAULT_PATTERNS) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const lines = raw.split(/\r?\n/)
  let part = null
  let chapter = null
  let scene = null
  const out = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed.startsWith('# ')) part = normalizeHeading(trimmed.replace(/^#\s+/, ''))
    if (trimmed.startsWith('## ')) chapter = normalizeHeading(trimmed.replace(/^##\s+/, ''))
    if (trimmed.startsWith('### ')) scene = normalizeHeading(trimmed.replace(/^###\s+/, ''))

    const matches = []
    for (const p of patterns) {
      p.lastIndex = 0
      let m
      while ((m = p.exec(line)) !== null) {
        matches.push({ match: m[0], index: m.index })
        if (m.index === p.lastIndex) p.lastIndex++
      }
    }
    if (!matches.length) continue

    const before = i > 0 ? lines[i - 1] : ''
    const after = i + 1 < lines.length ? lines[i + 1] : ''
    out.push({
      sourceFile: filePath,
      line: i + 1,
      part,
      chapter,
      scene,
      text: line,
      contextBefore: before,
      contextAfter: after,
      matches: matches.map((x) => x.match),
    })
  }

  return { filePath, count: out.length, mentions: out }
}

function extractFromCinematicTimeline(filePath, patterns = DEFAULT_PATTERNS) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const lines = raw.split(/\r?\n/)
  let section = null
  const out = []

  const timeRe = /\[(\d+:\d+)\s*[–-]\s*(\d+:\d+)\]\s+L(\d+)\s+([^:]+):\s+(.*)$/u

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed.startsWith('## ')) section = normalizeHeading(trimmed.replace(/^##\s+/, ''))

    const matches = []
    for (const p of patterns) {
      p.lastIndex = 0
      let m
      while ((m = p.exec(line)) !== null) {
        matches.push({ match: m[0], index: m.index })
        if (m.index === p.lastIndex) p.lastIndex++
      }
    }
    if (!matches.length) continue

    const parsed = trimmed.startsWith('-') ? timeRe.exec(trimmed.replace(/^-+\s*/, '')) : null
    const before = i > 0 ? lines[i - 1] : ''
    const after = i + 1 < lines.length ? lines[i + 1] : ''

    out.push({
      sourceFile: filePath,
      line: i + 1,
      section,
      timestampStart: parsed?.[1] ?? null,
      timestampEnd: parsed?.[2] ?? null,
      cueLine: parsed?.[3] ? Number(parsed[3]) : null,
      speaker: parsed?.[4]?.trim() ?? null,
      text: parsed?.[5] ?? line,
      rawLine: line,
      contextBefore: before,
      contextAfter: after,
      matches: matches.map((x) => x.match),
    })
  }

  return { filePath, count: out.length, mentions: out }
}

function toCsvRow(v) {
  const s = String(v ?? '')
  if (s.includes('"') || s.includes(',') || s.includes('\n')) return `"${s.replaceAll('"', '""')}"`
  return s
}

function writeCsv(filePath, rows, header) {
  const lines = [header.map(toCsvRow).join(',')]
  for (const r of rows) lines.push(header.map((k) => toCsvRow(r[k])).join(','))
  fs.writeFileSync(filePath, lines.join('\n'))
}

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd()
const osirisMd = path.resolve(root, '../OSIRIS.md')
const timelineMd = path.resolve(root, '../OSIRIS-SITE/OSIRIS_CINEMATIC_TIMELINE.md')

const mdRes = extractFromMarkdown(osirisMd)
const tlRes = extractFromCinematicTimeline(timelineMd)

const merged = []
for (const m of mdRes.mentions) {
  merged.push({
    source: 'OSIRIS.md',
    line: m.line,
    part: m.part ?? '',
    chapter: m.chapter ?? '',
    scene: m.scene ?? '',
    timestampStart: '',
    timestampEnd: '',
    speaker: '',
    text: m.text,
    contextBefore: m.contextBefore,
    contextAfter: m.contextAfter,
    matches: m.matches.join('|'),
  })
}
for (const m of tlRes.mentions) {
  merged.push({
    source: 'OSIRIS_CINEMATIC_TIMELINE.md',
    line: m.line,
    part: m.section ?? '',
    chapter: '',
    scene: '',
    timestampStart: m.timestampStart ?? '',
    timestampEnd: m.timestampEnd ?? '',
    speaker: m.speaker ?? '',
    text: m.text,
    contextBefore: m.contextBefore,
    contextAfter: m.contextAfter,
    matches: m.matches.join('|'),
  })
}

merged.sort((a, b) => a.source.localeCompare(b.source) || a.line - b.line)

const outDir = path.resolve(root, '../analysis')
fs.mkdirSync(outDir, { recursive: true })
const jsonOut = path.join(outDir, 'osiris_mentions_raw.json')
const csvOut = path.join(outDir, 'osiris_mentions_raw.csv')

fs.writeFileSync(jsonOut, JSON.stringify({ generatedAt: new Date().toISOString(), sources: { osirisMd, timelineMd }, mdRes, tlRes }, null, 2))
writeCsv(
  csvOut,
  merged,
  ['source', 'line', 'part', 'chapter', 'scene', 'timestampStart', 'timestampEnd', 'speaker', 'text', 'contextBefore', 'contextAfter', 'matches'],
)

process.stdout.write(JSON.stringify({ ok: true, jsonOut, csvOut, mdCount: mdRes.count, timelineCount: tlRes.count }, null, 2) + '\n')
