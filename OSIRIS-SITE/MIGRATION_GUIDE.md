# OSIRIS Asset Migration - Step-by-Step Guide

## Overview
This guide will help you migrate all local media assets to S3 + Database, reducing your git repo from 3GB to ~50MB.

---

## Prerequisites

1. **AWS Account** with S3 access
2. **S3 Bucket** created (e.g., `osiris-novel-assets`)
3. **AWS Credentials** with these permissions:
   - `s3:PutObject`
   - `s3:GetObject`
   - `s3:HeadObject`
4. **Database** accessible (MySQL/Postgres)

---

## Step 1: Configure Environment Variables

Add these to your `.env` file:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=osiris-novel-assets

# Database (should already be configured)
DATABASE_URL=mysql://user:pass@host:3306/dbname
```

---

## Step 2: Install Dependencies

```bash
# Install the new dependency
pnpm install

# Or if using npm
npm install
```

---

## Step 3: Run the Migration Script

This script will:
1. Upload all local media files to S3
2. Register URLs in the database
3. Skip files that already exist

```bash
# Test run (dry run - no actual upload)
DRY_RUN=true npx tsx server/seedAssets.ts

# Real run (actually uploads)
npx tsx server/seedAssets.ts
```

**Expected output:**
```
============================================================
OSIRIS ASSET MIGRATION (S3 + DB)
============================================================
S3 Bucket: osiris-novel-assets
Region: us-east-1
------------------------------------------------------------
[S3 UPLOADED] assets/video/video-VIDEO-01-intro
[DB] videoBg.intro → https://osiris-novel-assets.s3.us-east-1...
...
============================================================
MIGRATION COMPLETE: 85/85 assets
============================================================
```

---

## Step 4: Verify Assets in Database

Check that assets were registered:

```bash
# Connect to your database and run:
SELECT key, kind, url FROM assets LIMIT 5;
```

Or use the API:
```bash
curl http://localhost:3000/api/media/listAssets
```

---

## Step 5: Update Client to Use API Endpoints

Replace the old `assetUrls.ts` with the new one:

```bash
# Backup old file
cp client/src/lib/assetUrls.ts client/src/lib/assetUrls.ts.backup

# Replace with new version
cp client/src/lib/assetUrls.ts.new client/src/lib/assetUrls.ts
```

---

## Step 6: Test the Application

```bash
# Start development server
pnpm dev

# Or
npm run dev
```

Test that:
1. Videos load from S3 URLs
2. Audio plays correctly
3. Images display
4. No 404 errors in browser console

---

## Step 7: Clean Up Git Repository

Remove large files from git history:

```bash
# 1. Remove from git cache (keep files locally)
git rm -r --cached node_modules
git rm -r --cached dist
git rm -r --cached generated-assets/master/temp
git rm -r --cached "generated-assets/music-tracks/TRACK *.m4a"
git rm -r --cached "generated-assets/music-tracks/TRACK *.mp3"
git rm -r --cached "generated-assets/voices/VOICE *.wav"
git rm -r --cached MUSIC-BG/*.aup3

# 2. Commit the changes
git add .gitignore
git commit -m "chore: migrate assets to S3 + DB, reduce repo size"

# 3. Force push (WARNING: rewrites history)
git push origin main --force
```

---

## Step 8: Verify Repository Size

```bash
# Check local repo size
du -sh .git

# Expected: <100MB (was 3GB)
```

---

## Troubleshooting

### S3 Upload Fails

**Error:** `Access Denied`
- Check AWS credentials in `.env`
- Verify S3 bucket permissions
- Ensure IAM user has `s3:PutObject` permission

**Error:** `File not found`
- Verify file exists in `generated-assets/`
- Check file permissions

### Database Connection Fails

**Error:** `Database not available`
- Check `DATABASE_URL` in `.env`
- Verify database is running
- Test connection: `mysql -u user -p -h host database`

### Assets Not Loading in Browser

**Error:** `404 Not Found` on `/api/media/getAsset`
- Verify `mediaRouter` is registered in `server/routers.ts`
- Check server is running
- Test API: `curl http://localhost:3000/api/media/listAssets`

---

## Rollback Plan

If something goes wrong:

1. **Restore old assetUrls.ts:**
   ```bash
   cp client/src/lib/assetUrls.ts.backup client/src/lib/assetUrls.ts
   ```

2. **Clear database entries:**
   ```sql
   TRUNCATE TABLE assets;
   ```

3. **Delete S3 objects (optional):**
   ```bash
   aws s3 rm s3://osiris-novel-assets/assets --recursive
   ```

---

## Expected Results

| Before | After |
|--------|-------|
| Git repo: 3.05 GB | Git repo: ~50 MB |
| Assets in: `generated-assets/` (local) | Assets in: S3 (cloud) |
| URLs: Local paths | URLs: S3 URLs via API |
| Clone time: 10+ min | Clone time: <30 sec |
| Duplicates: 2-4x | Duplicates: 0 |

---

## Files Created/Modified

- ✅ `server/seedAssets.ts` - Updated with S3 upload
- ✅ `server/_core/mediaRouter.ts` - New API endpoints
- ✅ `server/routers.ts` - Registered media router
- ✅ `client/src/lib/assetUrls.ts.new` - Updated client URLs
- ✅ `package.json` - Added mime-types dependency
- ✅ `.gitignore` - Excludes large files

---

## Next Steps After Migration

1. Set up CloudFront CDN for faster global delivery
2. Configure S3 lifecycle policies for cost optimization
3. Add asset versioning for cache busting
4. Implement asset preloading for better UX

---

**Questions?** Check the troubleshooting section or review the code in:
- `server/seedAssets.ts`
- `server/_core/mediaRouter.ts`
