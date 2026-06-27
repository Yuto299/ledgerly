# 本番運用トラブルシューティング

Vercel / Prisma マイグレーション / OAuth まわりで本番デプロイ時に発生しやすい問題と、その解決手順をまとめます。

> ローカル開発環境のトラブル（DB 接続・ポート競合・キャッシュなど）は [../guides/setup.md](../guides/setup.md) の「トラブルシューティング」を参照してください。

> ⚠️ 本番 DB に対する操作（`migrate resolve` / 手動 SQL など）は不可逆です。**実行前に必ずバックアップ**（Neon / Supabase のダッシュボードから取得）を行ってください。

---

## 0. 共通: 本番 DATABASE_URL の取り出し方

ローカルから本番 DB を操作する場合、`DATABASE_URL` を Vercel から取得します。

1. [Vercel Dashboard](https://vercel.com/dashboard) → プロジェクト `ledgerly` → **Settings → Environment Variables**
2. `DATABASE_URL` の行の 👁️ アイコンをクリックして値を表示・コピー
   - 例: `postgresql://user:password@host.neon.tech/ledgerly?sslmode=require`

以降のコマンドの `"<PROD_DATABASE_URL>"` は、この値に置き換えてください。

```bash
# まずは現状確認（破壊的でない）
DATABASE_URL="<PROD_DATABASE_URL>" npx prisma migrate status
```

---

## 1. `relation "users" does not exist` / テーブルが無い

**症状**: 本番でログイン・新規登録などが 500 になり、ログに「テーブルが存在しない」系のエラーが出る。

**原因**: デプロイ時に `prisma migrate deploy` が走っておらず、スキーマが本番 DB に反映されていない。

**確認**:

```bash
DATABASE_URL="<PROD_DATABASE_URL>" npx prisma migrate status
```

**対処**:

1. ビルドコマンドにマイグレーションが含まれているか確認する。
   - `package.json` の `vercel-build` スクリプト、または Vercel の **Settings → Build & Development Settings → Build Command** に `prisma migrate deploy` が含まれていること。
2. 含まれていれば再デプロイ。即座に直したい場合はローカルから手動適用:

   ```bash
   DATABASE_URL="<PROD_DATABASE_URL>" npx prisma migrate deploy
   ```

3. 反映後にアプリを再デプロイ（または既存デプロイを Redeploy）。

---

## 2. `P3009`: 失敗したマイグレーションが残っている

**症状**:

```
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied.
The `20260117191843_add_hourly_rate_to_projects` migration started at ... failed
```

**原因**: 過去にマイグレーションが途中失敗し、`_prisma_migrations` テーブルに「失敗」記録が残っているため、以降のマイグレーションが適用されない。

### 解決手順

#### Step 1. 失敗マイグレーションが「実際に適用済みか」を判定する

該当マイグレーションが変更しようとしたカラム / テーブルが、本番 DB に実在するかを確認します。

```sql
-- Neon / Supabase の SQL エディタで実行（例: hourly_rate カラムの確認）
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'projects' AND column_name = 'hourly_rate';
```

#### Step 2-A. カラムが存在する場合 → `applied` としてマーク

スキーマ変更自体は通っており、記録だけが失敗状態のケース。

```bash
DATABASE_URL="<PROD_DATABASE_URL>" \
  npx prisma migrate resolve --applied 20260117191843_add_hourly_rate_to_projects
```

#### Step 2-B. カラムが存在しない場合 → `rolled-back` してから再適用

実際に変更が当たっていないケース。

```bash
# 1. ロールバック扱いにする
DATABASE_URL="<PROD_DATABASE_URL>" \
  npx prisma migrate resolve --rolled-back 20260117191843_add_hourly_rate_to_projects

# 2. 改めて適用
DATABASE_URL="<PROD_DATABASE_URL>" npx prisma migrate deploy
```

> 緊急時はカラムを手動追加（`ALTER TABLE projects ADD COLUMN IF NOT EXISTS hourly_rate INTEGER;`）してから Step 2-A を実行する方法もありますが、スキーマ定義との差異が出るため非推奨です。

#### Step 3. 確認

```bash
DATABASE_URL="<PROD_DATABASE_URL>" npx prisma migrate status
# → "Database schema is up to date!" が出れば OK
```

その後、Vercel で Redeploy。

> 補足: 現状の `package.json` の `vercel-build` には、特定マイグレーションを `migrate resolve --applied` する暫定ハックが入っています。この根本解決は [Issue #63](https://github.com/Yuto299/ledgerly-pre/issues/63) で追跡しています。

---

## 3. Google OAuth: `redirect_uri_mismatch`（400）

**原因**: Google OAuth の「承認済みリダイレクト URI」に、デプロイ先 URL が登録されていない。

**対処**:

1. Vercel のデプロイ URL を確認（例: `https://ledgerly.vercel.app`）。
2. [Google Cloud Console](https://console.cloud.google.com/) → **API とサービス → 認証情報** → 対象の OAuth 2.0 クライアント ID を開く。
3. **承認済みのリダイレクト URI** に追加:

   ```
   https://<実際のVercel URL>/api/auth/callback/google
   ```

4. 「保存」後、Vercel 側の環境変数も確認:
   - `NEXTAUTH_URL` … 実際のデプロイ URL
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
5. 環境変数を変更した場合は再デプロイ。

> OAuth クライアントの新規作成手順は [../guides/google-oauth.md](../guides/google-oauth.md) を参照。

---

## 4. 新規登録・ログインで 500 エラー

**よくある原因と確認順序**:

1. **マイグレーション未適用** → セクション 1・2 を確認。
2. **`DATABASE_URL` の SSL 設定漏れ** → 接続文字列に `?sslmode=require` が含まれているか。
3. **DB 自体の障害** → Neon / Supabase のダッシュボードで稼働状況を確認。
4. **ログの確認** → Vercel Dashboard → 対象デプロイ → **Functions / Logs** で実際の例外を確認。ブラウザ DevTools の Network / Console も併せて確認。

---

## 確認チェックリスト

- [ ] `prisma migrate status` が "up to date" を返す
- [ ] ビルドログに `prisma migrate deploy` の実行が出ている
- [ ] `DATABASE_URL` が正しく、`?sslmode=require` を含む
- [ ] `NEXTAUTH_URL` がデプロイ URL と一致している
- [ ] Google OAuth のリダイレクト URI にデプロイ URL が登録されている
- [ ] 環境変数変更後に再デプロイした

## 関連ドキュメント

- [deployment.md](./deployment.md) — Vercel デプロイ手順の全体像
- [../guides/setup.md](../guides/setup.md) — ローカル開発のトラブルシューティング
- [../guides/google-oauth.md](../guides/google-oauth.md) — Google OAuth 設定
