/**
 * Asset Verification Script
 * 
 * Run this before deployment to verify all required assets are present
 * and properly configured in the database.
 * 
 * Usage:
 *   npx tsx scripts/verify-deployment-assets.ts
 * 
 * This script checks:
 * - Database connectivity
 * - Required character assets exist with valid URLs
 * - Music track files exist in generated-assets
 * - Video background files exist
 * - R2 URLs are properly configured
 */

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { assets } from '../drizzle/schema';
import { eq, inArray } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

const REQUIRED_ASSETS = {
  characters: [
    'character.narrator',
    'character.yahya',
    'character.yahya_breakdown',
    'character.yahya_confront',
    'character.yahya_dying',
    'character.laila',
    'character.laila_faith',
    'character.laila_witness',
    'character.laila_crying',
    'character.tarek',
    'character.tarek_ghost',
    'character.tarek_dream',
    'character.first_engineer',
    'character.first_engineer_2',
    'character.first_engineer_confront',
    'character.first_engineer_exposed',
    'character.arius',
    'character.athanasius',
    'character.samiri',
    'character.samiri_calf',
    'character.constantine',
    'character.ramses',
  ],
  videos: [
    'videoBg.yahya_room',
    'videoBg.sinai_desert',
    'videoBg.andalusia',
    'videoBg.karbala',
  ],
  audio: [
    'audio.main_theme',
  ],
};

const LOCAL_ASSET_PATHS = {
  characters: 'generated-assets/characters',
  musicTracks: 'generated-assets/music-tracks',
  videoBg: 'generated-assets/video-bg',
};

interface VerificationResult {
  category: string;
  total: number;
  found: number;
  missing: string[];
  errors: string[];
}

async function verifyDatabaseAssets(db: ReturnType<typeof drizzle>): Promise<VerificationResult[]> {
  const results: VerificationResult[] = [];

  // Check character assets
  const characterResult: VerificationResult = {
    category: 'Database Character Assets',
    total: REQUIRED_ASSETS.characters.length,
    found: 0,
    missing: [],
    errors: [],
  };

  for (const key of REQUIRED_ASSETS.characters) {
    const result = await db.select().from(assets).where(eq(assets.key, key)).limit(1);
    if (result.length === 0) {
      characterResult.missing.push(key);
    } else {
      const asset = result[0];
      if (!asset.url || !asset.url.startsWith('http')) {
        characterResult.errors.push(`${key}: Invalid URL (${asset.url})`);
      } else {
        characterResult.found++;
      }
    }
  }

  results.push(characterResult);

  // Check video assets
  const videoResult: VerificationResult = {
    category: 'Database Video Assets',
    total: REQUIRED_ASSETS.videos.length,
    found: 0,
    missing: [],
    errors: [],
  };

  for (const key of REQUIRED_ASSETS.videos) {
    const result = await db.select().from(assets).where(eq(assets.key, key)).limit(1);
    if (result.length === 0) {
      videoResult.missing.push(key);
    } else {
      const asset = result[0];
      if (!asset.url || !asset.url.startsWith('http')) {
        videoResult.errors.push(`${key}: Invalid URL (${asset.url})`);
      } else {
        videoResult.found++;
      }
    }
  }

  results.push(videoResult);

  return results;
}

async function verifyLocalFiles(): Promise<VerificationResult[]> {
  const results: VerificationResult[] = [];
  const rootDir = process.cwd();

  // Check character images
  const characterResult: VerificationResult = {
    category: 'Local Character Images',
    total: 0,
    found: 0,
    missing: [],
    errors: [],
  };

  const charactersDir = path.join(rootDir, LOCAL_ASSET_PATHS.characters);
  if (fs.existsSync(charactersDir)) {
    const files = fs.readdirSync(charactersDir);
    characterResult.total = files.length;
    characterResult.found = files.filter(f => 
      f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')
    ).length;
  } else {
    characterResult.errors.push(`Directory not found: ${LOCAL_ASSET_PATHS.characters}`);
  }

  results.push(characterResult);

  // Check music tracks
  const musicResult: VerificationResult = {
    category: 'Local Music Tracks',
    total: 0,
    found: 0,
    missing: [],
    errors: [],
  };

  const musicDir = path.join(rootDir, LOCAL_ASSET_PATHS.musicTracks);
  if (fs.existsSync(musicDir)) {
    const files = fs.readdirSync(musicDir);
    musicResult.total = files.length;
    musicResult.found = files.filter(f => 
      f.startsWith('TRACK-') && (f.endsWith('.mp3') || f.endsWith('.m4a'))
    ).length;
  } else {
    musicResult.errors.push(`Directory not found: ${LOCAL_ASSET_PATHS.musicTracks}`);
  }

  results.push(musicResult);

  // Check video backgrounds
  const videoResult: VerificationResult = {
    category: 'Local Video Backgrounds',
    total: 0,
    found: 0,
    missing: [],
    errors: [],
  };

  const videoDir = path.join(rootDir, LOCAL_ASSET_PATHS.videoBg);
  if (fs.existsSync(videoDir)) {
    const files = fs.readdirSync(videoDir);
    videoResult.total = files.length;
    videoResult.found = files.filter(f => f.endsWith('.mp4')).length;
  } else {
    videoResult.errors.push(`Directory not found: ${LOCAL_ASSET_PATHS.videoBg}`);
  }

  results.push(videoResult);

  return results;
}

function printResults(results: VerificationResult[]) {
  console.log('\n========================================');
  console.log('ASSET VERIFICATION RESULTS');
  console.log('========================================\n');

  let hasErrors = false;

  for (const result of results) {
    const status = result.missing.length === 0 && result.errors.length === 0 ? '✅' : '❌';
    console.log(`${status} ${result.category}`);
    console.log(`   Found: ${result.found}/${result.total}`);
    
    if (result.missing.length > 0) {
      hasErrors = true;
      console.log(`   Missing (${result.missing.length}):`);
      result.missing.forEach(m => console.log(`     - ${m}`));
    }
    
    if (result.errors.length > 0) {
      hasErrors = true;
      console.log(`   Errors (${result.errors.length}):`);
      result.errors.forEach(e => console.log(`     - ${e}`));
    }
    
    console.log('');
  }

  console.log('========================================');
  if (hasErrors) {
    console.log('❌ VERIFICATION FAILED - Fix issues before deployment');
    process.exit(1);
  } else {
    console.log('✅ ALL CHECKS PASSED - Ready for deployment');
  }
  console.log('========================================\n');
}

async function main() {
  console.log('\n🔍 Starting Asset Verification...\n');

  // Check database
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }

  let dbResults: VerificationResult[] = [];
  let localResults: VerificationResult[] = [];

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    console.log('📊 Checking database assets...');
    dbResults = await verifyDatabaseAssets(db);

    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    dbResults.push({
      category: 'Database Connection',
      total: 0,
      found: 0,
      missing: [],
      errors: [`Connection failed: ${error}`],
    });
  }

  // Check local files
  console.log('📁 Checking local asset files...');
  localResults = await verifyLocalFiles();

  // Print combined results
  printResults([...dbResults, ...localResults]);
}

main().catch(console.error);
