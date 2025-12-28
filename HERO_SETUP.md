# 🚀 ヒーロー画像機能 - クイックスタート

## ✅ 実装完了しました！

ホームページのヒーローセクションに表示する画像を管理画面から完全に管理できるようになりました。

---

## 🔧 セットアップ（ユーザー側で実行）

### ステップ1: リポジトリをプル

```bash
git pull origin main
```

### ステップ2: 依存関係をインストール

```bash
npm install
```

これで `sharp`（画像処理ライブラリ）がインストールされます。

### ステップ3: データベースマイグレーション

```powershell
# PowerShellで実行
npx prisma migrate dev --name add_hero_images
```

これにより `HeroImage` テーブルが作成されます。

または、既存データをリセットする場合：

```powershell
npx prisma migrate reset --force
```

### ステップ4: 開発サーバーを起動

```bash
npm run dev
```

---

## 📸 使用方法

### 1. 管理画面にログイン

http://localhost:3000/login

```
Email: admin@eaglehome.com
Password: admin123
```

### 2. ヒーロー画像管理にアクセス

サイドバーの 🖼️ **Hero Images** をクリック

または直接: http://localhost:3000/admin/hero-images

### 3. 画像をアップロード

1. 「+ 新規画像追加」ボタンをクリック
2. フォームに入力:
   - **画像ファイル**: 任意の画像（JPEG, PNG, GIF, WebP）
   - **タイトル**: 画像の名前
   - **代替テキスト**: SEO用（オプション）
   - **幅**: 1920px（デフォルト）
   - **高さ**: 1080px（デフォルト）
   - **表示順序**: 0から始まる数値
3. 「アップロード」をクリック

### 4. ホームページで確認

http://localhost:3000/

ヒーローセクションに画像が表示されます！

---

## 🎨 機能

### 管理画面:
- ✅ 画像のアップロード
- ✅ 画像の編集（タイトル、サイズ、順序）
- ✅ 画像の削除
- ✅ 有効/無効の切り替え
- ✅ プレビュー表示
- ✅ 自動リサイズ

### ホームページ:
- ✅ 動的画像表示
- ✅ 自動カルーセル（5秒ごと）
- ✅ 手動切り替え（インジケーター）
- ✅ スムーズなフェード効果
- ✅ レスポンシブデザイン

---

## 📊 データベース

### 新しいテーブル: HeroImage

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | String | ユニークID |
| title | String | 画像タイトル |
| imagePath | String | ファイルパス |
| altText | String? | 代替テキスト |
| width | Int | 幅（px） |
| height | Int | 高さ（px） |
| displayOrder | Int | 表示順序 |
| isActive | Boolean | 有効/無効 |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

---

## 🔍 トラブルシューティング

### エラー: "Column 'HeroImage.id' not found"

**解決策**: マイグレーションを実行

```bash
npx prisma migrate dev --name add_hero_images
```

### エラー: "Cannot find module 'sharp'"

**解決策**: 依存関係を再インストール

```bash
npm install
```

### 画像がアップロードできない

**解決策**: アップロードフォルダの権限を確認

```bash
# Windows
icacls public\uploads\hero-images /grant Users:F

# macOS/Linux
chmod -R 755 public/uploads/hero-images
```

---

## 📚 詳細ドキュメント

完全なドキュメントは **HERO_IMAGES_GUIDE.md** を参照してください。

---

## 🎉 完成！

これでヒーロー画像管理システムが使用可能になりました。

管理画面から画像をアップロードして、ホームページで確認してください！
