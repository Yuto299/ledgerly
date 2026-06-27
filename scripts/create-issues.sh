#!/bin/bash
# GitHub Issues 一括作成スクリプト
set -e
REPO="Yuto299/Ledgerly"

create_issue() {
  local title="$1"
  local labels="$2"
  local body="$3"
  gh issue create --repo "$REPO" --title "$title" --label "$labels" --body "$body"
  sleep 1
}

# ============================================================
# P0: バグ・データ正確性
# ============================================================

create_issue \
  "【P0】レポート集計ロジックの修正（売上・請求額の定義を要件に合わせる）" \
  "bug,priority/p0" \
  "$(cat <<'EOF'
## 概要
`ReportService.getMonthlySummary()` の集計ロジックと UI ラベルが不一致です。要件定義（`docs/requirements.md` 7章）に合わせて修正が必要です。

## 現状の問題
- `revenue`（売上）が「プロジェクト完了月の請求額」で計算されているが、UI は「売上（入金ベース）」「入金された金額」と表示
- `billedAmount` が `dueAt`（支払期限月）でフィルタされているが、要件では「請求日 `issued_at` ベース」
- 入金ベース / 請求ベースの切替が未実装（2指標を並列表示するのみ）

## 要件定義（`docs/requirements.md`）
- **入金ベース**: `paid_at` を基準に集計
- **請求ベース**: `issued_at` を基準に集計

## 対象ファイル
- `src/domain/services/reportService.ts`
- `src/app/(dashboard)/reports/page.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`
- `tests/unit/domain/services/reportService.test.ts`

## 受け入れ条件
- [ ] 入金ベース・請求ベースの集計が要件通りに動作する
- [ ] UI ラベルと実際の集計ロジックが一致する
- [ ] 既存テストを更新し、新しい集計ルールのテストを追加する
EOF
)"

create_issue \
  "【P0】PDF消費税を UserSettings.taxRate に連動させる" \
  "bug,priority/p0" \
  "$(cat <<'EOF'
## 概要
設定画面で消費税率を変更できるが、請求書 PDF では 10% がハードコードされたままです。

## 対象ファイル
- `src/features/invoices/components/InvoicePDF.tsx`（または PDF 関連コンポーネント）
- `src/app/api/invoices/[id]/pdf/route.ts`

## 受け入れ条件
- [ ] PDF の消費税計算が `UserSettings.taxRate` を使用する
- [ ] 設定画面で税率を変更すると PDF に反映される
EOF
)"

create_issue \
  "【P0】ReportService の PrismaClient をシングルトンに統一" \
  "bug,priority/p0,refactor" \
  "$(cat <<'EOF'
## 概要
`ReportService` が `src/infrastructure/db/prisma.ts` のシングルトンを使わず、独自に `new PrismaClient()` を生成しています。接続プール枯渇のリスクがあります。

## 対象ファイル
- `src/domain/services/reportService.ts`
- `src/infrastructure/db/prisma.ts`

## 受け入れ条件
- [ ] `ReportService` が共有 PrismaClient インスタンスを使用する
- [ ] 他のサービス・リポジトリと同じパターンに統一する
EOF
)"

create_issue \
  "【P0】markInvoicePaid が PaymentService ロジックをバイパスしている問題の修正" \
  "bug,priority/p0" \
  "$(cat <<'EOF'
## 概要
一括入金済み機能（`markInvoicePaid`）が `registerPayment` ユースケースを経由せず、直接 repository 操作を行っています。`PaymentService` の自動 PAID 更新ロジックと乖離する可能性があります。

## 対象ファイル
- `src/application/usecases/invoices/markInvoicePaid.ts`（または同等ファイル）
- `src/application/usecases/payments/registerPayment.ts`
- `src/domain/services/paymentService.ts`

## 受け入れ条件
- [ ] 一括入金済みが `registerPayment` または `PaymentService` 経由で処理される
- [ ] 分割入金・一括入金でステータス更新ロジックが一貫する
- [ ] 関連テストを追加・更新する
EOF
)"

