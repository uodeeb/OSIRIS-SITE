import fs from 'node:fs'
import path from 'node:path'

function u32(buf, o) {
  return buf.readUInt32BE(o)
}

function u64(buf, o) {
  const hi = buf.readUInt32BE(o)
  const lo = buf.readUInt32BE(o + 4)
  return hi * 2 ** 32 + lo
}

function str4(buf, o) {
  return buf.subarray(o, o + 4).toString('ascii')
}

function fixed16_16ToFloat(n) {
  const i = (n >>> 16) & 0xffff
  const f = n & 0xffff
  return i + f / 65536
}

function clamp01(x) {
  if (x < 0) return 0
  if (x > 1) return 1
  return x
}

function parseBoxes(buf, start = 0, end = buf.length) {
  const boxes = []
  let o = start
  while (o + 8 <= end) {
    let size = u32(buf, o)
    const type = str4(buf, o + 4)
    let header = 8
    if (size === 1) {
      if (o + 16 > end) break
      size = u64(buf, o + 8)
      header = 16
    } else if (size === 0) {
      size = end - o
    }
    if (size < header || o + size > end) break
    const box = {
      type,
      start: o,
      size,
      header,
      dataStart: o + header,
      dataEnd: o + size,
    }
    boxes.push(box)
    o += size
  }
  return boxes
}

const CONTAINER_TYPES = new Set([
  'moov',
  'trak',
  'mdia',
  'minf',
  'stbl',
  'edts',
  'udta',
  'meta',
  'ilst',
  'dinf',
  'mvex',
  'moof',
  'traf',
  'mfra',
])

function walkBoxes(buf, box, visit) {
  visit(box)
  if (!CONTAINER_TYPES.has(box.type)) return
  let childStart = box.dataStart
  if (box.type === 'meta') childStart += 4
  const kids = parseBoxes(buf, childStart, box.dataEnd)
  for (const k of kids) walkBoxes(buf, k, visit)
}

function findFirstBox(buf, parent, type) {
  const boxes = parseBoxes(buf, parent.dataStart, parent.dataEnd)
  return boxes.find((b) => b.type === type) || null
}

function findBoxes(buf, parent, type) {
  return parseBoxes(buf, parent.dataStart, parent.dataEnd).filter((b) => b.type === type)
}

function parseHdlr(buf, hdlrBox) {
  const o = hdlrBox.dataStart
  if (o + 24 > hdlrBox.dataEnd) return null
  const handlerType = str4(buf, o + 8)
  return { handlerType }
}

function parseMdhd(buf, mdhdBox) {
  const o = mdhdBox.dataStart
  if (o + 4 > mdhdBox.dataEnd) return null
  const version = buf.readUInt8(o)
  if (version === 1) {
    if (o + 32 > mdhdBox.dataEnd) return null
    const timescale = u32(buf, o + 20)
    const duration = u64(buf, o + 24)
    return { timescale, duration }
  }
  if (o + 24 > mdhdBox.dataEnd) return null
  const timescale = u32(buf, o + 12)
  const duration = u32(buf, o + 16)
  return { timescale, duration }
}

function parseTkhd(buf, tkhdBox) {
  const o = tkhdBox.dataStart
  if (o + 4 > tkhdBox.dataEnd) return null
  const version = buf.readUInt8(o)
  if (version === 1) {
    if (o + 100 > tkhdBox.dataEnd) return null
    const widthFixed = u32(buf, o + 92)
    const heightFixed = u32(buf, o + 96)
    return {
      width: fixed16_16ToFloat(widthFixed),
      height: fixed16_16ToFloat(heightFixed),
    }
  }
  if (o + 84 > tkhdBox.dataEnd) return null
  const widthFixed = u32(buf, o + 76)
  const heightFixed = u32(buf, o + 80)
  return {
    width: fixed16_16ToFloat(widthFixed),
    height: fixed16_16ToFloat(heightFixed),
  }
}

function parseStts(buf, sttsBox) {
  const o = sttsBox.dataStart
  if (o + 8 > sttsBox.dataEnd) return null
  const entryCount = u32(buf, o + 4)
  let off = o + 8
  let sampleCount = 0
  let totalDelta = 0
  for (let i = 0; i < entryCount; i++) {
    if (off + 8 > sttsBox.dataEnd) break
    const count = u32(buf, off)
    const delta = u32(buf, off + 4)
    sampleCount += count
    totalDelta += count * delta
    off += 8
  }
  return { sampleCount, totalDelta }
}

