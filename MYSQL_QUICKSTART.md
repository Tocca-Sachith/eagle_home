# 🚀 MySQL セットアップ - クイックスタート

## ステップ1: MySQLデータベースを作成

```bash
mysql -u root -p
```

MySQLにログイン後：

```sql
CREATE DATABASE eagle_construction CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## ステップ2: `.env` ファイルを作成

プロジェクトルートに `.env` ファイルを作成：

```env
DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/eagle_construction"
NEXTAUTH_SECRET="eagle-home-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**重要**: `your_mysql_password` を実際のMySQLパスワードに置き換えてください。

---

## ステップ3: セットアップスクリプトを実行

### Windowsの場合:

```powershell
.\setup-mysql.bat
```

### macOS/Linuxの場合:

```bash
./setup-mysql.sh
```

---

## ステップ4: 開発サーバーを起動

```bash
npm run dev
```

http://localhost:3000/login にアクセス

```
Email: admin@eaglehome.com
Password: admin123
```

---

## トラブルシューティング

### エラー: "Can't connect to MySQL server"

MySQLサーバーを起動してください：

```bash
# Windows（管理者権限）
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

---

### エラー: "Access denied"

`.env` のパスワードが正しいか確認してください。

---

### エラー: "Unknown database"

ステップ1のデータベース作成を実行してください。

---

## 詳細情報

詳しいセットアップ方法は **MYSQL_SETUP.md** を参照してください。