# ============================================================
# P1: リファクタリング基盤
# ============================================================

create_issue \
  "【P1】共通 API クライアント lib/api/client.ts の作成" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
`features/` 配下の各 API モジュールで `fetchApi` が重複定義されています。`docs/architecture.md` に記載の `lib/api/client.ts` を実装し、統一します。

## 現状
- `customerApi.ts`, `projectApi.ts`, `invoiceApi.ts` — 各々 `fetchApi` 関数を定義
- `expenseApi.ts`, `paymentApi.ts` — オブジェクト形式で別実装
- `lib/api/client.ts` は未作成

## 対象ファイル
- 新規: `src/lib/api/client.ts`
- `src/features/*/services/*Api.ts`（全8モジュール）

## 受け入れ条件
- [ ] 共通 `fetchApi` / `apiClient` を作成する
- [ ] 全 feature の API サービスが共通クライアントを使用する
- [ ] エラーハンドリング・認証ヘッダーが統一される
EOF
)"

create_issue \
  "【P1】請求書ステータス定数・ラベルの共通化" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
`INVOICE_STATUS_LABELS` / `STATUS_LABELS` が最低4ファイルに重複しています。Badge variant マッピングも各所で異なります。

## 重複箇所
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/projects/[id]/reports/page.tsx`
- `src/app/(dashboard)/invoices/[id]/page.tsx`
- その他

## 対応方針
- `src/lib/constants/invoice.ts` または `src/domain/types/invoice.ts` に集約

## 受け入れ条件
- [ ] ステータスラベル・Badge variant が1箇所で定義される
- [ ] 全画面で共通定数を参照する
EOF
)"

create_issue \
  "【P1】経費フォームを ExpenseForm コンポーネントに抽出" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
経費の新規作成・編集ページにフォームが直書きされており、約230行×2のほぼ重複があります。顧客・案件・請求書と同様に `features/expenses/components/ExpenseForm.tsx` に抽出します。

## 対象ファイル
- `src/app/(dashboard)/expenses/new/page.tsx`
- `src/app/(dashboard)/expenses/[id]/edit/page.tsx`
- 新規: `src/features/expenses/components/ExpenseForm.tsx`

## 受け入れ条件
- [ ] `ExpenseForm` コンポーネントを作成する
- [ ] new/edit ページが共通フォームを使用する
- [ ] 既存のバリデーション・動作が維持される
EOF
)"

create_issue \
  "【P1】ダッシュボードページのコンポーネント分割" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
`dashboard/page.tsx` が625行あり、グラフ・サマリカード・最近の請求/経費一覧等がページ内に集中しています。`docs/architecture.md` の「pages はロジックを置かない」方針に沿って分割します。

## 対象ファイル
- `src/app/(dashboard)/dashboard/page.tsx`
- 新規: `src/features/reports/components/` 配下（SummaryCards, TrendChart, ExpenseBreakdownChart 等）

## 受け入れ条件
- [ ] ページファイルが200行以下になる
- [ ] グラフ・カード等が再利用可能なコンポーネントに分離される
- [ ] 既存の表示・動作が維持される
EOF
)"

create_issue \
  "【P1】レポートページのコンポーネント分割" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
`reports/page.tsx` が510行あり、ダッシュボードと同様に Fat Page 化しています。

## 対象ファイル
- `src/app/(dashboard)/reports/page.tsx`
- 新規: `src/features/reports/components/` 配下

## 受け入れ条件
- [ ] ページファイルが200行以下になる
- [ ] レポート固有の UI がコンポーネントに分離される
EOF
)"

create_issue \
  "【P1】API ルートの認証・エラーハンドリング統一" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
API ルート間で認証方法・レスポンス形式・エラーハンドリングが不統一です。

## 現状の不統一
- 認証: 大半は `getUserId()`、reports/alerts/settings/pdf は `getServerSession()` 直接使用
- レスポンス: 一部 `handleApiSuccess()`、他は `NextResponse.json()` 直書き
- `alerts/route.ts` は `handleApiError` 未使用

## 対象ファイル
- `src/app/api/**/*.ts`（26ルート）

## 受け入れ条件
- [ ] 全 API ルートが `getUserId()` + `handleApiSuccess/Error` パターンに統一される
- [ ] 認証漏れがないことを確認する
EOF
)"

create_issue \
  "【P1】本番コードのデバッグ console.log を除去" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
デバッグ用 `console.log` が本番コードに残存しています。

## 主な対象ファイル
- `src/application/usecases/invoices/createInvoice.ts`
- `src/application/usecases/expenses/updateExpense.ts`
- `src/app/api/invoices/[id]/pdf/route.ts`
- `src/app/api/invoices/[id]/pay/route.ts`
- `src/features/invoices/components/InvoiceForm.tsx`

## 受け入れ条件
- [ ] 不要な `console.log` を削除する
- [ ] 必要なログは構造化ログ（将来の Winston/Pino 導入を見据えた形式）に置き換えるか、開発環境のみ出力する
EOF
)"

create_issue \
  "【P1】invoiceSchema.ts の z.array(z.any()) を型安全に修正" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
`invoiceSchema.ts` に `z.array(z.any())` が残存しており、TypeScript の型安全性が損なわれています。

## 対象ファイル
- `src/features/invoices/schemas/invoiceSchema.ts`

## 受け入れ条件
- [ ] 明細配列に適切な Zod スキーマを定義する
- [ ] `any` 型が排除される
EOF
)"

create_issue \
  "【P1】一覧ページのページネーション default 値を統一" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
ページネーションのデフォルト件数が画面ごとに異なります（customers: 50, projects/invoices: 10）。

## 対応方針
- `src/lib/constants/pagination.ts` にデフォルト値を定義
- 全一覧画面で統一

## 受け入れ条件
- [ ] デフォルトページサイズが1箇所で定義される
- [ ] 全一覧画面で統一される（推奨: 20件）
EOF
)"

create_issue \
  "【P1】経費・設定ページのコンポーネント分割" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
以下のページも Fat Page 化しています。

| ファイル | 行数 |
|---------|------|
| `expenses/page.tsx` | 411 |
| `settings/page.tsx` | 328 |
| `invoices/[id]/page.tsx` | 301 |

## 受け入れ条件
- [ ] 各ページが200行以下になる
- [ ] ロジックが features/components に分離される
EOF
)"

create_issue \
  "【P1】全 API ルートの認証漏れ監査" \
  "refactor,priority/p1" \
  "$(cat <<'EOF'
## 概要
`middleware.ts` は `/api/*` をミドルウェアで通過させ、各ルートで個別認証する設計です。認証漏れリスクが高いパターンのため、全26ルートを監査します。

## 対象ファイル
- `src/middleware.ts`
- `src/app/api/**/*.ts`

## 受け入れ条件
- [ ] 全 API ルートの認証チェックを一覧化する
- [ ] 認証漏れがあれば修正する
- [ ] 監査結果を `docs/security.md` に追記する
EOF
)"

# ============================================================
# P2: テスト・CI
# ============================================================

create_issue \
  "【P2】GitHub Actions CI パイプラインの追加" \
  "test,infrastructure,priority/p2" \
  "$(cat <<'EOF'
## 概要
`docs/architecture.md` に CI/CD 設計が記載されているが、`.github/` フォルダが未設定です。

## 実装内容
- `.github/workflows/ci.yml` を作成
- lint（ESLint）, test（Vitest）, build（next build）を実行
- PR 時に自動実行

## 受け入れ条件
- [ ] PR 作成時に CI が自動実行される
- [ ] lint / test / build がすべてパスする
EOF
)"

create_issue \
  "【P2】API 統合テストの拡充（projects, invoices, expenses, reports, payments）" \
  "test,priority/p2" \
  "$(cat <<'EOF'
## 概要
API 統合テストは `customers.test.ts` のみ（1/26ルート）。アーキテクチャ目標（API 60%）に向けて拡充します。

## 追加対象
- `tests/integration/api/projects.test.ts`
- `tests/integration/api/invoices.test.ts`
- `tests/integration/api/expenses.test.ts`
- `tests/integration/api/reports.test.ts`
- `tests/integration/api/payments.test.ts`

## 各テストで確認すること
- 認証チェック（未認証 → 401）
- バリデーションエラー（不正リクエスト → 400）
- CRUD 操作の正常系

## 受け入れ条件
- [ ] 上記5モジュールの API テストが追加される
- [ ] `npm test` で全テストがパスする
EOF
)"

create_issue \
  "【P2】Usecase 統合テストの拡充（customers, projects, settings, reports）" \
  "test,priority/p2" \
  "$(cat <<'EOF'
## 概要
Usecase テストは 3/39（invoices, payments, expenses のみ）。アーキテクチャ目標（Usecase 70%）に向けて拡充します。

## 追加対象
- `tests/integration/usecases/customers.test.ts`
- `tests/integration/usecases/projects.test.ts`
- `tests/integration/usecases/settings.test.ts`
- `tests/integration/usecases/reports.test.ts`

## 受け入れ条件
- [ ] 上記4モジュールの Usecase テストが追加される
EOF
)"

create_issue \
  "【P2】Repository 層テストの拡充（残り5リポジトリ）" \
  "test,priority/p2" \
  "$(cat <<'EOF'
## 概要
Repository テストは 2/7（InvoiceRepository, PaymentRepository のみ）。

## 追加対象
- CustomerRepository
- ProjectRepository
- ExpenseRepository
- ExpenseCategoryRepository
- UserSettingsRepository

## 受け入れ条件
- [ ] 残り5リポジトリの単体テストが追加される
EOF
)"

create_issue \
  "【P2】Playwright E2E テストのセットアップ" \
  "test,priority/p2" \
  "$(cat <<'EOF'
## 概要
`docs/roadmap.md` Phase 6.3 に記載の E2E テストが未導入です。

## 実装内容
- Playwright の導入・設定
- `tests/e2e/` ディレクトリ作成
- 基本フローのテスト:
  1. ログイン → ダッシュボード表示
  2. 請求書作成 → 入金登録 → ダッシュボード反映

## 受け入れ条件
- [ ] `npm run test:e2e` で E2E テストが実行できる
- [ ] CI に E2E テストを組み込む（または nightly 実行）
EOF
)"

create_issue \
  "【P2】tests/setup.ts の整備（テスト DB 設定・モック共通化）" \
  "test,priority/p2" \
  "$(cat <<'EOF'
## 概要
`tests/setup.ts` が空ファイルです。テスト基盤を整備します。

## 実装内容
- テスト用 DB 接続設定
- 共通モック（Prisma, NextAuth 等）
- テストデータのクリーンアップ処理

## 受け入れ条件
- [ ] `tests/setup.ts` に共通セットアップが実装される
- [ ] 各テストファイルで重複するセットアップが削減される
EOF
)"

create_issue \
  "【P2】Issue / PR テンプレートの作成" \
  "infrastructure,priority/p2" \
  "$(cat <<'EOF'
## 概要
`.github/ISSUE_TEMPLATE` と `.github/PULL_REQUEST_TEMPLATE.md` が未設定です。新メンバーがスムーズに開発できるよう整備します。

## 実装内容
- Bug Report テンプレート
- Feature Request テンプレート
- Pull Request テンプレート

## 受け入れ条件
- [ ] Issue 作成時にテンプレートが選択できる
- [ ] PR 作成時にチェックリストが表示される
EOF
)"

# ============================================================
# P3: 機能完成
# ============================================================

create_issue \
  "【P3】レポート画面の CSV エクスポート実装" \
  "enhancement,priority/p3" \
  "$(cat <<'EOF'
## 概要
請求書・経費一覧の CSV エクスポートは実装済みですが、レポート画面の CSV は「将来実装予定」でボタンが disabled です。

## 対象ファイル
- `src/app/(dashboard)/reports/page.tsx`（494-505行付近）
- 既存: `src/lib/csv.ts`（CSV ユーティリティ）

## 受け入れ条件
- [ ] レポート画面から月次サマリ・案件別売上等を CSV エクスポートできる
- [ ] BOM 付き・Excel 対応（既存パターンに準拠）
- [ ] エクスポート成功時にトースト通知
EOF
)"

create_issue \
  "【P3】売上ベース切替 UI（入金ベース / 請求ベース）" \
  "enhancement,priority/p3" \
  "$(cat <<'EOF'
## 概要
`docs/requirements.md` 5.7 に「売上（入金ベース / 請求ベース 切替可）」と記載されていますが、現状は2指標を並列表示するのみです。

## 実装内容
- ダッシュボード・レポート画面に切替トグルを追加
- 選択に応じてグラフ・サマリカードの表示を切り替え

## 依存
- #14（レポート集計ロジック修正）完了後に着手推奨

## 受け入れ条件
- [ ] 入金ベース / 請求ベースを UI で切り替えられる
- [ ] グラフ・サマリが選択したベースで表示される
EOF
)"

create_issue \
  "【P3】レポート期間フィルタの拡張（四半期・年）" \
  "enhancement,priority/p3" \
  "$(cat <<'EOF'
## 概要
`docs/requirements.md` 5.7 に「期間指定（月・四半期・年）」と記載されていますが、現状は月選択のみです。

## 実装内容
- 四半期（Q1-Q4）・年単位の期間選択 UI
- バックエンド API の期間パラメータ拡張

## 受け入れ条件
- [ ] 月・四半期・年でレポート期間を選択できる
- [ ] 選択した期間でグラフ・サマリが更新される
EOF
)"

create_issue \
  "【P3】レポートの顧客別・案件別フィルタ" \
  "enhancement,priority/p3" \
  "$(cat <<'EOF'
## 概要
`docs/requirements.md` 5.7 に「案件別フィルタ」「顧客別フィルタ」と記載されていますが未実装です。

## 実装内容
- レポート画面に顧客・案件のドロップダウンフィルタを追加
- API に `customerId` / `projectId` パラメータを追加

## 受け入れ条件
- [ ] 顧客を選択してレポートを絞り込める
- [ ] 案件を選択してレポートを絞り込める
EOF
)"

create_issue \
  "【P3】カスタム 404 / 500 エラーページの実装" \
  "enhancement,priority/p3" \
  "$(cat <<'EOF'
## 概要
`docs/roadmap.md` Phase 7.1 に記載のカスタムエラーページが未実装です（`not-found.tsx` / `error.tsx` なし）。

## 実装内容
- `src/app/not-found.tsx` — 404 ページ
- `src/app/error.tsx` — 500 エラーページ
- ダッシュボードレイアウトに合わせたデザイン

## 受け入れ条件
- [ ] 存在しない URL でカスタム 404 が表示される
- [ ] サーバーエラー時にカスタム 500 が表示される
- [ ] ダッシュボードへの戻りリンクがある
EOF
)"

create_issue \
  "【P3】請求書複製機能の実装" \
  "enhancement,priority/p3" \
  "$(cat <<'EOF'
## 概要
案件・経費には複製機能がありますが、請求書には未実装です。

## 参考実装
- 案件複製: `src/application/usecases/projects/duplicateProject.ts`
- 経費複製: 経費一覧の複製ボタン

## 実装内容
- `DuplicateInvoice` ユースケース
- `POST /api/invoices/:id/duplicate` API
- 請求書詳細・一覧に複製ボタン

## 受け入れ条件
- [ ] 既存請求書を複製して新規 DRAFT 請求書が作成される
- [ ] 明細も含めてコピーされる
- [ ] 請求書番号は新規採番される
EOF
)"

create_issue \
  "【P3】フォーム入力フィールドにヘルプテキストを追加" \
  "enhancement,priority/p3" \
  "$(cat <<'EOF'
## 概要
`docs/roadmap.md` Phase 7.1 に記載のフォームヘルプテキストが未実装です。

## 実装内容
- `FormField` コンポーネントに `helpText` prop を追加（未対応の場合）
- 主要フォーム（顧客・案件・請求書・経費・設定）にヘルプテキストを追加

## 例
- 請求書番号: 「自動採番されます。形式: INV-YYYYMM-XXXX」
- 消費税率: 「請求書 PDF に反映されます」

## 受け入れ条件
- [ ] 主要フォームの入力項目にヘルプテキストが表示される
EOF
)"

create_issue \
  "【P3】ヘッダー検索バーの実装" \
  "enhancement,priority/p3" \
  "$(cat <<'EOF'
## 概要
`src/components/organisms/Header.tsx` に「検索バー将来追加」のコメントがあります。

## 実装内容
- 顧客・案件・請求書を横断検索する検索バー
- 検索結果のドロップダウン表示

## 受け入れ条件
- [ ] ヘッダーから顧客・案件・請求書を検索できる
- [ ] 検索結果から詳細ページに遷移できる
EOF
)"

create_issue \
  "【P3】支払期限アラートの DRAFT ステータス含有の仕様確認と修正" \
  "enhancement,priority/p3" \
  "$(cat <<'EOF'
## 概要
支払期限アラートの期限切れ検出に `DRAFT`（未送付）ステータスの請求書も含まれています。意図的かどうか確認し、必要に応じて修正します。

## 対象ファイル
- `src/app/api/alerts/route.ts`
- アラート表示コンポーネント

## 受け入れ条件
- [ ] DRAFT を含める/含めないの仕様が明確化される
- [ ] 仕様に沿った実装になる
EOF
)"

# ============================================================
# P4: 将来機能
# ============================================================

create_issue \
  "【P4】見積書管理機能（作成・請求書変換・PDF）" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/roadmap.md` Phase 7.6 / `docs/requirements.md` 10章に記載の将来機能です。

