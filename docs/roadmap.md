# 実装ロードマップ

**全体進捗: 98%**（7 Phase 中 Phase 7.5 まで完了）

## Phase 1: 基盤構築 ✅ 100%

### 1.1 プロジェクト初期設定 ✅

- [x] package.json 設定
- [x] TypeScript 設定
- [x] Next.js 設定
- [x] Tailwind CSS 設定
- [x] Docker Compose（PostgreSQL）
- [x] 環境変数テンプレート

### 1.2 データベース設定 ✅

- [x] Prisma スキーマ定義
- [x] テーブル設計
- [x] マイグレーション設定
- [x] Seed データ作成

### 1.3 認証システム ✅

- [x] NextAuth 設定
- [x] ログイン画面
- [x] セッション管理
- [x] 認証ミドルウェア

### 1.4 基本 UI ✅

- [x] Atomic Design コンポーネント（Button, Input, Card, Badge, Label）
- [x] FormField（Molecule）
- [x] Sidebar / Header（Organism）
- [x] ダッシュボードレイアウト

---

## Phase 2: 顧客・案件管理 ✅

### 2.1 顧客管理（Backend）✅

- [x] CustomerRepository（CRUD 操作）
- [x] Customer スキーマ（Zod）
- [x] Usecase 実装
  - [x] CreateCustomer
  - [x] UpdateCustomer
  - [x] DeleteCustomer（論理削除）
  - [x] GetCustomerById
  - [x] ListCustomers（ページネーション）
- [x] API Route Handlers
  - [x] GET /api/customers
  - [x] POST /api/customers
  - [x] GET /api/customers/:id
  - [x] PUT /api/customers/:id
  - [x] DELETE /api/customers/:id

### 2.2 顧客管理（Frontend）✅

- [x] 顧客一覧画面
- [x] 顧客詳細画面
- [x] 顧客作成フォーム
- [x] 顧客編集フォーム
- [x] TanStack Query 統合

### 2.3 案件管理（Backend）✅

- [x] ProjectRepository（CRUD 操作）
- [x] Project スキーマ（Zod）
- [x] Usecase 実装
  - [x] CreateProject
  - [x] UpdateProject
  - [x] DeleteProject
  - [x] GetProjectById
  - [x] ListProjects（フィルタ・ページネーション）
- [x] API Route Handlers
  - [x] GET /api/projects
  - [x] POST /api/projects
  - [x] GET /api/projects/:id
  - [x] PUT /api/projects/:id
  - [x] DELETE /api/projects/:id

### 2.4 案件管理（Frontend）✅

- [x] 案件一覧画面
- [x] 案件詳細画面（請求書・経費一覧含む）
- [x] 案件作成フォーム
- [x] 案件編集フォーム

---

## Phase 3: 請求書・入金管理 ✅

### 3.1 請求書管理（Backend）✅

- [x] InvoiceRepository
- [x] InvoiceItemRepository
- [x] Invoice スキーマ（Zod）
- [x] Domain Service: InvoiceService
  - [x] 明細から合計金額を算出
  - [x] ステータス更新ロジック
- [x] Usecase 実装
  - [x] CreateInvoice（明細含む）
  - [x] UpdateInvoice
  - [x] DeleteInvoice
  - [x] MarkInvoiceSent（送付済み）
  - [x] GetInvoiceById（明細・入金履歴含む）
  - [x] ListInvoices（フィルタ・ページネーション）
- [x] API Route Handlers
  - [x] GET /api/invoices
  - [x] POST /api/invoices
  - [x] GET /api/invoices/:id
  - [x] PUT /api/invoices/:id
  - [x] DELETE /api/invoices/:id
  - [x] POST /api/invoices/:id/send

### 3.2 請求書管理（Frontend）✅

- [x] 請求書一覧画面
- [x] 請求書詳細画面
- [x] 請求書作成フォーム
  - [x] 明細テーブル（動的追加・削除）
  - [x] 合計金額自動計算
- [x] 請求書編集フォーム

### 3.3 入金管理（Backend）✅

