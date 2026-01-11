# アーキテクチャ設計

## 1. 技術スタック

### 1.1 全体構成

- **フロントエンド**: Next.js 15 (App Router) + TypeScript
- **バックエンド**: Next.js Route Handlers（API）
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **認証**: NextAuth (Auth.js) + JWT/Session
- **バリデーション**: Zod
- **UI**: Tailwind CSS
- **グラフ**: Recharts
- **テスト**:
  - FE: Vitest + Testing Library
  - API: Vitest（統合テスト）
  - E2E: Playwright（任意）
- **IaC/運用**: Docker / GitHub Actions（CI）
- **デプロイ**: Vercel（FE/API） + Supabase/Neon/Railway（Postgres）

### 1.2 推奨理由

- Next.js で画面と API を同一リポジトリにまとめると、MVP が最短で仕上がり、運用も容易
- DB は PostgreSQL を推奨（集計・拡張・SaaS 化に強い）
- Prisma + Zod で、型安全に「入力 →DB→ 出力」を繋げる

---

## 2. フロントエンド設計（Atomic Design）

### 2.1 画面構成（App Router）

| パス                   | 説明                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| `/`                    | トップ（未認証時：ランディング、認証時：/dashboard へリダイレクト） |
| `/login`               | ログイン画面                                                        |
| `/dashboard`           | ダッシュボード（月次サマリ・グラフ）                                |
| `/customers`           | 顧客一覧                                                            |
| `/customers/new`       | 顧客作成                                                            |
| `/customers/[id]`      | 顧客詳細                                                            |
| `/customers/[id]/edit` | 顧客編集                                                            |
| `/projects`            | 案件一覧                                                            |
| `/projects/new`        | 案件作成                                                            |
| `/projects/[id]`       | 案件詳細                                                            |
| `/projects/[id]/edit`  | 案件編集                                                            |
| `/invoices`            | 請求書一覧                                                          |
| `/invoices/new`        | 請求書作成                                                          |
| `/invoices/[id]`       | 請求書詳細                                                          |
| `/invoices/[id]/edit`  | 請求書編集                                                          |
| `/expenses`            | 経費一覧                                                            |
| `/expenses/new`        | 経費作成                                                            |
| `/reports`             | レポート・分析                                                      |
| `/settings`            | 設定（ユーザー設定・経費カテゴリ管理等）                            |

---

### 2.2 ディレクトリ構成

「UI（Atomic）」「ドメイン（型/ロジック）」「インフラ（API/Storage）」を分離し、変更に強くする。

