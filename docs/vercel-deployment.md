# Vercel デプロイ要件定義

## 概要

LedgerlyをVercel + PostgreSQL（Neon/Supabase）にデプロイするための要件と手順をまとめたドキュメント。

---

## 1. アーキテクチャ構成

```
┌─────────────────┐
│  GitHub Repo    │
│  (Ledgerly)     │
└────────┬────────┘
         │ 自動デプロイ
         ↓
┌─────────────────┐      ┌──────────────────┐
│  Vercel         │─────→│ Neon/Supabase    │
│  (Next.js App)  │      │ (PostgreSQL DB)  │
└─────────────────┘      └──────────────────┘
```

### 選定理由

- **Vercel**: Next.js開発元、ゼロコンフィグ、自動CI/CD
- **Neon/Supabase**: サーバーレスPostgreSQL、無料枠あり、Prisma親和性高

---

## 2. データベース選定

### 🎯 推奨: Neon

#### メリット

- サーバーレスPostgreSQL（自動スケーリング）
- 無料枠: 0.5GB、3プロジェクト、10GBトラフィック
- 東京リージョン（nrt）対応
- Vercel統合が簡単
- ブランチごとにDB作成可能

#### 無料枠制限

- データベースサイズ: 0.5GB
- 計算時間: 月100時間
- プロジェクト数: 3個

### 代替: Supabase

#### メリット

- PostgreSQL + Auth + Storage統合
- 無料枠: 500MB、2プロジェクト
- 東京リージョン対応
- より多機能（このプロジェクトには過剰）

#### 無料枠制限

- データベースサイズ: 500MB
- 帯域: 5GB/月
- プロジェクト数: 2個

### ⚠️ 現在の課題

- 既存のMongoDB Atlasから移行が必要
- スキーマはPostgreSQL用に作成済み（`prisma/schema.prisma`）

---

## 3. 環境変数設定

### 必須環境変数

```bash
# Database
# Neon/Supabaseで取得した接続文字列
# ⚠️ SSL必須: ?sslmode=require を末尾に追加
DATABASE_URL="postgresql://user:password@host.neon.tech/ledgerly?sslmode=require"

# NextAuth（認証）
# デプロイ後のVercel URLを設定
NEXTAUTH_URL="https://ledgerly.vercel.app"

# 既に生成済み（.envファイルから取得）
NEXTAUTH_SECRET="your-generated-secret-here"

# Google OAuth（.envファイルから取得）
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 環境
NODE_ENV="production"
```

### ⚠️ セキュリティ注意事項

1. **Google OAuth承認済みリダイレクトURIの追加**
   - Google Cloud Consoleで設定
   - 追加URI: `https://ledgerly.vercel.app/api/auth/callback/google`
   - 追加URI: `https://*.vercel.app/api/auth/callback/google`（プレビュー環境用）

2. **環境変数の管理**
   - `.env`ファイルは`.gitignore`で除外済み
   - 本番環境の値はVercelダッシュボードで設定
   - `.env.example`には実際の値を含めない

---

## 4. Vercel設定

### vercel.json

プロジェクトルートに以下のファイルを作成：

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["nrt1"]
}
```

#### 設定項目の説明

- `buildCommand`: Prismaクライアント生成 → Next.jsビルド
- `installCommand`: 依存関係インストール
- `framework`: Next.js自動検出
- `regions`: 東京リージョン（nrt1）にデプロイ

### package.json の修正

ビルドスクリプトに以下を追加：

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

#### スクリプトの説明

- `postinstall`: 依存関係インストール後にPrismaクライアント生成
- `vercel-build`: Vercel専用ビルドコマンド（マイグレーション実行含む）

---

## 5. データベースマイグレーション戦略

### 初回デプロイ時

1. **Neon/Supabaseでデータベース作成**
2. **Vercelに環境変数設定**（`DATABASE_URL`）
3. **Vercelでデプロイ実行**
   - `vercel-build`スクリプトが実行される
   - `prisma migrate deploy`で本番用マイグレーション適用
4. **シードデータ投入**（必要な場合）
   - Vercelダッシュボードのターミナルから実行
   - または、GitHub Actionsで自動化

### 継続的デプロイ時

- **開発環境**: `prisma migrate dev`で開発用マイグレーション作成
- **本番環境**: mainブランチへのプッシュ → Vercel自動デプロイ → `prisma migrate deploy`自動実行

### マイグレーションファイル管理

```
prisma/
├── schema.prisma         # スキーマ定義
└── migrations/           # マイグレーション履歴
    ├── migration_lock.toml
    ├── 20260110110034_init/
    │   └── migration.sql
    └── 20260111025512_add_user_settings/
        └── migration.sql
