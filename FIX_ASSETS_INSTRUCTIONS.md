# 🚨 Asset Fix Instructions - Execute Manually

## Current Issue
The asset loading is failing because:
- Database has only 3 basic assets instead of 20+ character assets
- Console shows: `[AssetOverrides] Found array at path: 0 Length: 0`
- Characters, videos, and audio are not loading

## 🔧 Manual Fix Steps

### Option 1: Use npm Script (Recommended)
```bash
# In terminal, from OSIRIS-SITE directory:
npm run db:seed-assets
```

### Option 2: Run SQL Script Directly
```bash
# If you have psql command line:
psql "your-database-url" < fix-character-assets.sql
```

### Option 3: Use Database GUI
1. Open your database client (pgAdmin, Supabase dashboard, etc.)
2. Copy and paste the contents of `fix-character-assets.sql`
3. Execute the SQL script

### Option 4: Use Node.js Script
```bash
# Run the Node.js script I created:
node run-character-fix.js
```

## ✅ Verification Steps

After running the fix:

1. **Check Database:**
```sql
SELECT COUNT(*) FROM assets WHERE kind = 'character';
-- Should show 20+ instead of 3
```

2. **Check Browser:**
- Open `http://localhost:5173/debug-assets.html`
- Click "Check Database"
- Should show assets loaded

3. **Check Console:**
- Look for `[AssetProxy] Found override` messages
- Should show R2 URLs instead of empty arrays

## 🎯 Expected Result

After fix:
- ✅ Character images load properly
- ✅ Video backgrounds play
- ✅ Audio tracks work
- ✅ Console shows: `[AssetOverrides] Found array at path: 0 Length: 20+`

## 🚨 If Still Broken

1. Check `.env.local` has correct `DATABASE_URL`
2. Verify R2 credentials are set
3. Check network tab for 404 errors
4. Run the debug HTML tool for detailed diagnostics

## 📞 Support

If issues persist:
1. Check `docs/ASSET_TROUBLESHOOTING.md`
2. Use the debug HTML tool
3. Check browser console for specific error messages
