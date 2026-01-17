# Vercelでのマイグレーション実行方法

## 問題: `users`テーブルが存在しないエラー

### 原因
Vercelのデプロイ時にPrismaマイグレーションが実行されていない可能性があります。

## 解決方法

### 方法1: Vercelのビルド設定を確認（推奨）

1. **Vercelダッシュボードで確認**
   - プロジェクト → Settings → General
   - "Build & Development Settings"セクションを確認
   - "Build Command"が`prisma generate && prisma migrate deploy && next build`になっているか確認
   - もし異なる場合は、手動で設定

2. **または、`package.json`の`vercel-build`スクリプトを使用**
   - Vercelは`vercel-build`スクリプトを自動的に検出します
   - 既に`package.json`に設定済み: `"vercel-build": "prisma generate && prisma migrate deploy && next build"`
   - Vercelダッシュボードで"Build Command"を空にするか、`npm run vercel-build`に設定

### 方法2: 手動でマイグレーションを実行（即座に解決）

#### オプションA: Vercel CLIを使用（推奨）

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# プロジェクトにログイン
vercel login

# プロジェクトをリンク
vercel link

# 環境変数を設定してマイグレーション実行
vercel env pull .env.production
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma migrate deploy
```

#### オプションB: ローカルから直接実行

1. **Vercelダッシュボードから`DATABASE_URL`を取得**
   - Settings → Environment Variables
   - `DATABASE_URL`の値をコピー

2. **ローカルでマイグレーション実行**

```bash
# 本番データベースに対してマイグレーション実行
DATABASE_URL="your-production-database-url" npx prisma migrate deploy
```

**注意**: `DATABASE_URL`は実際の本番環境の接続文字列に置き換えてください。

#### オプションC: VercelのFunctionsから実行

1. Vercelダッシュボード → プロジェクト → Functions
2. 新しいFunctionを作成してマイグレーションを実行
3. または、Vercelのターミナル機能を使用（利用可能な場合）

### 方法3: ビルドログを確認

1. Vercelダッシュボード → Deployments
2. 最新のデプロイメントをクリック
3. "Build Logs"を確認
4. `prisma migrate deploy`が実行されているか確認
5. エラーメッセージがある場合は確認

### 確認コマンド

マイグレーションが正しく実行されたか確認：

```bash
# マイグレーション状態を確認
DATABASE_URL="your-production-database-url" npx prisma migrate status

# データベースのテーブル一覧を確認
DATABASE_URL="your-production-database-url" npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

## トラブルシューティング

### エラー: "Migration engine error: failed to connect to database"

- `DATABASE_URL`が正しく設定されているか確認
- SSL設定（`?sslmode=require`）が含まれているか確認
- データベースが起動しているか確認（Neon/Supabaseダッシュボードで確認）

### エラー: "Migration X already applied"

- これは正常です。マイグレーションは既に適用されています
- アプリケーションを再起動してみてください

### エラー: "The migration failed to apply"

- ビルドログの詳細なエラーメッセージを確認
- データベースの権限を確認
- マイグレーションファイルに構文エラーがないか確認

## 今後の対策

### 自動マイグレーション実行の確認

`vercel.json`と`package.json`の両方に設定があることを確認：

1. `vercel.json`: `"buildCommand": "prisma generate && prisma migrate deploy && next build"`
2. `package.json`: `"vercel-build": "prisma generate && prisma migrate deploy && next build"`

これにより、どちらの方法でもマイグレーションが実行されます。
