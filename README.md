# Ledgerly

> 副業・個人事業の **顧客 / 案件 / 請求 / 入金 / 経費** を一元管理し、月次・案件別の **利益を可視化** する Web アプリ

「誰から・どの案件で・いくら稼ぎ・いくら使い・いくら残ったか」を即座に把握できる状態を目指しています。

---

## 👋 はじめての方・新しく参画する方へ

開発を始める前に、この 3 つを順に読んでください。

1. **[docs/onboarding.md](./docs/onboarding.md)** — プロジェクト全体像と、開発を始めるまでの流れ（まずここから）
2. **[CONTRIBUTING.md](./CONTRIBUTING.md)** — ブランチ戦略・コミット規約・PR / レビュー・Issue 運用ルール
3. **[docs/guides/setup.md](./docs/guides/setup.md)** — ローカル開発環境のセットアップ手順

ドキュメント全体の目次は **[docs/README.md](./docs/README.md)** にあります。

---

## 主な特徴

- 📊 **月次ダッシュボード** — 売上・経費・利益を自動集計
- 💰 **請求書管理** — 明細付き請求書の作成・送付・入金管理（PDF 出力対応）
- 📁 **案件単位の管理** — 顧客・案件・請求・経費を紐づけて管理
- 💳 **分割入金対応** — 複数回の入金を自動で集計・ステータス更新
- 📈 **利益可視化** — 案件別・月別の利益をグラフで表示

## 想定ユーザー

- 副業・個人開発・業務委託で収入を得ている個人
- 基本は 1 ユーザー運用（将来的な複数ユーザー拡張を考慮）

## 技術スタック

| 領域 | 採用技術 |
|------|----------|
| フロント / API | Next.js 15（App Router）+ TypeScript |
| バックエンド | Next.js Route Handlers |
| DB / ORM | PostgreSQL + Prisma |
| 認証 | NextAuth (Auth.js) |
| バリデーション | Zod |
| UI / グラフ | Tailwind CSS / Recharts |
| テスト | Vitest + Testing Library（+ Playwright は任意） |
| デプロイ | Vercel + Managed Postgres（Neon / Supabase） |

---

## クイックスタート

```bash
# クローン
git clone https://github.com/Yuto299/Ledgerly.git
cd Ledgerly

# 依存関係のインストール
npm install

# 環境変数の設定（DATABASE_URL 等。DB ポートは 5433）
cp .env.example .env

# PostgreSQL を起動（Docker）
docker-compose up -d

# Prisma セットアップ + デモデータ投入
npx prisma generate
npx prisma db push
npm run prisma:seed

# 開発サーバー起動 → http://localhost:3000
npm run dev
```

デモアカウント: `demo@ledgerly.com` / `password123`

詳細は [docs/guides/setup.md](./docs/guides/setup.md) を参照してください。

## よく使うコマンド

```bash
npm run dev              # 開発サーバー
npm run build            # 本番ビルド
npm run lint             # Lint
npm run test             # テスト
npm run prisma:studio    # DB を GUI で確認
npm run prisma:migrate   # マイグレーション作成
```

---

## ドキュメント

| カテゴリ | 主なドキュメント |
|----------|------------------|
| 入門 | [オンボーディング](./docs/onboarding.md) / [開発ルール](./CONTRIBUTING.md) |
| 設計 | [要件定義](./docs/design/requirements.md) / [アーキテクチャ](./docs/design/architecture.md) / [DB 設計](./docs/design/database.md) / [セキュリティ](./docs/design/security.md) |
| ガイド | [セットアップ](./docs/guides/setup.md) / [Google OAuth](./docs/guides/google-oauth.md) |
| 運用 | [デプロイ](./docs/operations/deployment.md) / [トラブルシューティング](./docs/operations/troubleshooting.md) / [SEO](./docs/operations/seo.md) |
| 計画 | [ロードマップ](./docs/planning/roadmap.md) |

ドキュメントの目次: [docs/README.md](./docs/README.md)

## プロジェクト管理

- タスクは [GitHub Issues](https://github.com/Yuto299/Ledgerly/issues) で管理し、Project ボードで進行状況（Todo → 作業中 → レビュー中 → Done）を可視化しています。
- 優先度は `priority/p0`〜`priority/p5` のラベルで表します（詳細は [CONTRIBUTING.md](./CONTRIBUTING.md#6-issue--project-ボードの運用)）。
- はじめての方は `good first issue` ラベルの Issue からどうぞ。

## ライセンス

MIT
