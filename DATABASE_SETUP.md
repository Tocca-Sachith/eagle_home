# データベースセットアップガイド

## 📋 必要な情報

データベースに接続するために、以下の情報を `.env` ファイルに設定する必要があります：

```env
DATABASE_URL="mysql://ユーザー名:パスワード@ホスト:ポート/データベース名"
```

### 例：

**ローカルMySQL:**
```env
DATABASE_URL="mysql://root:password@localhost:3306/eagle_construction"
```

**リモートMySQL:**
```env
DATABASE_URL="mysql://user:pass123@db.example.com:3306/eagle_db"
```

**PlanetScale (Serverless MySQL):**
```env
DATABASE_URL="mysql://user:pass@aws.connect.psdb.cloud/eagle_construction?sslaccept=strict"
```

---

## 🚀 セットアップ手順

### 1. `.env` ファイルを設定

```bash
# .env.example をコピー
cp .env.example .env

# .env を編集して、実際のデータベース接続情報を入力
nano .env  # または vi, vim, code など
```

### 2. データベーススキーマをプッシュ

```bash
# スキーマをデータベースに同期（開発環境）
npm run db:push

# または、マイグレーションを作成（本番環境推奨）
npx prisma migrate dev --name init
```

### 3. SEEDデータを投入

```bash
# サンプルデータを投入
npm run db:seed
```

これにより以下のデータが作成されます：
- **8件の問い合わせ** (国内・海外のサンプル顧客)
- **3件の顧客データ** (サンプル)
- **5件のプロジェクトデータ** (完了・進行中・計画中)

---

## 🛠️ データベースコマンド一覧

```bash
# データベーススキーマをプッシュ（開発用）
npm run db:push

# マイグレーションを作成（本番用）
npx prisma migrate dev --name migration_name

# SEEDデータを投入
npm run db:seed

# Prisma Studio でデータを確認・編集
npm run db:studio
# → http://localhost:5555 でブラウザが開きます

# スキーマを再生成
npx prisma generate

# データベースをリセット（全データ削除）
npx prisma migrate reset
```

---

## 🔍 トラブルシューティング

### エラー: "Can't reach database server"

**原因:** データベースサーバーに接続できません。

**解決方法:**
1. `.env` の `DATABASE_URL` が正しいか確認
2. データベースサーバーが起動しているか確認
3. ファイアウォールでポートが開いているか確認
4. ホスト名/IPアドレスが正しいか確認

### エラー: "Unknown database"

**原因:** 指定されたデータベースが存在しません。

**解決方法:**
```sql
-- MySQLにログインしてデータベースを作成
CREATE DATABASE eagle_construction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### エラー: "Access denied for user"

**原因:** ユーザー名またはパスワードが間違っています。

**解決方法:**
1. `.env` のユーザー名とパスワードを確認
2. MySQLユーザーに適切な権限があるか確認

---

## 📊 Prisma Studioの使用

Prisma Studioは、データベースを視覚的に管理できるツールです：

```bash
npm run db:studio
```

ブラウザで http://localhost:5555 が開き、以下が可能です：
- データの閲覧
- データの追加・編集・削除
- リレーションの確認
- クエリの実行

---

## 🌱 SEEDデータの内容

### Inquiries (問い合わせ)
- 8件のサンプル問い合わせ
- 様々な国からの顧客（米国、英国、シンガポール、韓国、オーストラリア、スペイン）
- 全てのサービスタイプをカバー
- 予算範囲の多様性

### Customers (顧客)
- 3件のサンプル顧客
- 国際的な顧客ベース

### Projects (プロジェクト)
- 5件のプロジェクト
- ステータス：完了、進行中、計画中
- 様々な場所とタイプ

---

## 🔄 データベースのリセット

開発中にデータベースをクリーンな状態に戻したい場合：

```bash
# 全データを削除してマイグレーションをリセット
npx prisma migrate reset

# SEEDデータを再投入
npm run db:seed
```

⚠️ **警告:** このコマンドは全データを削除します！本番環境では実行しないでください。

---

## 📝 次のステップ

データベースのセットアップが完了したら：

1. **開発サーバーを起動:**
   ```bash
   npm run dev
   ```

2. **管理画面で問い合わせを確認:**
   http://localhost:3000/admin/inquiries

3. **問い合わせフォームをテスト:**
   http://localhost:3000/contact

4. **Prisma Studioでデータを確認:**
   ```bash
   npm run db:studio
   ```

---

## 💡 ヒント

- **開発環境:** `npm run db:push` を使用（速い、マイグレーション履歴不要）
- **本番環境:** `npx prisma migrate deploy` を使用（安全、履歴管理）
- **データ確認:** `npm run db:studio` が最も簡単です
- **バックアップ:** 本番データは定期的にバックアップしてください

---

質問がある場合は、README.md の完全なドキュメントを参照してください。
