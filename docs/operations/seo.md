# SEO対策実装ガイド

このドキュメントでは、Ledgerlyに実装されたSEO対策について説明します。

---

## 実装済みのSEO対策

### 1. **robots.txt** - [/src/app/robots.ts](../../src/app/robots.ts)

Next.js 14の機能を使用して動的に生成されます。

- ✅ 公開ページ（/, /login, /signup）をクロール許可
- ✅ 認証が必要なページ（/dashboard など）をクロール拒否
- ✅ sitemap.xmlへのリンク

```typescript
// 自動で /robots.txt として配信される
```

### 2. **sitemap.xml** - [/src/app/sitemap.ts](../../src/app/sitemap.ts)

検索エンジンにページ構造を伝えます。

- ✅ 全公開ページのURL
- ✅ 更新頻度と優先度の設定
- ✅ 最終更新日の自動設定

```typescript
// 自動で /sitemap.xml として配信される
```

### 3. **PWA Manifest** - [/src/app/manifest.ts](../../src/app/manifest.ts)

PWA対応とブランディング。

- ✅ アプリ名と説明
- ✅ テーマカラー
- ✅ アイコン設定

### 4. **Metadata強化** - [/src/app/layout.tsx](../../src/app/layout.tsx)

#### Open Graph (OG) タグ

- ✅ Facebook、LinkedIn用の最適化
- ✅ OG画像の設定（1200x630px推奨）
- ✅ タイトル、説明、URLの設定

#### Twitter Card

- ✅ summary_large_image カード
- ✅ Twitter用の最適化

#### その他のMetadata

- ✅ キーワード最適化
- ✅ 著者・制作者情報
- ✅ robots設定
- ✅ Google/Yandex検証コード用のプレースホルダー

### 5. **構造化データ (JSON-LD)** - [/src/app/layout.tsx](../../src/app/layout.tsx)

Schema.orgの構造化データで検索エンジンに情報を伝達。

```json
{
  "@type": "SoftwareApplication",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "price": "0",
    "priceCurrency": "JPY"
  }
}
```

### 6. **画像最適化** - [/next.config.js](../../next.config.js)

- ✅ AVIF/WebP自動変換
- ✅ レスポンシブ画像サイズ
- ✅ 圧縮有効化

### 7. **ページ別Metadata**

- [/src/app/page.tsx](../../src/app/page.tsx) - ホームページ
- [/src/app/login/metadata.ts](../../src/app/login/metadata.ts) - ログインページ
- [/src/app/signup/metadata.ts](../../src/app/signup/metadata.ts) - 登録ページ

---

## セットアップ手順

### 1. 環境変数の設定

`.env`ファイルに本番URLを設定：

```env
NEXTAUTH_URL="https://yourdomain.com"
```

### 2. OG画像の作成

`/public/og-image.png`を作成してください。

**推奨仕様:**

- サイズ: 1200x630px
- フォーマット: PNG or JPEG
- ファイルサイズ: 1MB以下
- 内容: ロゴ + キャッチコピー + サービス名

**作成方法の例:**

- Figma/Canva で作成
- [og-image-generator](https://og-image.vercel.app/) を使用
- Photoshop/Illustrator で作成

### 3. Google Search Console の設定

1. [Google Search Console](https://search.google.com/search-console) にアクセス
2. プロパティを追加
3. 検証コードを取得
4. [/src/app/layout.tsx](../../src/app/layout.tsx) の `verification.google` に設定：

```typescript
verification: {
  google: "your-google-verification-code-here",
},
```

### 4. デプロイ後の確認

開発サーバーを起動して確認：

```bash
npm run dev
```

以下のURLにアクセス：

- http://localhost:3000/robots.txt
- http://localhost:3000/sitemap.xml
- http://localhost:3000/manifest.webmanifest

---

## SEOチェックリスト

### 必須項目

- [ ] `NEXTAUTH_URL`を本番URLに設定
- [ ] `/public/og-image.png` を作成（1200x630px）
- [ ] Google Search Console に登録
- [ ] sitemap.xmlをGoogle Search Consoleに送信

### 推奨項目

- [ ] Google Analytics の設定
- [ ] Google Tag Manager の設定
- [ ] Schema.orgのレビュー評価を実データに更新
- [ ] Twitter/@ledgerly アカウントを作成（Twitter Cardの`creator`）
- [ ] ページ読み込み速度の最適化（Lighthouse スコア90+）
- [ ] モバイルフレンドリーテスト合格

### Vercelデプロイ時

- [ ] Environment Variables に `NEXTAUTH_URL` を追加
- [ ] Analytics の有効化
- [ ] Speed Insights の有効化

---

## SEOツールでの検証

### 1. Google PageSpeed Insights

https://pagespeed.web.dev/

目標スコア:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100

### 2. Open Graph Debugger

- Facebook: https://developers.facebook.com/tools/debug/
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

### 3. 構造化データテスト

https://search.google.com/test/rich-results

---

## パフォーマンス最適化のヒント

### 画像最適化

```tsx
import Image from "next/image";

<Image
  src="/hero.png"
  alt="説明テキスト"
  width={1200}
  height={630}
  priority // 最初に表示される画像
/>;
```

### フォントの最適化

```tsx
// 既に実装済み
const inter = Inter({ subsets: ["latin"] });
```

### コード分割

```tsx
// 動的インポートで必要な時だけロード
const DynamicComponent = dynamic(() => import("./Component"));
```

---

## トラブルシューティング

### robots.txtが表示されない

- 開発サーバーを再起動
- `/src/app/robots.ts` のシンタックスエラーをチェック

### sitemap.xmlが更新されない

- ビルドを再実行: `npm run build`
- Next.jsのキャッシュをクリア: `rm -rf .next`

### OG画像が表示されない

1. `/public/og-image.png` が存在するか確認
2. ファイルサイズが1MB以下か確認
3. Facebook/Twitterのキャッシュをクリア

---

## 今後の改善案

### コンテンツSEO

- [ ] ブログセクションの追加（/blog）
- [ ] ヘルプ/FAQページの追加（/help）
- [ ] 使い方ガイドの追加（/guides）
- [ ] 機能紹介ページの追加（/features）

### 技術的SEO

- [ ] AMP対応の検討
- [ ] インターナショナル対応（hreflang）
- [ ] パンくずリストの構造化データ追加
- [ ] 記事（Article）の構造化データ追加

### UX/パフォーマンス

- [ ] Core Web Vitals の継続的監視
- [ ] Lazy Loading の最適化
- [ ] Service Worker の実装
- [ ] Offline対応

---

## 参考リンク

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
