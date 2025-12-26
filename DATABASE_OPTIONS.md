# 🗄️ データベース接続オプション

現在、この環境にはMySQLがインストールされていません。以下のいずれかの方法でデータベースをセットアップできます。

## オプション1: ローカルのMySQLに接続（推奨）

もし、お使いのローカルマシンまたはリモートサーバーにMySQLがある場合：

### .envファイルを更新

```bash
# .envファイルを編集
nano .env  # または code .env
```

以下の形式で設定：

```env
# ローカルMySQL (あなたのマシン)
DATABASE_URL="mysql://ユーザー名:パスワード@ホスト:3306/eagle_construction"

# 例1: ローカルMySQL
DATABASE_URL="mysql://root:yourpassword@localhost:3306/eagle_construction"

# 例2: リモートMySQL
DATABASE_URL="mysql://user:pass@123.45.67.89:3306/eagle_construction"
```

### データベースを作成

MySQLにログインして：

```sql
CREATE DATABASE eagle_construction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### セットアップを実行

```bash
npx prisma generate
npm run db:push
npm run db:seed
```

---

## オプション2: この環境にMySQLをインストール

```bash
# MySQLをインストール
sudo apt update
sudo apt install mysql-server -y

# MySQLを起動
sudo service mysql start

# rootパスワードを設定
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';"

# データベースを作成
mysql -u root -ppassword -e "CREATE DATABASE eagle_construction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# セットアップを実行
npx prisma generate
npm run db:push
npm run db:seed
```

---

## オプション3: クラウドデータベース（無料プラン）

### PlanetScale (推奨 - 無料で始められる)

1. https://planetscale.com でアカウント作成
2. 新しいデータベースを作成
3. 接続文字列を取得
4. `.env` を更新：

```env
DATABASE_URL="mysql://xxx:pscale_pw_xxx@aws.connect.psdb.cloud/eagle_construction?sslaccept=strict"
```

### Railway (簡単セットアップ)

1. https://railway.app でアカウント作成
2. MySQL を追加
3. 接続文字列をコピー
4. `.env` を更新

### Supabase (PostgreSQLに切り替える場合)

1. https://supabase.com でアカウント作成
2. プロジェクトを作成
3. Connection string を取得
4. `prisma/schema.prisma` の provider を `postgresql` に変更
5. `.env` を更新

---

## オプション4: SQLiteに切り替え（テスト用）

開発・テスト目的であれば、SQLiteが最も簡単です：

### 1. Prismaスキーマを更新

`prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 2. .env を更新

```env
DATABASE_URL="file:./dev.db"
```

### 3. セットアップ

```bash
npx prisma generate
npm run db:push
npm run db:seed
```

**注意:** SQLiteは開発用です。本番環境ではMySQLまたはPostgreSQLを使用してください。

---

## 🤔 どれを選ぶべきか？

| オプション | メリット | デメリット |
|----------|---------|---------|
| **ローカルMySQL** | 速い、完全なコントロール | セットアップが必要 |
| **環境にインストール** | すぐ使える | sudoアクセスが必要 |
| **PlanetScale** | 無料、簡単、本番対応 | 外部サービス依存 |
| **SQLite** | 最速でテスト可能 | 本番環境には不向き |

---

## 📝 次のステップ

1. 上記のいずれかの方法でデータベースを準備
2. `.env` ファイルを更新
3. 以下を実行：

```bash
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

---

## 💡 ヒント

現在接続しようとしているデータベース：

```bash
cat .env | grep DATABASE_URL
```

接続テスト：

```bash
npx prisma db execute --stdin <<< "SELECT 1;"
```

---

**質問があれば、DATABASE_SETUP.md または README.md を参照してください！**