function parseStsdCodecAndColor(buf, stsdBox) {
  const o = stsdBox.dataStart
  if (o + 8 > stsdBox.dataEnd) return null
  const entryCount = u32(buf, o + 4)
  if (entryCount < 1) return null
  let off = o + 8
  if (off + 8 > stsdBox.dataEnd) return null
  const entrySize = u32(buf, off)
  const codec = str4(buf, off + 4)
  const entryStart = off
  const entryEnd = Math.min(off + entrySize, stsdBox.dataEnd)
  let colr = null
  let pasp = null
  const children = parseBoxes(buf, entryStart + 8, entryEnd)
  for (const b of children) {
    if (b.type === 'colr') {
      colr = parseColr(buf, b)
    } else if (b.type === 'pasp') {
      pasp = parsePasp(buf, b)
    }
  }
  return { codec, colr, pasp }
}

function parseColr(buf, colrBox) {
  const o = colrBox.dataStart
  if (o + 4 > colrBox.dataEnd) return null
  const kind = str4(buf, o)
  if (kind === 'nclx') {
    if (o + 11 > colrBox.dataEnd) return null
    const primaries = buf.readUInt16BE(o + 4)
    const transfer = buf.readUInt16BE(o + 6)
    const matrix = buf.readUInt16BE(o + 8)
    const rangeByte = buf.readUInt8(o + 10)
    const fullRange = (rangeByte & 0x80) !== 0
    return { kind, primaries, transfer, matrix, fullRange }
  }
  if (kind === 'nclc') {
    if (o + 10 > colrBox.dataEnd) return null
    const primaries = buf.readUInt16BE(o + 4)
    const transfer = buf.readUInt16BE(o + 6)
    const matrix = buf.readUInt16BE(o + 8)
    return { kind, primaries, transfer, matrix }
  }
  return { kind }
}

function parsePasp(buf, paspBox) {
  const o = paspBox.dataStart
  if (o + 8 > paspBox.dataEnd) return null
  const hSpacing = u32(buf, o)
  const vSpacing = u32(buf, o + 4)
  return { hSpacing, vSpacing }
}

function mapNclxPrimaries(v) {
  const m = {
    1: 'BT.709',
    5: 'BT.601 PAL',
    6: 'BT.601 NTSC',
    9: 'BT.2020',
    12: 'DCI-P3',
    22: 'EBU Tech 3213-E',
  }
  return m[v] || `Unknown(${v})`
}

function mapNclxTransfer(v) {
  const m = {
    1: 'BT.709',
    13: 'sRGB',
    16: 'PQ (ST 2084)',
    18: 'HLG',
  }
  return m[v] || `Unknown(${v})`
}

function mapNclxMatrix(v) {
  const m = {
    1: 'BT.709',
    5: 'BT.601',
    9: 'BT.2020 NCL',
  }
  return m[v] || `Unknown(${v})`
}

function summarizeColor(colr) {
  if (!colr) return null
  if (colr.kind === 'nclx' || colr.kind === 'nclc') {
    return {
      kind: colr.kind,
      primaries: mapNclxPrimaries(colr.primaries),
      transfer: mapNclxTransfer(colr.transfer),
      matrix: mapNclxMatrix(colr.matrix),
      fullRange: 'fullRange' in colr ? colr.fullRange : null,
      raw: colr,
    }
  }
  return { kind: colr.kind, raw: colr }
}

