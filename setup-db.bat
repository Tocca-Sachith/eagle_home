@echo off
echo ========================================
echo Eagle Home - Database Setup (Windows)
echo ========================================
echo.

echo [1/4] Deleting existing database...
if exist prisma\dev.db del prisma\dev.db
if exist prisma\dev.db-journal del prisma\dev.db-journal
echo Done!
echo.

echo [2/4] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)
echo Done!
echo.

echo [3/4] Running migrations...
call npx prisma migrate deploy
if %errorlevel% neq 0 (
    echo WARNING: migrate deploy failed, trying migrate reset...
    call npx prisma migrate reset --force
    if %errorlevel% neq 0 (
        echo ERROR: Failed to run migrations
        pause
        exit /b 1
    )
)
echo Done!
echo.

echo [4/4] Running seed...
call npm run db:seed
if %errorlevel% neq 0 (
    echo ERROR: Seed failed
    pause
    exit /b 1
)
echo Done!
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo You can now login with:
echo   Email: admin@eaglehome.com
echo   Password: admin123
echo.
echo Start the development server with:
echo   npm run dev
echo.
pause
