# 🖼️ ヒーロー画像管理機能 - 実装ガイド

## ✅ 実装完了

ホームページのヒーローセクションに表示する画像を管理画面から完全に管理できるようになりました。

---

## 🎯 機能概要

### 管理画面でできること:

1. **画像アップロード**
   - ファイル選択
   - タイトル設定
   - 代替テキスト（ALT）設定
   - サイズ調整（幅・高さ）
   - 表示順序の設定

2. **画像管理**
   - 画像の編集（タイトル、サイズ、順序）
   - 画像の削除
   - 有効/無効の切り替え
   - プレビュー表示

3. **自動処理**
   - 画像のリサイズ処理
   - ファイル名の自動生成
   - 安全なファイル保存

### ホームページの表示:

1. **自動カルーセル**
   - 複数の画像を5秒ごとに自動切り替え
   - スムーズなフェード効果
   - インジケーターボタン（手動切り替え可能）

2. **レスポンシブ**
   - 画像は背景として全画面表示
   - テキストオーバーレイ
   - モバイル対応

---

## 📂 ファイル構成

```
/workspace/
├── prisma/
│   └── schema.prisma                      # HeroImageモデル追加
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── hero-images/
│   │   │       ├── route.ts               # GET, POST（一覧取得・アップロード）
│   │   │       └── [id]/
│   │   │           └── route.ts           # GET, PUT, DELETE（個別操作）
│   │   ├── admin/
│   │   │   ├── hero-images/
│   │   │   │   └── page.tsx               # 管理画面UI
│   │   │   └── layout.tsx                 # ナビゲーション更新
│   │   └── (public)/
│   │       └── page.tsx                   # ホームページ（動的表示）
└── public/
    └── uploads/
        └── hero-images/                   # アップロードフォルダ
            └── .gitkeep
```

---

## 🚀 セットアップ手順

### ステップ1: データベースマイグレーション

```powershell
# PowerShellで実行
npx prisma migrate dev --name add_hero_images
```

これにより `HeroImage` テーブルが作成されます。

---

### ステップ2: 開発サーバーを起動

```bash
npm run dev
```

---

### ステップ3: 管理画面にアクセス

1. ログイン: http://localhost:3000/login
   - Email: admin@eaglehome.com
   - Password: admin123

2. ヒーロー画像管理: http://localhost:3000/admin/hero-images

---

## 📸 使用方法

### 新規画像をアップロード

1. 「+ 新規画像追加」ボタンをクリック
2. フォームに入力:
   - **画像ファイル**: JPEG, PNG, GIF, WebP対応
   - **タイトル**: 画像の名前（必須）
   - **代替テキスト**: SEO用（オプション）
   - **幅**: ピクセル単位（デフォルト: 1920px）
   - **高さ**: ピクセル単位（デフォルト: 1080px）
   - **表示順序**: 0から始まる数値（小さい順に表示）
3. 「アップロード」をクリック

---

### 画像を編集

1. 画像一覧で「編集」ボタンをクリック
2. インラインで編集:
   - タイトル
   - サイズ（幅・高さ）
   - 表示順序
3. 「保存」をクリック

---

### 画像を削除

1. 画像一覧で「削除」ボタンをクリック
2. 確認ダイアログで「OK」
3. データベースとファイルシステムから削除される

---

### 画像を無効化

1. ステータス列の「有効」ボタンをクリック
2. 「無効」に切り替わる
3. ホームページに表示されなくなる

---

## 🎨 ホームページでの表示

### 自動カルーセル機能

- 有効な画像が複数ある場合、5秒ごとに自動切り替え
- フェードイン/フェードアウト効果
- 画像の下部にインジケーター（●●○）表示
- インジケーターをクリックで手動切り替え可能

### 画像がない場合

- グラデーション背景のみ表示
- 既存のデザインを維持

---

## 🗄️ データベーススキーマ

### HeroImage テーブル

```prisma
model HeroImage {
  id           String   @id @default(cuid())
  title        String                          // 画像タイトル
  imagePath    String                          // 画像ファイルパス
  altText      String?                         // 代替テキスト
  width        Int      @default(1920)         // 画像幅
  height       Int      @default(1080)         // 画像高さ
  displayOrder Int      @default(0)            // 表示順序
  isActive     Boolean  @default(true)         // 有効/無効
  createdAt    DateTime @default(now())        // 作成日時
  updatedAt    DateTime @updatedAt             // 更新日時

  @@index([isActive])
  @@index([displayOrder])
}
```

---

## 🔒 セキュリティ

### 認証

- すべての編集・削除操作は ADMIN ロールが必要
- NextAuth.js でセッション管理

### ファイルバリデーション