function parseMp4Specs(filePath) {
  const buf = fs.readFileSync(filePath)
  const root = { type: 'root', dataStart: 0, dataEnd: buf.length }
  const top = parseBoxes(buf, 0, buf.length)
  const moov = top.find((b) => b.type === 'moov')
  if (!moov) return { ok: false, reason: 'missing moov' }

  const traks = findBoxes(buf, moov, 'trak')
  const tracks = []
  for (const trak of traks) {
    const mdia = findFirstBox(buf, trak, 'mdia')
    if (!mdia) continue
    const hdlr = findFirstBox(buf, mdia, 'hdlr')
    const mdhd = findFirstBox(buf, mdia, 'mdhd')
    const handler = hdlr ? parseHdlr(buf, hdlr) : null
    const time = mdhd ? parseMdhd(buf, mdhd) : null

    const tkhd = findFirstBox(buf, trak, 'tkhd')
    const geom = tkhd ? parseTkhd(buf, tkhd) : null

    let stts = null
    let stsd = null
    const minf = mdia ? findFirstBox(buf, mdia, 'minf') : null
    const stbl = minf ? findFirstBox(buf, minf, 'stbl') : null
    if (stbl) {
      const sttsBox = findFirstBox(buf, stbl, 'stts')
      const stsdBox = findFirstBox(buf, stbl, 'stsd')
      stts = sttsBox ? parseStts(buf, sttsBox) : null
      stsd = stsdBox ? parseStsdCodecAndColor(buf, stsdBox) : null
    }

    const isVideo = handler?.handlerType === 'vide'
    let fps = null
    let durationSec = null
    if (time?.timescale && time?.duration != null) {
      durationSec = time.duration / time.timescale
    }
    if (isVideo && time?.timescale && stts?.totalDelta && stts?.sampleCount) {
      const sttsDurationSec = stts.totalDelta / time.timescale
      if (sttsDurationSec > 0) fps = stts.sampleCount / sttsDurationSec
    }

    tracks.push({
      handlerType: handler?.handlerType || null,
      width: geom?.width ?? null,
      height: geom?.height ?? null,
      timescale: time?.timescale ?? null,
      duration: time?.duration ?? null,
      durationSec,
      sampleCount: stts?.sampleCount ?? null,
      fps: fps != null ? Math.round(fps * 1000) / 1000 : null,
      codec: stsd?.codec ?? null,
      pixelAspect: stsd?.pasp ?? null,
      color: summarizeColor(stsd?.colr ?? null),
    })
  }

  const video = tracks.find((t) => t.handlerType === 'vide') || null
  const audio = tracks.find((t) => t.handlerType === 'soun') || null

  return {
    ok: true,
    container: 'mp4',
    video,
    audio,
    tracks,
  }
}

function parseGifSpecs(filePath) {
  const buf = fs.readFileSync(filePath)
  if (buf.length < 13) return { ok: false, reason: 'too small' }
  const signature = buf.subarray(0, 6).toString('ascii')
  if (signature !== 'GIF87a' && signature !== 'GIF89a') return { ok: false, reason: 'not gif' }
  const width = buf.readUInt16LE(6)
  const height = buf.readUInt16LE(8)
  let o = 13
  const packed = buf.readUInt8(10)
  const hasGct = (packed & 0x80) !== 0
  const gctSize = hasGct ? 3 * 2 ** ((packed & 0x07) + 1) : 0
  o += gctSize

  let frameCount = 0
  let delays = []
  let loopCount = null
  let lastDelay = null
  while (o < buf.length) {
    const b = buf.readUInt8(o)
    if (b === 0x3b) break
    if (b === 0x21) {
      const label = buf.readUInt8(o + 1)
      if (label === 0xf9) {
        const blockSize = buf.readUInt8(o + 2)
        if (blockSize >= 4 && o + 2 + 1 + blockSize < buf.length) {
          const delay = buf.readUInt16LE(o + 4)
          lastDelay = delay
        }
        o += 2
      }
      o += 2
      while (o < buf.length) {
        const sz = buf.readUInt8(o)
        o += 1
        if (sz === 0) break
        if (label === 0xff && sz >= 11) {
          const app = buf.subarray(o, o + 11).toString('ascii')
          if (app.startsWith('NETSCAPE')) {
            const subBlockSize = buf.readUInt8(o + 11)
            if (subBlockSize >= 3 && o + 11 + 1 + subBlockSize <= buf.length) {
              const loops = buf.readUInt16LE(o + 14)
              loopCount = loops
            }
          }
        }
        o += sz
      }
      continue
    }
    if (b === 0x2c) {
      frameCount += 1
      if (lastDelay != null) delays.push(lastDelay)
      lastDelay = null
      if (o + 10 > buf.length) break
      const packedLocal = buf.readUInt8(o + 9)
      o += 10
      const hasLct = (packedLocal & 0x80) !== 0
      const lctSize = hasLct ? 3 * 2 ** ((packedLocal & 0x07) + 1) : 0
      o += lctSize
      o += 1
      while (o < buf.length) {
        const sz = buf.readUInt8(o)
        o += 1
        if (sz === 0) break
        o += sz
      }
      continue
    }
    o += 1
  }

  const avgDelay = delays.length ? delays.reduce((a, b) => a + b, 0) / delays.length : null
  const fps = avgDelay && avgDelay > 0 ? 100 / avgDelay : null

  let durationSec = null
  if (delays.length) {
    const totalDelay = delays.reduce((a, b) => a + b, 0)
    durationSec = totalDelay / 100
  }

  return {
    ok: true,
    container: 'gif',
    signature,
    width,
    height,
    frameCount,
    loopCount,
    avgFrameDelayCs: avgDelay != null ? Math.round(avgDelay * 1000) / 1000 : null,
    fps: fps != null ? Math.round(fps * 1000) / 1000 : null,
    durationSec,
  }
}

