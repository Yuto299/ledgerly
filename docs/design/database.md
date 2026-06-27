# データベース設計

## 1. 概要

PostgreSQL を使用し、Prisma ORM で型安全にアクセスする。

### 設計方針

- **金額は整数で管理**（最小通貨単位：円）
- **すべてのテーブルに user_id**（マルチテナント対応）
- **論理削除対応**（deleted_at）
- **UUID**をプライマリーキーとして使用
- **インデックス最適化**（user_id, 日付フィールド等）

---

## 2. テーブル一覧

| テーブル名         | 説明         |
| ------------------ | ------------ |
| users              | ユーザー     |
| user_settings      | ユーザー設定 |
| customers          | 顧客         |
| projects           | 案件         |
| invoices           | 請求書       |
| invoice_items      | 請求明細     |
| payments           | 入金         |
| expenses           | 経費         |
| expense_categories | 経費カテゴリ |

---

## 3. テーブル定義

### 3.1 users（ユーザー）

| カラム名   | 型        | NULL | デフォルト | 説明                          |
| ---------- | --------- | ---- | ---------- | ----------------------------- |
| id         | UUID      | NO   | uuid()     | ユーザー ID                   |
| email      | VARCHAR   | NO   | -          | メールアドレス（ログイン ID） |
| password   | VARCHAR   | NO   | -          | パスワード（ハッシュ化）      |
| name       | VARCHAR   | YES  | -          | 表示名                        |
| created_at | TIMESTAMP | NO   | now()      | 作成日時                      |
| updated_at | TIMESTAMP | NO   | now()      | 更新日時                      |

**制約**

- PRIMARY KEY: id
- UNIQUE: email

---

### 3.2 user_settings（ユーザー設定）

| カラム名             | 型        | NULL | デフォルト | 説明                       |
| -------------------- | --------- | ---- | ---------- | -------------------------- |
| id                   | UUID      | NO   | uuid()     | 設定 ID                    |
| user_id              | UUID      | NO   | -          | ユーザー ID                |
| business_name        | VARCHAR   | YES  | -          | 屋号・事業者名             |
| representative_name  | VARCHAR   | YES  | -          | 代表者名                   |
| postal_code          | VARCHAR   | YES  | -          | 郵便番号                   |
| address              | VARCHAR   | YES  | -          | 住所                       |
| phone                | VARCHAR   | YES  | -          | 電話番号                   |
| email                | VARCHAR   | YES  | -          | メールアドレス             |
| bank_name            | VARCHAR   | YES  | -          | 銀行名                     |
| branch_name          | VARCHAR   | YES  | -          | 支店名                     |
| account_type         | VARCHAR   | YES  | -          | 口座種別（普通/当座）      |
| account_number       | VARCHAR   | YES  | -          | 口座番号                   |
| account_holder       | VARCHAR   | YES  | -          | 口座名義                   |
| invoice_prefix       | VARCHAR   | YES  | 'INV'      | 請求書番号プレフィックス   |
| tax_rate             | FLOAT     | YES  | 0.10       | 消費税率                   |
| default_payment_days | INTEGER   | YES  | 30         | デフォルト支払期限（日数） |
| invoice_notes        | TEXT      | YES  | -          | 請求書デフォルト備考       |
| created_at           | TIMESTAMP | NO   | now()      | 作成日時                   |
| updated_at           | TIMESTAMP | NO   | now()      | 更新日時                   |

**制約**

- PRIMARY KEY: id
- UNIQUE: user_id
- FOREIGN KEY: user_id → users.id (CASCADE)

---

### 3.2 customers（顧客）

| カラム名     | 型        | NULL | デフォルト | 説明                    |
| ------------ | --------- | ---- | ---------- | ----------------------- |
| id           | UUID      | NO   | uuid()     | 顧客 ID                 |
| user_id      | UUID      | NO   | -          | ユーザー ID             |
| name         | VARCHAR   | NO   | -          | 顧客名（会社名/個人名） |
| contact_name | VARCHAR   | YES  | -          | 担当者名                |
| email        | VARCHAR   | YES  | -          | メールアドレス          |
| phone        | VARCHAR   | YES  | -          | 電話番号                |
| notes        | TEXT      | YES  | -          | メモ                    |
| created_at   | TIMESTAMP | NO   | now()      | 作成日時                |
| updated_at   | TIMESTAMP | NO   | now()      | 更新日時                |
| deleted_at   | TIMESTAMP | YES  | -          | 削除日時（論理削除）    |

