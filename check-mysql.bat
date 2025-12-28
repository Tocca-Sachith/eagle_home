@echo off
echo ========================================
echo Eagle Home Database Connection Test
echo ========================================
echo.

echo Testing MySQL connection...
echo.

REM Try to connect to MySQL
mysql -u root -pAika1211 -e "SELECT VERSION();" 2>nul
if %errorlevel% equ 0 (
    echo ✓ MySQL connection successful!
    echo.
    
    echo Checking if eagle_home database exists...
    mysql -u root -pAika1211 -e "USE eagle_home; SELECT 'Database exists' as status;" 2>nul
    if %errorlevel% equ 0 (
        echo ✓ Database 'eagle_home' exists
    ) else (
        echo ✗ Database 'eagle_home' does not exist
        echo.
        echo Creating database 'eagle_home'...
        mysql -u root -pAika1211 -e "CREATE DATABASE eagle_home CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        if %errorlevel% equ 0 (
            echo ✓ Database created successfully!
        ) else (
            echo ✗ Failed to create database
            pause
            exit /b 1
        )
    )
    
    echo.
    echo Database is ready!
    echo You can now run: npx prisma migrate dev --name init
    
) else (
    echo ✗ Cannot connect to MySQL
    echo.
    echo Possible issues:
    echo 1. MySQL service is not running
    echo    - Start MySQL service from Services (services.msc)
    echo    - Or run: net start MySQL80 ^(or your MySQL service name^)
    echo.
    echo 2. MySQL is running on a different port
    echo    - Check your MySQL port in my.ini or my.cnf
    echo    - Update DATABASE_URL in .env file if needed
    echo.
    echo 3. Password is incorrect
    echo    - Verify password for root user
    echo.
)

echo.
pause