```

---

## 6. デプロイ手順

### ステップ1: データベース準備

#### Neonを使う場合

1. [Neon Console](https://console.neon.tech/)にアクセス
2. 新規プロジェクト作成
   - プロジェクト名: `ledgerly`
   - リージョン: `Tokyo (nrt)`
   - PostgreSQLバージョン: 16（推奨）
3. 接続文字列を取得
   - Dashboard → Connection Details
   - "Pooled connection"を選択
   - `?sslmode=require`を末尾に追加

#### Supabaseを使う場合

1. [Supabase Dashboard](https://app.supabase.com/)にアクセス
2. 新規プロジェクト作成
   - Organization: 新規作成
   - プロジェクト名: `ledgerly`
   - Database Password: 強力なパスワード
   - リージョン: `Tokyo (ap-northeast-1)`
3. 接続文字列を取得
   - Settings → Database → Connection string
   - "URI"をコピー
   - `?pgbouncer=true&sslmode=require`を末尾に追加

### ステップ2: Vercelプロジェクト作成

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. "Add New..." → "Project"をクリック
3. GitHubリポジトリ連携
   - "Import Git Repository"
   - `Yuto299/Ledgerly`を選択
4. プロジェクト設定
   - Project Name: `ledgerly`
   - Framework Preset: `Next.js`（自動検出）
   - Root Directory: `./`（デフォルト）
   - Build Command: 自動（`vercel.json`から読み込み）

### ステップ3: 環境変数設定

Vercelプロジェクト設定画面で以下を設定：

```
DATABASE_URL = postgresql://user:password@host.neon.tech/ledgerly?sslmode=require
NEXTAUTH_URL = https://ledgerly.vercel.app
NEXTAUTH_SECRET = (ローカルの.envから取得)
GOOGLE_CLIENT_ID = (ローカルの.envから取得)
GOOGLE_CLIENT_SECRET = (ローカルの.envから取得)
NODE_ENV = production
```

**適用対象**:

- ✅ Production
- ✅ Preview（オプション）
- ✅ Development（オプション）

### ステップ4: デプロイ実行

1. "Deploy"ボタンをクリック
2. ビルドログを確認
   - Prismaクライアント生成
   - マイグレーション実行
   - Next.jsビルド
3. デプロイ完了後、URLを取得
   - 例: `https://ledgerly.vercel.app`

### ステップ5: Google OAuth設定更新

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクト選択 → API & Services → 認証情報
3. OAuth 2.0クライアントIDを選択
4. 承認済みのリダイレクトURIに追加
   - `https://ledgerly.vercel.app/api/auth/callback/google`
   - `https://*.vercel.app/api/auth/callback/google`

### ステップ6: 動作確認

1. **認証機能**
   - Google OAuthログイン
   - メール/パスワードログイン
2. **データベース接続**
   - ユーザー登録
   - データ作成・取得
3. **API動作**
   - 各エンドポイントのテスト

### ステップ7: シードデータ投入（オプション）

Vercelダッシュボードから実行：

1. Project → Settings → Functions
2. "Terminal"を開く（または、ローカルで実行してマイグレーション）
3. 以下のコマンドを実行:

```bash
npx prisma db seed
```

---

## 7. 継続的デプロイ（CI/CD）

### 自動デプロイトリガー

| ブランチ | デプロイ先 | URL例                                 |
| -------- | ---------- | ------------------------------------- |
| `main`   | Production | `ledgerly.vercel.app`                 |
| その他   | Preview    | `ledgerly-git-feature-xxx.vercel.app` |

### プルリクエスト連携

- PRが作成されると自動でPreview環境デプロイ
- コメントに自動でURLが追加される
- レビュー・確認が容易

---

## 8. コスト見積もり

### 無料枠での運用（個人利用）

| サービス | プラン | 制限                                          | コスト    |
| -------- | ------ | --------------------------------------------- | --------- |
| Vercel   | Hobby  | 100GB帯域/月、Serverless Function実行時間制限 | **無料**  |
| Neon     | Free   | 0.5GB、100時間計算/月                         | **無料**  |
| **合計** | -      | -                                             | **$0/月** |

### 有料プラン（スケール時）

| サービス | プラン | 特徴                                     | コスト     |
| -------- | ------ | ---------------------------------------- | ---------- |
| Vercel   | Pro    | 無制限デプロイ、チーム機能、優先サポート | $20/月     |
| Neon     | Launch | 10GB、300時間計算/月、自動バックアップ   | $19/月     |
| **合計** | -      | -                                        | **$39/月** |

### コスト最適化のポイント

- 無料枠で開始し、必要に応じてスケール
- Neonの"Auto-suspend"で計算時間を節約（5分間アクセスなしで自動休止）
- Vercelのエッジ機能を活用して応答速度向上