**制約**

- PRIMARY KEY: id
- FOREIGN KEY: user_id → users(id) CASCADE
- INDEX: user_id
- INDEX: user_id, deleted_at

---

### 3.3 projects（案件）

| カラム名        | 型        | NULL | デフォルト | 説明                                              |
| --------------- | --------- | ---- | ---------- | ------------------------------------------------- |
| id              | UUID      | NO   | uuid()     | 案件 ID                                           |
| user_id         | UUID      | NO   | -          | ユーザー ID                                       |
| customer_id     | UUID      | NO   | -          | 顧客 ID                                           |
| name            | VARCHAR   | NO   | -          | 案件名                                            |
| description     | TEXT      | YES  | -          | 説明                                              |
| contract_type   | ENUM      | NO   | -          | 契約形態（FIXED/HOURLY/COMMISSION）               |
| contract_amount | INT       | YES  | -          | 契約金額（円）                                    |
| start_date      | DATE      | YES  | -          | 開始日                                            |
| end_date        | DATE      | YES  | -          | 終了日                                            |
| status          | ENUM      | NO   | PROSPECT   | ステータス（PROSPECT/IN_PROGRESS/COMPLETED/LOST） |
| created_at      | TIMESTAMP | NO   | now()      | 作成日時                                          |
| updated_at      | TIMESTAMP | NO   | now()      | 更新日時                                          |
| deleted_at      | TIMESTAMP | YES  | -          | 削除日時（論理削除）                              |

**制約**

- PRIMARY KEY: id
- FOREIGN KEY: user_id → users(id) CASCADE
- FOREIGN KEY: customer_id → customers(id) RESTRICT
- INDEX: user_id
- INDEX: customer_id
- INDEX: user_id, deleted_at

**ENUM: ProjectStatus**

- PROSPECT: 見込み
- IN_PROGRESS: 進行中
- COMPLETED: 完了
- LOST: 失注

**ENUM: ContractType**

- FIXED: 固定報酬
- HOURLY: 時給
- COMMISSION: 成果報酬

---

### 3.4 invoices（請求書）

| カラム名       | 型        | NULL | デフォルト | 説明                          |
| -------------- | --------- | ---- | ---------- | ----------------------------- |
| id             | UUID      | NO   | uuid()     | 請求書 ID                     |
| user_id        | UUID      | NO   | -          | ユーザー ID                   |
| customer_id    | UUID      | NO   | -          | 顧客 ID                       |
| project_id     | UUID      | NO   | -          | 案件 ID                       |
| invoice_number | VARCHAR   | YES  | -          | 請求書番号                    |
| status         | ENUM      | NO   | DRAFT      | ステータス（DRAFT/SENT/PAID） |
| issued_at      | DATE      | NO   | -          | 請求日                        |
| due_at         | DATE      | NO   | -          | 支払期限                      |
| total_amount   | INT       | NO   | -          | 合計金額（円）※明細から算出   |
| paid_amount    | INT       | NO   | 0          | 入金済み金額（円）※キャッシュ |
| notes          | TEXT      | YES  | -          | メモ                          |
| created_at     | TIMESTAMP | NO   | now()      | 作成日時                      |
| updated_at     | TIMESTAMP | NO   | now()      | 更新日時                      |
| deleted_at     | TIMESTAMP | YES  | -          | 削除日時（論理削除）          |

**制約**

- PRIMARY KEY: id
- UNIQUE: invoice_number
- FOREIGN KEY: user_id → users(id) CASCADE
- FOREIGN KEY: customer_id → customers(id) RESTRICT
- FOREIGN KEY: project_id → projects(id) RESTRICT
- INDEX: user_id
- INDEX: customer_id
- INDEX: project_id
- INDEX: user_id, status
- INDEX: user_id, issued_at
- INDEX: user_id, deleted_at

**ENUM: InvoiceStatus**

