# 🚀 クイックスタートガイド

現在接続されているデータベースに、スキーマとサンプルデータをセットアップします。

## 📋 前提条件

`.env` ファイルに `DATABASE_URL` が設定されていること：

```bash
# 現在の設定を確認
cat .env | grep DATABASE_URL
```

## ⚡ セットアップ（3ステップ）

### 1. Prismaクライアントを生成

```bash
npx prisma generate
```

### 2. スキーマをデータベースにプッシュ

```bash
npm run db:push
```

これにより以下のテーブルが作成されます：
- `inquiries` (問い合わせ)
- `customers` (顧客)
- `projects` (プロジェクト)

### 3. サンプルデータを投入

```bash
npm run db:seed
```

以下のデータが作成されます：
- ✅ 8件の問い合わせ（国内外のサンプル）
- ✅ 3件の顧客データ
- ✅ 5件のプロジェクト（完了・進行中・計画中）

## 🎉 完了！

アプリケーションを起動：

```bash
npm run dev
```

### 確認方法

1. **管理画面で問い合わせを確認:**
   ```
   http://localhost:3000/admin/inquiries
   ```

2. **Prisma Studioでデータを確認:**
   ```bash
   npm run db:studio
   ```
   → http://localhost:5555 が開きます

3. **問い合わせフォームをテスト:**
   ```
   http://localhost:3000/contact
   ```

## 🔧 トラブルシューティング

### データベースに接続できない場合

```bash
# 接続テスト（オプション）
./scripts/test-db-connection.sh
```

### エラーが出た場合

詳細は [DATABASE_SETUP.md](./DATABASE_SETUP.md) を参照してください。

### データをリセットしたい場合

```bash
# 全データを削除してリセット
npx prisma migrate reset

# 再度SEEDデータを投入
npm run db:seed
```

---

## 📚 その他のコマンド

```bash
# データベース管理ツールを起動
npm run db:studio

# スキーマを再生成
npx prisma generate

# マイグレーションを作成（本番環境用）
npx prisma migrate dev --name migration_name
```

詳細なドキュメント：
- [README.md](./README.md) - 完全な使用方法
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - データベース詳細設定
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - 実装の詳細

---

**質問がある場合は、上記のドキュメントを参照してください！**