---

## 9. セキュリティ対策

### 実装済み

- ✅ 環境変数の`.gitignore`除外
- ✅ NextAuthによる認証・セッション管理
- ✅ PrismaのSQL Injection対策（パラメータ化クエリ）
- ✅ bcryptjsによるパスワードハッシュ化

### デプロイ時の追加対策

#### 1. Vercel環境変数の暗号化

- Vercelが自動で暗号化して保存
- ビルド時のみ復号化

#### 2. データベース接続のSSL強制

```
?sslmode=require
```

#### 3. CORS設定（必要な場合）

```typescript
// middleware.ts
export const config = {
  matcher: "/api/:path*",
};
```

#### 4. Rate Limiting（推奨）

- Vercelの`@vercel/edge-config`でレート制限
- または、Upstash Redisでカウンター管理

#### 5. CSPヘッダー設定

```javascript
// next.config.js
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
];
```

---

## 10. モニタリング・ログ

### Vercel標準機能

1. **Analytics**
   - ページビュー、トラフィック分析
   - Core Web Vitals測定

2. **Logs**
   - Serverless Function実行ログ
   - エラーログ

3. **Deployments**
   - デプロイ履歴
   - ビルドログ

### 推奨追加ツール（オプション）

#### Sentry（エラートラッキング）

- フロントエンド・バックエンドのエラー監視
- スタックトレース、ユーザーコンテキスト
- 無料枠: 5,000 events/月

#### Vercel Log Drains

- 外部ログサービスへの転送
- Datadog、Logtail、Axiom等

---

## 11. トラブルシューティング

### よくある問題と対処法

#### 問題1: ビルドエラー「Prisma Client not found」

**原因**: Prismaクライアントが生成されていない

**解決策**:

```json
// package.jsonに追加
"scripts": {
  "postinstall": "prisma generate"
}
```

#### 問題2: データベース接続エラー

**原因**: SSL設定が不足

**解決策**:

```
DATABASE_URL="postgresql://...?sslmode=require"
```

#### 問題3: NextAuth認証エラー

**原因**: `NEXTAUTH_URL`が正しくない

**解決策**:

- Vercel環境変数で正しいURLを設定
- Google OAuth承認済みURIを更新

#### 問題4: マイグレーションエラー

**原因**: 既存のテーブルとの競合

**解決策**:

```bash
# ローカルで確認
npx prisma migrate status

# 手動でリセット（開発環境のみ）
npx prisma migrate reset

# 本番環境では慎重に
npx prisma migrate deploy
```

---

## 12. チェックリスト

### デプロイ前

- [ ] `vercel.json`作成
- [ ] `package.json`に`postinstall`スクリプト追加
- [ ] `.env.example`更新（本番用設定例）
- [ ] `.gitignore`に`.env`が含まれているか確認
- [ ] Prismaスキーマが正しいか確認

### データベース準備

- [ ] Neon/Supabaseでプロジェクト作成
- [ ] 接続文字列取得（SSL設定含む）
- [ ] ローカルでマイグレーション動作確認

### Vercel設定

- [ ] GitHubリポジトリ連携
- [ ] 環境変数設定（6項目）
- [ ] ビルドコマンド確認

### デプロイ後

- [ ] デプロイ成功確認
- [ ] データベース接続確認
- [ ] 認証機能テスト
- [ ] Google OAuth動作確認
- [ ] API動作確認

### セキュリティ

- [ ] Google OAuth承認済みURIの更新
- [ ] 環境変数の漏洩チェック
- [ ] SSL接続確認

---

## 13. 次のステップ

### Phase 1: 基本デプロイ（完了目標: 1日）

1. Neonでデータベース作成
2. Vercelプロジェクト作成
3. 環境変数設定
4. 初回デプロイ
5. 動作確認

### Phase 2: 最適化（完了目標: 1週間）

1. パフォーマンス測定
2. エラーモニタリング導入（Sentry）
3. 画像最適化
4. キャッシュ戦略

### Phase 3: スケーリング（必要に応じて）

1. 有料プランへのアップグレード
2. 独自ドメイン設定
3. CDN設定
4. バックアップ戦略

---

## 14. 参考リンク

### 公式ドキュメント

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs/introduction)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

### 関連プロジェクトドキュメント

- [要件定義](./requirements.md)
- [アーキテクチャ設計](./architecture.md)
- [データベース設計](./database.md)
- [セキュリティ設計](./security.md)

---

## 変更履歴

| 日付       | 変更内容 | 担当者  |
| ---------- | -------- | ------- |
| 2026-01-17 | 初版作成 | Yuto299 |