- DRAFT: 下書き
- SENT: 請求済
- PAID: 入金済

**ビジネスルール**

- total_amount は invoice_items の amount の合計
- paid_amount は payments の amount の合計（キャッシュ）
- paid_amount >= total_amount の場合、status を PAID に自動更新

---

### 3.5 invoice_items（請求明細）

| カラム名    | 型        | NULL | デフォルト | 説明                               |
| ----------- | --------- | ---- | ---------- | ---------------------------------- |
| id          | UUID      | NO   | uuid()     | 明細 ID                            |
| invoice_id  | UUID      | NO   | -          | 請求書 ID                          |
| name        | VARCHAR   | NO   | -          | 品目名                             |
| description | TEXT      | YES  | -          | 説明                               |
| quantity    | INT       | NO   | 1          | 数量                               |
| unit_price  | INT       | NO   | -          | 単価（円）                         |
| amount      | INT       | NO   | -          | 金額（円）※ quantity \* unit_price |
| sort_order  | INT       | NO   | 0          | 表示順                             |
| created_at  | TIMESTAMP | NO   | now()      | 作成日時                           |
| updated_at  | TIMESTAMP | NO   | now()      | 更新日時                           |

**制約**

- PRIMARY KEY: id
- FOREIGN KEY: invoice_id → invoices(id) CASCADE
- INDEX: invoice_id

**ビジネスルール**

- amount = quantity \* unit_price（Usecase 層で計算）

---

### 3.6 payments（入金）

| カラム名       | 型        | NULL | デフォルト | 説明                 |
| -------------- | --------- | ---- | ---------- | -------------------- |
| id             | UUID      | NO   | uuid()     | 入金 ID              |
| invoice_id     | UUID      | NO   | -          | 請求書 ID            |
| amount         | INT       | NO   | -          | 入金額（円）         |
| paid_at        | DATE      | NO   | -          | 入金日               |
| payment_method | ENUM      | NO   | -          | 入金方法             |
| notes          | TEXT      | YES  | -          | メモ                 |
| created_at     | TIMESTAMP | NO   | now()      | 作成日時             |
| updated_at     | TIMESTAMP | NO   | now()      | 更新日時             |
| deleted_at     | TIMESTAMP | YES  | -          | 削除日時（論理削除） |

**制約**

- PRIMARY KEY: id
- FOREIGN KEY: invoice_id → invoices(id) RESTRICT
- INDEX: invoice_id
- INDEX: paid_at

**ENUM: PaymentMethod**

- BANK_TRANSFER: 銀行振込
- CREDIT_CARD: クレジットカード
- CASH: 現金
- OTHER: その他

**ビジネスルール**

- 入金登録時に invoice.paid_amount を更新
- 合計入金額が total_amount に達したら invoice.status を PAID に更新

---

### 3.7 expense_categories（経費カテゴリ）

| カラム名   | 型        | NULL | デフォルト | 説明          |
| ---------- | --------- | ---- | ---------- | ------------- |
| id         | UUID      | NO   | uuid()     | カテゴリ ID   |
| user_id    | UUID      | NO   | -          | ユーザー ID   |
| name       | VARCHAR   | NO   | -          | カテゴリ名    |
| color      | VARCHAR   | YES  | -          | 表示色（HEX） |
| sort_order | INT       | NO   | 0          | 表示順        |
| created_at | TIMESTAMP | NO   | now()      | 作成日時      |
| updated_at | TIMESTAMP | NO   | now()      | 更新日時      |

**制約**

- PRIMARY KEY: id
- FOREIGN KEY: user_id → users(id) CASCADE
- INDEX: user_id

---

### 3.8 expenses（経費）

| カラム名       | 型        | NULL | デフォルト | 説明                 |
| -------------- | --------- | ---- | ---------- | -------------------- |
| id             | UUID      | NO   | uuid()     | 経費 ID              |
| user_id        | UUID      | NO   | -          | ユーザー ID          |
| project_id     | UUID      | YES  | -          | 案件 ID（任意）      |
| category_id    | UUID      | NO   | -          | カテゴリ ID          |
| date           | DATE      | NO   | -          | 使用日               |
| amount         | INT       | NO   | -          | 金額（円）           |
| payment_method | ENUM      | NO   | -          | 支払方法             |
| description    | VARCHAR   | YES  | -          | 説明                 |
| notes          | TEXT      | YES  | -          | メモ                 |
| created_at     | TIMESTAMP | NO   | now()      | 作成日時             |
| updated_at     | TIMESTAMP | NO   | now()      | 更新日時             |
| deleted_at     | TIMESTAMP | YES  | -          | 削除日時（論理削除） |

