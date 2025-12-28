# SEED実行 - 完全ガイド

このガイドに従って、確実にサンプルデータを投入できます。

---

## 🎯 前提条件

- Node.js がインストール済み
- MySQL Server がインストール済み
- プロジェクトの依存関係がインストール済み (`npm install`)

---

## 📋 実行方法

### 方法1: 自動スクリプト（推奨・最も簡単）

プロジェクトフォルダで以下を実行：

```powershell
.\run-seed.bat
```

このスクリプトが以下をすべて自動で実行します：
1. MySQL接続確認
2. データベース確認・作成
3. Prisma Client生成
4. マイグレーション実行
5. SEED実行

---

### 方法2: 手動実行（ステップバイステップ）

#### ステップ1: MySQLサービスを起動

**PowerShell（管理者として実行）:**
```powershell
Start-Service -Name "MySQL80"
```

**確認:**
```powershell
mysql -u root -pAika1211 -e "SELECT VERSION();"
```

成功すると、MySQLのバージョン情報が表示されます。

---

#### ステップ2: データベースを確認・作成

```powershell
# データベースが存在するか確認
mysql -u root -pAika1211 -e "SHOW DATABASES LIKE 'eagle_home';"

# 存在しない場合は作成
mysql -u root -pAika1211 -e "CREATE DATABASE IF NOT EXISTS eagle_home CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

#### ステップ3: Prisma Clientを生成

```powershell
npx prisma generate
```

出力例：
```
✔ Generated Prisma Client (v6.19.1) to ./node_modules/@prisma/client
```

---

#### ステップ4: マイグレーションを実行

**オプションA: リセット（既存データを削除）**

```powershell
npx prisma migrate reset --force
```

これは自動的にSEEDも実行します。✅ **これが最も確実**

---

**オプションB: マイグレーションのみ実行（データを保持）**

```powershell
# マイグレーション状態を確認
npx prisma migrate status

# マイグレーションを適用
npx prisma migrate deploy
```

⚠️ 注意: `migrate deploy` はSEEDを実行しないので、次のステップが必要です。

---

#### ステップ5: SEEDを実行

```powershell
npm run db:seed
```

成功すると以下のように表示されます：

```
🌱 Starting seed...
🗑️  Clearing existing data...
👤 Creating default admin user...
✅ Created admin user: admin@eaglehome.com
📬 Seeding inquiries...
✅ Created 8 inquiries
👥 Seeding customers...
✅ Created 5 customers
🏗️  Seeding projects...
✅ Created 5 projects
🖼️  Seeding hero images...
✅ Created 3 hero images
🔧 Seeding services...
✅ Created 7 services
🎉 Seed completed successfully!
```

---

## ✅ SEED成功の確認

### データベースを確認

```powershell
mysql -u root -pAika1211 -e "USE eagle_home; SELECT COUNT(*) as users FROM User; SELECT COUNT(*) as customers FROM Customer; SELECT COUNT(*) as services FROM Service;"
```

期待される結果：
- users: 1
- customers: 5
- services: 7

---

## 🚨 トラブルシューティング

### エラー: "Can't reach database server"

**解決方法:**
1. MySQLサービスを起動
   ```powershell
   Start-Service -Name "MySQL80"
   ```

2. 接続を確認
   ```powershell
   mysql -u root -pAika1211
   ```

---

### エラー: "The column `customerNumber` does not exist"

**原因:** マイグレーションが実行されていない

**解決方法:**
```powershell
npx prisma migrate reset --force
```

---

### エラー: "Access denied for user"

**原因:** パスワードが間違っている

**解決方法:**
1. `.env` ファイルのパスワードを確認
2. MySQLのrootパスワードを確認

---

### エラー: "Unknown database 'eagle_home'"

**原因:** データベースが作成されていない

**解決方法:**
```powershell
mysql -u root -pAika1211 -e "CREATE DATABASE eagle_home CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## 📊 投入されるサンプルデータ

### 管理者ユーザー
- **Email**: admin@eaglehome.com
- **Password**: admin123

### 顧客（5件）
| お客様番号 | 名前 | 国 |
|-----------|------|-----|
| CUS-YYYYMMDD-001 | James Wilson | アメリカ |
| CUS-YYYYMMDD-002 | Sophie Taylor | イギリス |
| CUS-YYYYMMDD-003 | Hiroshi Tanaka | 日本 |
| CUS-YYYYMMDD-004 | Maria Rodriguez | アメリカ |
| CUS-YYYYMMDD-005 | David Kim | 韓国 |

### その他
- 問い合わせ: 8件
- プロジェクト: 5件
- ヒーローイメージ: 3件
- サービス: 7件

---

## 🚀 SEED完了後

開発サーバーを起動:
```powershell
npm run dev
```

ブラウザで開く:
- 公開サイト: http://localhost:3000
- 管理画面: http://localhost:3000/login

---

## 💡 おすすめのコマンド順序

```powershell
# 1. MySQLサービス起動
Start-Service -Name "MySQL80"

# 2. 自動スクリプト実行
.\run-seed.bat

# 3. 開発サーバー起動
npm run dev
```

これで確実にサンプルデータが投入されます！🎉
