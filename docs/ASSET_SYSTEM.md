# Asset System Architecture Documentation

## Overview

The OSIRIS asset system uses **Cloudflare R2** for storage with a **proxy-based resolution** system that maps client-side asset keys to database-stored R2 URLs.

## Architecture Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Client Code   │────▶│  ASSET_URLS Proxy │────▶│  Database/R2    │
│                 │     │  (assetOverrides)  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                         │
         │                       │                         │
         ▼                       ▼                         ▼
  ASSET_URLS.characters   Lookup override          R2 URLs stored
  .yahya ──────────────▶  for "character.yahya"    in database
```

## Key Components

### 1. Database Schema (`drizzle/schema.ts`)

Assets are stored with these fields:
- `key`: Unique identifier (e.g., `character.yahya`, `videoBg.intro`)
- `kind`: Asset category (`character`, `video`, `audio`, `background`, `document`, `ui`)
- `url`: Full R2 URL (e.g., `https://xxx.r2.cloudflarestorage.com/bucket/assets/character/character.yahya.jpg`)
- `mime`: MIME type for proper content serving
- `bytes`: File size (optional)

### 2. R2 URL Generation (`server/lib/r2.ts`)

```typescript
// URL format: {S3_ENDPOINT}/{bucket}/assets/{kind}/{key}.{ext}
generateR2UrlFromAsset({ key: "character.yahya", kind: "character", mime: "image/jpeg" })
// Returns: https://xxx.r2.cloudflarestorage.com/osiris-novel-assets/assets/character/character.yahya.jpg
```

### 3. Asset Proxy System (`client/src/lib/assetOverrides.ts`)

The proxy solves the **plural→singular** naming mismatch:

| Client Key | Database Key |
|------------|--------------|
| `characters.yahya` | `character.yahya` |
| `backgrounds.berlin_1933` | `background.berlin_1933` |
| `documents.encrypted_file` | `document.encrypted_file` |

**How it works:**
1. Client accesses `ASSET_URLS.characters.yahya`
2. Proxy intercepts and maps `characters` → `character`
3. Looks up `character.yahya` in override cache
4. Returns R2 URL if found, otherwise returns raw tRPC URL

### 4. Override Loading

```typescript
// On app init, assets are fetched from database
initAssetOverrides() 
  └─▶ fetch('/api/trpc/system.assets')
      └─▶ Returns all assets with R2 URLs
          └─▶ Stored in override cache
```

## Critical Implementation Details

### Why the Proxy is Necessary

The client uses **plural names** (`characters`, `backgrounds`) for organizational purposes, but the database uses **singular names** (`character`, `background`) for the `kind` field. The proxy bridges this gap.

### Why Re-access at Render Time

**Module load time:** Overrides not yet loaded → returns raw tRPC URL  
**Render time:** Overrides loaded → returns R2 URL

```typescript
// ❌ WRONG: Caches tRPC URL at module load
const imageUrl = ASSET_URLS.characters.yahya; // "/api/trpc/..."

// ✅ CORRECT: Re-accesses at render time through proxy
const s3Url = (ASSET_URLS.characters as any)[charName]; // "https://r2..."
```

## Seeding & Migration

### Initial Seed (`server/inlineSeed.ts`)

Populates database with R2 URLs for core assets:
```bash
npx tsx server/inlineSeed.ts
```

### Migration to R2 (`server/migrate-to-r2.ts`)

Converts existing assets to R2 URLs:
```bash
npx tsx server/migrate-to-r2.ts
```

This handles:
- Cloudfront URLs → R2 URLs
- Local paths (`/generated-assets/...`) → R2 URLs
- Skips already-R2 URLs

## Environment Configuration

Required in `.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Cloudflare R2 (S3-compatible)
AWS_ACCESS_KEY_ID=your_r2_access_key
AWS_SECRET_ACCESS_KEY=your_r2_secret_key
AWS_REGION=auto
S3_BUCKET_NAME=osiris-novel-assets
S3_ENDPOINT=https://0daf765b6145d95da530d586fda49b1e.r2.cloudflarestorage.com
```

## Common Issues & Solutions

### Issue: Characters not displaying (empty image)

**Cause:** Proxy not finding override because:
1. Overrides not loaded yet
2. Key mapping failed (e.g., `characters` vs `character`)
3. Database doesn't have the asset

**Debug steps:**
1. Check console for `[AssetProxy]` logs
2. Verify database has asset: `SELECT * FROM assets WHERE key = 'character.yahya'`
3. Check network tab for `system.assets` call
4. Ensure proxy is mapping plural→singular correctly

### Issue: 400 Bad Request on tRPC calls

**Cause:** Middleware not parsing superjson input correctly.

**Solution:** Fixed in `server/_core/index.ts` - parses base64 superjson from query params.

### Issue: Mixed URL formats in database

**Cause:** Multiple seeding runs with different URL formats.

**Solution:** Run `server/migrate-to-r2.ts` to standardize all URLs.

## File Reference

| File | Purpose |
|------|---------|
| `server/lib/r2.ts` | R2 URL generation utilities |
| `server/inlineSeed.ts` | Seed database with R2 URLs |
| `server/migrate-to-r2.ts` | Migrate existing assets to R2 |
| `client/src/lib/assetOverrides.ts` | Proxy system & override management |
| `client/src/lib/assetUrls.ts` | ASSET_URLS constants & API functions |
| `client/src/components/MainPlayer.tsx` | Character image resolution |

## Best Practices

1. **Always use ASSET_URLS proxy** - Don't hardcode R2 URLs
2. **Re-access at render time** - For dynamic resolution
3. **Run migration after URL changes** - Keep database consistent
4. **Check proxy logs** - When debugging asset issues
5. **Use singular keys in database** - Plural names only in client
