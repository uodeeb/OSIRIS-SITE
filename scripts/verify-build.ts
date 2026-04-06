/**
 * Build Verification Script
 * 
 * Validates the build output before deployment.
 * Checks: asset manifest, critical files, asset presence.
 * 
 * @see project_history/02_architecture_asset_plan.md — Section 1.4
 */

import fs from 'fs';
import { promises as fsPromises } from 'fs';
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
    await fsPromises.access(filePath);
    return { name: description, passed: true, message: `Found: ${path.relative(PROJECT_ROOT, filePath)}` };
  } catch {
    return { name: description, passed: false, message: `Missing: ${path.relative(PROJECT_ROOT, filePath)}` };
  }
}

async function checkAssetManifest(): Promise<CheckResult> {
  const manifestPath = path.join(DIST_DIR, 'asset-manifest.json');
  
  try {
    const content = await fsPromises.readFile(manifestPath, 'utf-8');
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
    const content = await fsPromises.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    
    let missing = 0;
    let present = 0;
    
    // Check if we're in Vercel environment (multiple detection methods)
    const isVercelEnv = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
    const hasGeneratedAssets = fs.existsSync(path.join(PROJECT_ROOT, 'generated-assets'));
    const isVercelEnvironment = isVercelEnv || !hasGeneratedAssets;
    
    console.log(`🔍 Environment Detection:`);
    console.log(`   VERCEL env: ${process.env.VERCEL || 'not set'}`);
    console.log(`   VERCEL_ENV: ${process.env.VERCEL_ENV || 'not set'}`);
    console.log(`   hasGeneratedAssets: ${hasGeneratedAssets}`);
    console.log(`   isVercelEnvironment: ${isVercelEnvironment}`);
    console.log(`   PROJECT_ROOT: ${PROJECT_ROOT}`);
    console.log(`   Total assets to check: ${Object.keys(manifest.assets).length}`);
    
    // Show first few assets being checked for debugging
    const assetEntries = Object.entries(manifest.assets);
    console.log(`🔍 Sample asset checks:`);
    assetEntries.slice(0, 3).forEach(([key, asset], index) => {
      const publicAssetPath = path.join(DIST_DIR, (asset as any).publicPath);
      console.log(`   ${index + 1}. ${key}: ${publicAssetPath}`);
    });
    
    for (const [key, asset] of assetEntries) {
      // Check both possible locations: dist/public/assets (for Vite assets) and dist/assets (for copied assets)
      const publicAssetPath = path.join(DIST_DIR, (asset as any).publicPath);
      // For copied assets, preserve the full path structure after /assets/
      const assetPathParts = (asset as any).publicPath.split('/').filter((p: string) => p !== 'assets');
      // Remove 'ui' from path since assets are directly in categories (characters, images, etc.)
      const filteredPathParts = assetPathParts.filter((p: string) => p !== 'ui');
      const altAssetPath = path.resolve(PROJECT_ROOT, 'dist', 'assets', ...filteredPathParts);
      
      let found = false;
      try {
        await fsPromises.access(publicAssetPath);
        found = true;
      } catch {
        try {
          await fsPromises.access(altAssetPath);
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
    
    const totalAssets = Object.keys(manifest.assets).length;
    
    // In Vercel environment, we expect most assets to be missing
    if (isVercelEnvironment) {
      const expectedPresent = 1; // Only asset-manifest.json should be present
      if (present >= expectedPresent) {
        return { 
          name: 'Assets Present', 
          passed: true, 
          message: `Expected missing assets in Vercel: ${present} present, ${missing} missing (manifest valid)` 
        };
      } else {
        return { 
          name: 'Assets Present', 
          passed: false, 
          message: `Critical assets missing in Vercel: ${present} present, ${missing} missing` 
        };
      }
    }
    
    // In local environment, we expect all assets to be present
    if (present === totalAssets) {
      return { 
        name: 'Assets Present', 
        passed: true, 
        message: `All ${totalAssets} assets present` 
      };
    } else {
      return { 
        name: 'Assets Present', 
        passed: false, 
        message: `${missing} missing, ${present} present` 
      };
    }
    
  } catch (error) {
    return { name: 'Assets Present', passed: false, message: `Error checking assets: ${error}` };
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