```
ledgerly/
├── src/
│   ├── app/                      # Next.js App Router（ルーティング・ページ）
│   │   ├── (auth)/               # 認証レイアウトグループ
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/          # ダッシュボードレイアウトグループ
│   │   │   ├── layout.tsx        # サイドバー付きレイアウト
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx      # 一覧
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # 作成
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx  # 詳細
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── projects/
│   │   │   ├── invoices/
│   │   │   ├── expenses/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── api/                  # API Route Handlers
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── customers/
│   │   │   │   ├── route.ts      # GET, POST
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # GET, PUT, DELETE
│   │   │   ├── projects/
│   │   │   ├── invoices/
│   │   │   ├── payments/
│   │   │   ├── expenses/
│   │   │   └── reports/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/               # UI コンポーネント（Atomic Design）
│   │   ├── atoms/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   └── ...
│   │   ├── molecules/
│   │   │   ├── FormField.tsx     # Label + Input + Error
│   │   │   ├── DatePicker.tsx
│   │   │   ├── SearchBox.tsx
│   │   │   └── ...
│   │   ├── organisms/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── CustomerCard.tsx
│   │   │   └── ...
│   │   └── templates/
│   │       ├── DashboardLayout.tsx
│   │       ├── FormLayout.tsx
│   │       └── ...
│   │
│   ├── features/                 # 機能別モジュール（画面ロジック）
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   └── schemas/
│   │   │       └── loginSchema.ts
│   │   ├── customers/
│   │   │   ├── components/
│   │   │   │   ├── CustomerList.tsx
│   │   │   │   ├── CustomerForm.tsx
│   │   │   │   └── CustomerDetail.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCustomers.ts
│   │   │   │   └── useCustomer.ts
│   │   │   ├── schemas/
│   │   │   │   └── customerSchema.ts
│   │   │   └── services/
│   │   │       └── customerApi.ts
│   │   ├── projects/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── schemas/
│   │   │   └── services/
│   │   ├── invoices/
│   │   │   ├── components/
│   │   │   │   ├── InvoiceList.tsx
│   │   │   │   ├── InvoiceForm.tsx
│   │   │   │   ├── InvoiceItemTable.tsx
│   │   │   │   └── PaymentForm.tsx
│   │   │   ├── hooks/
│   │   │   ├── schemas/
│   │   │   └── services/
│   │   ├── expenses/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── MonthlySummary.tsx
│   │   │   │   ├── RevenueChart.tsx
│   │   │   │   └── ExpenseChart.tsx
│   │   │   └── hooks/
│   │   └── reports/
│   │
│   ├── domain/                   # ドメインロジック（ビジネスルール）
│   │   ├── entities/             # エンティティ型定義
│   │   │   ├── Customer.ts
│   │   │   ├── Project.ts
│   │   │   ├── Invoice.ts
│   │   │   ├── Payment.ts
│   │   │   └── Expense.ts
│   │   ├── services/             # ドメインサービス
│   │   │   ├── invoiceService.ts  # 請求書計算ロジック
│   │   │   ├── paymentService.ts  # 入金処理・ステータス更新
│   │   │   └── reportService.ts   # 集計ロジック
│   │   └── types/
│   │       ├── InvoiceStatus.ts
│   │       ├── ProjectStatus.ts
│   │       └── PaymentMethod.ts
│   │
│   ├── infrastructure/           # インフラ層
│   │   ├── db/
│   │   │   └── prisma.ts         # Prisma Client インスタンス
│   │   ├── repositories/         # リポジトリパターン（DB操作抽象化）
│   │   │   ├── customerRepository.ts
│   │   │   ├── projectRepository.ts
│   │   │   ├── invoiceRepository.ts
│   │   │   ├── paymentRepository.ts
│   │   │   └── expenseRepository.ts
│   │   └── external/
│   │       └── emailService.ts   # 将来: メール送信
│   │
│   ├── application/              # アプリケーション層（ユースケース）
│   │   ├── usecases/
│   │   │   ├── customers/
│   │   │   │   ├── createCustomer.ts
│   │   │   │   ├── updateCustomer.ts
│   │   │   │   └── deleteCustomer.ts
│   │   │   ├── projects/
│   │   │   ├── invoices/
│   │   │   │   ├── createInvoice.ts
│   │   │   │   ├── markInvoiceSent.ts
│   │   │   │   └── registerPayment.ts  # 入金登録・自動PAID更新
│   │   │   ├── expenses/
│   │   │   ├── settings/
│   │   │   │   ├── getSettings.ts
│   │   │   │   └── updateSettings.ts
│   │   │   └── reports/
│   │   │       └── getMonthlySummary.ts
│   │   └── dto/                  # Data Transfer Objects
│   │       ├── CreateCustomerDto.ts
│   │       └── ...
│   │
│   ├── lib/                      # 共通ユーティリティ
│   │   ├── api/
│   │   │   ├── client.ts         # APIクライアント（fetch wrapper）
│   │   │   └── errorHandler.ts
│   │   ├── auth/
│   │   │   └── authOptions.ts    # NextAuth設定
│   │   ├── date/
│   │   │   └── formatter.ts
│   │   ├── money/
│   │   │   ├── calculator.ts     # 金額計算ヘルパー
│   │   │   └── formatter.ts
│   │   ├── validation/
│   │   │   └── zodHelpers.ts
│   │   └── utils.ts
│   │
│   └── types/                    # グローバル型定義
│       ├── next-auth.d.ts
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/
│   └── ...
│
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   └── lib/
│   ├── integration/
│   │   └── api/
│   └── e2e/
│       └── ...
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vitest.config.ts
```

---

### 2.3 Atomic Design の運用ルール

#### atoms（原子）

- Button, Input, Badge, Card など「最小単位の UI 部品」
- 他のコンポーネントに依存しない
- プロパティで見た目・振る舞いをカスタマイズ

#### molecules（分子）

- LabeledInput, DatePickerWithLabel, SearchBox など「atoms の組み合わせ」
- 単一の責務を持つ小さな機能単位
- 例：FormField = Label + Input + ErrorMessage

#### organisms（生体）

- InvoiceItemTable, CustomerSearchPanel, Sidebar など「画面部品」
- atoms/molecules を組み合わせて具体的な機能を提供
- ビジネスロジックは持たない（hooks/services から受け取る）

#### templates（テンプレート）

- ページの骨組み（SidebarLayout, TwoColumnLayout など）
- レイアウト・配置に特化
- 具体的なデータは持たない

#### pages（app）

- templates と feature を組み立てるだけ
- ロジックを置かない（hooks 経由でデータ取得）
- 「データ取得 → UI に渡す」のみ

---

### 2.4 状態管理

#### サーバー状態（取得/更新）

- **TanStack Query**（React Query）を推奨
- キャッシュ管理・再取得・楽観的更新が簡単
- 例：`useCustomers()`, `useInvoice(id)`

#### フォーム

- **React Hook Form + Zod resolver**
- バリデーションは Zod スキーマで定義
- 型安全なフォーム処理

#### クライアント状態

- React Context / Zustand（必要最小限）
- グローバルな UI 状態（サイドバー開閉等）のみ

#### 計算ロジック

- `domain/services` に寄せる
- UI から切り離し、テスト可能に

---

## 3. バックエンド設計（レイヤードアーキテクチャ）

### 3.1 設計方針

- **Presentation 層（API）**: HTTP の関心事を閉じる
- **Application 層（Usecase）**: 業務処理を表現（請求 → 入金 → ステータス更新等）
- **Domain 層**: 計算ルール・不変条件・状態遷移
- **Infrastructure 層**: DB 操作・外部 API

