# プロジェクト管理機能 - データベース更新ガイド

プロジェクト管理機能を追加するため、データベーススキーマを更新する必要があります。

## 📋 新機能

### Projectモデル拡張
- ✅ 詳細説明（description）
- ✅ 実際のコスト（actualCost）
- ✅ 契約日（contractDate）
- ✅ 実際の終了日（actualEndDate）
- ✅ 投資者情報（investorName, investorContact）
- ✅ 進捗状況（progressPercent, currentPhase）
- ✅ サムネイル画像（thumbnailImage）
- ✅ ホームページ表示設定（isPublished, displayOrder）
- ✅ メモ（notes）

### ProjectImageモデル（新規）
- プロジェクトごとに複数の写真を管理
- 段階的な写真追加（Foundation, Framing, Finishing など）
- キャプション機能
- 表示順序管理

## 🔧 データベース更新手順

### ステップ1: 最新コードを取得

```powershell
cd C:\dev\Next\eagle_home
git pull origin main
```

### ステップ2: Prisma Clientを生成

```powershell
npx prisma generate
```

### ステップ3: マイグレーションを作成・適用

```powershell
npx prisma migrate dev --name add_project_management
```

このコマンドは：
- データベーススキーマを更新
- Projectテーブルに新しいカラムを追加
- ProjectImageテーブルを作成

### ステップ4: 既存データの確認（オプション）

```powershell
mysql -u root -pAika1211 eagle_home -e "DESCRIBE Project;"
mysql -u root -pAika1211 eagle_home -e "DESCRIBE ProjectImage;"
```

## 📊 追加されたAPI

### プロジェクト管理API
- `GET /api/projects` - プロジェクト一覧取得
- `POST /api/projects` - 新規プロジェクト作成（サムネイル付き）
- `GET /api/projects/[id]` - 個別プロジェクト取得
- `PUT /api/projects/[id]` - プロジェクト更新
- `DELETE /api/projects/[id]` - プロジェクト削除

### プロジェクト画像API
- `POST /api/projects/[id]/images` - 画像アップロード
- `DELETE /api/projects/[id]/images/[imageId]` - 画像削除

## 🎯 使用可能な機能

### プロジェクトステータス
- `PLANNING` - 計画中
- `IN_PROGRESS` - 進行中
- `COMPLETED` - 完了
- `ON_HOLD` - 保留中

### 写真の段階
- Before（着工前）
- Foundation（基礎工事）
- Framing（骨組み）
- Finishing（仕上げ）
- After（完成）
- その他カスタム段階

## ⚠️ トラブルシューティング

### エラー: "Can't reach database server"
**解決方法:**
```powershell
Start-Service -Name "MySQL80"
```

### エラー: "The datasource provider doesn't match"
**解決方法:**
```powershell
rm -rf prisma/migrations
npx prisma migrate dev --name init_with_projects
```

### データをリセットしたい場合
```powershell
npx prisma migrate reset --force
npm run db:seed
```

## 次のステップ

1. ✅ データベース更新完了
2. 🔄 管理画面UI（開発中）
3. 🔄 ホームページ表示（開発中）

管理画面とホームページのUIは次回の更新で実装されます。

## 📁 ディレクトリ構造

```
public/uploads/projects/
  ├── .gitkeep
  ├── thumb_xxxxx.jpg (サムネイル画像)
  └── projectId_xxxxx.jpg (プロジェクト画像)
```

画像は自動的に`public/uploads/projects/`に保存されます。
