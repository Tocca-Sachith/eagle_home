# 投資者管理システム実装完了

## 概要

Eagle Home & Construction の管理画面に投資者管理機能を追加しました。
投資者の登録、編集、削除、プロフィール画像のアップロードが可能になりました。

## 実装された機能

### 1. データベースモデル

#### Investor テーブル
```prisma
model Investor {
  id             String   @id @default(cuid())
  investorNumber String   @unique // 自動生成: INV-YYYYMMDD-XXX
  fullName       String
  email          String?
  phone          String?
  country        String?
  address        String?
  profileImage   String?  // プロフィール画像のパス
  notes          String?  @db.Text
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

**特徴**:
- 自動生成される投資者番号（INV-20251228-001形式）
- プロフィール画像のアップロード対応
- アクティブ/非アクティブのステータス管理
- 備考欄（テキストフィールド）

### 2. API エンドポイント

#### 投資者一覧取得
```
GET /api/investors
```
- すべての投資者を取得
- 検索パラメータ対応（名前、メール、電話番号、投資者番号）
- ADMIN権限必須

#### 投資者作成
```
POST /api/investors
```
- 新規投資者の登録
- プロフィール画像のアップロード対応
- 投資者番号の自動生成
- FormData形式で送信

**必須フィールド**:
- fullName: 氏名（必須）

**任意フィールド**:
- email: メールアドレス
- phone: 電話番号
- country: 国
- address: 住所
- notes: 備考
- profileImage: プロフィール画像（ファイル）

#### 投資者詳細取得
```
GET /api/investors/[id]
```
- 特定の投資者の詳細情報を取得

#### 投資者更新
```
PUT /api/investors/[id]
```
- 投資者情報の更新
- プロフィール画像の変更対応
- 古い画像の自動削除

#### 投資者削除
```
DELETE /api/investors/[id]
```
- 投資者の削除
- プロフィール画像の自動削除

### 3. 管理画面UI

#### ページ構成
**URL**: `/admin/investors`

#### 一覧表示

##### デスクトップ表示（≥ 1024px）
テーブル形式で表示:

| 列 | 幅 | 内容 |
|---|---|---|
| 投資者 | 20% | プロフィール画像+名前+投資者番号 |
| メール | 15% | メールアドレス |
| 電話 | 12% | 電話番号 |
| 国 | 12% | 国名 |
| 住所 | 15% | 住所 |
| ステータス | 8% | アクティブ/非アクティブ |
| アクション | 18% | 編集・削除ボタン |

**特徴**:
- 固定幅レイアウト（画面外にはみ出さない）
- テキストの自動切り詰め（...）
- ホバーでツールチップ表示
- プロフィール画像は円形表示
- ステータスはアイコンで表示

##### モバイル・タブレット表示（< 1024px）
カード形式で表示:
```
┌─────────────────────────────────┐
│ [プロフィール画像] 投資者名      │
│                   投資者番号      │
│                   [ステータス]    │
├─────────────────────────────────┤
│ メール: xxx@example.com         │
│ 電話: +1 555-1234               │
│ 国: United States               │
│ 住所: 123 Main St              │
├─────────────────────────────────┤
│ [編集ボタン] [削除ボタン]       │
└─────────────────────────────────┘
```

#### 投資者作成・編集フォーム

**セクション構成**:

1. **プロフィール画像**
   - 画像アップロード
   - 現在の画像プレビュー（編集時）
   - 円形表示

2. **基本情報**
   - 氏名（必須）
   - メールアドレス
   - 電話番号
   - 国
   - 住所
   - 備考
   - アクティブステータス（チェックボックス）

**フォーム機能**:
- バリデーション（氏名は必須）
- 画像プレビュー
- スムーズスクロール
- ローディング状態の表示
- エラーハンドリング

### 4. ナビゲーション

管理画面のサイドバーに追加:
```
📊 Dashboard
📬 Inquiries
🖼️ Hero Images
🔧 Services
👥 Customers
💼 Investors  ← 新規追加
🏗️ Projects
💰 Finance
📈 Reports
👤 Users
```

配置: 顧客とプロジェクトの間（論理的な流れ）

### 5. 多言語対応

#### 英語（English）
```json
{
  "admin": {
    "investors": {
      "title": "Investors",
      "addNew": "Add New Investor",
      "editInvestor": "Edit Investor",
      "form": {
        "fullName": "Full Name",
        "email": "Email Address",
        "phone": "Phone Number",
        ...
      }
    }
  }
}
```

#### シンハラ語（Sinhala）
```json
{
  "admin": {
    "investors": {
      "title": "ආයෝජකයන්",
      "addNew": "නව ආයෝජකයෙකු එක් කරන්න",
      "editInvestor": "ආයෝජකයා සංස්කරණය කරන්න",
      ...
    }
  }
}
```

## 技術仕様

### ファイルアップロード

**保存先**: `/public/uploads/investors/`

**ファイル名形式**: `profile_[timestamp]-[random]_[originalname]`

例: `profile_1703761234567-123456789_investor.jpg`

**処理フロー**:
1. FormDataからファイルを取得
2. バッファに変換
3. 一意なファイル名を生成
4. ディレクトリを作成（存在しない場合）
5. ファイルを保存
6. パスをデータベースに保存

### 投資者番号の自動生成

**形式**: `INV-YYYYMMDD-XXX`

例: `INV-20251228-001`

**生成ロジック**:
1. 現在の日付を取得（YYYYMMDD形式）
2. 当日作成された投資者数をカウント
3. カウント+1を3桁でゼロパディング
4. 形式に従って連結

```typescript
async function generateInvestorNumber(): Promise<string> {
  const date = new Date()
  const dateStr = `${year}${month}${day}`
  
  // 今日作成された投資者数を取得
  const count = await prisma.investor.count({
    where: {
      createdAt: { gte: startOfDay, lte: endOfDay }
    }
  })
  
  const sequence = String(count + 1).padStart(3, '0')
  return `INV-${dateStr}-${sequence}`
}
```

## セキュリティ

### 認証・認可
- すべてのAPIエンドポイントで`ADMIN`ロールチェック
- NextAuth.jsによるセッション管理
- 未認証アクセスは401エラー

### ファイル処理
- 画像ファイルのみ受け付け（`accept="image/*"`）
- ファイルサイズのバリデーション
- 一意なファイル名生成（衝突防止）
- 古いファイルの自動削除

### データベース
- ユニーク制約（投資者番号）
- インデックス最適化
- カスケード削除の適切な設定

## 使用方法

### 1. 投資者の一覧表示
1. 管理画面にログイン
2. サイドバーから「Investors」をクリック
3. 投資者一覧が表示される

### 2. 新規投資者の登録
1. 「Add New Investor」ボタンをクリック
2. プロフィール画像を選択（任意）
3. 必須項目（氏名）を入力
4. その他の情報を入力
5. 「Save」ボタンをクリック

### 3. 投資者の編集
1. 一覧から編集したい投資者の「Edit」ボタンをクリック
2. 情報を更新
3. プロフィール画像を変更（任意）
4. 「Save」ボタンをクリック

### 4. 投資者の削除
1. 一覧から削除したい投資者の「Delete」ボタンをクリック
2. 確認ダイアログで「OK」をクリック
3. 投資者とプロフィール画像が削除される

## データベースマイグレーション

### 適用方法
```bash
# 開発環境
npx prisma migrate dev

