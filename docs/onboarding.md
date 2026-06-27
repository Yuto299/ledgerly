# オンボーディングガイド（新メンバー向け）

ようこそ！このドキュメントは、Ledgerly に新しく参画したメンバーが **これ一枚で開発を開始できる** ことを目指したものです。上から順に読み進めてください。

---

## 1. Ledgerly とは

Ledgerly は、副業・個人事業の **顧客 / 案件 / 請求 / 入金 / 経費** を一元管理し、月次・案件別の **利益を可視化** する Web アプリです。

「誰から・どの案件で・いくら稼ぎ・いくら使い・いくら残ったか」を即座に把握できる状態をゴールにしています。

- 想定ユーザー: 副業・個人開発・業務委託の個人（基本 1 ユーザー運用、将来の複数ユーザー化を考慮）
- 詳しい背景・機能要件 → [design/requirements.md](./design/requirements.md)

---

## 2. 技術スタックの全体像

| 領域 | 採用技術 |
|------|----------|
| フロント / API | Next.js 15（App Router）+ TypeScript |
| バックエンド | Next.js Route Handlers（`src/app/api`） |
| DB / ORM | PostgreSQL + Prisma |
| 認証 | NextAuth (Auth.js)（Credentials + Google OAuth） |
| バリデーション | Zod |
| UI | Tailwind CSS + Recharts（グラフ） |
| テスト | Vitest + Testing Library（+ Playwright は任意） |
| デプロイ | Vercel + Managed Postgres（Neon / Supabase） |

採用理由の詳細は [design/architecture.md](./design/architecture.md#1-技術スタック) を参照。

---

## 3. 開発環境のセットアップ

詳細な手順は [guides/setup.md](./guides/setup.md) にあります。最短ルートは以下のとおりです。

```bash
git clone https://github.com/Yuto299/Ledgerly.git
cd Ledgerly
npm install

cp .env.example .env        # DATABASE_URL などを設定（DB ポートは 5433）
docker-compose up -d        # PostgreSQL 起動

npx prisma generate
npx prisma db push          # スキーマを反映（開発用）
npm run prisma:seed         # デモデータ投入

npm run dev                 # http://localhost:3000
```

デモアカウント: `demo@ledgerly.com` / `password123`

Google ログインも試す場合は [guides/google-oauth.md](./guides/google-oauth.md) を参照。

---

## 4. ディレクトリ構成とレイヤー

UI・ドメイン・インフラを分離したレイヤード構成です。基本の依存方向は
**`app`（画面/API） → `application`（ユースケース） → `domain`（業務ロジック） → `infrastructure`（DB アクセス）** で、下位レイヤーは上位を知りません。

```
src/
├─ app/                 # Next.js App Router
│  ├─ (auth)/           #    login / signup
│  ├─ (dashboard)/      #   dashboard, customers, projects, invoices, expenses, reports, settings
│  └─ api/              #   REST API（customers, invoices, payments, expenses, reports, settings ...）
├─ application/         # ユースケース（画面と domain をつなぐ）
│  └─ usecases/
├─ domain/             # 業務ロジック・サービス（集計・計算など）
│  └─ services/
├─ infrastructure/     # DB アクセス
│  ├─ db/              #   Prisma クライアント（シングルトン）
│  └─ repositories/    #   永続化の実装
├─ features/           # 機能モジュール（customers, projects, invoices, payments,
│                      #   expenses, expense-categories, reports, alerts）
├─ components/         # 共通 UI（Atomic Design: atoms / molecules / organisms / pdf / providers）
├─ lib/                # 横断ユーティリティ（money, date, csv, security, api, auth ...）
└─ types/              # 共通型定義
```

- レイヤーの役割と図解 → [design/architecture.md](./design/architecture.md)
- テーブル定義・リレーション → [design/database.md](./design/database.md)
- DB スキーマの実体 → [prisma/schema.prisma](../prisma/schema.prisma)

---

## 5. 開発の進め方（重要）

ブランチ戦略・コミット規約・PR / レビューフロー・Issue / Project の運用ルールは
**[../CONTRIBUTING.md](../CONTRIBUTING.md) に集約** しています。コードを書き始める前に必ず一読してください。

ざっくりした流れ:

1. 着手する Issue を Project ボードで **「作業中」** に移す（自分をアサイン）
2. `main` から作業ブランチを切る（例: `feat/123-invoice-pdf-tax`）
3. 実装 + テスト。コミットは [Conventional Commits](../CONTRIBUTING.md#コミットメッセージ規約)
4. push して PR を作成（PR テンプレートのチェックリストを埋める）
5. Project ボードのカードを **「レビュー中」** に移し、**レビュアーに @Yuto299 を指定**
6. レビュー指摘対応 → Approve → マージ → カードは **Done**

---

## 6. よく使うコマンド

```bash
npm run dev              # 開発サーバー
npm run build            # 本番ビルド
npm run lint             # Lint
npm run test             # テスト（Vitest）
npm run test:coverage    # カバレッジ
npm run prisma:studio    # DB を GUI で確認
npm run prisma:migrate   # マイグレーション作成（スキーマ変更時）
npm run prisma:seed      # デモデータ投入
```

---

## 7. 主要な設計判断とその背景

新メンバーが「なぜこうなっているのか」で迷わないためのメモです。

- **画面と API を同一 Next.js プロジェクトに同居** — MVP を最短で出すため。FE/BE を分けず、`src/app/api` に Route Handlers を置く。
- **レイヤード + 機能モジュール（features）の併用** — 業務ロジック（domain/usecases）を UI から切り離し、テスト可能性と変更耐性を確保。
- **金額は整数（円）で扱う** — 浮動小数の誤差を避けるため。表示整形は `src/lib/money` に集約。
- **集計には「入金ベース / 請求ベース」の 2 つの定義がある** — レポートの数字の意味が変わるため、必ず [requirements.md の集計ルール](./design/requirements.md#7-集計ルール) を確認。
- **本番デプロイは Vercel + Managed Postgres** — マイグレーションはデプロイ時に流す運用。ハマりどころは [operations/troubleshooting.md](./operations/troubleshooting.md) に集約。
- **Prisma クライアントはシングルトン** — 接続枯渇を避けるため `src/infrastructure/db` 経由で利用する。

---

## 8. 困ったときは

| 状況 | 参照先 |
|------|--------|
| 環境構築でつまずいた | [guides/setup.md](./guides/setup.md) のトラブルシューティング |
| 本番（Vercel）でエラー | [operations/troubleshooting.md](./operations/troubleshooting.md) |
| 要件・仕様の意図を知りたい | [design/requirements.md](./design/requirements.md) |
| 全体の進捗・残タスク | [planning/roadmap.md](./planning/roadmap.md) / [GitHub Issues](https://github.com/Yuto299/Ledgerly/issues) |
| 開発ルールを確認したい | [../CONTRIBUTING.md](../CONTRIBUTING.md) |

それでも解決しない場合は、遠慮なく Issue やレビューで質問してください 🙌
