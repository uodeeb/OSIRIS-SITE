# OSIRIS NOVEL — ARCHITECTURE & ASSET MIGRATION PLAN
**Document ID:** 02  
**Created:** 2026-04-06  
**Status:** ACTIVE  
**Related:** Document 01 (Master Production Plan)  

---

## EXECUTIVE SUMMARY

This document details the complete migration from a database-backed asset system (PostgreSQL + Cloudflare R2) to a pure static asset architecture optimized for Vercel deployment.

**Migration Scope:**
- Current: 50+ assets served via tRPC API from R2
- Target: Static assets in `/generated-assets/` served by Vercel Edge Network
- Timeline: 3 days (Phase 1 of Master Plan)
- Risk Level: Medium (URL changes require validation)

---

## CURRENT ARCHITECTURE ANALYSIS

### System Diagram (Current)

```
┌─────────────┐      tRPC GET      ┌──────────────┐      SQL      ┌─────────────┐
│   Client    │ ──────────────────▶ │   Express    │ ─────────────▶ │  Supabase   │
│             │                     │   Server     │                │  PostgreSQL │
│ ASSET_URLS  │ ◀────────────────── │              │ ◀───────────── │             │
│   Proxy     │     Asset URLs      │              │    Results     │             │
└─────────────┘                     └──────────────┘                └─────────────┘
                                           │
                                           │ URL
                                           ▼
                                    ┌──────────────┐
                                    │ Cloudflare │
                                    │     R2     │
                                    └──────────────┘
```

### Problems with Current Architecture

| Issue | Impact | Severity |
|-------|--------|----------|
| **Cold Start Latency** | 2-5s delay on asset fetch | Critical |
| **Database Dependency** | App fails if DB unavailable | High |
| **Serverless Timeout** | 10s limit on Vercel functions | Critical |
| **Cost** | $25+/month for Supabase | Medium |
| **Complexity** | 3 layers (API → DB → R2) | Medium |
| **Offline Dev** | Requires live DB connection | Low |

### Code Analysis

**Current Asset Resolution Flow:**

```typescript
// 1. Component requests asset
@e:\Books-library2025\mofsedon-novel\client\src\lib\assetUrls.ts:1-50
const CHARACTER_URLS = {
  yahya: ASSET_URLS.characters.yahya  // Triggers proxy
};

// 2. Proxy intercepts access
@e:\Books-library2025\mofsedon-novel\client\src\lib\assetOverrides.ts:68-95
const proxy = new Proxy(target, {
  get(obj, prop) {
    // Maps 'characters.yahya' → 'character.yahya'
    // Fetches from /api/trpc/media.getAsset
    // Falls back to hardcoded URL
  }
});

// 3. tRPC server handles request
@e:\Books-library2025\mofsedon-novel\server\_core\mediaRouter.ts:25-50
getAsset: publicProcedure
  .input(z.object({ key: z.string() }))
  .query(async ({ input }) => {
    const result = await database
      .select()
      .from(assets)
      .where(eq(assets.key, input.key))
      .limit(1);
    return { url: result[0].url };
  });

// 4. URLs are often Cloudfront or R2 signed
@e:\Books-library2025\mofsedon-novel\client\src\lib\assetUrls.ts:78-240
// Mixed sources: Cloudfront CDN, R2, local paths
```

---

## TARGET ARCHITECTURE

### System Diagram (Target)

```
┌─────────────┐                       ┌─────────────────────────────┐
│   Client    │                       │      Vercel Edge Network     │
│             │  /generated-assets/*   │                              │
│  getAsset() │ ─────────────────────▶ │  • Static file serving       │
│             │                      │  • 300+ global PoPs           │
│  (Static)   │ ◀─────────────────────│  • 1-year immutable cache     │
└─────────────┘         Assets         │  • Zero cold start            │
                                     └─────────────────────────────┘
```

