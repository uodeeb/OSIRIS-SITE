import fs from 'node:fs'
import path from 'node:path'

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
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

function pct(x) {
  return Math.max(0, Math.min(100, x))
}

function chooseEffectId(row) {
  const t = `${row.text || ''} ${row.part || ''} ${row.chapter || ''} ${row.scene || ''}`.toLowerCase()
  const tone = (row.emotionalTone || '').toLowerCase()
  const fn = (row.narrativeFunction || '').toLowerCase()
  const kind = (row.mentionKind || '').toLowerCase()

  if (t.includes('افتح أوزيريس') || fn.includes('plot_catalyst')) return 'FX-01-SUMMONS-EYE'
  if (t.includes('تحذير') || t.includes('اختراق') || tone.includes('urgent')) return 'FX-06-ALERT-RED'
  if (t.includes('حجر رشيد') || t.includes('تفريغ') || t.includes('تسريب') || fn.includes('climax')) return 'FX-07-TRUTH-LEAK'
  if (t.includes('كربلاء')) return 'FX-08-SOLEMN-DUST'
  if (t.includes('مشروع أوزيريس')) return 'FX-04-NEURAL-ANALYSIS'
  if (t.includes('واجهة') || kind === 'ui_ux') return 'FX-02-INTERFACE-SCANLINES'
  if (t.includes('محاكاة')) return 'FX-05-HOLOGRAM-ORBIT'
  if (t.includes('تحليل') || t.includes('بيانات') || t.includes('قراءات') || t.includes('تفكيك')) return 'FX-04-NEURAL-ANALYSIS'
  if (tone.includes('tragic') || tone.includes('somber')) return 'FX-08-SOLEMN-DUST'
  return 'FX-03-HOLOGRAM-DATA'
}

