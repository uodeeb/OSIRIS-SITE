@echo off
echo Fixing git commit issue...
echo.

REM Remove the problematic nul file
del /f nul 2>nul
echo Removed nul file

REM Add files individually
git add client/src/components/MainPlayer.tsx
git add client/src/lib/assetOverrides.ts
git add client/src/lib/assetUrls.ts
git add server/_core/index.ts
git add server/inlineSeed.ts
git add client/src/hooks/useAssetPreloader.ts
git add scripts/verify-deployment-assets.ts
echo Files staged

REM Create commit
git commit -m "fix(assets): resolve character images and music display issues"
echo Commit created

REM Push to main
git push origin main
echo Pushed to GitHub

pause