### 3.2 レイヤー構成

```
┌─────────────────────────────────────┐
│  Presentation Layer (API Routes)    │  ← リクエスト/レスポンス・認証
├─────────────────────────────────────┤
│  Application Layer (Usecases)       │  ← ビジネスフロー・トランザクション
├─────────────────────────────────────┤
│  Domain Layer (Entities/Services)   │  ← ビジネスルール・計算ロジック
├─────────────────────────────────────┤
│  Infrastructure Layer (Repositories) │  ← DB操作・外部API
└─────────────────────────────────────┘
```

---

### 3.3 主要ユースケース

#### 顧客管理

- `CreateCustomer` - 顧客作成
- `UpdateCustomer` - 顧客更新
- `DeleteCustomer` - 顧客削除（論理削除）

#### 案件管理

- `CreateProject` - 案件作成
- `UpdateProject` - 案件更新
- `DeleteProject` - 案件削除

#### 請求書管理

- `CreateInvoice` - 請求書作成（明細含む）
  - 明細から合計金額を算出し保存
- `UpdateInvoice` - 請求書更新
- `MarkInvoiceSent` - 送付済にステータス変更
- `DeleteInvoice` - 請求書削除

#### 入金管理

- `RegisterPayment` - 入金登録（分割入金対応）
  - 入金合計が請求額に達したら `invoice.status` を `PAID` に自動更新
- `UpdatePayment` - 入金更新
- `DeletePayment` - 入金削除（invoice.status 再計算）

#### 経費管理

- `CreateExpense` - 経費登録（案件紐づけ任意）
- `UpdateExpense` - 経費更新
- `DeleteExpense` - 経費削除

#### レポート

- `GetMonthlySummary` - 月次サマリ取得（売上/経費/利益/未回収）
- `GetProjectReport` - 案件別レポート

---

### 3.4 データ整合性（工夫ポイント）

#### 金額管理

- **金額は整数（最小通貨単位：円）で保持**
- float 型は禁止（精度問題回避）
- 例：1000 円 → `1000`（整数）

#### 請求書合計

- 「明細から算出」を基本
- DB には `invoice.total_amount` を持たせるが、更新は Usecase のみが行う（単一責務）
- 計算式：`SUM(invoice_items.amount)`

#### 入金合計

- payments の集計で算出
- 必要なら `invoice.paid_amount` をキャッシュ（パフォーマンス）
- 計算式：`SUM(payments.amount WHERE invoice_id = X)`

#### ユーザースコープ

- すべてのテーブルに `user_id` を持たせる
- すべてのクエリで `WHERE user_id = ?` を必須化
- ID の推測対策：UUID 使用

---

### 3.5 エラーハンドリング

#### エラー種別

- `ValidationError` - バリデーションエラー（400）
- `UnauthorizedError` - 認証エラー（401）
- `ForbiddenError` - 権限エラー（403）
- `NotFoundError` - リソース未発見（404）
- `ConflictError` - 競合（409）
- `InternalServerError` - サーバーエラー（500）

#### エラーレスポンス形式

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## 4. セキュリティ

### 4.1 認証・認可

- NextAuth（Auth.js）でセッション管理
- すべての API で `session.user.id` を取得
- `user_id` で必ず絞り込み（WHERE 句必須）

### 4.2 バリデーション

- すべての入力を Zod でバリデーション
- API 層・フォーム層の両方でチェック

### 4.3 SQL Injection 対策

- Prisma の型安全なクエリビルダーを使用
- 生 SQL は原則禁止

### 4.4 CSRF 対策

- Next.js の CSRF 保護機能を利用
- API トークン（SameSite Cookie）

---

## 5. テスト戦略

### 5.1 単体テスト（Unit Test）

- Domain 層の計算ロジック
- ユーティリティ関数
- **ツール**: Vitest

### 5.2 統合テスト（Integration Test）

- Usecase 層の業務フロー
- API Route Handlers のエンドポイント
- **ツール**: Vitest + Prisma（テスト DB）

### 5.3 E2E テスト（End-to-End Test）

- 重要なユーザーフロー
  - 請求 → 入金 → ダッシュボード反映
- **ツール**: Playwright（任意）

### 5.4 テストカバレッジ目標

- Domain 層: 80%以上
- Usecase 層: 70%以上
- API 層: 60%以上

---

## 6. CI/CD

### 6.1 GitHub Actions

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### 6.2 デプロイフロー

1. **開発環境**: localhost + Docker Compose
2. **ステージング**: Vercel Preview Deployment（PR 単位）
3. **本番**: Vercel Production + Managed Postgres

---

## 7. 運用・監視

### 7.1 ログ

- アプリケーションログ：Winston / Pino
- エラー監視：Sentry（任意）
- パフォーマンス監視：Vercel Analytics

### 7.2 バックアップ

- DB 自動スナップショット（Supabase/Neon 標準機能）
- 定期バックアップ：日次

### 7.3 監査ログ（将来対応）

- invoice/payment/expense の作成・更新・削除履歴
- ユーザーアクション記録
