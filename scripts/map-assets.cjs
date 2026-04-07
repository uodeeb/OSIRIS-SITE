#!/usr/bin/env node
/**
 * Asset Mapping Script - Maps generated-assets to proper asset structure
 * 
 * Reads asset-manifest.json and copies assets to correct locations
 * for both local development and Vercel deployment
 */

const fs = require('fs');
const path = require('path');

function main() {
  console.log('🚀 Starting asset mapping for build...');
  console.log('📁 Working directory:', process.cwd());
  
  try {
    // Read asset manifest
    const manifestPath = 'public/asset-manifest.json';
    console.log('📋 Looking for manifest at:', manifestPath);
    
    if (!fs.existsSync(manifestPath)) {
      console.warn('⚠️ Asset manifest not found, skipping asset mapping');
      return;
    }
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const assets = manifest.assets || {};
    
    console.log(`📋 Found ${Object.keys(assets).length} assets in manifest`);
    
    let copiedCount = 0;
    let skippedCount = 0;
    
    // Check if we're in Vercel environment (no generated-assets directory)
    const isVercelEnvironment = !fs.existsSync('generated-assets');
    if (isVercelEnvironment) {
      console.log('🌐 Detected Vercel environment - generated-assets not present');
    }
    
    // Process each asset - assets are already in public/assets by build-assets.ts
    // This script verifies they're present
    Object.values(assets).forEach(asset => {
      const { key, path: assetPath } = asset;
      
      // The asset path is like /assets/characters/xxx.jpg
      // Check if it exists in public/
      const sourceFile = path.join('public', assetPath.replace(/^\//, ''));
      
      // Determine target path in dist/public
      const targetFile = path.join('dist/public', assetPath.replace(/^\//, ''));
      
      console.log(`🔍 Checking: ${sourceFile} → ${targetFile}`);
      
      if (fs.existsSync(sourceFile)) {
        // Ensure target directory exists
        const targetDir = path.dirname(targetFile);
        if (!fs.existsSync(targetDir)) {
          console.log(`📁 Creating directory: ${targetDir}`);
          fs.mkdirSync(targetDir, { recursive: true });
        }
        
        // Copy the file
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`✅ Copied: ${key} → ${assetPath}`);
        copiedCount++;
      } else {
        console.warn(`⚠️ Source not found: ${sourceFile} (${key})`);
        skippedCount++;
      }
    });
    
    console.log(`\n📊 Asset Mapping Summary:`);
    console.log(`✅ Copied: ${copiedCount} assets`);
    console.log(`⚠️ Skipped: ${skippedCount} assets (missing source files)`);
    console.log(`📁 Total assets in manifest: ${Object.keys(assets).length}`);
    
    // List what's actually in dist/public/assets
    const assetsDir = 'dist/public/assets';
    if (fs.existsSync(assetsDir)) {
      console.log(`\n📁 Contents of ${assetsDir}:`);
      function listDir(dir, prefix = '') {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          if (stat.isDirectory()) {
            console.log(`${prefix}📁 ${item}/`);
            listDir(itemPath, prefix + '  ');
          } else {
            console.log(`${prefix}📄 ${item} (${stat.size} bytes)`);
          }
        });
      }
      listDir(assetsDir);
    }
    
    if (isVercelEnvironment) {
      console.log(`\n🌐 Vercel Environment Notes:`);
      console.log(`⚠️ Assets not copied due to missing generated-assets (expected in Vercel)`);
      console.log(`📋 Verification will be updated to expect missing assets in Vercel`);
      console.log(`✅ Asset mapping completed (graceful handling for Vercel)`);
    } else if (copiedCount === 0) {
      console.warn('⚠️ No assets were copied. This may be expected in Vercel deployment.');
    } else {
      console.log('✅ Asset mapping completed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error during asset mapping:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

main();