- [x] PaymentRepository
- [x] Payment スキーマ（Zod）
- [x] Domain Service: PaymentService
  - [x] 入金合計計算
  - [x] 自動 PAID 更新ロジック
- [x] Usecase 実装
  - [x] RegisterPayment（入金登録 + ステータス自動更新）
  - [x] UpdatePayment
  - [x] DeletePayment（入金削除 + ステータス再計算）
  - [x] ListPaymentsByInvoice
- [x] API Route Handlers
  - [x] POST /api/invoices/:id/payments
  - [x] GET /api/invoices/:id/payments
  - [x] PUT /api/payments/:id
  - [x] DELETE /api/payments/:id

### 3.4 入金管理（Frontend）✅

- [x] 入金登録フォーム（モーダル）
- [x] 入金履歴一覧（請求書詳細内）
- [x] 入金削除機能

---

## Phase 4: 経費管理 ✅

### 4.1 経費カテゴリ管理（Backend）✅

- [x] ExpenseCategoryRepository
- [x] ExpenseCategory スキーマ（Zod）
- [x] Usecase 実装
  - [x] CreateExpenseCategory
  - [x] UpdateExpenseCategory
  - [x] DeleteExpenseCategory
  - [x] ListExpenseCategories
- [x] API Route Handlers
  - [x] GET /api/expense-categories
  - [x] POST /api/expense-categories
  - [x] PUT /api/expense-categories/:id
  - [x] DELETE /api/expense-categories/:id

### 4.2 経費管理（Backend）✅

- [x] ExpenseRepository
- [x] Expense スキーマ（Zod）
- [x] Usecase 実装
  - [x] CreateExpense
  - [x] UpdateExpense
  - [x] DeleteExpense
  - [x] GetExpenseById
  - [x] ListExpenses（フィルタ・ページネーション）
- [x] API Route Handlers
  - [x] GET /api/expenses
  - [x] POST /api/expenses
  - [x] GET /api/expenses/:id
  - [x] PUT /api/expenses/:id
  - [x] DELETE /api/expenses/:id

### 4.3 経費管理（Frontend）✅

- [x] 経費一覧画面
- [x] 経費作成フォーム
- [x] 経費編集フォーム
- [x] 経費カテゴリ設定画面

---

## Phase 5: レポート・ダッシュボード ✅

### 5.1 レポート API（Backend）✅

- [x] ReportService（集計ロジック）
  - [x] 月次売上集計（入金ベース / 請求ベース）
  - [x] 月次経費集計
  - [x] 利益計算
  - [x] 未回収金額集計
  - [x] 案件別集計
  - [x] 経費カテゴリ別集計
- [x] Usecase 実装
  - [x] GetMonthlySummary
  - [x] GetProjectReport
  - [x] GetExpenseBreakdown
- [x] API Route Handlers
  - [x] GET /api/reports/monthly?month=YYYY-MM
  - [x] GET /api/reports/trend?months=N
  - [x] GET /api/reports/expenses?month=YYYY-MM
  - [x] GET /api/reports/projects?month=YYYY-MM
  - [x] GET /api/reports/dashboard?month=YYYY-MM

### 5.2 ダッシュボード（Frontend）✅

- [x] 月次サマリカード（売上・経費・利益・未回収）
- [x] 月別推移グラフ（Recharts）
  - [x] 売上・経費・利益の折れ線グラフ
- [x] 経費カテゴリ別内訳（円グラフ）
- [x] 案件別売上ランキング（棒グラフ）
- [x] 最近の請求書一覧
- [x] 最近の経費一覧

### 5.3 レポート画面（Frontend）✅

- [x] 月別レポート画面
- [x] 案件別レポート画面
- [ ] CSV エクスポート（将来）

---

## Phase 6: テスト 🚧

### 6.1 単体テスト 🚧

- [x] ユーティリティ関数のテスト
  - [x] `formatCurrency` のテスト
  - [x] `formatDate` のテスト
