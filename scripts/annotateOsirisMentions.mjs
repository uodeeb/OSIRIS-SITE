import fs from 'node:fs'
import path from 'node:path'

function isNonStoryTimelineLine(rawLine) {
  const t = rawLine.trim()
  if (!t) return true
  if (t.startsWith('#')) return true
  if (t.startsWith('- BG ')) return true
  if (t.startsWith('- FX ')) return true
  if (t.startsWith('- Ambient ')) return true
  if (t.startsWith('- Beats:')) return true
  if (t.startsWith('- Part:')) return true
  if (t.startsWith('- SFX:')) return true
  if (t.startsWith('- Music:')) return true
  return false
}

function mentionKindFromRow(r) {
  const text = (r.text || '').trim()
  if (r.source === 'OSIRIS.md') {
    if (text.startsWith('#')) return 'title'
    if (text.startsWith('الموقع:')) return 'location'
    if (text.startsWith('•الشاشة:') || text.startsWith('•الصوت:')) return 'ui_ux'
    if (text.includes('واجهة أوزيريس') || text.includes('محاكاة أوزيريس')) return 'location'
    if (text.includes('شغّل') || text.includes('شغلي') || text.includes('برمج')) return 'system_action'
    if (text.includes('أجاب أوزيريس') || text.includes('رسالة من أوزيريس')) return 'system_output'
    if (text.includes('"')) return 'dialogue_or_quote'
    return 'narration'
  }

  if (r.source === 'OSIRIS_CINEMATIC_TIMELINE.md') {
    if (r.speaker) return r.speaker === 'Narrator' ? 'narration' : 'dialogue_or_quote'
    return 'tech_note'
  }

  return 'unknown'
}

function toneHeuristic(r) {
  const text = `${r.text || ''} ${r.contextBefore || ''} ${r.contextAfter || ''}`
  const t = text
  if (/(تحذير|اختراق|أحمر|Alarm|alarm)/u.test(t)) return 'urgent/ominous'
  if (/(دموع|يبكي|حزن|صمت ثقيل)/u.test(t)) return 'tragic/somber'
  if (/(رهبة|جلال|كوني|فضاء|نقطة الصفر)/u.test(t)) return 'awe/ominous'
  if (/(سأستخدم|سأدمر|المواجهة)/u.test(t)) return 'defiant/combative'
  if (/(التطابق: 100%|الفيروس يعمل)/u.test(t)) return 'ominous/confirmatory'
  if (/(تحليل|بيانات|قراءات)/u.test(t)) return 'analytical/clinical'
  return 'neutral'
}

function functionHeuristic(r) {
  const kind = mentionKindFromRow(r)
  const text = (r.text || '').trim()
  if (text.includes('افتح أوزيريس')) return 'plot_catalyst'
  if (text.includes('مشروع أوزيريس')) return 'plot_reveal/foreshadowing'
  if (text.includes('تشغيل أوزيريس') || text.includes('شغّل') || text.includes('شغلي')) return 'plot_progression/turning_point'
  if (text.includes('تسريب') || text.includes('تفريغ') || text.includes('حجر رشيد')) return 'climax/resolution'
  if (kind === 'system_output') return 'world_building/exposition'
  if (kind === 'system_action') return 'world_building/mechanics'
  if (kind === 'location' || kind === 'ui_ux') return 'world_building/staging'
  if (kind === 'dialogue_or_quote') return 'character_development/theme'
  return 'world_building/theme'
}

function reactionsHeuristic(r) {
  const kind = mentionKindFromRow(r)
  const before = (r.contextBefore || '').trim()
  const after = (r.contextAfter || '').trim()
  const t = `${before} ${after}`

  if (r.source === 'OSIRIS.md') {
    if (r.text.includes('افتح أوزيريس')) return 'Yahya shocked; urgency escalates; commits to opening system.'
    if (r.text.includes('طنين خوادم أوزيريس')) return 'Yahya breaks down emotionally; grief + moral dread.'
    if (r.text.includes('أنت تملك أوزيريس الآن')) return 'Laila steadies Yahya; reframes power as responsibility.'
    if (r.text.includes('سأستخدم أوزيريس')) return 'Yahya shifts into vengeance/mission mode; Laila cautions strategy.'
    if (r.text.includes('تحذير: اختراق')) return 'Both panic; immediate escape plan; story pivots from analysis to survival.'
    if (r.text.includes('الآلة لا تفهم')) return 'Yahya recognizes model limits; emotional insight overrides calculation.'
  }

  if (/ليلى/u.test(t) && /(صرخت|بصوت مرتجف|مبهورة|باشمئزاز)/u.test(t)) return 'Strong Laila reaction present (fear/awe/disgust), with Yahya analyzing.'
  if (/يحيى/u.test(t) && /(همس|بمرارة|أجاب|سقط)/u.test(t)) return 'Yahya reacts as analyst under pressure (awe/bitterness/overload).'
  if (kind === 'location' || kind === 'ui_ux') return 'Environmental/UX framing; characters positioned as observers/actors.'
  return 'Contextual reaction implied; see adjacent lines.'
}

