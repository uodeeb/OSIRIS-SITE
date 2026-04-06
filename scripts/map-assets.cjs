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
  
  try {
    // Read asset manifest
    const manifestPath = 'public/asset-manifest.json';
    if (!fs.existsSync(manifestPath)) {
      console.warn('⚠️ Asset manifest not found, skipping asset mapping');
      return;
    }
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const assets = manifest.assets || {};
    
    console.log(`📋 Found ${Object.keys(assets).length} assets in manifest`);
    
    let copiedCount = 0;
    let skippedCount = 0;
    
    // Process each asset
    Object.values(assets).forEach(asset => {
      const { localPath, publicPath } = asset;
      
      // Convert absolute Windows path to relative path
      let sourceFile;
      if (localPath.includes(':\\')) {
        // Windows absolute path - extract relative part after drive letter
        const pathParts = localPath.split('\\');
        const mofsedonIndex = pathParts.findIndex(part => part === 'mofsedon-novel');
        if (mofsedonIndex !== -1) {
          sourceFile = pathParts.slice(mofsedonIndex + 1).join('/');
        } else {
          sourceFile = localPath.replace(/^[A-Z]:\\/i, '').replace(/\\/g, '/');
        }
      } else {
        sourceFile = localPath;
      }
      
      // Determine target path in dist/public
      const targetFile = path.join('dist/public', publicPath.replace(/^\//, ''));
      
      console.log(`Checking: ${sourceFile} → ${targetFile}`);
      
      if (fs.existsSync(sourceFile)) {
        // Ensure target directory exists
        const targetDir = path.dirname(targetFile);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        
        // Copy the file
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`✅ Copied: ${asset.key} → ${publicPath}`);
        copiedCount++;
      } else {
        console.warn(`⚠️ Source not found: ${sourceFile} (${asset.key})`);
        skippedCount++;
      }
    });
    
    console.log(`\n📊 Asset Mapping Summary:`);
    console.log(`✅ Copied: ${copiedCount} assets`);
    console.log(`⚠️ Skipped: ${skippedCount} assets (missing source files)`);
    console.log(`📁 Total assets in manifest: ${Object.keys(assets).length}`);
    
    if (copiedCount === 0) {
      console.warn('⚠️ No assets were copied. This may be expected in Vercel deployment.');
    } else {
      console.log('✅ Asset mapping completed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error during asset mapping:', error.message);
    process.exit(1);
  }
}

main();
