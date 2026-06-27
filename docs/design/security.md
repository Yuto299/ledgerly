# セキュリティガイド

## 概要

Ledgerly アプリケーションに実装されているセキュリティ機能と、本番環境での推奨事項についてまとめています。

## 認証・認可

### 実装内容

- **NextAuth (Auth.js v4)**: JWT ベースのセッション管理
- **パスワードハッシュ化**: bcryptjs を使用（12 ラウンド）
- **セッション有効期限**: 30 日間
- **認証チェック**: すべての API エンドポイントで `getUserId()` または `getServerSession()` を使用

### ルート保護

Next.js middleware により、未認証ユーザーは保護されたルートにアクセスできません：

- **公開パス**: `/login`, `/signup`, `/api/auth/*`
- **保護パス**: 上記以外のすべてのルート

## パスワードポリシー

### 要件

- **最小長**: 8 文字
- **大文字**: 1 文字以上
- **小文字**: 1 文字以上
- **数字**: 1 文字以上
- **特殊文字**: 1 文字以上

### 実装

```typescript
import { strongPasswordSchema } from "@/lib/security/password";

// Zod スキーマでバリデーション
const validatedData = z
  .object({
    password: strongPasswordSchema,
  })
  .parse(data);
```

## レートリミット

### ログイン

- **制限**: 15 分間で 5 回まで
- **単位**: メールアドレス
- **実装**: メモリストア（本番環境では Redis 推奨）

### サインアップ

- **制限**: 15 分間で 5 回まで
- **単位**: IP アドレス
- **レスポンス**: 429 Too Many Requests（`Retry-After` ヘッダー付き）

## セキュリティヘッダー

以下のセキュリティヘッダーがすべてのレスポンスに設定されます：

| ヘッダー                    | 値                                             | 目的                     |
| --------------------------- | ---------------------------------------------- | ------------------------ |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | HTTPS 強制               |
| `X-Frame-Options`           | `SAMEORIGIN`                                   | クリックジャッキング対策 |
| `X-Content-Type-Options`    | `nosniff`                                      | MIME スニッフィング対策  |
| `X-XSS-Protection`          | `1; mode=block`                                | XSS 対策                 |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              | リファラー制御           |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`     | 機能ポリシー             |

## 環境変数の安全性

### 必須チェック

起動時に以下の環境変数が検証されます（本番環境のみ）：

- `DATABASE_URL`: 有効な URL 形式
- `NEXTAUTH_URL`: 有効な URL 形式
- `NEXTAUTH_SECRET`:
  - 32 文字以上
  - デフォルト値（`your-secret-key-here-change-in-production`）からの変更必須

### 生成方法

```bash
# セキュアなシークレットキーを生成
openssl rand -base64 32
```

## データ保護

### マルチテナント分離

- すべてのクエリで `userId` によるフィルタリング
- ユーザー間のデータ漏洩を防止
- Prisma の型安全性により実装ミスを防止

### 論理削除

- `deletedAt` フィールドによる論理削除
- データの完全性を保持
- 誤削除からの復旧が可能

## 脆弱性対策

### SQL インジェクション

- ✅ **Prisma ORM** による型安全なクエリ
- ✅ パラメータ化クエリの自動使用
- ✅ 生 SQL の使用なし

### XSS (Cross-Site Scripting)

- ✅ **React** のデフォルト保護（自動エスケープ）
- ✅ `dangerouslySetInnerHTML` の使用なし
- ✅ セキュリティヘッダー（`X-XSS-Protection`）

### CSRF (Cross-Site Request Forgery)

- ✅ **NextAuth** の組み込み CSRF 保護
- ✅ SameSite Cookie の使用
- ✅ トークンベースの検証

## 本番環境での推奨事項

### 1. レートリミットストアの変更

メモリストアから **Redis** への移行を推奨：

```typescript
// 例: Redis を使用したレートリミット
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
) {
  const key = `ratelimit:${identifier}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, Math.ceil(config.interval / 1000));
  }

  return {
    success: count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - count),
  };
}
```

### 2. 監査ログの実装

重要なアクションのログ記録を推奨：

- ログイン / ログアウト
- データの作成 / 更新 / 削除
- 権限変更
- 設定変更

### 3. CSP の追加

Content Security Policy の設定を推奨：

```javascript
// next.config.js
{
  key: "Content-Security-Policy",
  value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
}
```

### 4. HTTPS の強制

- 本番環境では必ず **HTTPS** を使用
- `NEXTAUTH_URL` を `https://` から始める
- HTTP リクエストを HTTPS にリダイレクト

### 5. セッション管理の強化

- セッションタイムアウトの実装
- ログアウト時のトークン無効化
- 複数デバイス管理

## セキュリティチェックリスト

### デプロイ前

- [ ] `NEXTAUTH_SECRET` がデフォルト値から変更されている
- [ ] `NEXTAUTH_URL` が本番環境の URL に設定されている
- [ ] HTTPS が有効化されている
- [ ] 環境変数が適切に設定されている
- [ ] データベース接続が SSL/TLS を使用している

### 定期的なメンテナンス

- [ ] `npm audit` で脆弱性をチェック
- [ ] 依存パッケージを最新版に更新
- [ ] セキュリティパッチの適用
- [ ] アクセスログの監視
- [ ] 異常なログイン試行の検出

## 脆弱性報告

セキュリティ上の問題を発見した場合は、以下の手順で報告してください：

1. **公開リポジトリには投稿しない**
2. プロジェクト管理者に直接連絡
3. 詳細な再現手順を提供
4. 修正まで情報を非公開に保つ

## 参考資料

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NextAuth.js Security](https://next-auth.js.org/security)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Prisma Security Best Practices](https://www.prisma.io/docs/guides/security)
