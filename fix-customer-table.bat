@echo off
chcp 65001 >nul
echo ========================================
echo Customer テーブル修正スクリプト
echo ========================================
echo.

echo Customerテーブルに以下のカラムを追加します:
echo  - customerNumber (お客様番号)
echo  - address (住所)
echo  - updatedAt (更新日時)
echo.

echo MySQL に接続して修正を適用中...
echo.

mysql -u root -pAika1211 eagle_home -e "ALTER TABLE Customer ADD COLUMN IF NOT EXISTS customerNumber VARCHAR(191) NOT NULL UNIQUE, ADD COLUMN IF NOT EXISTS address VARCHAR(191) NULL, ADD COLUMN IF NOT EXISTS updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3), ADD INDEX IF NOT EXISTS Customer_customerNumber_idx(customerNumber), ADD INDEX IF NOT EXISTS Customer_email_idx(email);" 2>nul

if %errorlevel% equ 0 (
    echo ✓ テーブル修正成功！
    echo.
    echo 次のコマンドでSEEDを実行してください:
    echo    npm run db:seed
) else (
    echo ✗ 修正失敗。手動で実行してください:
    echo.
    echo mysql -u root -pAika1211 eagle_home
    echo.
    echo 次のSQLを実行:
    echo ALTER TABLE Customer 
    echo   ADD COLUMN customerNumber VARCHAR(191) NOT NULL UNIQUE,
    echo   ADD COLUMN address VARCHAR(191) NULL,
    echo   ADD COLUMN updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
    echo.
    echo ALTER TABLE Customer 
    echo   ADD INDEX Customer_customerNumber_idx(customerNumber),
    echo   ADD INDEX Customer_email_idx(email);
)

echo.
pause
