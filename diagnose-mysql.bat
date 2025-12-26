@echo off
echo ========================================
echo MySQL Connection Diagnostics
echo ========================================
echo.

echo [1/5] Checking .env file...
if exist .env (
    echo ✓ .env file exists
    echo.
    echo DATABASE_URL contents:
    findstr "DATABASE_URL" .env
) else (
    echo ✗ .env file NOT FOUND!
    echo.
    echo Please create .env file with:
    echo DATABASE_URL="mysql://root:password@localhost:3306/eagle_construction"
    pause
    exit /b 1
)
echo.

echo [2/5] Testing MySQL connection...
mysql --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MySQL client is installed
) else (
    echo ✗ MySQL client not found in PATH
    echo Please install MySQL or add it to PATH
)
echo.

echo [3/5] Checking Prisma schema...
if exist prisma\schema.prisma (
    echo ✓ schema.prisma exists
    echo.
    echo Provider setting:
    findstr "provider" prisma\schema.prisma | findstr "db"
) else (
    echo ✗ schema.prisma NOT FOUND!
)
echo.

echo [4/5] Checking if database exists...
echo Enter your MySQL root password when prompted:
mysql -u root -p -e "SHOW DATABASES LIKE 'eagle_construction';"
if %errorlevel% equ 0 (
    echo.
    echo If you see 'eagle_construction' above, database exists.
) else (
    echo ✗ Failed to connect to MySQL
    echo.
    echo Common issues:
    echo   - MySQL server not running
    echo   - Wrong password
    echo   - MySQL not installed
)
echo.

echo [5/5] Checking Prisma Client...
if exist node_modules\.prisma\client (
    echo ✓ Prisma Client exists
) else (
    echo ✗ Prisma Client NOT FOUND!
    echo Run: npx prisma generate
)
echo.

echo ========================================
echo Diagnostic complete
echo ========================================
echo.
echo To fix issues, follow these steps:
echo.
echo 1. Create database:
echo    mysql -u root -p
echo    CREATE DATABASE eagle_construction;
echo    EXIT;
echo.
echo 2. Update .env file:
echo    DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/eagle_construction"
echo.
echo 3. Generate Prisma Client:
echo    npx prisma generate
echo.
echo 4. Run migrations:
echo    npx prisma migrate deploy
echo    or
echo    npx prisma migrate reset --force
echo.
pause