function buildRegistry(rawJsonPath) {
  const raw = JSON.parse(fs.readFileSync(rawJsonPath, 'utf8'))

  const OVERRIDE = {
    'OSIRIS.md:27': {
      emotionalTone: 'urgent/ominous',
      narrativeFunction: 'plot_catalyst',
      characterReactions: 'Yahya shocked; pulse stops; drops the call; commits to opening OSIRIS.',
    },
    'OSIRIS.md:37': {
      emotionalTone: 'awe/ominous',
      narrativeFunction: 'world_building/staging',
      characterReactions: 'Yahya enters an uncanny digital courtroom; scale and dread reset expectations.',
    },
    'OSIRIS.md:105': {
      emotionalTone: 'ominous/terrifying',
      narrativeFunction: 'plot_reveal/foreshadowing',
      characterReactions: 'Tarek trembles; realization lands that OSIRIS is neuro-engineering, not “better apps”.',
    },
    'OSIRIS.md:173': {
      emotionalTone: 'awe/scientific',
      narrativeFunction: 'world_building/exposition',
      characterReactions: 'Laila probes; Yahya explains mechanics; both cross from theory to lived simulation.',
    },
    'OSIRIS.md:223': {
      emotionalTone: 'ominous/confirmatory',
      narrativeFunction: 'foreshadowing/escalation',
      characterReactions: 'Reader completes mapping; OSIRIS confirms perfect match: the virus is already operational.',
    },
    'OSIRIS.md:300': {
      emotionalTone: 'tragic/somber',
      narrativeFunction: 'character_development',
      characterReactions: 'Silence and server-hum frame Yahya’s breakdown; grief becomes moral clarity.',
    },
    'OSIRIS.md:304': {
      emotionalTone: 'resolute/empowering',
      narrativeFunction: 'plot_progression/turning_point',
      characterReactions: 'Laila reframes power as duty; Yahya steadies and accepts the mission.',
    },
    'OSIRIS.md:305': {
      emotionalTone: 'defiant/combative',
      narrativeFunction: 'plot_progression/goal_statement',
      characterReactions: 'Yahya vows retaliation; Laila redirects toward strategy and root-cause analysis.',
    },
    'OSIRIS.md:313': {
      emotionalTone: 'cryptic/authoritative',
      narrativeFunction: 'plot_progression/constraint',
      characterReactions: 'OSIRIS refuses surface-level “political corruption” and forces a deeper target selection.',
    },
    'OSIRIS.md:466': {
      emotionalTone: 'analytical/clinical',
      narrativeFunction: 'world_building/exposition',
      characterReactions: 'Laila protests emotionally; OSIRIS answers in cold rationale; Yahya synthesizes pattern.',
    },
    'OSIRIS.md:481': {
      emotionalTone: 'urgent/ominous',
      narrativeFunction: 'plot_disruption/stakes',
      characterReactions: 'Alarm hits; analysis collapses into survival; characters scramble to escape.',
    },
    'OSIRIS.md:534': {
      emotionalTone: 'resolute',
      narrativeFunction: 'plot_progression/turning_point',
      characterReactions: 'Yahya chooses confrontation; Laila becomes the activator/partner in the trigger.',
    },
    'OSIRIS.md:561': {
      emotionalTone: 'poignant/reflective',
      narrativeFunction: 'theme/ai_limit',
      characterReactions: 'OSIRIS computation fails; Yahya articulates the human “missing variable”: love and sacrifice.',
    },
    'OSIRIS.md:612': {
      emotionalTone: 'triumphant/painful',
      narrativeFunction: 'climax/resolution',
      characterReactions: 'OSIRIS broadcasts the source code globally; Yahya pays immediate physical cost.',
    },
    'OSIRIS_CINEMATIC_TIMELINE.md:26': {
      emotionalTone: 'urgent/ominous',
      narrativeFunction: 'plot_catalyst',
      characterReactions: 'Tarek’s message spikes tension; Yahya is pushed into action.',
    },
    'OSIRIS_CINEMATIC_TIMELINE.md:236': {
      emotionalTone: 'resolute/empowering',
      narrativeFunction: 'plot_progression/turning_point',
      characterReactions: 'Laila insists power is now in Yahya’s hands; mission becomes explicit.',
    },
    'OSIRIS_CINEMATIC_TIMELINE.md:238': {
      emotionalTone: 'defiant/combative',
      narrativeFunction: 'plot_progression/goal_statement',
      characterReactions: 'Yahya pivots from grief to attack; declares intent to use OSIRIS offensively.',
    },
    'OSIRIS_CINEMATIC_TIMELINE.md:366': {
      emotionalTone: 'urgent/ominous',
      narrativeFunction: 'plot_disruption/stakes',
      characterReactions: 'Immediate threat interrupts the simulation; forces escape behavior.',
    },
    'OSIRIS_CINEMATIC_TIMELINE.md:484': {
      emotionalTone: 'triumphant/painful',
      narrativeFunction: 'climax/resolution',
      characterReactions: 'Truth leak begins; irreversible broadcast aligns with narrative payoff.',
    },
    'OSIRIS_CINEMATIC_TIMELINE.md:533': {
      emotionalTone: 'ominous/prophetic',
      narrativeFunction: 'meta_address/foreshadowing',
      characterReactions: 'Direct address to the reader; story reopens as a choice.',
    },
  }

  const rows = []

  for (const m of raw.mdRes.mentions) {
    rows.push({
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
      matches: (m.matches || []).join('|'),
      mentionKind: null,
      emotionalTone: null,
      narrativeFunction: null,
      characterReactions: null,
    })
  }

  for (const m of raw.tlRes.mentions) {
    if (isNonStoryTimelineLine(m.rawLine || m.text || '')) continue
    rows.push({
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
      matches: (m.matches || []).join('|'),
      mentionKind: null,
      emotionalTone: null,
      narrativeFunction: null,
      characterReactions: null,
    })
  }

  rows.sort((a, b) => a.source.localeCompare(b.source) || a.line - b.line)

  let id = 0
  const out = rows.map((r) => {
    id += 1
    const mentionKind = mentionKindFromRow(r)
    const emotionalTone = toneHeuristic(r)
    const narrativeFunction = functionHeuristic(r)
    const characterReactions = reactionsHeuristic(r)
    const key = `${r.source}:${r.line}`
    const o = OVERRIDE[key]
    return {
      mentionId: `OSR-${String(id).padStart(3, '0')}`,
      ...r,
      mentionKind,
      emotionalTone: o?.emotionalTone ?? emotionalTone,
      narrativeFunction: o?.narrativeFunction ?? narrativeFunction,
      characterReactions: o?.characterReactions ?? characterReactions,
    }
  })

  return out
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

const rawJsonPath = process.argv[2]
if (!rawJsonPath) {
  console.error('Usage: node scripts/annotateOsirisMentions.mjs <analysis/osiris_mentions_raw.json>')
  process.exit(1)
}

const abs = path.resolve(rawJsonPath)
const rows = buildRegistry(abs)

const outDir = path.resolve(path.dirname(abs))
const jsonOut = path.join(outDir, 'osiris_mentions_registry.json')
const csvOut = path.join(outDir, 'osiris_mentions_registry.csv')

fs.writeFileSync(jsonOut, JSON.stringify({ generatedAt: new Date().toISOString(), source: abs, count: rows.length, rows }, null, 2))
writeCsv(csvOut, rows, [
  'mentionId',
  'source',
  'line',
  'part',
  'chapter',
  'scene',
  'timestampStart',
  'timestampEnd',
  'speaker',
  'text',
  'matches',
  'mentionKind',
  'emotionalTone',
  'narrativeFunction',
  'characterReactions',
  'contextBefore',
  'contextAfter',
])

process.stdout.write(JSON.stringify({ ok: true, csvOut, jsonOut, count: rows.length }, null, 2) + '\n')