function buildCompositions(assetSpecs) {
  const byName = new Map(assetSpecs.assets.map((a) => [a.name, a]))

  function assetRef(name) {
    const a = byName.get(name)
    if (!a) return null
    const m = a.media?.ok ? a.media : null
    const v = m?.container === 'mp4' ? m.video : null
    const g = m?.container === 'gif' ? m : null
    return {
      name: a.name,
      relativePath: a.relativePath,
      bytes: a.bytes,
      container: m?.container ?? null,
      width: v?.width ?? g?.width ?? null,
      height: v?.height ?? g?.height ?? null,
      fps: v?.fps ?? g?.fps ?? null,
      durationSec: v?.durationSec ?? g?.durationSec ?? null,
      codec: v?.codec ?? null,
    }
  }

  const compositions = [
    {
      effectId: 'FX-01-SUMMONS-EYE',
      label: 'Summons / Falcon Eye',
      narrativeUse: 'Inciting messages, system wake-ups, “Open OSIRIS” moments.',
      base: assetRef('Egyptian_falcon_eye_202603301359.mp4'),
      fallback: assetRef('Slow_orbit_osiris_falcon_hologram_floating_i.gif'),
      palette: ['#05060a', '#00e5ff', '#2a5cff', '#d4af37', '#ff2d2d'],
      shaderPreset: 'irisGlow+crtSubtle',
      shaderParams: {
        irisPulseHz: 0.8,
        glowIntensity: 0.55,
        glowColor: '#00e5ff',
        vignette: 0.45,
        scanlineIntensity: 0.1,
        chromaAberration: 0.002,
        noise: 0.08,
      },
      particlePreset: 'microDust',
      particleParams: { count: 80, sizePx: [0.8, 1.6], speed: 0.12, opacity: [0.0, 0.18] },
    },
    {
      effectId: 'FX-02-INTERFACE-SCANLINES',
      label: 'OSIRIS Interface / Scanlines',
      narrativeUse: 'OSIRIS courtroom interface, “system voice” overlays, UI beats.',
      base: assetRef('OSIRIS_falcon_logo_202603301401.mp4'),
      fallback: assetRef('Medium_wide_shot_of_the_osiris_falcon_logo_re.gif'),
      palette: ['#000814', '#00e5ff', '#2a5cff', '#0b132b', '#ffffff'],
      shaderPreset: 'crtScanlines+vignette',
      shaderParams: {
        scanlineIntensity: 0.22,
        scanlineDensity: 1.35,
        bloom: 0.25,
        vignette: 0.5,
        noise: 0.12,
        flickerHz: 0.6,
      },
      particlePreset: 'floatingPoints',
      particleParams: { count: 120, sizePx: [0.6, 1.4], speed: 0.08, opacity: [0.0, 0.22] },
    },
    {
      effectId: 'FX-03-HOLOGRAM-DATA',
      label: 'Hologram Data Stream',
      narrativeUse: 'Data reads, dashboards, “OSIRIS shows” moments, analytical exposition.',
      base: assetRef('Falcon_hologram_data_202603301414.mp4'),
      fallback: assetRef('Slow_orbit_osiris_falcon_hologram_floating_i.gif'),
      palette: ['#02030a', '#00e5ff', '#00ff9d', '#2a5cff', '#c8fff4'],
      shaderPreset: 'dataRain+edgeGlow',
      shaderParams: {
        dataDensity: 0.6,
        edgeGlow: 0.35,
        gamma: 1.08,
        contrast: 1.12,
        scanlineIntensity: 0.12,
      },
      particlePreset: 'lineParticles',
      particleParams: { count: 160, lengthPx: [6, 18], speed: 0.22, opacity: [0.02, 0.18] },
    },
    {
      effectId: 'FX-04-NEURAL-ANALYSIS',
      label: 'Neural Analysis / Pattern Match',
      narrativeUse: 'Virus decomposition, correlation, “match 100%”, cognition/brain scenes.',
      base: assetRef('Neural_network_forms_202603301407.mp4'),
      fallback: assetRef('OSIRIS_falcon_logo_202603301401.mp4'),
      palette: ['#05060a', '#6cf0ff', '#9b5cff', '#00ff9d', '#ffffff'],
      shaderPreset: 'neuralPulse+colorShift',
      shaderParams: {
        pulseHz: 0.9,
        pulseIntensity: 0.45,
        hueShift: 0.06,
        vignette: 0.38,
        noise: 0.1,
      },
      particlePreset: 'synapseNodes',
      particleParams: { count: 220, linkProb: 0.12, speed: 0.15, opacity: [0.03, 0.2] },
    },
    {
      effectId: 'FX-05-HOLOGRAM-ORBIT',
      label: 'Falcon Hologram / Slow Orbit',
      narrativeUse: 'Simulation ambience, scene transitions, “entering OSIRIS” travel moments.',
      base: assetRef('OSIRIS_falcon_hologram_202603301403.mp4'),
      fallback: assetRef('Slow_orbit_osiris_falcon_hologram_floating_i.gif'),
      palette: ['#000000', '#00e5ff', '#2a5cff', '#00ff9d', '#0b132b'],
      shaderPreset: 'hologramFlicker',
      shaderParams: { flickerHz: 0.35, flickerAmp: 0.18, bloom: 0.32, scanlineIntensity: 0.18 },
      particlePreset: 'ionMist',
      particleParams: { count: 90, sizePx: [2, 8], speed: 0.05, opacity: [0.01, 0.12] },
    },
    {
      effectId: 'FX-06-ALERT-RED',
      label: 'Security Breach / Red Alert',
      narrativeUse: 'Intrusion warnings, emergency interrupts, panic escalations.',
      base: assetRef('OSIRIS_falcon_hologram_202603301403.mp4'),
      fallback: assetRef('OSIRIS_falcon_logo_202603301401.mp4'),
      palette: ['#05060a', '#ff2d2d', '#ff7a00', '#00e5ff', '#ffffff'],
      shaderPreset: 'uiRedFlash+glitchMinor',
      shaderParams: { flashHz: 2.4, flashIntensity: 0.85, glitch: 0.25, shakePx: 6, vignette: 0.55 },
      particlePreset: 'sparks',
      particleParams: { count: 140, sizePx: [1, 3], speed: 0.35, opacity: [0.05, 0.3] },
    },
    {
      effectId: 'FX-07-TRUTH-LEAK',
      label: 'Truth Leak / Glitch Burst',
      narrativeUse: 'Global broadcast, data exfiltration, climax transitions, white flash beats.',
      base: assetRef('Falcon_hologram_data_202603301414.mp4'),
      fallback: assetRef('OSIRIS_falcon_hologram_202603301403.mp4'),
      palette: ['#000000', '#ffffff', '#00e5ff', '#2a5cff', '#ff2d2d'],
      shaderPreset: 'glitchBurst+whiteFlash',
      shaderParams: { burstEverySec: 1.6, burstIntensity: 0.75, whiteFlash: 0.6, scanlineIntensity: 0.25, noise: 0.2 },
      particlePreset: 'fragmentShards',
      particleParams: { count: 260, sizePx: [1, 6], speed: 0.28, opacity: [0.02, 0.22] },
    },
    {
      effectId: 'FX-08-SOLEMN-DUST',
      label: 'Solemn / Desaturated Dust',
      narrativeUse: 'Tragedy, sacrifice, “AI fails to understand love”, Karbala, grief.',
      base: assetRef('Neural_network_forms_202603301407.mp4'),
      fallback: assetRef('Slow_orbit_osiris_falcon_hologram_floating_i.gif'),
      palette: ['#0b0b0d', '#8a8a8f', '#d4af37', '#3b3b43', '#ffffff'],
      shaderPreset: 'desaturate+filmGrain+slowZoom',
      shaderParams: { desat: 0.82, grain: 0.18, vignette: 0.62, zoom: 1.06, zoomSec: 18 },
      particlePreset: 'dust',
      particleParams: { count: 220, sizePx: [0.8, 2.4], speed: 0.08, opacity: [0.02, 0.16] },
    },
  ]

  const technicalNotes = {
    aspect: {
      primary: '16:9',
      scaling: 'Cover (object-fit: cover / UV crop), preserve center-safe region (0.15 margin).',
    },
    fpsPolicy: {
      preferred: 24,
      allow: [12, 15, 24, 30],
      syncToleranceMs: 50,
    },
    codecs: { mp4: ['H.264 (avc1)'], gif: ['GIF89a'] },
    colorSpacePolicy: {
      note: 'No explicit MP4 colr box detected; treat as BT.709/sRGB display pipeline with clamp + gamma.',
    },
    bandwidthFallback: {
      preferGifWhen: 'saveData=true OR effectiveType in [slow-2g,2g] OR downlink < 1.5Mbps',
      useCssFallbackWhen: 'video/gif decode fails OR memory pressure',
    },
  }

  return { compositions, technicalNotes }
}

