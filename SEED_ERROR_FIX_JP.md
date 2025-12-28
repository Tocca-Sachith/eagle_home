# SEEDエラー解決ガイド

## エラー内容
```
The column `customerNumber` does not exist in the current database.
```

このエラーは、データベースのテーブルに`customerNumber`カラムが存在しないことを示しています。
マイグレーションを実行していないか、古いスキーマのままになっている可能性があります。

## 解決方法

### ステップ1: マイグレーションを実行

プロジェクトフォルダで以下のコマンドを実行してください：

```powershell
npx prisma migrate dev --name add_customer_management
```

このコマンドは：
- データベーススキーマを最新の状態に更新
- `Customer`テーブルに`customerNumber`と`address`カラムを追加
- 新しいマイグレーションファイルを作成

### ステップ2: SEEDを再実行

マイグレーションが成功したら、SEEDを実行：

```powershell
npm run db:seed
```

---

## もし「マイグレーションの競合」エラーが出た場合

既存のマイグレーションと競合している場合は、以下を実行：

### オプションA: マイグレーションをリセット（データが削除されます）

```powershell
npx prisma migrate reset --force
```

これにより：
- すべてのテーブルが削除される
- マイグレーションが最初から実行される
- 自動的にSEEDも実行される

### オプションB: 手動でマイグレーションを適用

```powershell
# 現在のマイグレーション状態を確認
npx prisma migrate status

# マイグレーションを強制的に適用
npx prisma migrate deploy
```

---

## もし「P1001: Can't reach database server」エラーが出た場合

MySQLサーバーに接続できていません。

### 解決方法:

1. **MySQLサービスを起動**

   **方法A: サービスから**
   - Windowsキー + R → `services.msc`
   - 「MySQL80」を探す
   - 右クリック → 開始

   **方法B: PowerShellから**
   ```powershell
   Start-Service -Name "MySQL80"
   ```

2. **接続を確認**
   ```powershell
   mysql -u root -pAika1211
   ```

3. **マイグレーションを実行**
   ```powershell
   npx prisma migrate dev --name add_customer_management
   ```

---

## 完全なセットアップ手順（推奨）

すべてを一から設定し直す場合：

```powershell
# 1. MySQLサービスを起動
Start-Service -Name "MySQL80"

# 2. データベースが存在することを確認
mysql -u root -pAika1211 -e "CREATE DATABASE IF NOT EXISTS eagle_home;"

# 3. Prisma Clientを生成
npx prisma generate

# 4. マイグレーションをリセット（データベースを初期化）
npx prisma migrate reset --force

# これで自動的にSEEDも実行されます
```

---

## 自動セットアップスクリプト（最も簡単）

以下のスクリプトを実行すれば、すべて自動で実行されます：

```powershell
.\setup-eagle-home.bat
```

このスクリプトが行うこと：
1. ✅ MySQL接続確認
2. ✅ データベース作成/確認
3. ✅ Prisma Client生成
4. ✅ マイグレーション実行
5. ✅ SEED実行

---

## それでも解決しない場合

以下の情報を確認してください：

### 1. Prismaのマイグレーション状態
```powershell
npx prisma migrate status
```

### 2. データベースの現在のスキーマ
```powershell
npx prisma db pull
```

### 3. Customer テーブルの構造を確認
```sql
mysql -u root -pAika1211 -e "USE eagle_home; DESCRIBE Customer;"
```

`customerNumber`カラムが表示されない場合は、マイグレーションが適用されていません。

---

## まとめ

**最も簡単な解決方法：**

```powershell
# MySQLサービスを起動
Start-Service -Name "MySQL80"

# 自動セットアップを実行
.\setup-eagle-home.bat
```

これで問題が解決するはずです！
