@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║      プロジェクト管理機能 - マイグレーション実行          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/4] MySQL接続確認...
mysql -u root -pAika1211 -e "SELECT VERSION();" 2>nul
if %errorlevel% neq 0 (
    echo ✗ MySQLサーバーに接続できません
    echo.
    echo 【解決方法】PowerShellで実行:
    echo    Start-Service -Name "MySQL80"
    echo.
    pause
    exit /b 1
)
echo ✓ MySQL接続成功
echo.

echo [2/4] Prisma Client生成...
call npx prisma generate >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Prisma Client生成完了
) else (
    echo ✗ Prisma Client生成失敗
    pause
    exit /b 1
)
echo.

echo [3/4] マイグレーション適用...
echo.
echo 以下の変更をデータベースに適用します:
echo   • Projectテーブルに13個の新しいカラムを追加
echo   • ProjectImageテーブルを新規作成
echo   • 外部キー制約を追加
echo.
call npx prisma migrate deploy
if %errorlevel% equ 0 (
    echo ✓ マイグレーション適用成功
) else (
    echo ✗ マイグレーション失敗
    echo.
    echo マイグレーションエラーが発生しました。
    echo 詳細は上記のエラーメッセージを確認してください。
    echo.
    pause
    exit /b 1
)
echo.

echo [4/4] データベース構造確認...
mysql -u root -pAika1211 eagle_home -e "DESCRIBE Project;" 2>nul | findstr "updatedAt" >nul
if %errorlevel% equ 0 (
    echo ✓ Project テーブル更新確認
) else (
    echo ✗ Project テーブル更新が確認できません
)

mysql -u root -pAika1211 eagle_home -e "SHOW TABLES LIKE 'ProjectImage';" 2>nul | findstr "ProjectImage" >nul
if %errorlevel% equ 0 (
    echo ✓ ProjectImage テーブル作成確認
) else (
    echo ✗ ProjectImage テーブルが見つかりません
)
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✅ マイグレーション完了！                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📊 追加された機能:
echo.
echo   📝 プロジェクト詳細情報
echo      - 詳細説明、実際のコスト
echo      - 契約日、実際の終了日
echo      - 投資者情報
echo.
echo   📸 プロジェクト画像管理
echo      - 複数の写真をアップロード
echo      - 段階的な写真管理（Before, During, After）
echo      - キャプション機能
echo.
echo   🏠 ホームページ表示
echo      - サムネイル画像
echo      - 公開/非公開設定
echo      - 表示順序管理
echo.
echo   📈 進捗管理
echo      - 進捗率（%%）
echo      - 現在の工事段階
echo      - メモ機能
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🚀 次のステップ:
echo.
echo    1. 開発サーバーを起動:
echo       npm run dev
echo.
echo    2. プロジェクト管理画面:
echo       http://localhost:3000/admin/projects
echo.
echo    3. APIエンドポイント:
echo       GET/POST /api/projects
echo       GET/PUT/DELETE /api/projects/[id]
echo       POST /api/projects/[id]/images
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