## 実装スコープ
- [ ] 見積書の CRUD（顧客・案件紐づけ、明細）
- [ ] 見積書から請求書への変換
- [ ] 見積書 PDF 出力
- [ ] Prisma スキーマ追加（`estimates`, `estimate_items`）

## 参考
- 請求書管理の実装パターンを踏襲
EOF
)"

create_issue \
  "【P4】請求書メール送付機能" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/roadmap.md` Phase 7.6 / `docs/requirements.md` Phase 4 に記載の未実装機能です。

## 実装スコープ
- [ ] 請求書 PDF をメール添付して送信
- [ ] メールテンプレート管理
- [ ] 送信履歴の記録
- [ ] `infrastructure/external/emailService.ts` の実装（`docs/architecture.md` 記載）

## 技術選定
- Resend / SendGrid / AWS SES 等の選定が必要
EOF
)"

create_issue \
  "【P4】定期請求（月次自動発行）機能" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/requirements.md` 10章に記載の中期拡張機能です。

## 実装スコープ
- [ ] 定期請求テンプレートの作成・管理
- [ ] 月次自動請求書発行（Vercel Cron / GitHub Actions）
- [ ] 発行履歴の管理
EOF
)"

create_issue \
  "【P4】領収書管理機能" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/roadmap.md` Phase 7.6 / `docs/requirements.md` 10章に記載の将来機能です。

## 実装スコープ
- [ ] 領収書の CRUD
- [ ] 入金との紐づけ
- [ ] 領収書 PDF 出力
EOF
)"

create_issue \
  "【P4】レートリミットの Redis 化（本番環境対応）" \
  "infrastructure,priority/p4" \
  "$(cat <<'EOF'
## 概要
現在のレートリミットはメモリベースです。Vercel のサーバーレス環境ではインスタンス間で共有されないため、本番では Redis ベースに移行が必要です。

## 対象
- ログイン試行制限
- サインアップ IP レートリミット

## 参考
- `src/lib/security/rateLimit.ts`（または同等ファイル）
- `docs/security.md`
EOF
)"

create_issue \
  "【P4】監査ログ機能" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/architecture.md` / `docs/requirements.md` に記載の将来対応項目です。invoice/payment/expense の更新履歴を記録します。

