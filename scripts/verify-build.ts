/**
 * Build Verification Script
 * 
 * Validates the build output before deployment.
 * Checks: asset manifest, critical files, asset presence.
 * 
 * @see project_history/02_architecture_asset_plan.md — Section 1.4
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist', 'public');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

interface VerificationResult {
  passed: boolean;
  checks: CheckResult[];
}

interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

async function checkFileExists(filePath: string, description: string): Promise<CheckResult> {
  try {
    await fs.access(filePath);
    return { name: description, passed: true, message: `Found: ${path.relative(PROJECT_ROOT, filePath)}` };
  } catch {
    return { name: description, passed: false, message: `Missing: ${path.relative(PROJECT_ROOT, filePath)}` };
  }
}

async function checkAssetManifest(): Promise<CheckResult> {
  const manifestPath = path.join(DIST_DIR, 'asset-manifest.json');
  
  try {
    const content = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    
    if (!manifest.assets || Object.keys(manifest.assets).length === 0) {
      return { name: 'Asset Manifest', passed: false, message: 'Manifest has no assets' };
    }
    
    return { 
      name: 'Asset Manifest', 
      passed: true, 
      message: `Valid: ${Object.keys(manifest.assets).length} assets` 
    };
  } catch (error) {
    return { name: 'Asset Manifest', passed: false, message: `Invalid: ${error}` };
  }
}

async function checkAssetsPresent(): Promise<CheckResult> {
  try {
    const manifestPath = path.join(DIST_DIR, 'asset-manifest.json');
    const content = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    
    let missing = 0;
    let present = 0;
    
    for (const [key, asset] of Object.entries(manifest.assets)) {
      // Check both possible locations: dist/public/assets (for Vite assets) and dist/assets (for copied assets)
      const publicAssetPath = path.join(DIST_DIR, (asset as any).publicPath);
      // For copied assets, preserve the full path structure after /assets/
      const assetPathParts = (asset as any).publicPath.split('/').filter((p: string) => p !== 'assets');
      // Remove 'ui' from path since assets are directly in categories (characters, images, etc.)
      const filteredPathParts = assetPathParts.filter((p: string) => p !== 'ui');
      const altAssetPath = path.resolve(PROJECT_ROOT, 'dist', 'assets', ...filteredPathParts);
      
      let found = false;
      try {
        await fs.access(publicAssetPath);
        found = true;
      } catch {
        try {
          await fs.access(altAssetPath);
          found = true;
        } catch {
          // Neither location has the file
        }
      }
      
      if (found) {
        present++;
      } else {
        missing++;
      }
    }
    
    if (missing > 0) {
      return { 
        name: 'Assets Present', 
        passed: false, 
        message: `${missing} missing, ${present} present` 
      };
    }
    
    return { 
      name: 'Assets Present', 
      passed: true, 
      message: `All ${present} assets present` 
    };
  } catch {
    return { name: 'Assets Present', passed: false, message: 'Failed to check' };
  }
}

async function runVerification(): Promise<VerificationResult> {
  console.log('🔍 Verifying build...\n');
  
  const checks: CheckResult[] = [];
  
  // Check critical files
  checks.push(await checkFileExists(path.join(DIST_DIR, 'index.html'), 'index.html'));
  checks.push(await checkFileExists(path.join(DIST_DIR, 'asset-manifest.json'), 'asset-manifest.json'));
  
  // Check asset manifest validity
  checks.push(await checkAssetManifest());
  
  // Check assets are present
  checks.push(await checkAssetsPresent());
  
  // Summary
  const passed = checks.every(c => c.passed);
  
  console.log('Verification Results:');
  console.log('=====================\n');
  
  for (const check of checks) {
    const icon = check.passed ? '✅' : '❌';
    console.log(`${icon} ${check.name}`);
    console.log(`   ${check.message}\n`);
  }
  
  const passedCount = checks.filter(c => c.passed).length;
  console.log(`\n${passedCount}/${checks.length} checks passed`);
  
  return { passed, checks };
}

async function main(): Promise<void> {
  const result = await runVerification();
  
  if (!result.passed) {
    console.error('\n❌ Build verification failed');
    process.exit(1);
  }
  
  console.log('\n✅ Build verification passed');
  process.exit(0);
}

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
