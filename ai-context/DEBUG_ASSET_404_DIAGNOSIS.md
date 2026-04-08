# Asset 404 Debug Diagnosis — Production Errors

## Error Summary

| Error | Count | Root Cause |
|-------|-------|------------|
| Video 404 (`digital-space.mp4`, `cosmic-opening.mp4`) | 2 | Files exist but manifest not loaded |
| Background aliases failing | 7 | `osiris_cosmic`, `corporate_lab`, `nicaea_council`, `granada_fall`, `qabil_habil_altar`, `qabil_habil_aftermath`, `osiris_interface` |
| `/assets.json` 404 | Multiple | Old fallback manifest missing |
| `/api/trpc/system.assets` 404 | Multiple | tRPC mediaRouter removed but code still calls it |

## Files with Broken Imports

### Missing `assetOverrides.ts` — CRITICAL
- `client/src/hooks/useAssetPreloader.ts` line 16 imports `initAssetOverrides, getAssetOverride`
- **This file doesn't exist** — will cause build/runtime failure

### Using Old `ASSET_URLS` Proxy (37 files)
| File | Import | Impact |
|------|--------|--------|
| `client/src/pages/Home.tsx` | `ASSET_URLS.backgrounds.*` | 7 background references |
| `client/src/pages/HomeFix.tsx` | `ASSET_URLS.backgrounds.*` | 1 background reference |
| `client/src/pages/PartZero.tsx` | `ASSET_URLS.backgrounds.osiris_cosmic` | Cinema background |
| `client/src/pages/PartOne.tsx` | `ASSET_URLS.backgrounds.qabil_habil_altar` | Cinema background |
| `client/src/pages/PartThree.tsx` | `ASSET_URLS.backgrounds.nicaea_council` | Cinema background |
| `client/src/pages/PartFour.tsx` | `ASSET_URLS.backgrounds.granada_fall` | Cinema background |
| `client/src/pages/PartSix.tsx` | `ASSET_URLS.backgrounds.corporate_lab` | Cinema background |
| `client/src/pages/PartTemplate.tsx` | `ASSET_URLS.backgrounds.osiris_cosmic` | Template bg |
| `client/src/lib/scenes/*.ts` (7 files) | `ASSET_URLS.backgrounds.*` | Scene backgrounds |
| `client/src/hooks/useAsset.ts` | `getAssetUrl, getAssetUrls` | Hook broken |
| `client/src/hooks/useAssetPreloader.ts` | `getAssetUrl, preloadAssets` | Preloader broken |
| `client/src/components/AssetDebug.tsx` | `initAssetOverrides` | Debug panel broken |
| `client/src/components/AssetManager.tsx` | `getAssetUrl` | Manager broken |
| `client/src/components/CinematicExperienceSystem.tsx` | `ASSET_URLS` | Cinematic system |
| `client/src/components/EnhancedCinematicPlayer.tsx` | `ASSET_URLS` | Player broken |

## Root Causes Identified

### 1. **Missing `assetOverrides.ts` Module**
```typescript
// useAssetPreloader.ts line 16
import { initAssetOverrides, getAssetOverride } from '@/lib/assetOverrides';
// ❌ File doesn't exist — causes import error
```

### 2. **AssetDebug.tsx Uses Old API**
```typescript
// AssetDebug.tsx line 2, 30
import { initAssetOverrides } from '../lib/assetOverrides'; // ❌ Missing
await initAssetOverrides({ timeoutMs: 5000 }); // ❌ Calls missing module
await fetch('/api/trpc/system.debug'); // ❌ tRPC endpoint removed
```

### 3. **Production Build Out of Sync**
The production errors show:
- `assetUrls-BAVlFG6r.js` — Old bundled code
- Trying to fetch `/assets.json` — Old fallback
- Calling `/api/trpc/system.assets` — Removed endpoint

**Conclusion:** Production was built BEFORE asset system migration completed.

### 4. **Manifest Not Loading**
The `assets.ts` system requires `loadAssetManifest()` to be called. If not called:
- `manifestCache` is null
- All `getAsset()` calls return empty string
- Background aliases fail

## Verification: Files Exist ✅

| Asset | Path | Status |
|-------|------|--------|
| `digital-space.mp4` | `/public/assets/video-bg/digital-space.mp4` | ✅ 1.9MB |
| `cosmic-opening.mp4` | `/public/assets/video-bg/cosmic-opening.mp4` | ✅ 972KB |
| `background.01-07` | `/public/assets/images/0[1-7].jpg` | ✅ All present |
| `asset-manifest.json` | `/public/asset-manifest.json` | ✅ 114 assets |

**Files exist — problem is code trying to use OLD system.**

## Fix Strategy

### Immediate Fixes (Production Broken)

1. **Fix `useAssetPreloader.ts`**
   - Remove `assetOverrides` imports
   - Use new `assets.ts` API

2. **Fix `AssetDebug.tsx`**
   - Remove `initAssetOverrides` import
   - Update to use `loadAssetManifest()` from `assets.ts`

3. **Ensure Manifest Loading**
   - Add `loadAssetManifest()` call in app initialization
   - Verify it's called before any asset access

### Migration Path (37 files)

Replace `ASSET_URLS.backgrounds.xxx` with `getAsset('background.xxx')`:

```typescript
// BEFORE
import { ASSET_URLS } from '@/lib/assetUrls';
<img src={ASSET_URLS.backgrounds.osiris_cosmic} />

// AFTER
import { getAsset } from '@/lib/assets';
<img src={getAsset('background.osiris_cosmic')} />
// Or use: background('osiris_cosmic')
```

## Quick Fix Commands

```bash
# Find all ASSET_URLS.backgrounds usage
grep -r "ASSET_URLS.backgrounds" client/src --include="*.ts" --include="*.tsx"

# Find all assetUrls imports
grep -r "from.*assetUrls" client/src --include="*.ts" --include="*.tsx"

# Find assetOverrides references
grep -r "assetOverrides" client/src --include="*.ts" --include="*.tsx"
```

## Priority Actions

| Priority | Action | Impact |
|----------|--------|--------|
| **P0** | Fix `useAssetPreloader.ts` import error | Build/runtime failure |
| **P0** | Fix `AssetDebug.tsx` | Console spam, debug failure |
| **P1** | Add `loadAssetManifest()` to app init | All assets fail without this |
| **P2** | Migrate 37 files from `ASSET_URLS` to `getAsset()` | Clean code, no proxy overhead |
| **P3** | Rebuild and redeploy | Fix production |

---

**Status:** Diagnosis complete. Ready to implement fixes.