## 実装スコープ
- [ ] `audit_logs` テーブル追加
- [ ] 主要操作（作成・更新・削除）のログ記録
- [ ] 監査ログ閲覧 UI（管理者向け）
EOF
)"

create_issue \
  "【P4】複数ユーザー・権限管理（チーム機能）" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/requirements.md` 10章の長期拡張です。現在は1ユーザー = 1事業者の設計です。

## 実装スコープ
- [ ] 組織（Organization）モデル
- [ ] ロールベースアクセス制御（管理者・メンバー・閲覧者）
- [ ] 招待・メンバー管理 UI
EOF
)"

create_issue \
  "【P4】請求書テンプレートのカスタマイズ機能" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/requirements.md` 10章の中期拡張です。

## 実装スコープ
- [ ] 複数の請求書テンプレートを保存・選択
- [ ] テンプレートのデザインカスタマイズ（ロゴ・色・レイアウト）
EOF
)"

create_issue \
  "【P4】DB クエリ最適化・N+1 問題の解消" \
  "infrastructure,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/roadmap.md` Phase 7.7 に記載のパフォーマンス最適化です。

## 調査・改善対象
- レポート集計クエリの最適化
- Prisma `include` / `select` の見直し
- インデックス追加の検討

## 受け入れ条件
- [ ] 主要 API のレスポンス時間を計測・改善する
EOF
)"