### Target Benefits

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Asset Fetch Time | 2-5s (cold) | ~50ms | 98% faster |
| Cost | $25+/month | $0 | 100% savings |
| Complexity | 3 layers | 1 layer | 67% simpler |
| Reliability | DB-dependent | Static | 100% uptime |
| Offline Dev | ❌ | ✅ | Full support |

---

## MIGRATION STRATEGY

### Phase 1.1: Asset Inventory (Day 3 Morning)

#### Step 1: Complete Asset Audit

**Create:** `scripts/audit-assets.ts`

```typescript
#!/usr/bin/env tsx
/**
 * Asset Audit Script
 * Scans all asset references in codebase
 */

import { glob } from 'glob';
import { readFile } from 'fs/promises';

interface AssetReference {
  file: string;
  line: number;
  type: 'character' | 'background' | 'audio' | 'video' | 'ui';
  key: string;
  currentUrl: string;
}

async function auditAssets() {
  const references: AssetReference[] = [];
  
  // Scan for ASSET_URLS usage
  const files = await glob('client/src/**/*.{ts,tsx}');
  
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, idx) => {
      // Match patterns like ASSET_URLS.characters.yahya
      const match = line.match(/ASSET_URLS\.(\w+)\.(\w+)/);
      if (match) {
        references.push({
          file,
          line: idx + 1,
          type: match[1] as AssetReference['type'],
          key: match[2],
          currentUrl: 'TBD'
        });
      }
    });
  }
  
  // Output report
  console.table(references);
  return references;
}

auditAssets();
```

**Expected Output:**
```
┌─────────┬────────────────────────────────┬──────┬───────────┬────────┬─────────────┐
│ (index) │ file                           │ line │ type      │ key    │ currentUrl  │
├─────────┼────────────────────────────────┼──────┼───────────┼────────┼─────────────┤
│ 0       │ 'components/MainPlayer.tsx'    │ 50   │ 'characters'│ 'yahya'│ 'TBD'       │
│ 1       │ 'components/MainPlayer.tsx'    │ 51   │ 'characters'│ 'laila'│ 'TBD'       │
│ ...     │ ...                            │ ...  │ ...         │ ...    │ ...         │
└─────────┴────────────────────────────────┴──────┴───────────┴────────┴─────────────┘
```

#### Step 2: Physical Asset Inventory

**Command:**
```bash
find generated-assets -type f \( \
  -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o \
  -name "*.webp" -o -name "*.mp4" -o -name "*.mp3" -o \
  -name "*.wav" -o -name "*.gif" \
\) | sort > asset-inventory.txt
```

**Current Asset Count:**
- Characters: ~8 files (mixed Arabic/English filenames)
- Backgrounds: ~15 files
- Music/Audio: ~10 files
- Video: ~5 files
- UI elements: ~15 files
- **Total: ~53 assets**

---

### Phase 1.2: Asset Manifest Generation (Day 3 Afternoon)

#### Asset Manifest Schema

**File:** `assets-manifest.json`

