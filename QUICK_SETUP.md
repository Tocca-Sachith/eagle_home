# 🚀 クイックセットアップガイド（Windows用）

## ❌ エラーが出た場合の対処法

SEEDでエラーが出ている場合、以下の方法で解決できます。

---

## 方法1: 自動セットアップスクリプト（推奨）

### Windowsの場合:

プロジェクトフォルダで、以下のスクリプトをダブルクリックするだけ:

```
setup-db.bat
```

または、PowerShellで:

```powershell
.\setup-db.bat
```

### macOS/Linuxの場合:

ターミナルで:

```bash
./setup-db.sh
```

これで自動的に:
- ✅ 既存のデータベースを削除
- ✅ Prisma Clientを再生成
- ✅ マイグレーションを実行
- ✅ SEEDデータを投入

---

## 方法2: 手動セットアップ

### Windows PowerShellまたはコマンドプロンプトで:

```bash
# 1. 既存のデータベースを削除
del prisma\dev.db

# 2. Prisma Clientを再生成
npx prisma generate

# 3. マイグレーションとSEEDを実行
npx prisma migrate reset --force
```

### macOS/Linuxのターミナルで:

```bash
# 1. 既存のデータベースを削除
rm -f prisma/dev.db

# 2. Prisma Clientを再生成
npx prisma generate

# 3. マイグレーションとSEEDを実行
npx prisma migrate reset --force
```

---

## 成功すると...

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

## その後の手順

### 1. 開発サーバーを起動

```bash
npm run dev
```

### 2. ログイン

ブラウザで http://localhost:3000/login にアクセス

```
メールアドレス: admin@eaglehome.com
パスワード: admin123
```

---

## よくある問題と解決方法

### 問題1: "tsx: command not found"

**解決策**:

```bash
npm install
```

### 問題2: ".env file not found"

**解決策**: プロジェクトルートに `.env` ファイルを作成

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
```

### 問題3: Windowsで "cannot find path"

**解決策**: 
- PowerShellを**管理者として実行**
- または、Git Bashを使用

---

## 詳細なトラブルシューティング

詳しい情報は以下のドキュメントを参照:

- **SEED_TROUBLESHOOTING.md** - エラー対処法の詳細
- **USAGE_GUIDE.md** - 完全な使用方法ガイド
- **DATABASE_SETUP.md** - データベース設定の詳細

---

## 🎉 セットアップ完了！

正常にSEEDが完了したら、すぐにログインして管理画面を使用できます。

質問がある場合は、上記のドキュメントを参照してください。
