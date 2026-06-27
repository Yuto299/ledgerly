# Ledgerly ドキュメント

Ledgerly の設計・開発・運用に関するドキュメントの目次です。
（プロジェクト概要は [ルート README](../README.md)、開発ルールは [CONTRIBUTING.md](../CONTRIBUTING.md) を参照）

## 🚀 はじめに（新規参画の方へ）

1. [onboarding.md](./onboarding.md) — **まずここから。** プロジェクト全体像と開発開始までの流れ
2. [guides/setup.md](./guides/setup.md) — ローカル開発環境のセットアップ手順
3. [../CONTRIBUTING.md](../CONTRIBUTING.md) — ブランチ戦略・コミット規約・PR / レビューフロー

## 📁 ディレクトリ構成

| フォルダ | 内容 |
|----------|------|
| [design/](./design/) | 何を・どう作るかの設計（要件・アーキテクチャ・DB・セキュリティ） |
| [guides/](./guides/) | 開発者向けの手順書（環境構築・外部サービス設定） |
| [operations/](./operations/) | デプロイ・運用・SEO・トラブルシューティング |
| [planning/](./planning/) | ロードマップ・進捗 |

## 🧭 設計 — design/

- [requirements.md](./design/requirements.md) — システム要件定義（目的・機能要件・業務フロー・集計ルール）
- [architecture.md](./design/architecture.md) — レイヤー構成・ディレクトリ構造・技術選定
- [database.md](./design/database.md) — テーブル定義・リレーション
- [security.md](./design/security.md) — 認証・認可・パスワード・レートリミット等

## 🛠 ガイド — guides/

- [setup.md](./guides/setup.md) — ローカル開発環境のセットアップ
- [google-oauth.md](./guides/google-oauth.md) — Google OAuth クライアントの設定手順

## 🚢 運用 — operations/

- [deployment.md](./operations/deployment.md) — Vercel への本番デプロイ手順
- [troubleshooting.md](./operations/troubleshooting.md) — 本番のマイグレーション / OAuth 障害の対処
- [seo.md](./operations/seo.md) — SEO 実装内容とチェックリスト

## 🗺 計画 — planning/

- [roadmap.md](./planning/roadmap.md) — フェーズ別の実装ロードマップと進捗

---

> ドキュメントを追加・更新したら、この目次にもリンクを追加してください。
