# Google OAuth 設定ガイド

## 1. Google Cloud Console での設定

### プロジェクト作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）

### OAuth 同意画面の設定

1. 左メニューから「API とサービス」→「OAuth 同意画面」を選択
2. User Type で「外部」を選択して「作成」
3. アプリ情報を入力：
   - アプリ名: Ledgerly
   - ユーザーサポートメール: あなたのメールアドレス
   - デベロッパーの連絡先情報: あなたのメールアドレス
4. 「保存して次へ」をクリック
5. スコープは追加せずに「保存して次へ」
6. テストユーザーを追加（開発中は必要に応じて）
7. 「保存して次へ」→「ダッシュボードに戻る」

### OAuth クライアント ID の作成

1. 左メニューから「API とサービス」→「認証情報」を選択
2. 「認証情報を作成」→「OAuth クライアント ID」をクリック
3. アプリケーションの種類で「ウェブアプリケーション」を選択
4. 名前: Ledgerly Web App
5. 承認済みのリダイレクト URI に以下を追加：
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   本番環境用：
   ```
   https://your-domain.com/api/auth/callback/google
   ```
6. 「作成」をクリック
7. 表示される **クライアント ID** と **クライアントシークレット** をコピー

## 2. 環境変数の設定

`.env` ファイルに以下を追加：

```bash
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
```

## 3. 動作確認

1. 開発サーバーを再起動

   ```bash
   npm run dev
   ```

2. ログインページ（http://localhost:3000/login）にアクセス

3. 「Google でログイン」ボタンをクリック

4. Google アカウントでログインを試す

## トラブルシューティング

### リダイレクト URI エラー

- Google Cloud Console で設定したリダイレクト URI が正しいか確認
- `http://localhost:3000/api/auth/callback/google` が登録されているか確認

### 認証情報エラー

- `.env` ファイルの `GOOGLE_CLIENT_ID` と `GOOGLE_CLIENT_SECRET` が正しいか確認
- 開発サーバーを再起動

### ユーザーが作成されない

- データベース接続が正常か確認
- Prisma schema に `User` モデルが正しく定義されているか確認

## セキュリティ上の注意

- クライアントシークレットは絶対に公開しない
- `.env` ファイルを `.gitignore` に追加（既に追加済み）
- 本番環境では適切なドメインのリダイレクト URI を使用
