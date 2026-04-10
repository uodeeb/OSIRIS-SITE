import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.resolve(__dirname, '..', 'public', 'asset-manifest.json');
const destPath = path.resolve(__dirname, '..', 'dist', 'public', 'asset-manifest.json');

console.log('Source path:', sourcePath);
console.log('Dest path:', destPath);

try {
  fs.copyFileSync(sourcePath, destPath);
  console.log('✅ Copied asset-manifest.json to dist/public/');
} catch (error) {
  console.error('❌ Failed to copy asset-manifest.json:', error.message);
  process.exit(1);
}