```json
{
  "$schema": "./schemas/asset-manifest.schema.json",
  "version": "1.0.0",
  "generatedAt": "2026-04-06T12:00:00Z",
  "baseUrl": "/generated-assets",
  
  "categories": {
    "characters": {
      "description": "Character portrait images",
      "formats": ["jpeg", "webp"],
      "assets": {
        "yahya": {
          "key": "yahya",
          "url": "/generated-assets/characters/yahya-portrait.jpeg",
          "fallbackUrl": "/generated-assets/characters/yahya-portrait.webp",
          "dimensions": { "width": 800, "height": 1200 },
          "alt": {
            "en": "Yahya Al-Rashid portrait",
            "ar": "صورة يحيى الراشد"
          }
        },
        "laila": {
          "key": "laila",
          "url": "/generated-assets/characters/laila-portrait.jpeg",
          "fallbackUrl": "/generated-assets/characters/laila-portrait.webp",
          "dimensions": { "width": 800, "height": 1200 },
          "alt": {
            "en": "Dr. Laila Hassan portrait",
            "ar": "صورة الدكتورة ليلى حسن"
          }
        }
        // ... remaining characters
      }
    },
    
    "backgrounds": {
      "description": "Scene background images",
      "formats": ["jpg", "webp"],
      "assets": {
        "osiris_cosmic": {
          "key": "osiris_cosmic",
          "url": "/generated-assets/images/01.jpg",
          "fallbackUrl": "/generated-assets/images/01.webp",
          "dimensions": { "width": 1920, "height": 1080 }
        }
        // ... remaining backgrounds
      }
    },
    
    "video": {
      "description": "Cinematic video backgrounds",
      "formats": ["mp4", "webm"],
      "assets": {
        "intro": {
          "key": "intro",
          "sources": [
            { "url": "/generated-assets/video-bg/intro.mp4", "type": "video/mp4" },
            { "url": "/generated-assets/video-bg/intro.webm", "type": "video/webm" }
          ],
          "poster": "/generated-assets/video-bg/intro-poster.jpg"
        }
      }
    },
    
    "audio": {
      "description": "Music and sound effects",
      "formats": ["mp3", "ogg"],
      "assets": {
        "theme_main": {
          "key": "theme_main",
          "sources": [
            { "url": "/generated-assets/music-tracks/osiris-theme.mp3", "type": "audio/mpeg" },
            { "url": "/generated-assets/music-tracks/osiris-theme.ogg", "type": "audio/ogg" }
          ]
        }
      }
    }
  }
}
```

#### Generation Script

**File:** `scripts/generate-asset-manifest.ts`

```typescript
#!/usr/bin/env tsx
/**
 * Asset Manifest Generator
 * Creates assets-manifest.json from physical files
 */

import { readdir, stat } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import sharp from 'sharp';

interface AssetEntry {
  key: string;
  url: string;
  fallbackUrl?: string;
  dimensions?: { width: number; height: number };
  bytes?: number;
  mimeType: string;
}

interface AssetCategory {
  description: string;
  formats: string[];
  assets: Record<string, AssetEntry>;
}

interface AssetManifest {
  version: string;
  generatedAt: string;
  baseUrl: string;
  categories: Record<string, AssetCategory>;
}

async function getImageDimensions(path: string) {
  try {
    const metadata = await sharp(path).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch {
    return undefined;
  }
}

async function scanDirectory(
  dir: string,
  category: string,
  basePath: string
): Promise<Record<string, AssetEntry>> {
  const assets: Record<string, AssetEntry> = {};
  
  const entries = await readdir(dir);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = await stat(fullPath);
    
    if (stats.isFile()) {
      const ext = extname(entry).toLowerCase();
      const key = basename(entry, ext)
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-');
      
      const url = `${basePath}/${entry}`;
      const dimensions = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext)
        ? await getImageDimensions(fullPath)
        : undefined;
      
      assets[key] = {
        key,
        url,
        dimensions,
        bytes: stats.size,
        mimeType: getMimeType(ext)
      };
    }
  }
  
  return assets;
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.wav': 'audio/wav'
  };
  return map[ext] || 'application/octet-stream';
}

async function generateManifest() {
  const manifest: AssetManifest = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    baseUrl: '/generated-assets',
    categories: {}
  };
  
  // Scan each category
  manifest.categories.characters = {
    description: 'Character portrait images',
    formats: ['jpeg', 'webp'],
    assets: await scanDirectory(
      'generated-assets/characters',
      'characters',
      '/generated-assets/characters'
    )
  };
  
  manifest.categories.backgrounds = {
    description: 'Scene background images',
    formats: ['jpg', 'webp'],
    assets: await scanDirectory(
      'generated-assets/images',
      'backgrounds',
      '/generated-assets/images'
    )
  };
  
  manifest.categories.video = {
    description: 'Cinematic video backgrounds',
    formats: ['mp4', 'webm'],
    assets: await scanDirectory(
      'generated-assets/video-bg',
      'video',
      '/generated-assets/video-bg'
    )
  };
  
  manifest.categories.audio = {
    description: 'Music and sound effects',
    formats: ['mp3', 'ogg'],
    assets: await scanDirectory(
      'generated-assets/music-tracks',
      'audio',
      '/generated-assets/music-tracks'
    )
  };
  
  // Write manifest
  await writeFile(
    'assets-manifest.json',
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('✅ Generated assets-manifest.json');
  console.log(`   Characters: ${Object.keys(manifest.categories.characters.assets).length}`);
  console.log(`   Backgrounds: ${Object.keys(manifest.categories.backgrounds.assets).length}`);
  console.log(`   Videos: ${Object.keys(manifest.categories.video.assets).length}`);
  console.log(`   Audio: ${Object.keys(manifest.categories.audio.assets).length}`);
}

generateManifest().catch(console.error);
```

