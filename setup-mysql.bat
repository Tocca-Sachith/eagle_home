@echo off
echo ========================================
echo Eagle Home MySQL Setup
echo ========================================
echo.

echo Checking MySQL connection...
echo.

REM Check if .env is configured
findstr /C:"mysql://" .env >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: DATABASE_URL is not configured for MySQL in .env file
    echo.
    echo Please update your .env file with MySQL credentials:
    echo DATABASE_URL="mysql://username:password@localhost:3306/eagle_construction"
    echo.
    pause
    exit /b 1
)

echo Step 1: Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)

echo.
echo Step 2: Creating database and running migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ERROR: Failed to run migrations
    echo.
    echo Common solutions:
    echo 1. Make sure MySQL server is running
    echo 2. Verify database credentials in .env
    echo 3. Ensure database 'eagle_construction' exists
    echo.
    pause
    exit /b 1
)

echo.
echo Step 3: Seeding database with sample data...
call npm run db:seed
if %errorlevel% neq 0 (
    echo WARNING: Seed failed but migration was successful
    echo You can run 'npm run db:seed' manually later
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo You can now run: npm run dev
echo.
pause
