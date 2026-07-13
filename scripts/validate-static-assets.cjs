#!/usr/bin/env node
/**
 * Static asset validation for the current OSIRIS Vite/Vercel asset model.
 *
 * Source of truth:
 * - public/asset-manifest.json
 * - public/assets/**
 * - public/logo/** for index.html favicons
 *
 * If dist/public exists, this also verifies that build output contains the same
 * deploy-critical files Vercel serves from outputDirectory.
 */

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'public', 'asset-manifest.json');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST_PUBLIC_DIR = path.join(ROOT, 'dist', 'public');

const requiredPublicPaths = [
  '/asset-manifest.json',
  '/assets/music-tracks/track-01.mp3',
  '/assets/osiris-vid-bg/falcon-hologram.mp4',
  '/assets/images/fire-worship.jpg',
  '/logo/new-logo/favicon-black.png',
  '/logo/new-logo/favicon-black-0.25.png',
];

function relToFs(baseDir, webPath) {
  return path.join(baseDir, webPath.replace(/^\/+/, '').replace(/[\/]+/g, path.sep));
}

function exists(baseDir, webPath) {
  return fs.existsSync(relToFs(baseDir, webPath));
}

function gitTracked(webPath) {
  const rel = path.join('public', webPath.replace(/^\/+/, '')).replace(/[\\]+/g, '/');
  try {
    childProcess.execFileSync('git', ['ls-files', '--error-unmatch', rel], {
      cwd: ROOT,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function main() {
  const errors = [];
  const warnings = [];

  console.log('Static asset validation: current public/asset-manifest model');

  if (!fs.existsSync(MANIFEST_PATH)) {
    errors.push(`Missing manifest: ${path.relative(ROOT, MANIFEST_PATH)}`);
  }

  let manifest = null;
  if (errors.length === 0) {
    try {
      manifest = readJson(MANIFEST_PATH);
      console.log('OK manifest JSON');
    } catch (error) {
      errors.push(`Invalid manifest JSON: ${error.message}`);
    }
  }

  if (manifest) {
    if (!manifest.version) errors.push('Manifest missing version');
    if (!manifest.assets || typeof manifest.assets !== 'object') errors.push('Manifest missing assets object');
    if (typeof manifest.totalAssets !== 'number') warnings.push('Manifest missing numeric totalAssets');
  }

  if (manifest?.assets) {
    const entries = Object.values(manifest.assets);
    console.log(`Checking ${entries.length} manifest assets in public/`);
    for (const asset of entries) {
      if (!asset?.key || !asset?.path) {
        errors.push(`Malformed manifest asset entry: ${JSON.stringify(asset)}`);
        continue;
      }
      if (!asset.path.startsWith('/assets/')) {
        errors.push(`Asset ${asset.key} has non-/assets path: ${asset.path}`);
        continue;
      }
      if (!exists(PUBLIC_DIR, asset.path)) {
        errors.push(`Missing public file for ${asset.key}: ${asset.path}`);
      } else if (!gitTracked(asset.path)) {
        errors.push(`Manifest asset exists locally but is not tracked for Vercel Git deploy: ${asset.key} ${asset.path}`);
      }
    }
  }

  console.log('Checking deploy-critical public paths');
  for (const webPath of requiredPublicPaths) {
    if (!exists(PUBLIC_DIR, webPath)) {
      errors.push(`Missing deploy-critical public file: ${webPath}`);
    } else if (!gitTracked(webPath)) {
      errors.push(`Deploy-critical public file exists locally but is not tracked for Vercel Git deploy: ${webPath}`);
    }
  }

  const hasDist = fs.existsSync(DIST_PUBLIC_DIR);
  if (hasDist) {
    console.log('dist/public exists; checking deploy-critical built paths');
    for (const webPath of requiredPublicPaths) {
      if (!exists(DIST_PUBLIC_DIR, webPath)) {
        errors.push(`Missing deploy-critical built file: ${webPath}`);
      }
    }
  } else {
    warnings.push('dist/public not found; run build for built-output validation');
  }

  if (!fs.existsSync(path.join(ROOT, 'client', 'src', 'lib', 'assets.ts'))) {
    errors.push('Current static asset resolver missing: client/src/lib/assets.ts');
  }

  const vercelPath = path.join(ROOT, 'vercel.json');
  if (fs.existsSync(vercelPath)) {
    try {
      const vercel = readJson(vercelPath);
      if (vercel.outputDirectory !== 'dist/public') {
        warnings.push(`Unexpected Vercel outputDirectory: ${vercel.outputDirectory || '(missing)'}`);
      }
    } catch (error) {
      errors.push(`Invalid vercel.json: ${error.message}`);
    }
  } else {
    warnings.push('vercel.json not found');
  }

  console.log('');
  console.log('Static asset validation summary');
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  for (const error of errors) console.log(`ERROR ${error}`);
  for (const warning of warnings) console.log(`WARN ${warning}`);

  if (errors.length > 0) process.exit(1);
  console.log('OK static assets are deployable');
}

main();