create_issue \
  "【P4】キャッシュ戦略の導入" \
  "infrastructure,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/roadmap.md` Phase 7.7 に記載のパフォーマンス最適化です。

## 検討事項
- レポート API のキャッシュ（月次データは変動が少ない）
- TanStack Query の `staleTime` / `cacheTime` 最適化
- Next.js の `unstable_cache` / ISR の活用
EOF
)"

create_issue \
  "【P4】構造化ログ・Sentry エラー監視の導入" \
  "infrastructure,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/architecture.md` に Winston/Pino ログ・Sentry の導入が計画されています。

## 実装スコープ
- [ ] 構造化ログ（Pino 推奨）の導入
- [ ] Sentry によるエラー監視・通知
- [ ] 本番環境でのログレベル設定
EOF
)"

create_issue \
  "【P4】銀行 API 連携（入金自動取込）" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/requirements.md` 10章の長期拡張です。

## 実装スコープ
- [ ] 銀行 API（Moneytree / freee 銀行連携等）との連携調査
- [ ] 入金データの自動取込
- [ ] 請求書との自動マッチング
EOF
)"

create_issue \
  "【P4】会計ソフト連携（freee / マネーフォワード）" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/requirements.md` 10章の長期拡張です。

## 実装スコープ
- [ ] freee API / MF クラウド API 連携の調査
- [ ] 請求書・経費データのエクスポート / 同期
EOF
)"

