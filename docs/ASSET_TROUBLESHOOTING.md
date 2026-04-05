# Asset Troubleshooting Guide

## Quick Diagnostic Commands

```bash
# 1. Check database assets
npx tsx server/scripts/verify-assets.ts

# 2. Test R2 connectivity
npx tsx server/scripts/test-r2.ts

# 3. Re-seed if needed
npx tsx server/inlineSeed.ts
```

## Common Issues

### ❌ Characters Not Displaying

**Symptoms:**
- Character portrait area is empty
- Browser console shows 404 errors for images
- `[AssetProxy] No override for...` logs

**Diagnostic Steps:**

1. **Check if overrides loaded:**
   ```javascript
   // In browser console
   await fetch('/api/trpc/system.assets').then(r => r.json())
   ```
   Should return array of assets with R2 URLs.

2. **Verify database has assets:**
   ```bash
   npx tsx -e "
   import { drizzle } from 'drizzle-orm/node-postgres';
   import { Pool } from 'pg';
   import { assets } from './drizzle/schema';
   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
   const db = drizzle(pool);
   const all = await db.select().from(assets);
   console.log('Total assets:', all.length);
   console.log('Characters:', all.filter(a => a.kind === 'character').map(a => a.key));
   pool.end();
   "
   ```

3. **Check proxy mapping:**
   ```javascript
   // In browser console on the game page
   console.log('[Debug] ASSET_URLS.characters.yahya:', ASSET_URLS.characters.yahya);
   ```
   Should show R2 URL, not `/api/trpc/...`

**Fixes:**
- If database empty: `npx tsx server/inlineSeed.ts`
- If wrong URLs: `npx tsx server/migrate-to-r2.ts`
- If proxy not working: Check `assetOverrides.ts` plural→singular mapping

---

### ❌ 400 Bad Request on tRPC Calls

**Symptoms:**
- Network tab shows `400 Bad Request` for `/api/trpc/media.getAsset`
- Console shows `API call failed: 400`

**Diagnostic Steps:**

1. **Check middleware is handling input:**
   ```bash
   # Look for these logs in server console
   [tRPC Middleware] GET /media.getAsset
   [tRPC Middleware] Decoded input: {"json":{"key":"character.yahya"}}
   ```

2. **Verify input format:**
   ```javascript
   // The URL should have base64 superjson input
   // Correct: /api/trpc/media.getAsset?input=eyJqc29uIjp7ImtleSI6ImNoYXJhY3Rlci55YWh5YSJ9fQ==
   // Wrong: /api/trpc/media.getAsset?key=character.yahya
   ```

**Fix:**
- Middleware fix is in `server/_core/index.ts`
- Ensure `createTrpcMiddleware` parses base64 superjson from query params

---

### ❌ Mixed URL Formats (Cloudfront + R2 + Local)

**Symptoms:**
- Some assets load, others don't
- Database query shows different URL prefixes

**Example:**
```sql
SELECT key, url FROM assets WHERE kind = 'character';
-- Some show: https://d2xsxph8kpxj0f.cloudfront.net/...
-- Some show: https://0daf765b6145d95da530d586fda49b1e.r2.cloudflarestorage.com/...
-- Some show: /generated-assets/...
```

**Fix:**
```bash
# Standardize all to R2
npx tsx server/migrate-to-r2.ts
```

---

### ❌ R2 URLs Not Working (CORS/404)

**Symptoms:**
- R2 URLs in database but images 404
- CORS errors in console

**Diagnostic:**
```bash
# Test R2 URL directly
curl -I "https://0daf765b6145d95da530d586fda49b1e.r2.cloudflarestorage.com/osiris-novel-assets/assets/character/character.yahya.jpg"
# Should return 200 OK
```

**Common Causes:**
1. **R2 bucket not public:** Configure public access in Cloudflare dashboard
2. **Wrong account ID in .env:** Verify `S3_ENDPOINT` matches your account
3. **Assets not uploaded to R2:** The database has URLs but files don't exist

**Fix:**
- Verify `.env.local` has correct credentials
- Check R2 dashboard for file existence
- Re-upload assets if needed via `server/seedAssets.ts`

---

## Debugging Checklist

When assets aren't working, check in this order:

- [ ] Database has assets: `SELECT COUNT(*) FROM assets;`
- [ ] Assets have R2 URLs (not cloudfront/local)
- [ ] Overrides API returns assets: `GET /api/trpc/system.assets`
- [ ] Browser console shows `[AssetProxy] Found override` logs
- [ ] ASSET_URLS.characters.xxx returns R2 URL (not /api/trpc)
- [ ] Image src in DOM is R2 URL
- [ ] Network tab shows 200 for R2 image requests

## Browser Console Debugging

```javascript
// 1. Check if overrides loaded
const overrides = await fetch('/api/trpc/system.assets')
  .then(r => r.json())
  .then(d => d.result?.data?.json || d);
console.log('Loaded assets:', overrides.length);

// 2. Check proxy resolution
console.log('Proxy check - yahya:', ASSET_URLS.characters.yahya);
console.log('Proxy check - narrator:', ASSET_URLS.characters.narrator);

// 3. Check character image element
const img = document.querySelector('img[alt*="Yahya"]');
console.log('Image src:', img?.src);
console.log('Image error:', img?.onerror);
```

## Server-Side Debugging

Add to `server/_core/mediaRouter.ts`:

```typescript
getAsset: publicProcedure
  .input(z.object({ key: z.string() }))
  .query(async ({ input }) => {
    console.log('[DEBUG] getAsset called with key:', input.key);
    const db = await getDb();
    const result = await db.select().from(assets).where(eq(assets.key, input.key)).limit(1);
    console.log('[DEBUG] Database result:', result);
    if (result.length === 0) throw new TRPCError({ code: "NOT_FOUND" });
    return result[0];
  }),
```

## Prevention Checklist

After fixing issues:

- [ ] Document any new asset keys added
- [ ] Run `migrate-to-r2.ts` to ensure URL consistency
- [ ] Test in incognito window (no cache)
- [ ] Check both desktop and mobile views
- [ ] Verify all character variants load (yahya_breakdown, yahya_confront, etc.)

## Emergency Reset

If everything is broken:

```bash
# 1. Clear database and re-seed
psql $DATABASE_URL -c "TRUNCATE TABLE assets;"
npx tsx server/inlineSeed.ts

# 2. Clear browser cache
# Open DevTools → Application → Storage → Clear site data

# 3. Restart dev server
npm run dev
```
