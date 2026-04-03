/**
 * Bundle Analysis Script
 * Analyzes build output and generates reports
 * 
 * Usage: npm run build:analyze
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist/public');
const REPORT_FILE = path.join(__dirname, '../bundle-analysis-report.json');

// Performance budgets (in bytes)
const BUDGETS = {
  'index.html': 50 * 1024,           // 50 KB
  'assets/index-*.js': 500 * 1024,     // 500 KB main bundle
  'assets/index-*.css': 100 * 1024,   // 100 KB CSS
  'assets/react-vendor-*.js': 200 * 1024,  // 200 KB React
  'assets/animation-vendor-*.js': 150 * 1024,  // 150 KB Framer Motion
  'assets/scenes-core-*.js': 300 * 1024,  // 300 KB scene data
  'assets/audio-engine-*.js': 100 * 1024, // 100 KB audio
  total: 2 * 1024 * 1024,              // 2 MB total
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getAllFiles(dir, pattern = '') {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (!pattern || entry.name.includes(pattern.replace('*', ''))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function matchBudgetPattern(filename) {
  for (const [pattern, budget] of Object.entries(BUDGETS)) {
    if (pattern === 'total') continue;
    
    const regex = new RegExp(pattern.replace('*', '.*'));
    if (regex.test(filename)) {
      return { pattern, budget };
    }
  }
  return null;
}

function analyzeBundle() {
  console.log('📊 Analyzing bundle...\n');
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/public directory not found. Run npm run build first.');
    process.exit(1);
  }
  
  const files = getAllFiles(DIST_DIR);
  const analysis = {
    timestamp: new Date().toISOString(),
    totalSize: 0,
    totalFiles: files.length,
    files: [],
    budgets: [],
    summary: {
      passed: 0,
      failed: 0,
      warnings: 0
    }
  };
  
  for (const file of files) {
    const stats = fs.statSync(file);
    const relativePath = path.relative(DIST_DIR, file);
    const size = stats.size;
    
    analysis.totalSize += size;
    
    const budgetInfo = matchBudgetPattern(relativePath);
    const budget = budgetInfo ? budgetInfo.budget : null;
    const budgetPattern = budgetInfo ? budgetInfo.pattern : null;
    
    let status = 'ok';
    if (budget) {
      if (size > budget * 1.5) {
        status = 'error';
        analysis.summary.failed++;
      } else if (size > budget) {
        status = 'warning';
        analysis.summary.warnings++;
      } else {
        analysis.summary.passed++;
      }
    }
    
    analysis.files.push({
      path: relativePath,
      size: size,
      sizeFormatted: formatBytes(size),
      budget: budget ? formatBytes(budget) : null,
      budgetPattern,
      status,
      gzipEstimate: formatBytes(size * 0.3) // Rough estimate
    });
  }
  
  // Check total budget
  if (analysis.totalSize > BUDGETS.total) {
    analysis.summary.failed++;
    analysis.budgets.push({
      type: 'total',
      size: analysis.totalSize,
      budget: BUDGETS.total,
      status: 'error',
      message: `Total size ${formatBytes(analysis.totalSize)} exceeds budget ${formatBytes(BUDGETS.total)}`
    });
  } else {
    analysis.summary.passed++;
    analysis.budgets.push({
      type: 'total',
      size: analysis.totalSize,
      budget: BUDGETS.total,
      status: 'ok',
      message: `Total size ${formatBytes(analysis.totalSize)} within budget`
    });
  }
  
  // Sort by size
  analysis.files.sort((a, b) => b.size - a.size);
  
  // Generate report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(analysis, null, 2));
  
  // Console output
  console.log('📦 Bundle Analysis Report\n');
  console.log(`Total Size: ${formatBytes(analysis.totalSize)}`);
  console.log(`Total Files: ${analysis.totalFiles}`);
  console.log(`\nPerformance Budgets:`);
  console.log(`  ✅ Passed: ${analysis.summary.passed}`);
  console.log(`  ⚠️  Warnings: ${analysis.summary.warnings}`);
  console.log(`  ❌ Failed: ${analysis.summary.failed}`);
  
  console.log(`\n📁 Largest Files:`);
  analysis.files.slice(0, 10).forEach((file, i) => {
    const icon = file.status === 'error' ? '❌' : file.status === 'warning' ? '⚠️' : '✅';
    const budgetStr = file.budget ? ` (budget: ${file.budget})` : '';
    console.log(`  ${icon} ${file.path} - ${file.sizeFormatted}${budgetStr}`);
  });
  
  console.log(`\n💡 Recommendations:`);
  if (analysis.summary.failed > 0) {
    console.log('  - Consider code splitting for large bundles');
    console.log('  - Review and remove unused dependencies');
    console.log('  - Enable tree shaking for vendor libraries');
  }
  if (analysis.totalSize > BUDGETS.total * 0.8) {
    console.log('  - Total bundle approaching budget limit');
    console.log('  - Consider lazy loading for non-critical components');
  }
  console.log('  - Use gzip/brotli compression on server');
  console.log('  - Implement asset preloading for critical resources');
  
  console.log(`\n📄 Full report saved to: ${REPORT_FILE}`);
  
  // Exit with error if budgets failed
  if (analysis.summary.failed > 0) {
    console.log('\n❌ Build failed: Performance budgets exceeded');
    process.exit(1);
  }
  
  console.log('\n✅ All performance budgets passed');
}

analyzeBundle();