create_issue \
  "【P4】Slack 通知連携" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/requirements.md` 10章の長期拡張です。

## 実装スコープ
- [ ] Slack Webhook 連携
- [ ] 支払期限アラート・入金通知の Slack 送信
EOF
)"

create_issue \
  "【P4】税務・確定申告向け機能" \
  "enhancement,priority/p4" \
  "$(cat <<'EOF'
## 概要
`docs/requirements.md` 10章の長期拡張です。

## 実装スコープ
- [ ] 青色申告対応レポート
- [ ] 消費税計算・申告用データ出力
- [ ] e-Tax 連携（調査フェーズ）
EOF
)"

# ============================================================
# P5: ドキュメント・運用
# ============================================================

create_issue \
  "【P5】docs/api-spec.md の作成" \
  "documentation,priority/p5" \
  "$(cat <<'EOF'
## 概要
`README.md` が参照する `docs/api-spec.md` が存在しません。

## 実装内容
- 全26 API ルートのエンドポイント仕様書を作成
- リクエスト/レスポンス形式、認証要件、エラーコードを記載

## 受け入れ条件
- [ ] `docs/api-spec.md` が作成される
- [ ] 全 API エンドポイントが文書化される
EOF
)"

create_issue \
  "【P5】requirements.md / roadmap.md の進捗同期" \
  "documentation,priority/p5" \
  "$(cat <<'EOF'
## 概要
ドキュメントと実装の乖離があります。

## 主な乖離
| 項目 | ドキュメント | 実装 |
|------|-------------|------|
| PDF 出力 | requirements Phase 4 🔲 | ✅ 実装済み |
| CSV エクスポート | requirements Phase 4 🔲 | ✅ 実装済み（レポート除く） |
| 支払期限アラート | requirements Phase 4 🔲 | ✅ 実装済み |
| 売上ベース切替 | requirements 5.7 | ❌ 未実装 |
| roadmap 進捗率 | 83% / 99% が混在 | 要整理 |

## 受け入れ条件
- [ ] チェックボックスと実装状況が一致する
- [ ] 進捗率が正確になる
EOF
)"

create_issue \
  "【P5】setup.md の DB ポート番号修正（5432 → 5433）" \
  "documentation,priority/p5" \
  "$(cat <<'EOF'
## 概要
`docs/setup.md` の DB ポートが 5432 と記載されていますが、`.env.example` / `docker-compose.yml` は 5433 です。

## 対象ファイル
- `docs/setup.md`

## 受け入れ条件
- [ ] setup.md のポート番号が 5433 に修正される
EOF
)"

create_issue \
  "【P5】SEO チェックリストの完了（og-image, Search Console 等）" \
  "documentation,priority/p5" \
  "$(cat <<'EOF'
## 概要
`docs/seo.md` のチェックリストに未完了項目があります。

## 未完了項目
- [ ] `og-image.png` の作成・配置
- [ ] Google Search Console 登録
- [ ] Google Analytics / GTM 設定

## 受け入れ条件
- [ ] `docs/seo.md` のチェックリストが完了する
EOF
)"

create_issue \
  "【P5】vercel-build マイグレーション resolve ハックの根本解決" \
  "infrastructure,priority/p5" \
  "$(cat <<'EOF'
## 概要
`package.json` の `vercel-build` スクリプトにマイグレーション `resolve` ハックが含まれています。根本的な解決が必要です。

## 参考ドキュメント
- `docs/vercel-migration-fix.md`
- `docs/vercel-migration-troubleshooting.md`
- `docs/fix-failed-migration.md`

## 受け入れ条件
- [ ] `vercel-build` からハックが除去される
- [ ] Vercel デプロイ時のマイグレーションが安定して動作する
EOF
)"

create_issue \
  "【P5】Payment テーブルの user_id 設計方針の整理" \
  "documentation,priority/p5" \
  "$(cat <<'EOF'
## 概要
`Payment` モデルに `user_id` がなく、請求書経由で認可しています。`docs/database.md` の設計方針と矛盾する可能性があります。

## 対応
- 現状の設計（請求書経由認可）で問題ないか検討
- 必要に応じて `user_id` 追加またはドキュメント更新

## 受け入れ条件
- [ ] 設計方針が明確化され、コードとドキュメントが一致する
EOF
)"

create_issue \
  "【P5】オンボーディングドキュメントの作成（新メンバー向け）" \
  "documentation,priority/p5,good first issue" \
  "$(cat <<'EOF'
## 概要
新メンバーがスムーズに開発を始められるよう、オンボーディングドキュメントを作成します。

## 内容
- プロジェクト概要・アーキテクチャの説明
- 開発環境セットアップ手順（`docs/setup.md` の補完）
- コーディング規約・PR フロー
- 主要な設計判断の背景

## 受け入れ条件
- [ ] `docs/onboarding.md` が作成される
- [ ] 新メンバーがこのドキュメントだけで開発を開始できる
EOF
)"

echo "=== All issues created ==="
