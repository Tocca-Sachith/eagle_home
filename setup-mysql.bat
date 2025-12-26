@echo off
echo ========================================
echo Eagle Home - MySQL Setup (Windows)
echo ========================================
echo.

echo This script will set up the database with MySQL.
echo.
echo Prerequisites:
echo   - MySQL server must be running
echo   - .env file must contain valid MySQL connection string
echo.
echo Example .env file:
echo   DATABASE_URL="mysql://root:password@localhost:3306/eagle_construction"
echo   NEXTAUTH_SECRET="your-secret-key"
echo   NEXTAUTH_URL="http://localhost:3000"
echo.

set /p CONTINUE="Do you want to continue? (y/n): "
if /i not "%CONTINUE%"=="y" (
    echo Setup cancelled.
    pause
    exit /b 0
)

echo.
echo [1/3] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma Client
    echo.
    echo Please check:
    echo   1. prisma/schema.prisma file exists
    echo   2. @prisma/client is installed
    pause
    exit /b 1
)
echo Done!
echo.

echo [2/3] Running migrations...
call npx prisma migrate deploy
if %errorlevel% neq 0 (
    echo WARNING: migrate deploy failed, trying migrate reset...
    call npx prisma migrate reset --force
    if %errorlevel% neq 0 (
        echo ERROR: Failed to run migrations
        echo.
        echo Please check:
        echo   1. MySQL server is running
        echo   2. .env file has correct DATABASE_URL
        echo   3. Database exists or user has permission to create it
        echo.
        echo To create database manually:
        echo   mysql -u root -p
        echo   CREATE DATABASE eagle_construction;
        echo   EXIT;
        pause
        exit /b 1
    )
)
echo Done!
echo.

echo [3/3] Running seed...
call npm run db:seed
if %errorlevel% neq 0 (
    echo ERROR: Seed failed
    echo.
    echo Please check:
    echo   1. Database connection is working
    echo   2. Tables were created successfully
    pause
    exit /b 1
)
echo Done!
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Database: MySQL
echo.
echo You can now login with:
echo   Email: admin@eaglehome.com
echo   Password: admin123
echo.
echo Start the development server with:
echo   npm run dev
echo.
echo To view data in Prisma Studio:
echo   npx prisma studio
echo.
pause
