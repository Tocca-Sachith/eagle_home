# 🎯 SEEDエラー解決方法（簡易版）

## ❌ エラーが発生しました

```
Validation Error Count: 1
Error: Command failed with exit code 1: tsx prisma/seed.ts
```

---

## ✅ 解決方法（3ステップ）

### Windowsの場合:

#### 方法1: 自動スクリプト（推奨）
プロジェクトフォルダで `setup-db.bat` をダブルクリック

#### 方法2: コマンド
PowerShellまたはコマンドプロンプトで:

```bash
npx prisma generate
npx prisma migrate reset --force
```

---

### macOS/Linuxの場合:

#### 方法1: 自動スクリプト（推奨）
```bash
./setup-db.sh
```

#### 方法2: コマンド
```bash
npx prisma generate
npx prisma migrate reset --force
```

---

## ✅ 成功したら...

以下のメッセージが表示されます:

```
🎉 Seed completed successfully!
```

その後、開発サーバーを起動:

```bash
npm run dev
```

ログイン:
- **URL**: http://localhost:3000/login
- **Email**: admin@eaglehome.com
- **Password**: admin123

---

## 📚 詳細情報

- **SEED_TROUBLESHOOTING.md** - 詳細なトラブルシューティング
- **USAGE_GUIDE.md** - 完全な使用方法ガイド
- **README.md** - プロジェクト概要

---

**これで解決しない場合は、上記のドキュメントを参照してください。**
