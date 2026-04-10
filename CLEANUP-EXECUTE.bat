@echo off
REM OSIRIS Novel - File Cleanup Script for Windows
REM This script moves unlinked files to _ARCHIVE and documentation to project_history

echo ==========================================
echo OSIRIS Novel - File Cleanup
echo ==========================================

REM Create archive subdirectories if they don't exist
mkdir "_ARCHIVE\orphaned-scripts" 2>nul
mkdir "_ARCHIVE\orphaned-images" 2>nul
mkdir "_ARCHIVE\build-artifacts" 2>nul
mkdir "_ARCHIVE\temp-docs" 2>nul
mkdir "project_history\documentation" 2>nul
mkdir "project_history\backups" 2>nul

echo.
echo [1/5] Moving orphaned JavaScript/Node scripts...
move /Y "browser-test.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "check-db.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "db-test.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "repair_main_player.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "run-character-fix.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "run-insert.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "seed-database.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "seed-database-browser.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "seed-assets.html" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "seed-db.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "test-b64.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "test-b64.bat" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "test-db.ts" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "test-seed-browser.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "trpc-debug.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "report-new-osiris.md" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "database-check.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "copy-manifest.js" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "push-assets-fix.bat" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "fix.cjs" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "insert-basic-assets.sql" "_ARCHIVE\orphaned-scripts\" 2>nul
move /Y "fix-character-assets.sql" "_ARCHIVE\orphaned-scripts\" 2>nul

echo.
echo [2/5] Moving orphaned image files...
move /Y "06_01_28_36.png" "_ARCHIVE\orphaned-images\" 2>nul
move /Y "10_01_33_09.png" "_ARCHIVE\orphaned-images\" 2>nul
move /Y "لاخننس.webp" "_ARCHIVE\orphaned-images\" 2>nul
move /Y "logo-osiris.ai" "_ARCHIVE\orphaned-images\" 2>nul

echo.
echo [3/5] Moving build artifacts...
move /Y "osiris-novel.zip" "_ARCHIVE\build-artifacts\" 2>nul

echo.
echo [4/5] Moving temporary documentation...
move /Y "CLEANUP-PLAN.md" "_ARCHIVE\temp-docs\" 2>nul
move /Y "FILE-LINKAGE-ANALYSIS.md" "_ARCHIVE\temp-docs\" 2>nul
move /Y "PROJECT-FILE-INVENTORY.md" "_ARCHIVE\temp-docs\" 2>nul

echo.
echo [5/5] Moving project documentation to project_history...
move /Y "ASSET_GAP_ANALYSIS.md" "project_history\documentation\" 2>nul
move /Y "ASSET_INVENTORY_MASTER.md" "project_history\documentation\" 2>nul
move /Y "ASSET_MIGRATION_PROGRESS.md" "project_history\documentation\" 2>nul
move /Y "ASSET_PRESENTATION_REVISION_REPORT.md" "project_history\documentation\" 2>nul
move /Y "ASSET_SYSTEM_IMPLEMENTATION.md" "project_history\documentation\" 2>nul
move /Y "ASSET_TRIGGER_TABLE.md" "project_history\documentation\" 2>nul
move /Y "ASSET_TRIGGER_TABLE_DETAILED.md" "project_history\documentation\" 2>nul
move /Y "CHARACTER_ASSET_FIX_PLAN.md" "project_history\documentation\" 2>nul
move /Y "CINEMATIC_EXPERIENCE_SYSTEM.md" "project_history\documentation\" 2>nul
move /Y "CLOUDFLARE_R2_MIGRATION_PLAN.md" "project_history\documentation\" 2>nul
move /Y "FIX_ASSETS_INSTRUCTIONS.md" "project_history\documentation\" 2>nul
move /Y "IMPLEMENTATION_ROADMAP.md" "project_history\documentation\" 2>nul
move /Y "ISSUES_ANALYSIS.md" "project_history\documentation\" 2>nul
move /Y "MIGRATION_GUIDE.md" "project_history\documentation\" 2>nul
move /Y "OPTIMIZATION_PROGRESS.md" "project_history\documentation\" 2>nul
move /Y "OSIRIS_ASSET_PROMPTS.md" "project_history\documentation\" 2>nul
move /Y "OSIRIS_ASSET_PROMPT_GUIDE.md" "project_history\documentation\" 2>nul
move /Y "OSIRIS_CINEMATIC_TIMELINE.md" "project_history\documentation\" 2>nul
move /Y "PHASE2_COMPLETION_REPORT.md" "project_history\documentation\" 2>nul
move /Y "PRODUCTION_READINESS_EXECUTION.md" "project_history\documentation\" 2>nul
move /Y "PRODUCTION_READINESS_FINAL.md" "project_history\documentation\" 2>nul
move /Y "README_OSIRIS_COMPLETE.md" "project_history\documentation\" 2>nul
move /Y "SYNC-RESTORATION-PLAN.md" "project_history\documentation\" 2>nul
move /Y "SYNC_SYSTEM_DOCUMENTATION.md" "project_history\documentation\" 2>nul
move /Y "UX_AUDIT_REPORT_FULL.md" "project_history\documentation\" 2>nul
move /Y "UX_UI_AUDIT_REPORT.md" "project_history\documentation\" 2>nul
move /Y "UX_UI_CODE_REVIEW_COMPLETE.md" "project_history\documentation\" 2>nul

echo.
echo ==========================================
echo Cleanup Complete!
echo ==========================================
echo.
echo Files moved to _ARCHIVE/: Check the folders
echo Documentation moved to project_history/documentation/
echo.
echo NEXT STEPS:
echo 1. Review moved files in _ARCHIVE/
echo 2. Delete generated-assets/ folder manually (duplicates client/public/)
echo 3. Commit changes: git add . && git commit -m "cleanup: Archive unlinked files"
echo.
pause