- [x] 金額計算ロジックのテスト
  - [x] `calculateItemAmount`（明細金額計算）
  - [x] `calculateInvoiceTotal`（請求書合計）
  - [x] `calculatePaidAmount`（入金合計）
  - [x] `calculateUnpaidAmount`（未回収金額）
  - [x] `isFullyPaid`（入金済み判定）
- [x] Repository 層のテスト
  - [x] InvoiceRepository（ステータス更新ロジック）
  - [x] PaymentRepository（入金合計計算）
- [x] Domain Service のテスト
  - [x] ReportService（月次サマリ集計）
- [ ] その他の Domain Service テスト
  - [ ] InvoiceService（明細から合計金額算出）
  - [ ] PaymentService（自動 PAID 更新ロジック）

### 6.2 統合テスト ✅

- [x] Usecase 層のテスト
  - [x] 請求書作成 + 明細
  - [x] 入金登録 + 自動 PAID 更新
  - [x] 経費登録
- [ ] API Route Handlers のテスト
  - [ ] 認証チェック
  - [ ] バリデーションエラー
  - [ ] CRUD 操作

### 6.3 E2E テスト（任意）

- [ ] ログイン → ダッシュボード
- [ ] 請求書作成 → 入金登録 → ダッシュボード反映

---

## Phase 7: 改善・拡張（最短で"売れる"優先順位）

### 7.1 UX 改善（最優先）🎯

**目的: ユーザーが使いやすい UI を実現（数字・グラフの見やすさ重視）**

- [x] ローディング状態の表示
  - [x] スケルトンスクリーン実装（Skeleton, TableSkeleton, CardSkeleton）
  - [x] ローディングスピナー（Spinner, LoadingOverlay）
  - [x] ボタン押下時のローディング状態（Button loading prop）
- [x] エラーハンドリング強化
  - [x] グローバルエラーバウンダリー（ErrorBoundary）
  - [x] トースト通知の実装（ToastProvider, useToast）
  - [x] TypeScript 型安全性の強化（any 型の排除、Prisma 型の適切な使用）
  - [ ] エラーページの改善（404, 500）
- [x] バリデーションメッセージの改善
  - [x] エラーメッセージの日本語化（全スキーマで実装済み）
  - [ ] フォームのリアルタイムバリデーション（react-hook-form 統合済み）
  - [ ] 入力フィールドのヘルプテキスト
- [x] レスポンシブ対応
  - [x] モバイル最適化（320px〜）
    - [x] ハンバーガーメニュー実装
    - [x] ヘッダー・サイドバーのモバイル対応
    - [x] 全ページのヘッダー（テキストサイズ、ボタン配置）
  - [x] タブレット最適化
  - [x] ダッシュボードのグラフ表示調整（高さ自動調整）
  - [x] テーブルのスクロール対応（overflow-x-auto + マージン調整）
- [x] 一覧ページの削除機能
  - [x] 顧客一覧に削除ボタン追加
  - [x] 請求書一覧に削除ボタン追加
  - [x] 経費一覧に削除ボタン追加
  - [x] 案件一覧に削除ボタン追加
  - [x] 確認ダイアログの実装
  - [x] トースト通知による削除完了通知

### 7.2 請求書 PDF 出力 ✅ 100%

- [x] PDF 生成ライブラリの選定（@react-pdf/renderer）
- [x] 請求書テンプレートのデザイン（日本語フォント対応）
- [x] PDF ダウンロード機能の実装（請求書詳細ページ）
- [x] 会社情報の挿入機能

### 7.3 支払期限アラート ✅ 100%

- [x] 支払期限切れの請求書検出ロジック（/api/alerts）
- [x] ダッシュボードにアラート表示（期限切れ・期限間近）
- [x] 期限前の通知機能（1 週間前、3 日前）
- [x] アラート一覧表示（未払い請求書の可視化）

### 7.4 CSV エクスポート ✅ 100%

- [x] CSV 生成ユーティリティ（BOM 付き、Excel 対応）
- [x] 請求書一覧の CSV エクスポート
- [x] 経費一覧の CSV エクスポート
- [x] エクスポート成功時のトースト通知

