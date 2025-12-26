# 🔧 SEED エラーのトラブルシューティング

## ❌ 発生しているエラー

```
Validation Error Count: 1
Error: Command failed with exit code 1: tsx prisma/seed.ts
```

このエラーは、Prismaのデータベーススキーマが正しくセットアップされていないことを示しています。

---

## ✅ 解決手順（順番に実行してください）

### ステップ1: Prisma Clientを再生成

```bash
npx prisma generate
```

**説明**: Prismaスキーマから型定義とクライアントを生成します。

---

### ステップ2: データベースファイルをリセット

```bash
# Windowsの場合
del prisma\dev.db

# macOS/Linuxの場合
rm -f prisma/dev.db
```

**説明**: 既存のSQLiteデータベースファイルを削除します。

---

### ステップ3: マイグレーションを実行

```bash
npx prisma migrate dev --name init_with_user
```

**もし「マイグレーション既に存在」エラーが出た場合**:

```bash
npx prisma migrate reset
```

これは以下を実行します:
- データベースを削除
- すべてのマイグレーションを再実行
- **自動的にseedも実行**

---

### ステップ4: SEEDを実行

```bash
npm run db:seed
```

---

## 🔍 詳細なトラブルシューティング

### エラーケース1: "Validation Error Count: 1"

**原因**: Prisma Clientが古いスキーマで生成されている

**解決策**:
```bash
# 1. Clientを再生成
npx prisma generate

# 2. node_modulesをクリア（必要な場合）
rm -rf node_modules/.prisma
npx prisma generate
```

---

### エラーケース2: "Table 'User' does not exist"

**原因**: マイグレーションが実行されていない

**解決策**:
```bash
# データベースをリセット（SEEDも自動実行される）
npx prisma migrate reset
```

---

### エラーケース3: "Unique constraint failed"

**原因**: 既にデータが存在している

**解決策**:
```bash
# オプション1: データベースをリセット
npx prisma migrate reset

# オプション2: 手動でクリア
npx prisma studio
# → Prisma Studio でデータを手動削除
```

---

## 📋 完全なセットアップ手順（初回または完全リセット）

Windowsの場合:

```bash
# 1. 既存のデータベースを削除
del prisma\dev.db 2>nul

# 2. Prisma Clientを生成
npx prisma generate

# 3. マイグレーションを実行（SEEDも自動実行）
npx prisma migrate reset --force
```

macOS/Linuxの場合:

```bash
# 1. 既存のデータベースを削除
rm -f prisma/dev.db

# 2. Prisma Clientを生成
npx prisma generate

# 3. マイグレーションを実行（SEEDも自動実行）
npx prisma migrate reset --force
```

---

## 🎯 クイックフィックス（最も確実な方法）

以下を順番に実行:

```bash
# Windowsの場合
npx prisma generate && npx prisma migrate reset --force

# macOS/Linuxの場合
npx prisma generate && npx prisma migrate reset --force
```

これで:
- ✅ Prisma Clientが再生成される
- ✅ データベースがリセットされる
- ✅ すべてのマイグレーションが適用される
- ✅ SEEDが自動実行される

---

## 🔄 SEEDが成功すると...

以下のメッセージが表示されます:

```
🌱 Starting seed...
🗑️  Clearing existing data...
👤 Creating default admin user...
✅ Created admin user: admin@eaglehome.com
📬 Seeding inquiries...
✅ Created 8 inquiries
👥 Seeding customers...
✅ Created 3 customers
🏗️  Seeding projects...
✅ Created 5 projects
🎉 Seed completed successfully!
```

---

## 📊 データの確認

### 方法1: Prisma Studio（推奨）

```bash
npx prisma studio
```

ブラウザで `http://localhost:5555` が開き、データを視覚的に確認できます。

### 方法2: SQLiteコマンド（上級者向け）

```bash
sqlite3 prisma/dev.db

# SQLiteシェル内で
.tables
SELECT * FROM User;
SELECT * FROM Inquiry LIMIT 3;
.quit
```

---

## ⚠️ よくある間違い

### ❌ 間違い1: `.env`ファイルがない

**解決策**: `.env`ファイルを作成

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### ❌ 間違い2: 依存関係がインストールされていない

**解決策**:
```bash
npm install
```

### ❌ 間違い3: Windowsでパスが認識されない

**解決策**: PowerShellまたはCMDで実行するか、Git Bashを使用

---

## 🆘 それでも解決しない場合

### 完全クリーンインストール:

```bash
# 1. node_modulesを削除
rm -rf node_modules

# 2. Prismaキャッシュを削除
rm -rf node_modules/.prisma

# 3. データベースを削除
rm -f prisma/dev.db
rm -f prisma/dev.db-journal

# 4. 再インストール
npm install

# 5. Prisma setup
npx prisma generate
npx prisma migrate reset --force
```

---

## ✅ 成功したら...

ログイン可能になります:

```bash
npm run dev
```

ブラウザで:
- **URL**: http://localhost:3000/login
- **Email**: admin@eaglehome.com
- **Password**: admin123

---

## 🔗 関連ドキュメント

- **USAGE_GUIDE.md** - 使用方法の完全ガイド
- **DATABASE_SETUP.md** - データベース設定の詳細
- **README.md** - プロジェクト概要

---

**質問がある場合**: 上記の手順を順番に試してください。ほとんどの場合、`npx prisma migrate reset --force` で解決します。