---

### Phase 1.3: Static Asset System Implementation (Day 4 Morning)

#### New Asset Resolution API

**File:** `client/src/lib/staticAssets.ts`

```typescript
/**
 * Static Asset Resolution System
 * Replaces assetOverrides.ts and assetUrls.ts
 * Uses build-time manifest instead of runtime API calls
 */

import assetManifest from '../../../assets-manifest.json';

// Type definitions from manifest
export type AssetCategory = keyof typeof assetManifest.categories;
export type AssetKey<C extends AssetCategory> = keyof typeof assetManifest.categories[C]['assets'];

// Re-export the full manifest for advanced use
export { assetManifest };

/**
 * Get asset URL by category and key
 * @example
 * const url = getAssetUrl('characters', 'yahya');
 * // Returns: "/generated-assets/characters/yahya-portrait.jpeg"
 */
export function getAssetUrl<C extends AssetCategory>(
  category: C,
  key: AssetKey<C>
): string {
  const cat = assetManifest.categories[category];
  if (!cat) {
    console.warn(`[staticAssets] Unknown category: ${category}`);
    return '';
  }
  
  const asset = cat.assets[key as string];
  if (!asset) {
    console.warn(`[staticAssets] Unknown key: ${category}.${String(key)}`);
    return '';
  }
  
  return asset.url;
}

/**
 * Get asset entry with full metadata
 */
export function getAsset<C extends AssetCategory>(
  category: C,
  key: AssetKey<C>
) {
  return assetManifest.categories[category]?.assets[key as string] ?? null;
}

/**
 * Preload multiple assets
 */
export async function preloadAssets(urls: string[]): Promise<void> {
  const promises = urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    });
  });
  
  await Promise.all(promises);
}

/**
 * Get chapter accent color
 * Centralized color mapping for chapters
 */
export function getChapterAccent(chapterId: string): string {
  const accents: Record<string, string> = {
    'part-0': '#c9a96e',  // Gold
    'part-1': '#ef4444',  // Red
    'part-2': '#22c55e',  // Green
    'part-3': '#3b82f6',  // Blue
    'part-4': '#a855f7',  // Purple
    'part-5': '#f97316',  // Orange
    'part-6': '#14b8a6',  // Teal
    'default': '#c9a96e'
  };
  
  return accents[chapterId] ?? accents.default;
}

/**
 * Convenience exports for common categories
 */
export const ASSET_URLS = {
  characters: assetManifest.categories.characters.assets,
  backgrounds: assetManifest.categories.backgrounds.assets,
  video: assetManifest.categories.video.assets,
  audio: assetManifest.categories.audio.assets
} as const;
```

#### TypeScript Declaration for JSON Import

**File:** `client/src/types/asset-manifest.d.ts`

```typescript
declare module '../../../assets-manifest.json' {
  const value: {
    version: string;
    generatedAt: string;
    baseUrl: string;
    categories: {
      characters: {
        description: string;
        formats: string[];
        assets: Record<string, {
          key: string;
          url: string;
          fallbackUrl?: string;
          dimensions?: { width: number; height: number };
          bytes?: number;
          mimeType: string;
        }>;
      };
      backgrounds: {
        description: string;
        formats: string[];
        assets: Record<string, {
          key: string;
          url: string;
          fallbackUrl?: string;
          dimensions?: { width: number; height: number };
          bytes?: number;
          mimeType: string;
        }>;
      };
      video: {
        description: string;
        formats: string[];
        assets: Record<string, {
          key: string;
          url: string;
          sources?: { url: string; type: string }[];
          poster?: string;
          bytes?: number;
          mimeType: string;
        }>;
      };
      audio: {
        description: string;
        formats: string[];
        assets: Record<string, {
          key: string;
          url: string;
          sources?: { url: string; type: string }[];
          bytes?: number;
          mimeType: string;
        }>;
      };
    };
  };
  
  export default value;
}
```

