# セットアップガイド

## 前提条件

- Node.js 20.x 以上
- Docker Desktop（PostgreSQL 用）
- Git

---

## 1. プロジェクトのクローン

```bash
git clone https://github.com/Yuto299/ledgerly-pre.git
cd ledgerly-pre
```

---

## 2. 依存関係のインストール

```bash
npm install
```

---

## 3. データベースのセットアップ

### Docker Compose で prisma を起動

```bash
# PostgreSQLコンテナを起動
docker-compose up -d

# コンテナの状態を確認
docker-compose ps
```

### 環境変数の設定

`.env.example`をコピーして`.env`を作成：

```bash
cp .env.example .env
```

`.env`ファイルを編集（Docker Compose の場合）:

```env
DATABASE_URL="postgresql://ledgerly:ledgerly_dev_password@localhost:5433/ledgerly?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NODE_ENV="development"
```

> ℹ️ ポートは **5433** です。`docker-compose.yml` でホスト側 `5433` → コンテナ側 `5432` にマップしているため、ローカルの既存 PostgreSQL（5432）と競合しません。

### Prisma のセットアップ

```bash
# Prisma Clientの生成
npx prisma generate

# データベースに反映（マイグレーションなし・開発用）
npx prisma db push

# Seedデータの投入
npm run prisma:seed
```

### Prisma Studio で確認（任意）

```bash
npm run prisma:studio
```

ブラウザで http://localhost:5555 にアクセスしてデータを確認できます。

---

## 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

---

## 5. ログイン

デモアカウントでログイン：

- **メールアドレス**: `demo@ledgerly.com`
- **パスワード**: `password123`

---

## 6. 開発フロー

### ブランチ戦略・コミット規約・PR フロー

ブランチ戦略（GitHub Flow）、ブランチ命名規則、コミットメッセージ規約、PR・レビューの流れは [CONTRIBUTING.md](../../CONTRIBUTING.md) に集約しています。新規参画の方はまずそちらを確認してください。

```bash
# 例: 機能開発の開始
git switch -c feat/customer-management
# 作業 → コミット（Conventional Commits）→ push → PR 作成
```

### Prisma スキーマ変更時

```bash
# スキーマを編集後
npx prisma format       # フォーマット
npx prisma generate     # Clientを再生成
npx prisma db push      # DBに反映（開発用）

# 本番用マイグレーション作成
npx prisma migrate dev --name add_customer_table
```

### テストの実行

```bash
# 単体テスト
npm run test

# カバレッジ
npm run test:coverage

# ウォッチモード
npm run test:watch
```

### Lint・フォーマット

```bash
# Lint
npm run lint

# Lintエラーを自動修正
npm run lint --fix
```

---

## 7. よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# Prisma Studio起動
npm run prisma:studio

# Prisma Client生成
npm run prisma:generate

# DB反映
npm run prisma:push

# マイグレーション作成
npm run prisma:migrate

# Seedデータ投入
npm run prisma:seed

# テスト
npm run test
```

---

## 8. トラブルシューティング

### Prisma Client が見つからない

```bash
npx prisma generate
```

### データベース接続エラー

```bash
# Dockerコンテナの状態を確認
docker-compose ps

# コンテナを再起動
docker-compose restart

# ログを確認
docker-compose logs postgres
```

### ポート 3000 が使用中

```bash
# 別のポートで起動
PORT=3001 npm run dev
```

### キャッシュクリア

```bash
# Next.jsのキャッシュクリア
rm -rf .next

# node_modulesを再インストール
rm -rf node_modules package-lock.json
npm install
```

---

## 9. VSCode 推奨設定

`.vscode/settings.json`を作成：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

### 推奨拡張機能

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- Error Lens

---

## 10. 本番デプロイ（Vercel）

### 前提条件

- Vercel アカウント
- Managed PostgreSQL（Supabase / Neon / Railway）

### 手順

1. プロジェクトを GitHub にプッシュ
2. Vercel で新規プロジェクト作成
3. 環境変数を設定
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. デプロイ

```bash
# Vercel CLIを使う場合
npm i -g vercel
vercel
```

### データベースマイグレーション

```bash
# 本番DBに対してマイグレーション実行
DATABASE_URL="production_url" npx prisma migrate deploy
```

---

## 11. 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
