# 管理画面プロジェクト管理機能 - 実装完了

## 概要

Eagle Home & Construction の管理画面にプロジェクト管理機能を実装しました。
この機能により、管理者はプロジェクトの作成、編集、削除、および詳細な進捗管理が可能になりました。

## 実装された機能

### 1. プロジェクト一覧表示
- プロジェクトの一覧をテーブル形式で表示
- サムネイル画像の表示
- ステータスに応じた色分け（計画中、進行中、完了、保留中）
- 進捗バーによる視覚的な進捗表示
- 予算情報の表示
- 顧客情報との連携表示
- 公開/非公開状態の表示

### 2. プロジェクト作成機能
以下の情報を管理できます：

#### 基本情報
- プロジェクトタイトル
- 説明
- 場所
- プロジェクトタイプ（住宅、商業、リノベーション、カスタム）
- ステータス（計画中、進行中、完了、保留中）
- 顧客選択（顧客データベースと連携）

#### 財務情報
- 予算総額
- 実際のコスト
- 投資家名
- 投資家連絡先

#### スケジュール
- 契約日
- 開始日
- 予定終了日
- 実際の終了日
- 現在のフェーズ
- 進捗率（0-100%）

#### 表示設定
- サムネイル画像アップロード
- ホームページへの公開設定
- 表示順序
- 備考

### 3. プロジェクト編集機能
- 既存プロジェクトの全情報を編集可能
- 現在のサムネイル画像プレビュー
- 画像の変更機能
- バリデーション付きフォーム

### 4. プロジェクト削除機能
- 確認ダイアログ付き削除機能
- サムネイル画像の自動削除
- 関連画像の連鎖削除

### 5. 多言語対応
- 英語（English）
- シンハラ語（Sinhala）
- すべてのUIテキストが翻訳対応

### 6. レスポンシブデザイン
- モバイル、タブレット、デスクトップに対応
- タッチフレンドリーなUI

## 技術仕様

### フロントエンド
- **Framework**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks (useState, useEffect)
- **国際化**: カスタムLanguageContext

### バックエンド
- **API Routes**: Next.js API Routes
- **認証**: NextAuth.js
- **データベース**: MySQL (Prisma ORM)
- **ファイル処理**: Node.js fs/promises

### データベーススキーマ
```prisma
model Project {
  id              String   @id @default(cuid())
  title           String
  description     String?  @db.Text
  location        String?
  projectType     String
  status          String   @default("PLANNING")
  budgetTotal     Float?
  actualCost      Float?
  contractDate    DateTime?
  startDate       DateTime?
  endDatePlanned  DateTime?
  actualEndDate   DateTime?
  customerId      String?
  customer        Customer? @relation(fields: [customerId], references: [id])
  investorName    String?
  investorContact String?
  thumbnailImage  String?
  isPublished     Boolean  @default(false)
  displayOrder    Int      @default(0)
  progressPercent Int      @default(0)
  currentPhase    String?
  notes           String?  @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  images          ProjectImage[]
}
```

## API エンドポイント

### プロジェクト管理
- `GET /api/projects` - プロジェクト一覧取得
- `POST /api/projects` - プロジェクト作成
- `GET /api/projects/[id]` - プロジェクト詳細取得
- `PUT /api/projects/[id]` - プロジェクト更新
- `DELETE /api/projects/[id]` - プロジェクト削除

### プロジェクト画像管理
- `POST /api/projects/[id]/images` - 画像アップロード
- `DELETE /api/projects/[id]/images/[imageId]` - 画像削除

### 顧客管理（既存）
- `GET /api/customers` - 顧客一覧取得（プロジェクト選択用）

## 使用方法

### 1. プロジェクト一覧の表示
管理画面にログイン後、サイドバーから「Projects」をクリックします。

### 2. 新規プロジェクトの作成
1. 「Add New Project」ボタンをクリック
2. 必要な情報を入力
3. サムネイル画像を選択（オプション）
4. 「Save」ボタンをクリック

### 3. プロジェクトの編集
1. プロジェクト一覧の「Edit」ボタンをクリック
2. 情報を更新
3. 「Save」ボタンをクリック

### 4. プロジェクトの削除
1. プロジェクト一覧の「Delete」ボタンをクリック
2. 確認ダイアログで「OK」をクリック

## セキュリティ

- すべてのAPI操作は管理者認証が必要
- NextAuth.jsによる認証チェック
- ADMIN ロールのみがプロジェクト管理にアクセス可能

## ファイル構造

```
src/
├── app/
│   ├── admin/
│   │   └── projects/
│   │       └── page.tsx          # プロジェクト管理画面
│   └── api/
│       ├── projects/
│       │   ├── route.ts          # プロジェクトCRUD API
│       │   └── [id]/
│       │       ├── route.ts      # 個別プロジェクトAPI
│       │       └── images/
│       │           ├── route.ts  # 画像アップロードAPI
│       │           └── [imageId]/
│       │               └── route.ts # 画像削除API
│       └── customers/
│           └── route.ts          # 顧客API（選択用）
├── locales/
│   ├── en.json                   # 英語翻訳
│   └── si.json                   # シンハラ語翻訳
└── contexts/
    └── LanguageContext.tsx       # 多言語コンテキスト
```

## デプロイ情報

### コミット情報
- **ブランチ**: `cursor/admin-project-management-90a1` → `main`
- **コミットハッシュ**: `1bb3867`
- **コミット日時**: 2025-12-28

### 変更ファイル
- `src/app/admin/projects/page.tsx` (830行追加)
- `src/locales/en.json` (77行追加)
- `src/locales/si.json` (77行追加)

### ビルド状態
✅ TypeScript コンパイル成功
✅ Next.js ビルド成功
✅ リモートリポジトリへのプッシュ完了

## 今後の拡張可能性

1. **プロジェクト画像ギャラリー**
   - 複数画像のアップロード
   - 画像のソートとフィルタリング
   - フェーズ別画像管理

2. **プロジェクトタイムライン**
   - マイルストーン管理
   - ガントチャート表示

3. **ドキュメント管理**
   - 契約書のアップロード
   - 設計図の管理

4. **通知機能**
   - プロジェクトステータス変更通知
   - 期限アラート

5. **レポート機能**
   - 収益分析
   - 進捗レポート
   - 顧客別プロジェクト統計

## サポート

問題が発生した場合は、以下を確認してください：
1. データベース接続が正常か
2. 認証が正しく機能しているか
3. ファイルアップロード先のディレクトリが存在し、書き込み権限があるか

## まとめ

プロジェクト管理機能の実装が完了し、mainブランチへのマージとプッシュが正常に完了しました。
管理者は now 完全なCRUD機能を使用してプロジェクトを管理できます。