### 7.5 セキュリティ強化 ✅ 100%

- [x] CSRF 保護（NextAuth 組み込み機能で対応済み）
- [x] セッション管理（30 日間、JWT 方式）
- [x] 認証ミドルウェア（全 API ルートで適用済み）

### 低優先度（将来拡張）

13. レート制限 + セキュリティ強化
14. 見積書管理
15. メール送付機能
16. 定期請求
17. E2E テスト
18. パフォーマンス最適化

### 7.6 追加機能（余力があれば）

- [ ] 見積書管理
  - [ ] 見積書の作成・編集・削除
  - [ ] 見積書から請求書への変換
  - [ ] 見積書 PDF 出力
- [ ] メール送付機能
  - [ ] 請求書の自動メール送信
  - [ ] テンプレート管理
  - [ ] 送信履歴の記録
- [ ] 定期請求（月次自動発行）
- [ ] 領収書管理

### 7.7 パフォーマンス最適化（継続的に）

- [ ] DB クエリ最適化
- [ ] キャッシュ戦略
- [ ] ページネーション改善
- [ ] 画像最適化

---

## 優先順位

### 高優先度（MVP 必須）

1. ✅ プロジェクト初期設定
2. ✅ 認証システム
3. 顧客管理（Backend + Frontend）
4. 案件管理（Backend + Frontend）
5. 請求書管理（Backend + Frontend）
6. 入金管理（Backend + Frontend）
7. 経費管理（Backend + Frontend）
8. 基本的なダッシュボード

### 中優先度

9. レポート機能（詳細）
10. グラフ表示
11. 単体テスト
12. | 統合テスト |
    | ---------- | ---- | -------------- |
    | Phase 1    | 100% | 完了           |
    | Phase 2    | 100% | 完了           |
    | Phase 3    | 100% | 完了           |
    | Phase 4    | 100% | 完了           |
    | Phase 5    | 100% | 完了           |
    | Phase 6    | 70%  | 統合テスト完了 |
    | Phase 7.1  | 80%  | UX 改善実装中  |

**全体進捗: 83%**（Phase 1-5 完了、Phase 6 70%、Phase 7.1 開始）

### Phase 6 実装済みテスト

**単体テスト（Unit Tests）:**

- ✅ `tests/unit/lib/utils.test.ts` - フォーマット関数のテスト
- ✅ `tests/unit/lib/money/calculator.test.ts` - 金額計算ロジックのテスト
- ✅ `tests/unit/infrastructure/repositories/invoiceRepository.test.ts` - 請求書ステータス更新のテスト
- ✅ `tests/unit/infrastructure/repositories/paymentRepository.test.ts` - 入金合計計算のテスト
- ✅ `tests/unit/domain/services/reportService.test.ts` - レポート集計ロジックのテスト

---

## 実装進捗

| Phase     | 進捗 | 備考                 |
| --------- | ---- | -------------------- |
| Phase 1   | 100% | 完了                 |
| Phase 2   | 100% | 完了                 |
| Phase 3   | 100% | 完了                 |
| Phase 4   | 100% | 完了                 |
| Phase 5   | 100% | 完了                 |
| Phase 6   | 70%  | 統合テスト完了       |
| Phase 7.1 | 100% | UX 改善完了          |
| Phase 7.2 | 100% | PDF 出力完了         |
| Phase 7.3 | 100% | 支払期限アラート完了 |
| Phase 7.4 | 100% | CSV エクスポート完了 |
| Phase 7.5 | 100% | セキュリティ強化完了 |
| Phase 7.6 | 100% | ユーザー設定機能完了 |

**全体進捗: 98%**（Phase 1-5, Phase 7.1-7.6 完了、Phase 6 70%）

---

## Phase 7.6: ユーザー設定機能 ✅ 100%

### 7.6.1 設定機能（Backend）✅

- [x] UserSettings モデル追加（Prisma）
  - [x] 事業者情報（屋号、代表者名、住所、電話、メール）
  - [x] 銀行口座情報（銀行名、支店名、口座種別、口座番号、口座名義）
  - [x] 請求書設定（プレフィックス、消費税率、支払期限デフォルト、デフォルト備考）
