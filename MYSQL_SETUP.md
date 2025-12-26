# 🐬 MySQL セットアップガイド

## 📋 前提条件

MySQLサーバーがインストールされ、起動している必要があります。

---

## ステップ1: データベースを作成

MySQLにログインして、データベースを作成します：

### Windowsの場合（コマンドプロンプトまたはPowerShell）:

```bash
# MySQLにログイン
mysql -u root -p

# データベースを作成
CREATE DATABASE eagle_construction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# ユーザーを作成（オプション）
CREATE USER 'eagle_user'@'localhost' IDENTIFIED BY 'your_password_here';

# 権限を付与
GRANT ALL PRIVILEGES ON eagle_construction.* TO 'eagle_user'@'localhost';
FLUSH PRIVILEGES;

# 終了
EXIT;
```

---

## ステップ2: `.env` ファイルを設定

プロジェクトルート（`C:\dev\Next\eagle_home`）に `.env` ファイルを作成または編集：

### オプション1: rootユーザーを使用（開発環境）

```env
DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/eagle_construction"
NEXTAUTH_SECRET="eagle-home-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### オプション2: 専用ユーザーを使用（推奨）

```env
DATABASE_URL="mysql://eagle_user:your_password_here@localhost:3306/eagle_construction"
NEXTAUTH_SECRET="eagle-home-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### リモートMySQLサーバーの場合:

```env
DATABASE_URL="mysql://username:password@remote-host:3306/eagle_construction"
NEXTAUTH_SECRET="eagle-home-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**重要**: パスワードに特殊文字が含まれる場合はURLエンコードが必要です：
- `@` → `%40`
- `#` → `%23`
- `!` → `%21`
- など

---

## ステップ3: Prisma Clientを生成

```bash
npx prisma generate
```

---

## ステップ4: マイグレーションを実行

### 新規データベースの場合:

```bash
npx prisma migrate dev --name init
```

### 既存データをリセットしてSEED実行:

```bash
npx prisma migrate reset --force
```

これにより：
- ✅ すべてのテーブルが削除される
- ✅ マイグレーションが再実行される
- ✅ SEEDデータが自動投入される

---

## ステップ5: 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000/login にアクセス

```
メールアドレス: admin@eaglehome.com
パスワード: admin123
```

---

## 🚀 クイックセットアップ（PowerShell）

以下のコマンドをコピー＆ペーストして、**パスワード部分を実際のMySQLパスワードに置き換えて**実行：

```powershell
# .envファイルを作成（パスワードを変更してください）
@"
DATABASE_URL="mysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/eagle_construction"
NEXTAUTH_SECRET="eagle-home-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
"@ | Out-File -FilePath .env -Encoding utf8 -Force

# Prismaセットアップ
npx prisma generate
npx prisma migrate reset --force
```

---

## 🔍 トラブルシューティング

### エラー1: "Can't connect to MySQL server"

**原因**: MySQLサーバーが起動していない

**解決策**:
```bash
# Windowsの場合（管理者権限でコマンドプロンプト）
net start MySQL80

# または、Windowsサービスから「MySQL」を起動
```

---

### エラー2: "Access denied for user"

**原因**: ユーザー名またはパスワードが間違っている

**解決策**: 
1. MySQLにログインできるか確認：
   ```bash
   mysql -u root -p
   ```
2. `.env`のパスワードが正しいか確認

---

### エラー3: "Unknown database 'eagle_construction'"

**原因**: データベースが存在しない

**解決策**:
```bash
mysql -u root -p
CREATE DATABASE eagle_construction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

### エラー4: "Error validating datasource"

**原因**: DATABASE_URLの形式が間違っている

**正しい形式**:
```
mysql://username:password@host:port/database
```

例:
```
DATABASE_URL="mysql://root:mypassword@localhost:3306/eagle_construction"
```

---

## 📊 データの確認

### Prisma Studioを使用（推奨）:

```bash
npx prisma studio
```

ブラウザで http://localhost:5555 が開き、データを視覚的に確認できます。

### MySQLコマンドラインを使用:

```bash
mysql -u root -p eagle_construction

# テーブル一覧
SHOW TABLES;

# ユーザー確認
SELECT * FROM User;

# 問い合わせ確認
SELECT * FROM Inquiry LIMIT 5;

# 終了
EXIT;
```

---

## 🔄 SQLiteに戻す場合

1. `prisma/schema.prisma` を編集：
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. `.env` を編集：
   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. セットアップ：
   ```bash
   npx prisma generate
   npx prisma migrate reset --force
   ```

---

## ✅ 成功すると...

SEEDが完了すると以下が表示されます：

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

その後、http://localhost:3000/login でログインできます！

---

## 📚 関連ドキュメント

- **README.md** - プロジェクト概要
- **USAGE_GUIDE.md** - 完全な使用方法
- **SEED_TROUBLESHOOTING.md** - SEEDエラーの対処法

---

**質問がある場合は、上記のドキュメントを参照してください！**
