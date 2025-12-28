@echo off
chcp 65001 >nul
echo ========================================
echo Eagle Home データベースセットアップ
echo ========================================
echo.

echo ステップ 1: MySQL接続テスト...
echo.

REM Test MySQL connection
mysql -u root -pAika1211 -e "SELECT VERSION();" 2>nul
if %errorlevel% neq 0 (
    echo ✗ MySQLサーバーに接続できません
    echo.
    echo 【解決方法】
    echo 1. MySQLサービスが起動しているか確認してください
    echo    - Windowsキー + R → services.msc と入力
    echo    - MySQL80 サービスを探して「開始」
    echo.
    echo 2. または PowerShell で実行:
    echo    Start-Service -Name "MySQL80"
    echo.
    echo 詳細は MYSQL_TROUBLESHOOTING_JP.md をご覧ください
    echo.
    pause
    exit /b 1
)

echo ✓ MySQL接続成功！
echo.

echo ステップ 2: データベース確認・作成...
mysql -u root -pAika1211 -e "CREATE DATABASE IF NOT EXISTS eagle_home CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %errorlevel% equ 0 (
    echo ✓ データベース 'eagle_home' 準備完了
) else (
    echo ✗ データベース作成失敗
    pause
    exit /b 1
)

echo.
echo ステップ 3: Prisma Client 生成...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ✗ Prisma Client生成失敗
    pause
    exit /b 1
)
echo ✓ Prisma Client生成完了

echo.
echo ステップ 4: マイグレーション実行...
call npx prisma migrate dev --name add_customer_management
if %errorlevel% neq 0 (
    echo ✗ マイグレーション失敗
    echo.
    echo 【解決方法】
    echo.
    echo もし「マイグレーションが既に存在する」というエラーの場合:
    echo   1. npx prisma migrate status で状態を確認
    echo   2. npx prisma migrate deploy で適用
    echo.
    echo もしデータベースをリセットしたい場合（データが削除されます）:
    echo   npx prisma migrate reset --force
    echo   その後、もう一度このスクリプトを実行してください
    echo.
    echo 詳細は SEED_ERROR_FIX_JP.md をご覧ください
    echo.
    pause
    exit /b 1
)
echo ✓ マイグレーション完了

echo.
echo ステップ 5: サンプルデータ投入...
call npm run db:seed
if %errorlevel% neq 0 (
    echo ✗ SEED失敗
    pause
    exit /b 1
)
echo ✓ サンプルデータ投入完了

echo.
echo ========================================
echo セットアップ完了！
echo ========================================
echo.
echo 投入されたサンプルデータ:
echo  - 管理者ユーザー: admin@eaglehome.com / admin123
echo  - 問い合わせ: 8件
echo  - 顧客: 5件（お客様番号付き）
echo  - プロジェクト: 5件
echo  - ヒーローイメージ: 3件
echo  - サービス: 7件
echo.
echo 次のコマンドで開発サーバーを起動できます:
echo   npm run dev
echo.
echo 管理画面: http://localhost:3000/login
echo.
pause
