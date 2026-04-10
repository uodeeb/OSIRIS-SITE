# Cloudflare R2 Asset Migration Plan
## Transition from Local Folders to Database-Resolved Cloudflare URLs

**Status:** Planning Phase  
**Date:** 2026-04-06  
**Priority:** HIGH

---

## Executive Summary

The OSIRIS asset system has infrastructure in place for Cloudflare R2 + database asset serving, but the client is still primarily using local folder paths. This plan outlines the complete migration to database-resolved Cloudflare URLs.

**Current State:**
- ✅ Database schema exists with `assets` table
- ✅ Backend API endpoints exist (`mediaRouter`, `systemRouter`)
- ✅ R2 integration utilities exist
- ✅ Migration scripts exist
- ❌ Client components still use local fallback paths
- ❌ Multiple conflicting asset loading systems
- ❌ Mixed asset sources (local, CloudFront, R2)

**Target State:**
- All assets served from Cloudflare R2 URLs stored in database
- Single standardized asset loading system
- No local file dependencies in production
- Consistent caching and error handling

---

## Architecture Analysis

### Current Asset Loading Systems (3 conflicting systems)

#### 1. API-Based System (`assetUrls.ts`) - INTENDED PRIMARY
```typescript
// Functions that fetch from database
getAssetUrl(key: string)           // Fetch single asset
getAssetsByKind(kind: string)       // Fetch by category
getAssetUrls(keys: string[])        // Batch fetch
preloadAssets(keys: string[])       // Preload for UX
```
**Status:** ✅ Implemented, but not consistently used

#### 2. Proxy System (`assetOverrides.ts`) - INTENDED FALLBACK
```typescript
// Proxy that intercepts ASSET_URLS access
ASSET_URLS.characters.yahya → checks database override
```
**Status:** ✅ Implemented, used in MainPlayer.tsx

#### 3. Hardcoded CDN System (`assetManager.ts`) - LEGACY
```typescript
// Hardcoded CloudFront URLs
const CDN_BASE = 'https://d2xsxph8kpxj0f.cloudfront.net/...'
export const OSIRIS_ASSETS = { ... }
```
**Status:** ❌ Legacy, should be deprecated

### Current Asset Sources by File

| File | Source | Status |
|------|--------|--------|
| `assetUrls.ts` | API + Local fallback | Mixed |
| `assetOverrides.ts` | Database proxy | ✅ Correct |
| `assetManager.ts` | Hardcoded CloudFront | ❌ Legacy |
| `OSIRIS_CINEMATIC_TIMELINE.md` | Local + CloudFront | Mixed |
| `MainPlayer.tsx` | ASSET_URLS proxy | ✅ Correct |
| `useAssets.ts` | assetManager | ❌ Legacy |

---

## Migration Strategy

### Phase 1: Database Verification (Prerequisite)
**Goal:** Ensure all assets exist in database with correct R2 URLs

#### Tasks:
1. **Check database asset count**
   ```bash
   # Run verification script
   npx tsx server/scripts/verify-assets.ts
   ```

2. **Seed missing assets**
   ```bash
   # If assets missing, run seed
   npx tsx server/inlineSeed.ts
   ```

3. **Migrate to R2 format**
   ```bash
   # Convert CloudFront/local URLs to R2
   npx tsx server/migrate-to-r2.ts
   ```

4. **Verify critical assets**
   ```sql
   -- Check key assets exist
   SELECT key, url FROM assets 
   WHERE key LIKE 'character.%' 
   OR key LIKE 'videoBg.%'
   LIMIT 20;
   ```

**Success Criteria:**
- All assets in database use R2 URLs (`https://xxx.r2.cloudflarestorage.com/...`)
- No local paths (`/generated-assets/...`) in database
- No CloudFront URLs (`d2xsxph8kpxj0f.cloudfront.net`) in database

---

### Phase 2: Client-Side Standardization
**Goal:** Single asset loading system across all components

