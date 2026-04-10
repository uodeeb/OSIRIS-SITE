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
    
    // Process each asset - copy from public/assets to dist/public/assets
    Object.values(assets).forEach(asset => {
      const { key, path: assetPath } = asset;
      
      // The asset path is like /assets/characters/xxx.jpg
      // Check if it exists in public/assets (normalized names)
      const sourceFile = path.join('public/assets', assetPath.replace(/^\/assets\//, ''));
      
      // Determine target path in dist/public
      const targetFile = path.join('dist/public', assetPath.replace(/^\//, ''));
      
      if (fs.existsSync(sourceFile)) {
        // Ensure target directory exists
        const targetDir = path.dirname(targetFile);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        
        // Copy the file
        fs.copyFileSync(sourceFile, targetFile);
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
    
    if (copiedCount === 0) {
      console.error('❌ No assets were copied! Build will have 404 errors.');
      process.exit(1);
    } else {
      console.log('✅ Asset mapping completed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error during asset mapping:', error.message);
    process.exit(1);
  }
}

main();
