@echo off
chcp 65001 >nul
echo ========================================
echo Eagle Home データベースリセット
echo ========================================
echo.
echo ⚠️  警告: この操作は以下を実行します:
echo    - すべてのテーブルを削除
echo    - マイグレーションを最初から実行
echo    - サンプルデータを投入
echo.
echo ⚠️  既存のデータはすべて削除されます！
echo.
set /p confirm="続行しますか？ (yes/no): "

if /i not "%confirm%"=="yes" (
    echo.
    echo キャンセルされました。
    pause
    exit /b 0
)

echo.
echo MySQL接続確認...
mysql -u root -pAika1211 -e "SELECT VERSION();" 2>nul
if %errorlevel% neq 0 (
    echo ✗ MySQLサーバーに接続できません
    echo.
    echo MySQLサービスを起動してください:
    echo   Start-Service -Name "MySQL80"
    echo.
    pause
    exit /b 1
)

echo ✓ MySQL接続成功
echo.

echo データベースをリセット中...
echo.
call npx prisma migrate reset --force

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ リセット完了！
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
    echo 開発サーバーを起動: npm run dev
    echo.
) else (
    echo.
    echo ✗ リセット失敗
    echo 詳細は SEED_ERROR_FIX_JP.md をご覧ください
    echo.
)

pause