**制約**

- PRIMARY KEY: id
- FOREIGN KEY: user_id → users(id) CASCADE
- FOREIGN KEY: project_id → projects(id) SET NULL
- FOREIGN KEY: category_id → expense_categories(id) RESTRICT
- INDEX: user_id
- INDEX: project_id
- INDEX: category_id
- INDEX: user_id, date
- INDEX: user_id, deleted_at

---

## 4. ER 図（主要リレーション）

```
users
  ├─ 1:N → customers
  ├─ 1:N → projects
  ├─ 1:N → invoices
  ├─ 1:N → expenses
  └─ 1:N → expense_categories

customers
  ├─ 1:N → projects
  └─ 1:N → invoices

projects
  ├─ 1:N → invoices
  └─ 1:N → expenses (nullable)

invoices
  ├─ 1:N → invoice_items
  └─ 1:N → payments

expense_categories
  └─ 1:N → expenses
```

---

## 5. インデックス戦略

### 主要インデックス

- **user_id**: すべてのテーブルに付与（マルチテナント分離）
- **日付フィールド**: issued_at, paid_at, date（集計クエリ最適化）
- **ステータス**: status（絞り込み頻度が高い）
- **論理削除**: deleted_at（論理削除済みデータを除外）

### 複合インデックス

- `(user_id, deleted_at)`: 論理削除を考慮した一覧取得
- `(user_id, status)`: ステータスによる絞り込み
- `(user_id, issued_at)`: 期間による集計

---

## 6. データ整合性ルール

### 金額管理

- すべての金額フィールドは **INT 型**（円単位）
- 小数点は扱わない（精度問題回避）
- 計算はアプリケーション層で実施

### 請求書合計

```sql
-- 明細合計を算出
invoice.total_amount = SUM(invoice_items.amount)

-- 入金合計を算出
invoice.paid_amount = SUM(payments.amount WHERE deleted_at IS NULL)

-- 入金済み判定
IF paid_amount >= total_amount THEN
  invoice.status = PAID
END IF
```

### 論理削除

- `deleted_at IS NULL` で有効なデータのみ取得
- 削除時は `deleted_at = NOW()` を設定
- 物理削除は原則禁止（監査対応）

### ユーザースコープ

```sql
-- すべてのクエリで user_id による絞り込み必須
WHERE user_id = :userId AND deleted_at IS NULL
```

---

## 7. マイグレーション戦略

### 開発環境

```bash
# スキーマ変更を反映（prototype）
npx prisma db push

# マイグレーション作成
npx prisma migrate dev --name init
```

### 本番環境

```bash
# マイグレーション実行
npx prisma migrate deploy
```

---

## 8. パフォーマンス最適化

### N+1 問題の回避

```typescript
// Prismaのincludeを活用
const invoices = await prisma.invoice.findMany({
  where: { userId },
  include: {
    customer: true,
    project: true,
    items: true,
    payments: true,
  },
});
```

### 集計クエリの最適化

```typescript
// 集計はDBで実施
const summary = await prisma.$queryRaw`
  SELECT 
    SUM(total_amount) as total_revenue,
    SUM(paid_amount) as total_paid
  FROM invoices
  WHERE user_id = ${userId}
    AND issued_at >= ${startDate}
    AND issued_at <= ${endDate}
    AND deleted_at IS NULL
`;
```

---

## 9. バックアップ・リストア

### 自動バックアップ

- Managed Postgres（Supabase/Neon）の自動スナップショット機能を利用
- 日次バックアップ（保持期間: 7 日）

### 手動バックアップ

```bash
# バックアップ
pg_dump $DATABASE_URL > backup.sql

# リストア
psql $DATABASE_URL < backup.sql
```
