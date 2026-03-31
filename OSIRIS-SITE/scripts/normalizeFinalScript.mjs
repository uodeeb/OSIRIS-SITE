import fs from 'node:fs'
import path from 'node:path'

function normalize(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let prevBlank = true
  for (const raw of lines) {
    const line = raw.replace(/[ \t]+$/g, '')
    const isBlank = line.trim() === ''
    if (isBlank) {
      if (!prevBlank) out.push('')
      prevBlank = true
      continue
    }
    if (line.trim() === '---') {
      if (!prevBlank) out.push('')
      out.push('---')
      out.push('')
      prevBlank = true
      continue
    }
    if (line.startsWith('#')) {
      if (!prevBlank) out.push('')
      out.push(line)
      out.push('')
      prevBlank = true
      continue
    }
    out.push(line)
    prevBlank = false
  }
  while (out.length && out[out.length - 1] === '') out.pop()
  return out.join('\n') + '\n'
}

const scriptDir = process.argv[2]
if (!scriptDir) {
  console.error('Usage: node scripts/normalizeFinalScript.mjs <OSIRIS-SITE/script>')
  process.exit(1)
}

const dir = path.resolve(scriptDir)
const src = path.join(dir, 'OSIRIS_Final_Interactive_Script.md')
const dst = path.join(dir, 'OSIRIS_Final_Interactive_Script.kateb.md')

const md = fs.readFileSync(src, 'utf8')
const normalized = normalize(md)
fs.writeFileSync(dst, normalized)
process.stdout.write(JSON.stringify({ ok: true, src, dst, bytes: Buffer.byteLength(normalized, 'utf8') }, null, 2) + '\n')

