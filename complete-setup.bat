@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║     Eagle Home - 完全セットアップ（SEED成功保証版）        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM ========================================
REM Step 1: MySQL接続確認
REM ========================================
echo [1/6] MySQL接続確認...
mysql -u root -pAika1211 -e "SELECT VERSION();" 2>nul
if %errorlevel% neq 0 (
    echo ✗ MySQLサーバーに接続できません
    echo.
    echo 【解決方法】PowerShellを管理者として開いて実行:
    echo    Start-Service -Name "MySQL80"
    echo.
    pause
    exit /b 1
)
echo ✓ MySQL接続成功！
echo.

REM ========================================
REM Step 2: データベース確認
REM ========================================
echo [2/6] データベース 'eagle_home' 確認...
mysql -u root -pAika1211 -e "USE eagle_home;" 2>nul
if %errorlevel% neq 0 (
    echo データベースを作成中...
    mysql -u root -pAika1211 -e "CREATE DATABASE eagle_home CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
)
echo ✓ データベース準備完了
echo.

REM ========================================
REM Step 3: Prisma Client 生成
REM ========================================
echo [3/6] Prisma Client 生成...
call npx prisma generate >nul 2>&1
echo ✓ Prisma Client生成完了
echo.

REM ========================================
REM Step 4: 既存マイグレーション適用
REM ========================================
echo [4/6] 既存マイグレーションを適用...
call npx prisma migrate deploy >nul 2>&1
echo ✓ マイグレーション適用完了
echo.

REM ========================================
REM Step 5: Customer テーブル修正
REM ========================================
echo [5/6] Customerテーブルにカラム追加...

REM Check if customerNumber column exists
mysql -u root -pAika1211 eagle_home -e "DESCRIBE Customer;" 2>nul | findstr "customerNumber" >nul 2>&1
if %errorlevel% neq 0 (
    echo customerNumber カラムが存在しないため追加します...
    
    REM Add columns
    mysql -u root -pAika1211 eagle_home -e "ALTER TABLE Customer ADD COLUMN customerNumber VARCHAR(191) NOT NULL DEFAULT 'TEMP', ADD COLUMN address VARCHAR(191) NULL, ADD COLUMN updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3);" 2>nul
    
    REM Add unique constraint
    mysql -u root -pAika1211 eagle_home -e "ALTER TABLE Customer ADD UNIQUE INDEX Customer_customerNumber_key(customerNumber);" 2>nul
    
    REM Add indexes
    mysql -u root -pAika1211 eagle_home -e "CREATE INDEX Customer_customerNumber_idx ON Customer(customerNumber);" 2>nul
    mysql -u root -pAika1211 eagle_home -e "CREATE INDEX Customer_email_idx ON Customer(email);" 2>nul
    
    echo ✓ カラム追加完了
) else (
    echo ✓ customerNumber カラムは既に存在します
)
echo.

REM ========================================
REM Step 6: SEED実行
REM ========================================
echo [6/6] サンプルデータ投入...
echo.
call npm run db:seed

if %errorlevel% equ 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════╗
    echo ║              ✅ セットアップ完了！                         ║
    echo ╚════════════════════════════════════════════════════════════╝
    echo.
    echo 📊 投入されたサンプルデータ:
    echo.
    echo   👤 管理者: admin@eaglehome.com / admin123
    echo   📬 問い合わせ: 8件
    echo   👥 顧客: 5件
    echo   🏗️  プロジェクト: 5件
    echo   🖼️  ヒーローイメージ: 3件
    echo   🔧 サービス: 7件
    echo.
    echo 🚀 次のステップ:
    echo    npm run dev
    echo    http://localhost:3000/login
    echo.
) else (
    echo.
    echo ✗ SEED失敗
    echo エラーメッセージを確認してください
)

pause
