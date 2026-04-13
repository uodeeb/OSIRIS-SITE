/**
 * Build Assets Script
 * 
 * Copies assets from /generated-assets/ to /public/assets/
 * Normalizes Arabic filenames to ASCII slugs
 * Generates asset-manifest.json and TypeScript types
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT_DIR, 'generated-assets');
const DEST_DIR = path.join(ROOT_DIR, 'public', 'assets');
const MANIFEST_PATH = path.join(ROOT_DIR, 'public', 'asset-manifest.json');
const TYPES_PATH = path.join(ROOT_DIR, 'client', 'src', 'types', 'assets.d.ts');

// Arabic to ASCII filename mapping
const FILENAME_MAP = {
  // Characters
  'يحيى الراشد-الصورة الأساسية (Portrait).jpeg': 'yahya-portrait.jpeg',
  'يحيى الراشد-صورة الانهيار (Breakdown Scene).jpeg': 'yahya-breakdown.jpeg',
  'يحيى الراشد-صورة المواجهة (Confrontation Scene).jpeg': 'yahya-confront.jpeg',
  'ليلى حسنالصورة الأساسية (Portrait).jpeg': 'laila-portrait.jpeg',
  'ليلى حسن-صورة الإيمان (Faith Portrait).jpeg': 'laila-faith.jpeg',
  'ليلى حسن-صورة الشاهدة (Witness Scene — Final Chapter).jpeg': 'laila-witness.jpeg',
  'طارق الراشد-الصورة الأساسية (Portrait).jpeg': 'tarek-portrait.jpeg',
  'طارق الراشد-صورة التسجيل (Recording — Ghost Image).jpeg': 'tarek-ghost.jpeg',
  'طارق الراشد-صورة الحلم (Dream Sequence).jpeg': 'tarek-dream.jpeg',
  'المهندس الأول-الصورة الأساسية (Portrait).jpeg': 'first-engineer-portrait.jpeg',
  'المهندس الأول-الصورة الأساسية (Portrait)02.jpeg': 'first-engineer-portrait-02.jpeg',
  'المهندس الأول-صورة الانكشاف (Exposed — Final Scene).jpeg': 'first-engineer-exposed.jpeg',
  'المهندس الأول-صورة المواجهة (Confrontation).jpeg': 'first-engineer-confront.jpeg',
  'الراوي الكوني-التجسيد البصري (Visual Representation).png': 'narrator-visual.png',
  'السامري-الصورة الأساسية (Portrait).jpeg': 'samiri-portrait.jpeg',
  'السامري-اصورة صناعة العجل (The Golden Calf Scene).png': 'samiri-calf.png',
  'قسطنطين-الصورة الأساسية (Portrait).jpeg': 'constantine-portrait.jpeg',
  'آريوس.jpeg': 'arius.jpeg',
  'أثناسيوس.jpeg': 'athanasius.jpeg',
  'RAMSIS.jpg': 'ramses.jpg',
  'RAMSIS01.jpg': 'ramses-01.jpg',
  
  // Video backgrounds
  'VIDEO 01 — الشاشة الرئيسية (Intro).mp4': 'intro.mp4',
  'VIDEO 02 — غرفة يحيى (المشهد الافتتاحي).mp4': 'yahya-room.mp4',
  'VIDEO 03 — الفضاء الكوني (المرافعة الافتتاحية).mp4': 'cosmic-opening.mp4',
  'VIDEO 04 — سطح المبنى (وداع طارق).mp4': 'tarek-rooftop.mp4',
  'VIDEO 05 — صحراء سيناء (العجل الذهبي).mp4': 'sinai-desert.mp4',
  'VIDEO 06 — صهر الذهب (هندسة الحشود).mp4': 'molten-gold.mp4',
  'VIDEO 07 — مجمع نيقية (الإمبراطور والحكيم).mp4': 'nicaea.mp4',
  'VIDEO 08 — الأندلس (جمال يتلاشى).mp4': 'granada-fall.mp4',
  'VIDEO 09 — دموع أبو عبد الله (زفرة العربي الأخيرة).mp4': 'abu-abdullah-tears.mp4',
  'VIDEO 10 — برلين 1933 (الكبر يصبح نظاماً).mp4': 'berlin-1933.mp4',
  'VIDEO 11 — كربلاء (الحق الأعزل).mp4': 'karbala.mp4',
  'VIDEO 12 — الفضاء الرقمي (المواجهة مع المهندس).mp4': 'digital-space.mp4',
  'VIDEO 13 — ضغطة Enter (التضحية النهائية).mp4': 'enter-key.mp4',

  // Osiris falcon hologram videos (osiris-vid-bg subfolder)
  'Egyptian_falcon_eye_202603301359.mp4': 'falcon-eye.mp4',
  'Falcon_hologram_data_202603301414.mp4': 'falcon-hologram-data.mp4',
  'Neural_network_forms_202603301407.mp4': 'neural-network-forms.mp4',
  'OSIRIS_falcon_hologram_202603301403.mp4': 'falcon-hologram.mp4',
  'OSIRIS_falcon_logo_202603301401.mp4': 'falcon-logo.mp4',
  'Medium_wide_shot_of_the_osiris_falcon_logo_re.gif': 'falcon-logo-reveal.gif',
  'Slow_orbit_osiris_falcon_hologram_floating_i.gif': 'falcon-hologram-orbit.gif',
  
  // Music tracks
  'TRACK 01 — الثيم الرئيسي للرواية.mp3': 'main-theme.mp3',
  'TRACK 01.mp3': 'track-01-alt.mp3',
  'TRACK-01.mp3': 'track-01.mp3',
  'TRACK 02.m4a': 'track-02.m4a',
  'TRACK-02.m4a': 'track-02-alt.m4a',
  'TRACK 03.mp3': 'track-03.mp3',
  'TRACK 04.m4a': 'track-04.m4a',
  'TRACK-04.m4a': 'track-04-alt.m4a',
  'TRACK 04.mp3': 'track-04-mp3.mp3',
  'TRACK 05.m4a': 'track-05.m4a',
  'TRACK-05.m4a': 'track-05-alt.m4a',
  'TRACK 06.m4a': 'track-06.m4a',
  'TRACK-06.m4a': 'track-06-alt.m4a',
  'TRACK 07.m4a': 'track-07.m4a',
  'TRACK-07.m4a': 'track-07-alt.m4a',
  'TRACK 08.m4a': 'track-08.m4a',
  'TRACK-08.m4a': 'track-08-alt.m4a',
  'TRACK 09.m4a': 'track-09.m4a',
  'TRACK-09.m4a': 'track-09-alt.m4a',
  'TRACK 10.m4a': 'track-10.m4a',
  'TRACK-10.m4a': 'track-10-alt.m4a',
  'TRACK 11.m4a': 'track-11.m4a',
  'TRACK-11.m4a': 'track-11-alt.m4a',
  'TRACK 12.m4a': 'track-12.m4a',
  'TRACK-12.m4a': 'track-12-alt.m4a',
  'TRACK 13.m4a': 'track-13.m4a',
  'TRACK-13.m4a': 'track-13-alt.m4a',
  'TRACK 14.m4a': 'track-14.m4a',
  'TRACK-14.m4a': 'track-14-alt.m4a',
};


function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeMap = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.m4a': 'audio/mp4',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
  };
  return mimeMap[ext] || 'application/octet-stream';
}

function normalizeFilename(originalName) {
  // Check if we have a mapping for this file
  if (FILENAME_MAP[originalName]) {
    return FILENAME_MAP[originalName];
  }
  
  // For files without Arabic names, keep as-is but lowercase and clean
  return originalName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function baseNameFromFile(filename) {
  return path.basename(filename, path.extname(filename));
}

function getAssetKey(category, normalizedName) {
  // Remove extension for the key
  const baseName = path.basename(normalizedName, path.extname(normalizedName));
  return `${category}.${baseName}`;
}

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory may already exist
  }
}

async function copyFile(src, dest) {
  await fs.copyFile(src, dest);
}

async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size;
}

async function scanExistingAssets() {
  console.log('� Scanning existing assets in public/assets/...\n');
  
  const assets = {};
  let totalCount = 0;
  
  // Category mapping for existing assets
  const categories = [
    { dir: 'characters', category: 'character' },
    { dir: 'video-bg', category: 'videoBg' },
    { dir: 'osiris-vid-bg', category: 'videoBg', subDir: 'osiris-vid-bg' },
    { dir: 'music-tracks', category: 'audio' },
    { dir: 'voices', category: 'voice' },
    { dir: 'images', category: 'background' },
    { dir: 'ambient', category: 'ambient' },
  ];

  for (const { dir, category, subDir } of categories) {
    const assetPath = subDir
      ? path.join(DEST_DIR, subDir)
      : path.join(DEST_DIR, dir);
    
    try {
      const files = await fs.readdir(assetPath);
      
      for (const file of files) {
        const filePath = path.join(assetPath, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isFile()) {
          const key = subDir
            ? `videoBg.osiris.${baseNameFromFile(file)}`
            : getAssetKey(category, file);
          const size = stat.size;

          assets[key] = {
            key,
            path: subDir
              ? `/assets/${subDir}/${file}`
              : `/assets/${dir}/${file}`,
            category,
            mime: getMimeType(file),
            originalName: file,
            size,
          };
          
          totalCount++;
          console.log(`  ✅ ${key}`);
        }
      }
    } catch (error) {
      console.warn(`  ⚠️  Skipping ${dir}: ${error.message}`);
    }
  }
  
  return { assets, totalCount };
}

async function buildAssets() {
  console.log('🔨 Building assets...\n');
  
  let assets = {};
  let totalCount = 0;
  
  // FIRST: Try to scan existing assets in public/assets/ (Vercel build)
  console.log('🔍 Scanning existing assets in public/assets/...\n');
  const existingResult = await scanExistingAssets();
  assets = existingResult.assets;
  totalCount = existingResult.totalCount;
  
  // If no assets found in public/assets/, try to copy from generated-assets/
  if (totalCount === 0) {
    console.log('⚠️  No assets found in public/assets/');
    console.log('📁 Checking generated-assets/ for source assets...\n');
    
    let sourceExists = true;
    try {
      await fs.access(SOURCE_DIR);
    } catch {
      sourceExists = false;
    }
    
    if (sourceExists) {
      const categories = [
        { dir: 'characters', category: 'image', destDir: 'characters' },
        { dir: 'images', category: 'image', destDir: 'images' },
        { dir: 'music-tracks', category: 'audio', destDir: 'music-tracks' },
        { dir: 'video-bg', category: 'video', destDir: 'video-bg', skipSubdirs: true },
        { dir: 'video-bg', category: 'video', destDir: 'osiris-vid-bg', subdir: 'osiris-vid-bg' },
        { dir: 'voices', category: 'audio', destDir: 'voices' },
        { dir: 'ambient', category: 'ambient', destDir: 'ambient' },
      ];

      for (const { dir, category, destDir, subdir, skipSubdirs } of categories) {
        const sourcePath = subdir
          ? path.join(SOURCE_DIR, dir, subdir)
          : path.join(SOURCE_DIR, dir);
        const destPath = path.join(DEST_DIR, destDir);
        
        try {
          await ensureDir(destPath);
          const files = await fs.readdir(sourcePath);
          
          for (const file of files) {
            const srcFile = path.join(sourcePath, file);
            const normalizedName = FILENAME_MAP[file] || file;
            const destFileNormalized = path.join(destPath, normalizedName);

            await fs.copyFile(srcFile, destFileNormalized);

            const assetPath = `/assets/${destDir}/${normalizedName}`;
            const key = subdir
              ? `videoBg.osiris.${baseNameFromFile(normalizedName)}`
              : path.parse(normalizedName).name;
            assets[key] = {
              key,
              path: assetPath,
              category,
              mime: getMimeType(file),
              originalName: file,
            };
            
            totalCount++;
          }
          
          console.log(`✅ Copied ${files.length} ${dir}`);
        } catch (error) {
          console.warn(`⚠️  Skipping ${dir}: ${error.message}`);
        }
      }
      
      console.log(`\n📊 Copied ${totalCount} assets`);
    } else {
      console.log('❌ Source assets not found in generated-assets/');
    }
  } else {
    console.log(`\n📊 Found ${totalCount} existing assets in public/assets/`);
  }
  
  // Generate manifest
  const manifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalAssets: totalCount,
    assets,
  };
  
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n📝 Generated manifest: ${MANIFEST_PATH}`);
  console.log(`   Total assets: ${totalCount}`);
  
  // Generate TypeScript types
  const assetKeys = Object.keys(assets).sort();
  const typesContent = `// Auto-generated by scripts/build-assets.ts
// Do not edit manually

export type AssetKey =
${assetKeys.map(key => `  | '${key}'`).join('\n')};

export interface AssetEntry {
  key: string;
  path: string;
  category: string;
  mime: string;
  originalName: string;
  size?: number;
}

export interface AssetManifest {
  version: string;
  generatedAt: string;
  totalAssets: number;
  assets: Record<string, AssetEntry>;
}
`;
  
  await ensureDir(path.dirname(TYPES_PATH));
  await fs.writeFile(TYPES_PATH, typesContent);
  console.log(`📝 Generated types: ${TYPES_PATH}`);
  
  console.log('\n✅ Asset build complete!');
}

buildAssets().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
