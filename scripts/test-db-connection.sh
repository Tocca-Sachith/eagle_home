#!/bin/bash

echo "🔍 データベース接続テスト"
echo "========================="
echo ""

# .env ファイルを読み込む
if [ -f .env ]; then
    export $(cat .env | grep DATABASE_URL | xargs)
    echo "✅ .env ファイルが見つかりました"
    echo "📊 DATABASE_URL: ${DATABASE_URL:0:30}..." # 最初の30文字のみ表示
else
    echo "❌ .env ファイルが見つかりません"
    exit 1
fi

echo ""
echo "🔌 データベースへの接続をテスト中..."
echo ""

# Prisma で接続テスト
npx prisma db execute --stdin <<EOF
SELECT 1 as test;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ データベース接続成功！"
    echo ""
    echo "次のステップ:"
    echo "1. npm run db:push    # スキーマをプッシュ"
    echo "2. npm run db:seed    # サンプルデータを投入"
    echo "3. npm run db:studio  # データを確認"
else
    echo ""
    echo "❌ データベース接続に失敗しました"
    echo ""
    echo "トラブルシューティング:"
    echo "1. DATABASE_URL が正しいか確認してください"
    echo "2. データベースサーバーが起動しているか確認してください"
    echo "3. DATABASE_SETUP.md を参照してください"
fi
