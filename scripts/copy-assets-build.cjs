#!/usr/bin/env node
/**
 * Build Asset Copy Script - Phase 1 Migration
 * 
 * Copies generated-assets to dist/public for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

const sourceDir = 'generated-assets';
const targetDir = 'dist/public/generated-assets';

function copyDirectory(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read all items in source directory
  const items = fs.readdirSync(src);

  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function main() {
  console.log('🚀 Starting asset copy for Phase 1 migration...');
  
  try {
    // Check if source directory exists
    if (!fs.existsSync(sourceDir)) {
      console.warn(`⚠️ Source directory not found: ${sourceDir}`);
      console.warn('⚠️ Skipping generated-assets copy (likely excluded by .vercelignore)');
      
      // Still try to copy manifest if it exists
      const manifestSrc = 'assets-manifest.json';
      const manifestDest = 'dist/public/assets-manifest.json';
      if (fs.existsSync(manifestSrc)) {
        // Ensure dist/public exists
        const publicDir = 'dist/public';
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        fs.copyFileSync(manifestSrc, manifestDest);
        console.log(`📋 Copied manifest to ${manifestDest}`);
      }
      
      console.log('✅ Asset copy completed (skipped generated-assets)');
      return;
    }

    // Copy assets
    console.log(`📁 Copying ${sourceDir} → ${targetDir}`);
    copyDirectory(sourceDir, targetDir);

    // Copy manifest to dist
    const manifestSrc = 'assets-manifest.json';
    const manifestDest = 'dist/public/assets-manifest.json';
    if (fs.existsSync(manifestSrc)) {
      fs.copyFileSync(manifestSrc, manifestDest);
      console.log(`📋 Copied manifest to ${manifestDest}`);
    }

    console.log('✅ Asset copy completed successfully!');
    
    // Show summary
    const totalFiles = countFiles(targetDir);
    console.log(`📊 Copied ${totalFiles} asset files`);
    
  } catch (error) {
    console.error('❌ Error during asset copy:', error.message);
    process.exit(1);
  }
}

function countFiles(dir) {
  let count = 0;
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        traverse(itemPath);
      } else {
        count++;
      }
    });
  }
  
  traverse(dir);
  return count;
}

main();
