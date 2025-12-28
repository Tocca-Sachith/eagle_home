@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║      Eagle Home - SEED データ投入（確実版）                ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM ========================================
REM Step 1: MySQL接続確認
REM ========================================
echo [1/5] MySQL接続確認...
mysql -u root -pAika1211 -e "SELECT VERSION();" 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ✗ エラー: MySQLサーバーに接続できません
    echo.
    echo 【解決方法】PowerShellを管理者として開いて実行:
    echo    Start-Service -Name "MySQL80"
    echo.
    echo または、services.msc で MySQL80 サービスを起動してください
    echo.
    pause
    exit /b 1
)
echo ✓ MySQL接続成功！
echo.

REM ========================================
REM Step 2: データベース確認
REM ========================================
echo [2/5] データベース 'eagle_home' 確認...
mysql -u root -pAika1211 -e "USE eagle_home;" 2>nul
if %errorlevel% neq 0 (
    echo ✗ データベース 'eagle_home' が存在しません
    echo ⚙️  データベースを作成中...
    mysql -u root -pAika1211 -e "CREATE DATABASE eagle_home CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    if %errorlevel% equ 0 (
        echo ✓ データベース作成成功
    ) else (
        echo ✗ データベース作成失敗
        pause
        exit /b 1
    )
) else (
    echo ✓ データベース存在確認
)
echo.

REM ========================================
REM Step 3: Prisma Client 生成
REM ========================================
echo [3/5] Prisma Client 生成中...
call npx prisma generate >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Prisma Client 生成完了
) else (
    echo ✗ Prisma Client 生成失敗
    pause
    exit /b 1
)
echo.

REM ========================================
REM Step 4: マイグレーション実行
REM ========================================
echo [4/5] データベーススキーマを更新中...
echo.
echo ⚠️  注意: 既存データがある場合は削除されます
echo.
set /p continue="続行しますか？ (y/n): "
if /i not "%continue%"=="y" (
    echo.
    echo キャンセルされました
    pause
    exit /b 0
)
echo.

REM マイグレーションをリセット（確実にスキーマを更新）
echo マイグレーションを実行中...
call npx prisma migrate reset --force --skip-seed
if %errorlevel% equ 0 (
    echo ✓ マイグレーション完了
) else (
    echo ✗ マイグレーション失敗
    echo.
    echo マイグレーションのログを確認してください
    pause
    exit /b 1
)
echo.

REM ========================================
REM Step 5: SEED実行
REM ========================================
echo [5/5] サンプルデータを投入中...
echo.
call npm run db:seed
if %errorlevel% equ 0 (
    echo.
    echo ╔════════════════════════════════════════════════════════════╗
    echo ║              ✅ SEED 完了しました！                         ║
    echo ╚════════════════════════════════════════════════════════════╝
    echo.
    echo 📊 投入されたサンプルデータ:
    echo.
    echo   👤 管理者ユーザー
    echo      Email: admin@eaglehome.com
    echo      Password: admin123
    echo.
    echo   📬 問い合わせ: 8件
    echo   👥 顧客: 5件 (お客様番号: CUS-YYYYMMDD-001～005)
    echo   🏗️  プロジェクト: 5件
    echo   🖼️  ヒーローイメージ: 3件
    echo   🔧 サービス: 7件
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo 🚀 次のステップ:
    echo.
    echo    1. 開発サーバーを起動:
    echo       npm run dev
    echo.
    echo    2. ブラウザで開く:
    echo       http://localhost:3000
    echo.
    echo    3. 管理画面にログイン:
    echo       http://localhost:3000/login
    echo.
    echo ═══════════════════════════════════════════════════════════
) else (
    echo.
    echo ✗ SEED失敗
    echo.
    echo エラーメッセージを確認して、SEED_ERROR_FIX_JP.md を参照してください
)

echo.
pause