- アップロードファイルタイプをチェック（画像のみ）
- ファイル名をサニタイズ
- タイムスタンプでユニーク化

### ファイルシステム

- アップロードは `public/uploads/hero-images/` に保存
- Git管理から除外（.gitignoreに追加済み）

---

## 📊 API エンドポイント

### GET /api/hero-images

**説明**: 有効なヒーロー画像を取得

**レスポンス**:
```json
{
  "heroImages": [
    {
      "id": "clx...",
      "title": "Modern Villa",
      "imagePath": "/uploads/hero-images/resized_1234567890_villa.jpg",
      "altText": "Beautiful modern villa",
      "width": 1920,
      "height": 1080,
      "displayOrder": 0,
      "isActive": true,
      "createdAt": "2024-12-26T10:00:00.000Z"
    }
  ]
}
```

---

### POST /api/hero-images

**説明**: 新規画像をアップロード

**リクエスト**: FormData
- `file`: File (required)
- `title`: string (required)
- `altText`: string (optional)
- `width`: number (optional, default: 1920)
- `height`: number (optional, default: 1080)
- `displayOrder`: number (optional, default: 0)

**レスポンス**:
```json
{
  "success": true,
  "heroImage": { ... }
}
```

---

### PUT /api/hero-images/[id]

**説明**: 画像情報を更新（ADMIN のみ）

**リクエスト**:
```json
{
  "title": "Updated Title",
  "width": 1920,
  "height": 1080,
  "displayOrder": 1,
  "isActive": true
}
```

---

### DELETE /api/hero-images/[id]

**説明**: 画像を削除（ADMIN のみ）

**レスポンス**:
```json
{
  "success": true,
  "message": "Hero image deleted successfully"
}
```

---

## 🎨 カスタマイズ

### カルーセルの速度を変更

`src/app/(public)/page.tsx` の以下の行を編集:

```typescript
}, 5000); // 5000 = 5秒（ミリ秒単位）
```

---

### デフォルトサイズを変更

管理画面フォームのデフォルト値:

```typescript
const [width, setWidth] = useState('1920')  // ← 変更
const [height, setHeight] = useState('1080') // ← 変更
```

---

### 画像エフェクトを変更

`src/app/(public)/page.tsx` のCSS:

```typescript
className={`absolute inset-0 transition-opacity duration-1000 ${
  //                                              ↑ 時間を変更（ミリ秒）
  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
}`}
```

---

## 🧪 テストシナリオ

### シナリオ1: 画像をアップロードして表示

1. 管理画面で画像をアップロード
2. ホームページを開く
3. ヒーローセクションに画像が表示されることを確認

---

### シナリオ2: 複数画像でカルーセル

1. 管理画面で3枚の画像をアップロード
2. 表示順序を 0, 1, 2 に設定
3. ホームページを開く
4. 5秒ごとに画像が切り替わることを確認
5. インジケーターをクリックして手動切り替え

---

### シナリオ3: 画像を無効化

1. 管理画面で画像のステータスを「無効」に変更
2. ホームページで表示されないことを確認

---

### シナリオ4: 画像を削除

1. 管理画面で画像を削除
2. ホームページから消えることを確認
3. `public/uploads/hero-images/` からファイルも削除されることを確認

---

## 🔧 トラブルシューティング

### 画像がアップロードできない

**原因**: ディレクトリの書き込み権限がない

**解決策**:
```bash
# Windows
icacls public\uploads\hero-images /grant Users:F

# macOS/Linux
chmod -R 755 public/uploads/hero-images
```

---

### 画像が表示されない

**確認事項**:
1. 画像が「有効」になっているか
2. ブラウザのコンソールでエラーが出ていないか
3. ファイルパスが正しいか（開発者ツールでチェック）

---

### マイグレーションエラー

```bash
# マイグレーションをリセット
npx prisma migrate reset --force
```

---

## 📚 関連ドキュメント

- **README.md** - プロジェクト概要
- **USAGE_GUIDE.md** - 基本的な使用方法
- **MYSQL_SETUP.md** - データベース設定

---

## ✨ まとめ

ヒーロー画像管理システムが完全に実装されました！

### 実現した機能:
- ✅ 管理画面から画像のアップロード
- ✅ 画像の編集・削除
- ✅ サイズ調整（幅・高さ）
- ✅ 表示順序の管理
- ✅ 有効/無効の切り替え
- ✅ ホームページでの動的表示
- ✅ 自動カルーセル機能
- ✅ レスポンシブデザイン

### 次のステップ:
1. マイグレーションを実行
2. 管理画面で画像をアップロード
3. ホームページで確認

**質問がある場合は、このドキュメントを参照してください！**