- [x] UserSettingsRepository（CRUD 操作）
- [x] Usecase 実装
  - [x] GetSettings（存在しない場合は自動作成）
  - [x] UpdateSettings
- [x] API Route Handlers
  - [x] GET /api/settings
  - [x] PUT /api/settings

### 7.6.2 設定機能（Frontend）✅

- [x] 設定画面実装（/settings）
  - [x] 事業者情報フォーム
  - [x] 銀行口座情報フォーム
  - [x] 請求書設定フォーム
  - [x] TanStack Query 統合
- [x] Sidebar に設定リンク追加（既存）

### 7.6.3 請求書 PDF 連携 ✅

- [x] InvoicePDF コンポーネント修正
  - [x] ハードコードされた会社情報を設定から取得
  - [x] 銀行口座情報を設定から取得
  - [x] デフォルト備考を設定から取得
- [x] PDF 生成 API 修正
  - [x] 請求書 PDF 生成時に設定情報を取得
  - [x] 設定情報を PDF コンポーネントに渡す

---

### Phase 6 実装済みテスト

**単体テスト（Unit Tests）:**

- ✅ `tests/unit/lib/utils.test.ts` - フォーマット関数のテスト
- ✅ `tests/unit/lib/money/calculator.test.ts` - 金額計算ロジックのテスト
- ✅ `tests/unit/infrastructure/repositories/invoiceRepository.test.ts` - 請求書ステータス更新のテスト
- ✅ `tests/unit/infrastructure/repositories/paymentRepository.test.ts` - 入金合計計算のテスト
- ✅ `tests/unit/domain/services/reportService.test.ts` - レポート集計ロジックのテスト

**統合テスト（Integration Tests）:**

- ✅ `tests/integration/usecases/invoices.test.ts` - 請求書作成・更新と明細の統合テスト
- ✅ `tests/integration/usecases/payments.test.ts` - 入金登録と自動 PAID 更新の統合テスト
- ✅ `tests/integration/usecases/expenses.test.ts` - 経費登録の統合テスト

### Phase 7.1 実装済み UX 改善

**ローディング状態:**

- ✅ Spinner コンポーネント（sm/md/lg サイズ）
- ✅ LoadingOverlay コンポーネント（全画面ローディング）
- ✅ Skeleton コンポーネント（text/rectangular/circular）
- ✅ TableSkeleton・CardSkeleton（特化版）
- ✅ Button loading prop（ボタン押下時のスピナー表示）

**エラーハンドリング:**

- ✅ ErrorBoundary（グローバルエラー境界）
- ✅ ToastProvider（トースト通知システム、4 種類: success/error/warning/info）
- ✅ TypeScript 型安全性強化（any 型排除、Prisma 型の適切な使用）
- ✅ ビルドエラー修正（production build 成功）

**レスポンシブ対応:**

- ✅ モバイルファーストデザイン（320px〜対応）
- ✅ ハンバーガーメニュー（サイドバーのモバイル表示）
- ✅ タッチデバイス対応（タップエリアの最適化）
- ✅ グラフの自動リサイズ（ResponsiveContainer 活用）
- ✅ テーブルの横スクロール対応（overflow-x-auto）
- ✅ ブレークポイント対応（sm: 640px, md: 768px, lg: 1024px）
- ✅ フレキシブルレイアウト（flexbox & grid）

**バリデーション:**

- ✅ 日本語エラーメッセージ（全フォームで実装済み）
- ✅ react-hook-form 統合（zodResolver 使用）
- ✅ リアルタイムバリデーション（onChange/onBlur）

**エラーハンドリング:**

- ✅ ErrorBoundary（グローバルエラー境界）
- ✅ ToastProvider（トースト通知システム、4 種類: success/error/warning/info）
- ✅ TypeScript 型安全性強化（any 型排除、Prisma 型の適切な使用）
- ✅ ビルドエラー修正（production build 成功）
