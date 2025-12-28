# MySQL接続トラブルシューティングガイド

現在、MySQLサーバーに接続できない状態です。以下の手順で解決してください。

## エラー内容
```
Error: P1001: Can't reach database server at `localhost:3306`
```

## 解決手順

### 1. MySQLサービスが起動しているか確認

#### 方法A: サービスから確認（推奨）

1. **Windowsキー + R** を押す
2. `services.msc` と入力してEnter
3. サービス一覧から「**MySQL80**」または「**MySQL**」を探す
4. 状態が「実行中」になっているか確認
5. 実行中でない場合:
   - 右クリック → **開始** を選択

#### 方法B: コマンドで確認

PowerShellを管理者として実行し、以下を実行:

```powershell
# MySQLサービスの状態を確認
Get-Service -Name "MySQL*"

# MySQLサービスを開始（サービス名は環境によって異なる場合があります）
Start-Service -Name "MySQL80"
# または
net start MySQL80
```

### 2. MySQLのポート番号を確認

MySQLが3306以外のポートで動作している可能性があります。

#### 確認方法:

1. MySQLの設定ファイルを開く:
   - 通常の場所: `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`
   - または: `C:\Program Files\MySQL\MySQL Server 8.0\my.ini`

2. `port = XXXX` の行を探す

3. ポートが3306以外の場合、`.env`ファイルを更新:
   ```env
   DATABASE_URL="mysql://root:Aika1211@localhost:別のポート番号/eagle_home"
   ```

### 3. MySQLがインストールされているか確認

#### 確認方法:

```powershell
# コマンドプロンプトまたはPowerShellで実行
mysql --version
```

もし「コマンドが見つかりません」と表示される場合:
- MySQLがインストールされていない、または
- 環境変数のPATHに追加されていない

### 4. 代替ポートでの接続を試す

一般的なMySQLポート:
- `3306` (デフォルト)
- `3307`
- `3308`

各ポートで試してみてください:

```env
# .envファイル
DATABASE_URL="mysql://root:Aika1211@localhost:3307/eagle_home"
```

## 解決後の手順

MySQLサーバーが起動したら、以下のコマンドを実行:

```powershell
# 1. データベースが存在するか確認・作成
mysql -u root -pAika1211 -e "CREATE DATABASE IF NOT EXISTS eagle_home CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Prisma Clientを生成
npx prisma generate

# 3. マイグレーションを実行
npx prisma migrate dev --name init

# 4. サンプルデータを投入
npm run db:seed

# 5. 開発サーバーを起動
npm run dev
```

## さらなるサポート

上記の手順で解決しない場合、以下の情報を確認してください:

1. **MySQLのバージョン**:
   ```powershell
   mysql --version
   ```

2. **MySQLサービスの状態**:
   ```powershell
   Get-Service -Name "MySQL*"
   ```

3. **エラーログの確認**:
   - `C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err`

4. **手動でMySQLに接続してみる**:
   ```powershell
   mysql -u root -pAika1211
   ```
   成功すれば、MySQLは正常に動作しています。