function inferCreativeTags(fileName) {
  const n = fileName.toLowerCase()
  const tags = []
  if (n.includes('falcon')) tags.push('falcon')
  if (n.includes('hologram')) tags.push('hologram')
  if (n.includes('data')) tags.push('data')
  if (n.includes('neural') || n.includes('network')) tags.push('neural')
  if (n.includes('logo')) tags.push('logo')
  if (n.includes('eye')) tags.push('eye')
  if (n.includes('orbit')) tags.push('orbit')
  if (n.includes('slow')) tags.push('slow')
  if (n.includes('medium')) tags.push('medium')
  return tags
}

function buildAssetSpecs(dirPath) {
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => !f.startsWith('.') && !f.startsWith('_asset_specs.'))
  const out = []
  for (const name of files) {
    const fullPath = path.join(dirPath, name)
    const st = fs.statSync(fullPath)
    if (!st.isFile()) continue
    const ext = path.extname(name).toLowerCase()
    let media = null
    if (ext === '.mp4') media = parseMp4Specs(fullPath)
    else if (ext === '.gif') media = parseGifSpecs(fullPath)
    out.push({
      name,
      relativePath: path.relative(process.cwd(), fullPath).replaceAll('\\', '/'),
      bytes: st.size,
      ext,
      creativeTags: inferCreativeTags(name),
      media,
    })
  }
  out.sort((a, b) => a.name.localeCompare(b.name))
  return out
}

function toCsvRow(v) {
  const s = String(v ?? '')
  if (s.includes('"') || s.includes(',') || s.includes('\n')) return `"${s.replaceAll('"', '""')}"`
  return s
}

function writeCsv(filePath, rows) {
  const header = [
    'name',
    'ext',
    'bytes',
    'container',
    'width',
    'height',
    'fps',
    'durationSec',
    'codec',
    'colorPrimaries',
    'colorTransfer',
    'colorMatrix',
    'fullRange',
    'relativePath',
    'creativeTags',
  ]
  const lines = [header.map(toCsvRow).join(',')]
  for (const r of rows) {
    const media = r.media?.ok ? r.media : null
    const video = media?.container === 'mp4' ? media.video : null
    const gif = media?.container === 'gif' ? media : null
    const color = video?.color
    lines.push(
      [
        r.name,
        r.ext,
        r.bytes,
        media?.container ?? '',
        (video?.width ?? gif?.width) ?? '',
        (video?.height ?? gif?.height) ?? '',
        (video?.fps ?? gif?.fps) ?? '',
        (video?.durationSec ?? gif?.durationSec) ?? '',
        video?.codec ?? '',
        color?.primaries ?? '',
        color?.transfer ?? '',
        color?.matrix ?? '',
        color?.fullRange ?? '',
        r.relativePath,
        r.creativeTags.join('|'),
      ].map(toCsvRow).join(','),
    )
  }
  fs.writeFileSync(filePath, lines.join('\n'))
}

const dirArg = process.argv[2]
if (!dirArg) {
  console.error('Usage: node scripts/extractGeneratedVideoBgSpecs.mjs <dir>')
  process.exit(1)
}

const dirPath = path.resolve(dirArg)
const specs = buildAssetSpecs(dirPath)

const jsonOut = path.join(dirPath, '_asset_specs.json')
const csvOut = path.join(dirPath, '_asset_specs.csv')

fs.writeFileSync(jsonOut, JSON.stringify({ generatedAt: new Date().toISOString(), cwd: process.cwd(), dirPath, assets: specs }, null, 2))
writeCsv(csvOut, specs)

process.stdout.write(JSON.stringify({ ok: true, jsonOut, csvOut, count: specs.length }, null, 2) + '\n')