---

### Phase 1.4: Deprecation & Migration (Day 4 Afternoon)

#### Deprecation Warnings

**File:** `client/src/lib/assetOverrides.ts` (add at top)

```typescript
/**
 * @deprecated Use `staticAssets.ts` instead
 * This module is deprecated and will be removed in v2.0
 * 
 * Migration guide:
 *   import { ASSET_URLS } from '@/lib/assetOverrides';  // OLD
 *   import { ASSET_URLS, getAssetUrl } from '@/lib/staticAssets';  // NEW
 */

if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[assetOverrides] This module is deprecated. ' +
    'Migrate to staticAssets.ts for better performance.'
  );
}
```

#### Component Migration Examples

**Before → After:**

```typescript
// BEFORE (in MainPlayer.tsx)
import { ASSET_URLS } from '@/lib/assetOverrides';

const CHARACTER_CONFIG = {
  yahya: {
    name: 'Yahya',
    imageUrl: ASSET_URLS.characters.yahya,  // Proxy resolution
    glowColor: '#c9a96e'
  }
};

// AFTER (in MainPlayer.tsx)
import { ASSET_URLS, getChapterAccent } from '@/lib/staticAssets';

const CHARACTER_CONFIG = {
  yahya: {
    name: 'Yahya',
    imageUrl: ASSET_URLS.characters.yahya.url,  // Static lookup
    glowColor: getChapterAccent('part-0')
  }
};
```

---

### Phase 1.5: Vercel Configuration (Day 5)

#### Complete vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  
  "rewrites": [
    {
      "source": "/api/trpc/(.*)",
      "destination": "/api/trpc/$1"
    },
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  
  "headers": [
    {
      "source": "/generated-assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "Vary",
          "value": "Accept-Encoding"
        }
      ]
    },
    {
      "source": "/(.*\\.(js|css|woff2))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; frame-ancestors 'none';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
        }
      ]
    }
  ],
  
  "env": {
    "NODE_ENV": "production"
  },
  
  "build": {
    "env": {
      "VITE_ASSET_MANIFEST": "./assets-manifest.json"
    }
  }
}
```

---

## VALIDATION CHECKLIST

### Pre-Migration
- [ ] All assets inventoried (53 expected)
- [ ] All asset URLs documented
- [ ] Test environment prepared
- [ ] Rollback plan documented

### During Migration
- [ ] Asset manifest generates without errors
- [ ] All assets have normalized filenames
- [ ] TypeScript types compile
- [ ] No broken imports in components

### Post-Migration
- [ ] All 53 assets load successfully
- [ ] No 404s in browser console
- [ ] Cache-Control headers present
- [ ] Lighthouse performance score ≥ 90
- [ ] No tRPC asset calls in network tab

---

## ROLLBACK PLAN

If migration fails:

1. **Immediate (0-5 min):**
   ```bash
   git revert HEAD  # Revert last commit
   git push
   ```

2. **Short-term (5-30 min):**
   - Re-enable old asset system
   - Update imports to use `assetOverrides.ts`
   - Deploy hotfix

3. **Long-term (30+ min):**
   - Debug manifest generation
   - Fix asset path issues
   - Re-attempt migration

---

## DOCUMENT CONTROL

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-04-06 | Cascade | Initial architecture plan |

**Next Review:** After Phase 1 completion (Day 5)

**Dependencies:** Document 01 (Master Plan)

**Blocks:** Document 03 (UX/UI Review) implementation
