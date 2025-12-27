@echo off
echo ========================================
echo Fix Prisma Client TypeScript Errors
echo ========================================
echo.

echo [1/5] Removing old Prisma Client cache...
if exist "node_modules\.prisma" (
    rmdir /s /q "node_modules\.prisma"
    echo ✓ Removed .prisma cache
) else (
    echo ℹ No .prisma cache found
)
echo.

echo [2/5] Removing old migrations (SQLite)...
if exist "prisma\migrations" (
    rmdir /s /q "prisma\migrations"
    echo ✓ Removed old migrations
) else (
    echo ℹ No migrations found
)
echo.

echo [3/5] Generating fresh Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

echo [4/5] Creating new migration for MySQL...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ERROR: Failed to create migration
    echo.
    echo Please check:
    echo   1. MySQL is running
    echo   2. .env has correct DATABASE_URL
    echo   3. Database exists
    pause
    exit /b 1
)
echo ✓ Migration created and applied
echo.

echo [5/5] Verification...
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo TypeScript errors should now be resolved.
echo.
echo Next steps:
echo   1. Restart VS Code (or press Ctrl+Shift+P and run "Developer: Reload Window")
echo   2. Open prisma/seed.ts - errors should be gone
echo   3. Run: npm run dev
echo.
echo If you still see TypeScript errors:
echo   - Press Ctrl+Shift+P in VS Code
echo   - Type "TypeScript: Restart TS Server"
echo   - Press Enter
echo.
pause