const registryPath = process.argv[2]
const assetSpecsPath = process.argv[3]
if (!registryPath || !assetSpecsPath) {
  console.error('Usage: node scripts/buildOsirisEffectMapping.mjs <analysis/osiris_mentions_registry.json> <dir/_asset_specs.json>')
  process.exit(1)
}

const registry = readJson(path.resolve(registryPath))
const assetSpecs = readJson(path.resolve(assetSpecsPath))

const { compositions, technicalNotes } = buildCompositions(assetSpecs)
const compById = new Map(compositions.map((c) => [c.effectId, c]))

const mappingRows = registry.rows.map((r) => {
  const effectId = chooseEffectId(r)
  const c = compById.get(effectId)
  return {
    mentionId: r.mentionId,
    source: r.source,
    line: r.line,
    timestampStart: r.timestampStart || '',
    timestampEnd: r.timestampEnd || '',
    speaker: r.speaker || '',
    part: r.part || '',
    chapter: r.chapter || '',
    scene: r.scene || '',
    emotionalTone: r.emotionalTone || '',
    narrativeFunction: r.narrativeFunction || '',
    text: r.text || '',
    effectId,
    effectLabel: c?.label || '',
    baseAsset: c?.base?.relativePath || '',
    fallbackAsset: c?.fallback?.relativePath || '',
    baseW: c?.base?.width ?? '',
    baseH: c?.base?.height ?? '',
    baseFps: c?.base?.fps ?? '',
    baseCodec: c?.base?.codec ?? '',
    palette: (c?.palette || []).join('|'),
    shaderPreset: c?.shaderPreset || '',
    shaderParams: c ? JSON.stringify(c.shaderParams) : '',
    particlePreset: c?.particlePreset || '',
    particleParams: c ? JSON.stringify(c.particleParams) : '',
    gpuBudgetMB: 128,
    syncToleranceMs: 50,
    centerSafePct: pct(15),
  }
})

const outDir = path.resolve(path.dirname(path.resolve(registryPath)))
fs.mkdirSync(outDir, { recursive: true })

const compositionsOut = path.join(outDir, 'osiris_effect_compositions.json')
const mappingCsvOut = path.join(outDir, 'osiris_master_mapping.csv')

fs.writeFileSync(compositionsOut, JSON.stringify({ generatedAt: new Date().toISOString(), technicalNotes, compositions }, null, 2))
writeCsv(mappingCsvOut, mappingRows, [
  'mentionId',
  'source',
  'line',
  'timestampStart',
  'timestampEnd',
  'speaker',
  'part',
  'chapter',
  'scene',
  'emotionalTone',
  'narrativeFunction',
  'text',
  'effectId',
  'effectLabel',
  'baseAsset',
  'fallbackAsset',
  'baseW',
  'baseH',
  'baseFps',
  'baseCodec',
  'palette',
  'shaderPreset',
  'shaderParams',
  'particlePreset',
  'particleParams',
  'gpuBudgetMB',
  'syncToleranceMs',
  'centerSafePct',
])

process.stdout.write(
  JSON.stringify(
    {
      ok: true,
      compositionsOut,
      mappingCsvOut,
      rows: mappingRows.length,
      compositions: compositions.length,
      coverage: `${Math.round((mappingRows.filter((r) => r.effectId).length / Math.max(1, mappingRows.length)) * 1000) / 10}%`,
    },
    null,
    2,
  ) + '\n',
)
