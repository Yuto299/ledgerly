# Ledgerly

## 概要

Ledgerly は、副業・個人事業における **顧客管理・案件管理・請求管理・入金管理・経費管理** を一元化し、月次・案件別の **利益を可視化** することを目的とした Web アプリケーションです。

「誰から・どの案件で・いくら稼ぎ・いくら使い・いくら残ったか」を即座に把握できる状態を目指します。

## 主な特徴

- 📊 **月次ダッシュボード** - 売上・経費・利益を自動集計
- 💰 **請求書管理** - 明細付き請求書の作成・送付・入金管理
- 📁 **案件単位の管理** - 顧客・案件・請求・経費を紐づけて管理
- 💳 **分割入金対応** - 複数回の入金を自動で集計・ステータス更新
- 📈 **利益可視化** - 案件別・月別の利益をグラフで表示

## 想定ユーザー

- 副業・個人開発・業務委託で収入を得ている個人
- 基本は 1 ユーザー運用（将来的な複数ユーザー拡張を考慮）

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router) + TypeScript
- **バックエンド**: Next.js Route Handlers (API)
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **認証**: NextAuth (Auth.js)
- **バリデーション**: Zod
- **UI**: Tailwind CSS
- **グラフ**: Recharts
- **テスト**: Vitest + Testing Library + Playwright
- **デプロイ**: Vercel + Managed Postgres

## ドキュメント

- [要件定義](./docs/requirements.md) - システムの目的・機能要件・業務フロー
- [アーキテクチャ設計](./docs/architecture.md) - レイヤー構成・ディレクトリ構造
- [データベース設計](./docs/database.md) - テーブル定義・リレーション
- [API 仕様](./docs/api-spec.md) - エンドポイント一覧・リクエスト/レスポンス
- [実装ロードマップ](./docs/roadmap.md) - MVP 実装の段階的計画

## セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/ledgerly.git
cd ledgerly

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envを編集してデータベースURL等を設定

# Prismaのセットアップ
npx prisma generate
npx prisma db push

# 開発サーバーの起動
npm run dev
```

## 開発

```bash
# 開発サーバー
npm run dev

# テスト
npm run test

# Lint
npm run lint

# ビルド
npm run build
```

## ライセンス

MIT
