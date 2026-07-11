import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(new URL('../', import.meta.url).pathname.replace(/^\/(.:\/)/, '$1'));
const read = (path) => readFileSync(join(ROOT, path), 'utf8');

const canonical = JSON.parse(read('client/src/content/osirisCanonicalStory.seed.json'));
const manifest = JSON.parse(read('public/asset-manifest.json'));
const assetsSource = read('client/src/lib/assets.ts');
const mainPlayer = read('client/src/components/MainPlayer.tsx');
const mainPlayerConfig = read('client/src/lib/mainPlayerConfig.ts');

function extractAliases(source) {
  const aliases = new Map();
  const blockMatch = source.match(/const KEY_ALIASES:[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  if (!blockMatch) return aliases;
  for (const match of blockMatch[1].matchAll(/['"]([^'"]+)['"]:\s*['"]([^'"]+)['"]/g)) {
    aliases.set(match[1], match[2]);
  }
  return aliases;
}

function resolveAssetKey(key, aliases) {
  const mapped = aliases.get(key) ?? key;
  return { requested: key, mapped, entry: manifest.assets[mapped] ?? null };
}

function fileExistsForPublicPath(publicPath) {
  if (!publicPath?.startsWith('/')) return false;
  try {
    return statSync(join(ROOT, 'public', publicPath)).isFile();
  } catch {
    return false;
  }
}

function sceneFiles() {
  const dir = join(ROOT, 'client/src/lib/scenes');
  return readdirSync(dir).filter((name) => name.endsWith('.ts')).map((name) => `client/src/lib/scenes/${name}`);
}

function extractRuntimeSceneIds() {
  const ids = new Set();
  for (const file of sceneFiles()) {
    const source = read(file);
    for (const match of source.matchAll(/^\s{2}'([^']+)':\s*\{/gm)) ids.add(match[1]);
  }
  return [...ids];
}

function extractSceneLinks() {
  const links = [];
  for (const file of sceneFiles()) {
    const source = read(file);
    const sceneMatches = [...source.matchAll(/^\s{2}'([^']+)':\s*\{/gm)];
    for (let index = 0; index < sceneMatches.length; index += 1) {
      const start = sceneMatches[index].index;
      const end = sceneMatches[index + 1]?.index ?? source.length;
      const block = source.slice(start, end);
      for (const link of block.matchAll(/(?:nextSceneId|defaultNextScene):\s*['"]([^'"]+)['"]/g)) {
        links.push({ file, sceneId: sceneMatches[index][1], target: link[1], kind: link[0].split(':')[0].trim() });
      }
    }
  }
  return links;
}

function extractAssetRequests() {
  const requests = [];
  for (const file of ['client/src/lib/mainPlayerConfig.ts', 'client/src/components/MainPlayer.tsx', 'client/src/lib/assets.ts', ...sceneFiles()]) {
    const source = read(file);
    for (const match of source.matchAll(/getAsset\(['"]([^'"]+)['"]\)/g)) requests.push({ file, key: match[1], via: 'getAsset' });
    for (const match of source.matchAll(/background\(['"]([^'"]+)['"]\)/g)) requests.push({ file, key: `background.${match[1]}`, via: 'background' });
    for (const match of source.matchAll(/videoBg\(['"]([^'"]+)['"]\)/g)) requests.push({ file, key: `videoBg.${match[1]}`, via: 'videoBg' });
    for (const match of source.matchAll(/audio\(['"]([^'"]+)['"]\)/g)) requests.push({ file, key: `audio.${match[1]}`, via: 'audio' });
    for (const match of source.matchAll(/musicKey:\s*['"]([^'"]+)['"]/g)) requests.push({ file, key: match[1], via: 'musicKey' });
    for (const array of source.matchAll(/(?:ambientKeys|enterSfxKeys):\s*\[([^\]]*)\]/g)) {
      for (const key of array[1].matchAll(/['"]([^'"]+)['"]/g)) requests.push({ file, key: key[1], via: 'ambientOrSfx' });
    }
  }
  return requests;
}

function extractTimeline(source) {
  const timeline = new Map();
  const block = source.match(/SCENE_CHARACTER_TIMELINE[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) return timeline;
  for (const match of block[1].matchAll(/['"]([^'"]+)['"]:\s*['"]([^'"]+)['"]/g)) timeline.set(match[1], match[2]);
  return timeline;
}

const aliases = extractAliases(assetsSource);
const runtimeIds = extractRuntimeSceneIds();
const runtimeIdSet = new Set(runtimeIds);
const canonicalIds = canonical.scenes.map((scene) => scene.id);
const canonicalIdSet = new Set(canonicalIds);
const links = extractSceneLinks();
const assetRequests = extractAssetRequests();
const resolvedAssets = assetRequests.map((request) => ({ ...request, ...resolveAssetKey(request.key, aliases) }));
const missingAssetKeys = resolvedAssets.filter((asset) => !asset.entry);
const missingAssetFiles = resolvedAssets.filter((asset) => asset.entry && !fileExistsForPublicPath(asset.entry.path));
const timelineMain = extractTimeline(mainPlayer);
const timelineConfig = extractTimeline(mainPlayerConfig);
const timelineMismatches = [...new Set([...timelineMain.keys(), ...timelineConfig.keys()])]
  .map((sceneId) => ({ sceneId, mainPlayer: timelineMain.get(sceneId) ?? null, mainPlayerConfig: timelineConfig.get(sceneId) ?? null }))
  .filter((entry) => entry.mainPlayer !== entry.mainPlayerConfig);

const brokenRuntimeLinks = links.filter((link) => !runtimeIdSet.has(link.target));
const canonicalMissingInRuntime = canonicalIds.filter((id) => !runtimeIdSet.has(id));
const runtimeMissingInCanonical = runtimeIds.filter((id) => !canonicalIdSet.has(id));

function extractRuntimeSceneBlock(sceneId) {
  for (const file of sceneFiles()) {
    const source = read(file);
    const sceneMatches = [...source.matchAll(/^\s{2}'([^']+)':\s*\{/gm)];
    for (let index = 0; index < sceneMatches.length; index += 1) {
      if (sceneMatches[index][1] !== sceneId) continue;
      const start = sceneMatches[index].index;
      const end = sceneMatches[index + 1]?.index ?? source.length;
      return source.slice(start, end);
    }
  }
  return '';
}

const expectedSemanticWarnings = [];
for (const scene of canonical.scenes) {
  if (scene.sceneNumber === '6.1' && scene.id === 'four-4-1-desert') {
    const runtimeBlock = extractRuntimeSceneBlock(scene.id);
    if (/Ramses|ramses|\u0631\u0645\u0633\u064a\u0633|Nile|\u0627\u0644\u0646\u064a\u0644/.test(runtimeBlock)) {
      expectedSemanticWarnings.push({
        sceneId: scene.id,
        sceneNumber: scene.sceneNumber,
        issue: 'Canonical scene 6.1 maps to historical four-4-1-desert, but current runtime still contains Ramses/Nile material. This id needs semantic cleanup during migration.',
      });
    }
  }
}

const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  summary: {
    canonicalScenes: canonicalIds.length,
    runtimeScenes: runtimeIds.length,
    canonicalMissingInRuntime: canonicalMissingInRuntime.length,
    runtimeMissingInCanonical: runtimeMissingInCanonical.length,
    runtimeLinks: links.length,
    brokenRuntimeLinks: brokenRuntimeLinks.length,
    uniqueAssetRequests: new Set(assetRequests.map((request) => request.key)).size,
    missingAssetKeys: missingAssetKeys.length,
    missingAssetFiles: missingAssetFiles.length,
    characterTimelineMismatches: timelineMismatches.length,
    semanticWarnings: expectedSemanticWarnings.length,
  },
  canonicalMissingInRuntime,
  runtimeMissingInCanonical,
  brokenRuntimeLinks,
  missingAssetKeys,
  missingAssetFiles,
  characterTimelineMismatches: timelineMismatches,
  semanticWarnings: expectedSemanticWarnings,
};

const md = `# Phase 4 - Runtime audit against canonical seed\n\n## Summary\n\n- Canonical scenes: ${report.summary.canonicalScenes}\n- Runtime scenes: ${report.summary.runtimeScenes}\n- Canonical scene IDs missing in runtime: ${report.summary.canonicalMissingInRuntime}\n- Runtime scene IDs missing in canonical seed: ${report.summary.runtimeMissingInCanonical}\n- Broken runtime links: ${report.summary.brokenRuntimeLinks}\n- Missing asset keys: ${report.summary.missingAssetKeys}\n- Missing asset files: ${report.summary.missingAssetFiles}\n- Character timeline mismatches: ${report.summary.characterTimelineMismatches}\n- Semantic warnings: ${report.summary.semanticWarnings}\n\n## Canonical IDs missing in runtime\n\n${canonicalMissingInRuntime.map((id) => `- ${id}`).join('\n') || 'None'}\n\n## Runtime IDs missing in canonical seed\n\n${runtimeMissingInCanonical.map((id) => `- ${id}`).join('\n') || 'None'}\n\n## Broken runtime links\n\n${brokenRuntimeLinks.map((link) => `- ${link.sceneId} -> ${link.target} (${link.file})`).join('\n') || 'None'}\n\n## Character timeline mismatches\n\n${timelineMismatches.map((entry) => `- ${entry.sceneId}: MainPlayer=${entry.mainPlayer ?? 'missing'}, mainPlayerConfig=${entry.mainPlayerConfig ?? 'missing'}`).join('\n') || 'None'}\n\n## Missing asset keys\n\n${missingAssetKeys.map((asset) => `- ${asset.key} -> ${asset.mapped} (${asset.file})`).join('\n') || 'None'}\n\n## Missing asset files\n\n${missingAssetFiles.map((asset) => `- ${asset.key} -> ${asset.entry.path} (${asset.file})`).join('\n') || 'None'}\n\n## Semantic warnings\n\n${expectedSemanticWarnings.map((warning) => `- ${warning.sceneId}: ${warning.issue}`).join('\n') || 'None'}\n`;

writeFileSync(join(ROOT, 'docs/phase4-runtime-audit.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(join(ROOT, 'docs/PHASE4_RUNTIME_AUDIT.md'), md, 'utf8');
process.stdout.write(`${JSON.stringify(report.summary, null, 2)}\n`);