# 本番環境
npx prisma migrate deploy
```

### マイグレーションファイル
`prisma/migrations/20251228101936_add_investor_model/migration.sql`

```sql
CREATE TABLE `Investor` (
    `id` VARCHAR(191) NOT NULL,
    `investorNumber` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `profileImage` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Investor_investorNumber_key`(`investorNumber`),
    INDEX `Investor_investorNumber_idx`(`investorNumber`),
    INDEX `Investor_email_idx`(`email`),
    INDEX `Investor_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## レスポンシブデザイン

### ブレークポイント
- **モバイル**: < 640px
- **タブレット**: 640px - 1023px
- **デスクトップ**: ≥ 1024px

### 表示切替
```tsx
{/* デスクトップのみ */}
<div className="hidden lg:block">
  <TableView />
</div>

{/* モバイル・タブレットのみ */}
<div className="lg:hidden">
  <CardView />
</div>
```

## パフォーマンス最適化

### データベースクエリ
- インデックスの適切な設定
- 必要なフィールドのみ取得
- ページネーション対応準備

### 画像処理
- ファイルサイズの制限
- 適切な画像フォーマット推奨
- CDN対応準備

### UIレンダリング
- 条件付きレンダリング
- メモ化の活用
- 遅延ローディング

## 今後の拡張可能性

### 1. 高度な検索・フィルタリング
- 国別フィルター
- ステータスフィルター
- 日付範囲検索
- 複合条件検索

### 2. 投資者とプロジェクトの連携
- 投資者をプロジェクトにリンク
- 投資履歴の追跡
- 投資額の管理

### 3. レポート機能
- 投資者別レポート
- 国別統計
- 活動状況の可視化

### 4. 通知機能
- 新規投資者登録通知
- 情報更新通知
- リマインダー機能

### 5. エクスポート機能
- CSV/Excelエクスポート
- PDFレポート生成
- バックアップ機能

## トラブルシューティング

### 問題: 画像がアップロードできない
**解決策**:
1. `/public/uploads/investors/` ディレクトリの書き込み権限を確認
2. ファイルサイズ制限を確認
3. サーバーログでエラー詳細を確認

### 問題: 投資者番号が重複する
**解決策**:
1. データベースのユニーク制約が有効か確認
2. トランザクション処理を確認
3. 同時リクエストの制御を検討

### 問題: TypeScriptエラー
**解決策**:
```bash
# Prismaクライアントを再生成
npx prisma generate
```

## まとめ

投資者管理システムの実装が完了しました。

### 実装内容
✅ Investorモデルとマイグレーション
✅ 完全なCRUD API（認証付き）
✅ 管理画面UI（レスポンシブ対応）
✅ プロフィール画像アップロード
✅ 投資者番号の自動生成
✅ 多言語対応（英語・シンハラ語）
✅ ナビゲーションへの追加
✅ セキュリティとバリデーション

### デプロイ情報
- **コミット**: `0a496ce`
- **ブランチ**: `main`
- **状態**: リモートリポジトリにプッシュ済み ✓

### ファイル構成
```
/workspace/
├── prisma/
│   ├── schema.prisma (Investorモデル追加)
│   └── migrations/
│       └── 20251228101936_add_investor_model/
│           └── migration.sql
├── public/uploads/investors/ (新規)
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── investors/
│   │   │   │   └── page.tsx (新規)
│   │   │   └── layout.tsx (ナビゲーション追加)
│   │   └── api/investors/
│   │       ├── route.ts (新規)
│   │       └── [id]/
│   │           └── route.ts (新規)
│   └── locales/
│       ├── en.json (投資者翻訳追加)
│       └── si.json (投資者翻訳追加)
```

管理者は now 投資者を完全に管理できます！🎉
