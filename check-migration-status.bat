@echo off
echo ========================================
echo Prisma Migration Status Check
echo ========================================
echo.

echo Checking migration status...
echo.
npx prisma migrate status

echo.
echo ========================================
echo Checking database tables...
echo ========================================
echo.

echo If you see "Database schema is up to date!", everything is fine.
echo If you see errors, follow the instructions below.
echo.
echo ========================================
echo Fix Instructions:
echo ========================================
echo.
echo Option 1: Reset migrations (RECOMMENDED)
echo   Remove-Item -Path "prisma\migrations" -Recurse -Force
echo   npx prisma migrate dev --name init
echo.
echo Option 2: Deploy existing migrations
echo   npx prisma migrate deploy
echo.
echo Option 3: Push schema directly (development only)
echo   npx prisma db push
echo.
pause
