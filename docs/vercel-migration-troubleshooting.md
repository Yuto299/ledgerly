# Vercelマイグレーションエラーのトラブルシューティング

## 設定を修正してもエラーが出る場合

### ステップ1: ビルドログを確認

1. Vercelダッシュボード → Deployments
2. 最新のデプロイメントをクリック
3. "Build Logs"タブを開く
4. 以下を確認：

#### ✅ 正常な場合
```
Running "prisma generate && prisma migrate deploy && next build"
...
Prisma schema loaded from prisma/schema.prisma
...
Applying migration `20260110110034_init`
Applying migration `20260111025512_add_user_settings`
...
All migrations have been successfully applied.
```

#### ❌ エラーが出ている場合

**エラー1: "Migration engine error: failed to connect to database"**
- **原因**: `DATABASE_URL`が正しく設定されていない、またはデータベースに接続できない
- **解決策**:
  1. Vercel → Settings → Environment Variables
  2. `DATABASE_URL`が正しく設定されているか確認
  3. SSL設定（`?sslmode=require`）が含まれているか確認
  4. データベースが起動しているか確認（Neon/Supabaseダッシュボード）

**エラー2: "The migration failed to apply"**
- **原因**: マイグレーションファイルに問題がある、またはデータベースの状態が不正
- **解決策**: 手動でマイグレーションを実行して詳細なエラーを確認

**エラー3: "Migration X already applied"**
- **原因**: マイグレーションは既に適用されているが、Prismaの状態が不正
- **解決策**: これは正常な場合もあります。アプリケーションを再起動してみる

**エラー4: ビルドログに`prisma migrate deploy`が表示されない**
- **原因**: ビルドコマンドが正しく実行されていない
- **解決策**: 
  1. 設定が保存されているか確認
  2. 新しいデプロイをトリガー
  3. キャッシュをクリアして再デプロイ

### ステップ2: 手動でマイグレーションを実行（即座に解決）

設定の問題を回避して、直接マイグレーションを実行：

#### 方法A: Vercel CLIを使用

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# プロジェクトにログイン
vercel login

# プロジェクトをリンク
vercel link

# 環境変数を取得
vercel env pull .env.production

# マイグレーション実行
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2) npx prisma migrate deploy
```

#### 方法B: ローカルから直接実行

1. **Vercelダッシュボードから`DATABASE_URL`を取得**
   - Settings → Environment Variables
   - `DATABASE_URL`の値をコピー（目のアイコンをクリック）

2. **マイグレーション実行**

```bash
# 本番データベースに対してマイグレーション実行
DATABASE_URL="your-production-database-url" npx prisma migrate deploy
```

**例**（Neonの場合）:
```bash
DATABASE_URL="postgresql://user:password@host.neon.tech/ledgerly?sslmode=require" npx prisma migrate deploy
```

### ステップ3: マイグレーション状態を確認

マイグレーションが正しく適用されたか確認：

```bash
# マイグレーション状態を確認
DATABASE_URL="your-production-database-url" npx prisma migrate status

# 期待される出力:
# Database schema is up to date!
# All migrations have been applied.
```

### ステップ4: データベースのテーブルを確認

`users`テーブルが存在するか確認：

```bash
# Prisma Studioで確認（ローカルから）
DATABASE_URL="your-production-database-url" npx prisma studio

# または、SQLで直接確認
DATABASE_URL="your-production-database-url" npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users';"
```

### ステップ5: アプリケーションを再起動

マイグレーションが成功したら：

1. Vercelダッシュボードで新しいデプロイをトリガー
2. または、既存のデプロイメントを再デプロイ

## よくある問題と解決策

### 問題1: ビルドは成功するが、アプリケーションでエラーが出る

**原因**: マイグレーションは実行されたが、アプリケーションが古いPrisma Clientを使用している

**解決策**:
1. Vercelで再デプロイ
2. ビルドログで`prisma generate`が実行されているか確認

### 問題2: マイグレーションが途中で失敗する

**原因**: データベースの状態が不正、またはマイグレーションファイルに問題

**解決策**:
1. ビルドログの詳細なエラーメッセージを確認
2. ローカルで同じマイグレーションを実行してエラーを再現
3. 必要に応じて、データベースをリセット（**本番環境では注意**）

### 問題3: 設定を変更しても反映されない

**原因**: Vercelのキャッシュ、または設定の保存漏れ

**解決策**:
1. 設定を再度確認して保存
2. Vercelのキャッシュをクリア
3. 新しいデプロイをトリガー

### 問題4: Production OverridesとProject Settingsが異なる

**原因**: 過去のデプロイメント設定が残っている

**解決策**:
1. Project Settingsを正しく設定（`prisma migrate deploy`を含む）
2. Production Overridesを削除するか、Project Settingsと同じにする
3. 新しいデプロイをトリガー

## 緊急時の対応

### データベースが空の場合

1. **手動でマイグレーション実行**（上記の方法B）
2. **マイグレーション状態を確認**
3. **アプリケーションをテスト**

### データベースに既にデータがある場合

1. **バックアップを取得**（Neon/Supabaseのダッシュボードから）
2. **マイグレーション状態を確認**: `npx prisma migrate status`
3. **必要に応じて手動でマイグレーション実行**

## 確認チェックリスト

- [ ] Vercelのビルドログで`prisma migrate deploy`が実行されている
- [ ] マイグレーションが成功している（エラーがない）
- [ ] `DATABASE_URL`が正しく設定されている
- [ ] データベースに`users`テーブルが存在する
- [ ] アプリケーションを再デプロイした

## それでも解決しない場合

1. **Vercelのサポートに連絡**: ビルドログとエラーメッセージを共有
2. **Prismaのコミュニティフォーラム**: エラーメッセージを共有
3. **データベースプロバイダーのサポート**: Neon/Supabaseのサポートに連絡