#### Option A: Use API-Based System (RECOMMENDED)
**Pros:**
- Explicit async loading
- Better error handling
- Follows Vercel best practices (async-parallel)
- Type-safe with TypeScript

**Cons:**
- Requires component changes to use async/await
- Need to handle loading states

#### Option B: Use Proxy System (CURRENT)
**Pros:**
- Minimal component changes
- Works with existing ASSET_URLS usage
- Automatic database lookup

**Cons:**
- Implicit loading (harder to debug)
- Proxy complexity
- Timing issues (overrides load after module init)

**Decision:** **Use Option A (API-Based)** for new code, keep Option B for existing code during transition.

---

### Phase 3: Component Migration
**Goal:** Replace all hardcoded asset references with database API calls

#### Priority Order:

**HIGH PRIORITY (Critical User Experience):**
1. `MainPlayer.tsx` - Character images, video backgrounds
2. `CinematicStage.tsx` - Scene backgrounds
3. `GlobalMediaLayer.tsx` - Global media assets

**MEDIUM PRIORITY (Secondary Features):**
4. `EnhancedHome.tsx` - Landing page assets
5. `OSIRISNovelApp.tsx` - App-level assets
6. Part pages (`PartOne.tsx`, etc.)

**LOW PRIORITY (Admin/Debug):**
7. `AssetManager.tsx` - Asset management UI
8. Debug components

#### Migration Pattern:

**BEFORE (Hardcoded):**
```typescript
import { ASSET_URLS } from '@/lib/assetUrls';

const imageUrl = ASSET_URLS.characters.yahya; // Returns local path
```

**AFTER (Database API):**
```typescript
import { getAssetUrl } from '@/lib/assetUrls';
import { useState, useEffect } from 'react';

const Component = () => {
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    getAssetUrl('character.yahya').then(setImageUrl);
  }, []);
  
  return <img src={imageUrl} alt="Yahya" />;
};
```

**OPTIMIZED (with Suspense):**
```typescript
import { useAsset } from '@/hooks/useAsset'; // New hook

const Component = () => {
  const { url, isLoading } = useAsset('character.yahya');
  
  if (isLoading) return <Skeleton />;
  return <img src={url} alt="Yahya" />;
};
```

---

### Phase 4: Deprecation & Cleanup
**Goal:** Remove legacy systems after verification

#### Tasks:

1. **Deprecate `assetManager.ts`**
   - Add deprecation warning to all exports
   - Document migration path in comments
   - Mark as `@deprecated` in TypeScript

2. **Clean up `assetUrls.ts`**
   - Remove `RAW_ASSET_URLS` constant (hardcoded URLs)
   - Remove fallback system (local paths)
   - Keep only API-based functions
   - Update documentation

3. **Update timeline references**
   - Replace local paths in `OSIRIS_CINEMATIC_TIMELINE.md`
   - Use database key format (`character.yahya` instead of `/generated-assets/...`)

4. **Remove local asset folders from git**
   - Update `.gitignore` to exclude `generated-assets/`
   - Run git cleanup commands
   - Verify repo size reduction

---

## Implementation Plan

### Step 1: Create New Hook for Asset Loading
**File:** `client/src/hooks/useAsset.ts`

```typescript
import { useState, useEffect } from 'react';
import { getAssetUrl } from '@/lib/assetUrls';

export function useAsset(key: string) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAssetUrl(key)
      .then(setUrl)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [key]);

  return { url, isLoading, error };
}

export function useAssets(keys: string[]) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAssetUrls(keys)
      .then(setUrls)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [keys]);

  return { urls, isLoading, error };
}
```

### Step 2: Migrate MainPlayer.tsx
**Changes:**
- Replace `ASSET_URLS.characters[charName]` with `useAsset()`
- Add loading states for character images
- Preload scene assets on mount

### Step 3: Migrate CinematicStage.tsx
**Changes:**
- Replace background image loading with `useAsset()`
- Add loading skeleton for smooth UX

### Step 4: Update Asset Loading Strategy
**File:** `client/src/lib/mediaStrategy.ts`

