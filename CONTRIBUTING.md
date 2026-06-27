# コントリビューションガイド / 開発ルール

Ledgerly の開発に参加するためのルールをまとめます。新規参画の方は、まず [docs/onboarding.md](./docs/onboarding.md) で全体像をつかんでから本ドキュメントを読んでください。

- レビュアー: **@Yuto299**
- 対象リポジトリ: `Yuto299/ledgerly-pre`

---

## 1. ブランチ戦略（GitHub Flow）

少人数・継続デプロイ（Vercel）に適した **GitHub Flow** を採用します。

- `main` は常にデプロイ可能な状態を保つ（直接 push 禁止、PR 経由のみ）。
- 作業は必ず `main` から **作業ブランチ** を切って行う。
- 作業ブランチは PR → レビュー → Approve を経て `main` にマージする。
- マージ後、作業ブランチは削除する。

```
main ──●─────────●──────────●──────────▶（常にデプロイ可能）
        \       /            \        /
         ●──●──●（feat/...）   ●──●──●（fix/...）
```

> `develop` ブランチや release ブランチは使いません。リリース＝ `main` へのマージ＝Vercel デプロイ、というシンプルな運用です。

---

## 2. ブランチ命名規則

```
<type>/<issue番号>-<短い説明（英小文字・ケバブケース）>
```

例:

| ブランチ名 | 用途 |
|------------|------|
| `feat/45-quote-management` | 新機能（Issue #45） |
| `fix/17-mark-invoice-paid` | バグ修正（Issue #17） |
| `refactor/21-dashboard-split` | リファクタリング |
| `docs/65-onboarding` | ドキュメント |
| `test/30-api-integration` | テスト追加 |
| `chore/ci-setup` | 雑務（依存更新・設定など。Issue 無しも可） |

- `<type>` は後述のコミット種別と揃える。
- Issue が紐づく場合は **番号を含める**（PR と Issue の対応が追いやすくなる）。

---

## 3. コミットメッセージ規約（Conventional Commits）

```
<type>(<scope>): <要約>

[任意] 本文（変更理由・背景）

[任意] Refs #<issue番号>
```

**type 一覧**:

| type | 用途 |
|------|------|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `refactor` | 挙動を変えないコード改善 |
| `docs` | ドキュメントのみ |
| `test` | テストの追加・修正 |
| `chore` | ビルド・設定・依存など |
| `style` | フォーマットのみ（挙動・意味の変更なし） |
| `perf` | パフォーマンス改善 |

例:

```
feat(invoices): 請求書 PDF の消費税を UserSettings.taxRate に連動

設定画面で変更した税率が PDF に反映されるようにした。

Refs #15
```

- 要約は日本語で簡潔に。命令形でなくてよい。
- 1 コミット 1 目的を意識する。

---

## 4. プルリクエスト（PR）フロー

1. 作業ブランチを push し、`main` 向けに PR を作成する。
2. PR テンプレート（自動表示）の **概要 / 変更点 / チェックリスト** を埋める。
3. 関連 Issue を `Closes #123` で紐づける（マージ時に Issue が自動クローズ）。
4. **レビュアーに @Yuto299 を指定** する。
5. Project ボードのカードを **「レビュー中」** に移す（→ セクション 6）。
6. レビュー指摘に対応。会話が解決し Approve されたらマージ。
7. マージは **Squash and merge** を基本とし、マージ後に作業ブランチを削除する。

### PR を出す前のセルフチェック

```bash
npm run lint      # Lint が通る
npm run test      # テストが通る
npm run build     # ビルドが通る
```

- 差分は小さく保つ（レビューしやすい単位に分割）。
- スキーマを変更した場合はマイグレーションを含め、PR 説明に記載する。

---

## 5. コーディング規約

- **言語**: TypeScript。`any` は原則禁止（やむを得ない場合は理由をコメント）。
- **バリデーション**: 外部入力は Zod スキーマで検証する。
- **金額**: 整数（円）で扱う。整形は `src/lib/money` を使う。
- **DB アクセス**: `src/infrastructure` 経由。Prisma クライアントはシングルトンを使う。
- **レイヤー依存方向**: `app → application → domain → infrastructure`（逆流させない）。
- **Lint / フォーマット**: ESLint に従う。コミット前に `npm run lint` で確認。
- 設計の詳細は [docs/design/architecture.md](./docs/design/architecture.md) を参照。

---

## 6. Issue / Project ボードの運用

タスクは GitHub Issues で管理し、Project ボードで進行状況を可視化します。

### カードの流れ

```
Todo（未着手） → 作業中（In Progress） → レビュー中（In Review） → Done（完了）
```

| ステータス | いつ移すか | あわせてやること |
|------------|------------|------------------|
| **作業中** | 着手するとき | 自分を Assignee に設定し、ブランチを切る |
| **レビュー中** | PR を出したとき | レビュアーに **@Yuto299** を指定 |
| **Done** | PR がマージされたとき | Issue は `Closes #` で自動クローズ |

- 1 人が同時に「作業中」にするカードは **1〜2 枚** までを目安に。
- 着手前に Issue の受け入れ条件（チェックボックス）を確認する。

### 優先度ラベル

| ラベル | 意味 |
|--------|------|
| `priority/p0` | 最優先（バグ・データ正確性） |
| `priority/p1` | 高優先 |
| `priority/p2` | 中優先 |
| `priority/p3` | 機能完成 |
| `priority/p4` | 将来機能 |
| `priority/p5` | ドキュメント・運用 |

種別ラベル: `bug` / `enhancement` / `refactor` / `test` / `infrastructure` / `documentation` / `good first issue`

> はじめての方は `good first issue` ラベルのついた Issue から着手するのがおすすめです。

---

## 7. 困ったとき

| 状況 | 参照先 |
|------|--------|
| 環境構築 | [docs/guides/setup.md](./docs/guides/setup.md) |
| 本番（Vercel）でのエラー | [docs/operations/troubleshooting.md](./docs/operations/troubleshooting.md) |
| 仕様・要件の意図 | [docs/design/requirements.md](./docs/design/requirements.md) |
| 全体像 | [docs/onboarding.md](./docs/onboarding.md) |
