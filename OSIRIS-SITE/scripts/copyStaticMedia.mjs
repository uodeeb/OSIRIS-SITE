import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outputRoot = path.join(root, 'dist', 'public');

const copyTasks = [
  {
    source: path.join(root, 'generated-assets', 'music-tracks'),
    destination: path.join(outputRoot, 'music'),
  },
  {
    source: path.join(root, 'generated-assets', 'voices'),
    destination: path.join(outputRoot, 'music'),
  },
  {
    source: path.join(root, 'generated-assets', 'video-bg'),
    destination: path.join(outputRoot, 'video-bg'),
  },
  {
    source: path.join(root, 'generated-assets'),
    destination: path.join(outputRoot, 'generated-assets'),
  },
];

for (const task of copyTasks) {
  if (!fs.existsSync(task.source)) continue;
  fs.mkdirSync(task.destination, { recursive: true });
  fs.cpSync(task.source, task.destination, { recursive: true, force: true });
}