Add bandwidth-aware asset loading:
```typescript
export function useBandwidthStrategy() {
  // Detect connection quality
  // Return appropriate asset quality
  // Low bandwidth: lower quality images
  // High bandwidth: full quality
}
```

### Step 5: Add Error Boundaries
**File:** `client/src/components/AssetErrorBoundary.tsx`

```typescript
export function AssetErrorBoundary({ children, fallbackUrl }: Props) {
  // Catch asset loading errors
  // Show fallback or placeholder
  // Log errors for debugging
}
```

---

## Testing Strategy

### Unit Tests
- Test `getAssetUrl()` with various keys
- Test error handling for missing assets
- Test cache behavior

### Integration Tests
- Test asset loading in MainPlayer
- Test preloading performance
- Test fallback behavior

### Manual Testing Checklist
- [ ] All character images load from R2
- [ ] All video backgrounds load from R2
- [ ] All audio tracks load from R2
- [ ] No 404 errors in console
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Cache works (second load is faster)
- [ ] Fallback works when database is down

---

## Performance Optimization (Vercel Best Practices)

### 1. Eliminate Waterfalls (CRITICAL)
```typescript
// ❌ BAD: Sequential loading
const bgUrl = await getAssetUrl('background.main');
const charUrl = await getAssetUrl('character.yahya');

// ✅ GOOD: Parallel loading
const [bgUrl, charUrl] = await Promise.all([
  getAssetUrl('background.main'),
  getAssetUrl('character.yahya')
]);
```

### 2. Bundle Size Optimization
- Lazy load asset manager utilities
- Dynamic import for heavy components
- Tree-shake unused asset functions

### 3. Server-Side Caching
- Use `server-cache-lru` pattern for asset metadata
- Cache database queries with TTL
- Implement CDN caching headers

### 4. Client-Side Data Fetching
- Use SWR for automatic deduplication
- Implement optimistic updates
- Cache-first strategy for assets

---

## Rollback Plan

If migration fails:

1. **Revert assetUrls.ts**
   ```bash
   git checkout HEAD -- client/src/lib/assetUrls.ts
   ```

2. **Restore local assets**
   ```bash
   git checkout HEAD -- generated-assets/
   ```

3. **Clear database changes**
   ```sql
   -- Optional: if database was modified
   ROLLBACK;
   ```

---

## Success Metrics

### Quantitative
- Database asset count: >100 assets
- R2 URL usage: 100% of assets
- Local path usage: 0% in production
- Asset load time: <2s average
- Cache hit rate: >80%

### Qualitative
- No console errors related to assets
- Smooth loading experience
- Consistent asset delivery
- Easy to add new assets

---

## Timeline Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Database Verification | 4 tasks | 2 hours |
| Phase 2: Client Standardization | Design decision | 1 hour |
| Phase 3: Component Migration | 6 components | 8 hours |
| Phase 4: Deprecation | 4 tasks | 2 hours |
| Testing | Unit + Integration | 4 hours |
| **Total** | **All phases** | **17 hours** |

---

## Next Steps

1. **Immediate:** Run database verification script
2. **Today:** Create `useAsset` hook
3. **This Week:** Migrate MainPlayer.tsx
4. **Next Week:** Complete component migration
5. **Following Week:** Deprecation and cleanup

---

## Questions & Decisions Needed

1. **Should we keep the proxy system?**
   - Pro: Works with existing code
   - Con: Adds complexity
   - **Decision:** Keep during transition, deprecate after

2. **Should we implement asset versioning?**
   - Pro: Cache busting
   - Con: Complexity
   - **Decision:** Add after migration is complete

3. **Should we use CloudFront CDN in front of R2?**
   - Pro: Global CDN, faster
   - Con: Additional cost
   - **Decision:** Evaluate after migration

---

## References

- [Vercel React Best Practices](https://vercel.com/guides/react-best-practices)
- [Asset System Documentation](./docs/ASSET_SYSTEM.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Database Schema](./drizzle/schema.ts)
