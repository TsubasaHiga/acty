# Acty 共有開発ガイドライン

## プロジェクト概要

Acty は **Astro 6** で構築された静的 Web サイトの**テンプレートリポジトリ**です。インタラクティブなコンポーネントには **React 19** を使用し、スタイリングには Tailwind CSS と SCSS、状態管理には nanostores を採用しています。

### テンプレートとしての性質

このリポジトリは新規プロジェクトのボイラープレートとして機能します。clone した後、以下のファイルは利用者が自身の環境に合わせて設定する必要があります：

- `src/siteConfig.ts`: サイト名、URL、テーマカラー等
- `src/pageDataList.ts`: ページメタデータ
- `public/`: ファビコン、OGP 画像等のアセット

以下のファイルは `.gitignore` で除外されており、利用者が各自で設定します：

- `.mcp.json`: MCP（Model Context Protocol）サーバー設定
- `.serena/`: Serena AI 開発支援ツールの設定・メモリ
- `.claude/settings.local.json`: Claude Code の個人設定

## テックスタック

| カテゴリ             | 技術                            |
| -------------------- | ------------------------------- |
| フレームワーク       | Astro 6                         |
| UI                   | React 19 + Tailwind CSS + SCSS  |
| 状態管理             | nanostores (@nanostores/react)  |
| パッケージマネージャ | pnpm (9.15.4)                   |
| リンター/フォーマッター | Biome + Stylelint（SCSS） + markuplint |
| Git Hooks              | Lefthook                               |
| ユーティリティ       | umaki                           |
| Node.js              | >= 22.12.0                      |

## 公式ドキュメント参照

不明な点がある場合は、API の動作を推測せず公式ドキュメントを確認すること。

- **Astro**: https://docs.astro.build/
- **React 19**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **nanostores**: https://github.com/nanostores/nanostores
- **umaki**: https://github.com/TsubasaHiga/umaki

## アーキテクチャ

### ディレクトリ構成

```
src/
├── components/        # React (.tsx) / Astro (.astro) コンポーネント
├── const/             # 定数定義
├── layouts/           # レイアウトコンポーネント
├── pages/             # ページ（Astro ルーティング）
├── store/
│   └── atoms/         # nanostores 状態 atom
├── styles/            # SCSS（7-1 + Single Entry Point）
├── types/             # TypeScript 型定義
├── siteConfig.ts      # サイト全体設定
└── pageDataList.ts    # ページメタデータ
scripts/               # ビルドスクリプト
integrations/          # カスタム Astro インテグレーション
public/                # 静的アセット
```

### パスエイリアス

`tsconfig.json` で `@/*` → `src/*` にマッピング。すべての import は `@/` から始める形式に統一。

```typescript
import { siteConfig } from '@/siteConfig'
import Layout from '@/layouts/Layout.astro'
import { values } from '@/const/values'
import type { PageNameType } from '@/types/PageDataListType'
```

### Astro インテグレーション

| 種別           | 名前                 | 用途                           |
| -------------- | -------------------- | ------------------------------ |
| ビルトイン     | @astrojs/react       | React コンポーネントサポート   |
| ビルトイン     | @astrojs/sitemap     | サイトマップ自動生成           |
| サードパーティ | astro-relative-links | 相対リンク変換                 |
| サードパーティ | astro-robots-txt     | robots.txt 自動生成            |
| サードパーティ | astro-seo            | SEO メタタグ管理               |
| カスタム       | prettyHtml.ts        | 非本番ビルドで HTML 出力を整形 |
| カスタム       | imagesOptimize.ts    | ビルド/開発時に画像を自動変換  |

### ページデータシステム

ページメタデータは `src/pageDataList.ts` に集約。各ページには `PageNameType`（`src/types/PageDataListType.ts` で定義）があり、`Layout.astro` が `pageName` props から SEO メタデータを自動設定。

### 状態管理

**nanostores** を React バインディング（`@nanostores/react`）と共に使用。状態 atom は `src/store/atoms/` に配置：

- `siteState.ts`: グローバル UI の状態（例: `isOpenMenu`）

### サイト設定

`src/siteConfig.ts` にサイト全体の設定（名前、URL、ベースパス、テーマカラー、Twitter メタ）を定義。ビルドは `isProduction()` ユーティリティに基づいて動作を切り替え。

### SCSS アーキテクチャ

7-1 パターンをベースとした Single Entry Point 構成。詳細は [style-system.md](./style-system.md) を参照。

```
src/styles/
├── abstracts/           # 変数・関数・mixin（出力なし）
│   ├── _index.scss      # Public API（エントリーポイント）
│   ├── config/          # ブレークポイント、デザイントークン
│   ├── functions/       # 単位変換関数（rem, vw, vh）
│   └── mixins/          # 1ファイル1mixin構成
│       └── detection/   # ブラウザ・OS・デバイス検出
├── base/                # リセット・ベーススタイル
├── extends/             # プレースホルダーセレクタ
├── utilities/           # ユーティリティクラス
└── main.scss            # メインエントリーポイント
```

**Single Entry Point パターン**: コンポーネント SCSS では明示的な `@use` が不要（`astro.config.ts` で自動注入）

**主要な mixin**:

- メディアクエリ: `mqw-up`, `mqw-down`, `mqh-up`, `mqh-down`
- 検出系: `is-safari`, `is-firefox`, `is-ios`, `is-android`, `is-type-mobile`
- タイポグラフィ: `fz`, `fzs`, `letter-spacing`, `responsive-font-size`
- レイアウト: `vh100`, `aspect-ratio`, `custom-scrollbar`

### ビルドスクリプト

`scripts/` に配置：

| スクリプト           | 用途                                           |
| -------------------- | ---------------------------------------------- |
| convertImages.ts     | sharp による画像最適化（`--watch` モード対応） |
| genDistArchive.ts    | 配布用アーカイブを作成                         |
| copyDistDirectory.ts | ステージング用に dist フォルダをコピー         |

## コマンド一覧

| コマンド             | 用途                                         |
| -------------------- | -------------------------------------------- |
| `pnpm dev`           | 開発サーバー起動                             |
| `pnpm build`         | 本番ビルド                                   |
| `pnpm build-stg`     | ステージング用ビルド（ビルド + dist コピー） |
| `pnpm preview`       | ビルドしてプレビュー                         |
| `pnpm archive`       | ビルドして dist アーカイブを作成             |
| `pnpm check`         | Biome によるリント + フォーマットチェック    |
| `pnpm check:fix`     | Biome によるリント + フォーマット自動修正    |
| `pnpm lint:styles`   | Stylelint による CSS/SCSS スタイルのリント   |
| `pnpm lint:html`     | HTML 構造のリント（markuplint）              |
| `pnpm format`        | Biome で全ファイルをフォーマット             |
| `pnpm convertImages` | 画像変換（必要に応じて個別実行）             |

## コーディング規約

### 命名規則

- **コンポーネント**: PascalCase（例: `Header`, `PageTitle`）
- **関数/変数**: camelCase（例: `getPageData`, `isProduction`）
- **定数**: UPPER_SNAKE_CASE（例: `SITE_NAME`, `BASE_PATH`）
- **ファイル名**: ユーティリティは camelCase、コンポーネントは PascalCase（例: `siteConfig.ts`, `Header.tsx`）
- **CSS クラス**: kebab-case（Tailwind 使用時は不要）

### TypeScript 方針

- `astro/tsconfigs/strict` を継承した厳密な型付け
- `any` 型は禁止 — `unknown` + 型ガードを使用
- 複雑なオブジェクトには interface を定義
- 型が明らかな場合は型推論を活用
- `let` より `const` を優先

### インポート順序

Biome の `organizeImports` アシストが自動整理。`@/` エイリアスで内部モジュールを参照。

### スタイリング方針

- 新規スタイルは Tailwind CSS を優先使用
- SCSS は `src/styles/` の既存パターンに従う
- Stylelint は Recess 順でプロパティを並び替え
- レスポンシブデザインを考慮

### 重要なパターン

- React コンポーネントは `.tsx` 拡張子を使用し、`src/components/` に配置
- Astro コンポーネントは `.astro` 拡張子を使用
- 本番ビルドでは esbuild 設定で `console.log` と `debugger` を削除

### ユーティリティライブラリ (umaki)

新規ユーティリティ関数を作成する前に、[umaki](https://github.com/TsubasaHiga/umaki) に同等の機能がないか確認する。`debounce`, `throttle`, `sleep`, `sanitizeHtml` 等が利用可能。

```typescript
// NG: 自作
const debounce = (fn, delay) => {
  /* ... */
}

// OK: umaki を使用
import { debounce } from 'umaki/eventControl'
```

## Git ワークフロー

### ブランチ戦略

- `main`: プロダクションリリース・統合ブランチ（PR のターゲット）
- `feature/#<Issue番号>`: 機能ブランチ

### コミットメッセージ

```
<type>: <emoji> <説明>
```

| Type     | Emoji | Description            |
| -------- | ----- | ---------------------- |
| feat     | ✨    | 新機能                 |
| fix      | 🐛    | バグ修正               |
| refactor | ♻️    | リファクタリング       |
| docs     | 📝    | ドキュメント           |
| style    | 💄    | フォーマット、スタイル |
| test     | ✅    | テスト追加             |
| chore    | 🔧    | メンテナンス           |
| perf     | ⚡    | パフォーマンス改善     |
| build    | 📦    | ビルド関連             |
| ci       | 👷    | CI 関連                |
| revert   | ⏪    | リバート               |

### Issue と PR の原則

**原則: 1 Issue = 1 Feature Branch = 1 PR**

- 各 Issue は個別の `feature/#<Issue番号>` ブランチで作業する
- 1つの PR には原則1つの Issue の修正のみを含める
- 既存の Issue が存在する場合、重複する Issue を新規作成しないこと

### Git Hooks（Lefthook）

`lefthook.yml` で定義。コミット時に自動実行：

- `*.{ts,tsx,astro,js,jsx,json,jsonc,cjs,mjs}` → `biome check --fix`（自動修正 + 再ステージ）
- `*.{css,scss,html,astro}` → `pnpm lint:styles`

## プレコミットチェックリスト

- [ ] `pnpm check` がエラーなしで通過
- [ ] `pnpm lint:styles` がエラーなしで通過
- [ ] `pnpm build` がエラーなしで成功
- [ ] コミットメッセージが conventional 形式（絵文字付き）に従っている

## トラブルシューティング

**開発サーバーが起動しない**

- ポート 4321 が使用中でないか確認
- 実行中のプロセスを停止して再起動

**画像最適化の問題**

- `pnpm convertImages` を手動実行
- ソース画像が正しい場所に存在するか確認

**SCSS 警告**

- `astro.config.ts` で `SCSS_Logger` により `mixed-decls`、`legacy-js-api` 等の警告は抑制済み

**ビルドエラー**

- `pnpm install --force` でクリーン再インストール
- 解決しない場合: `node_modules/` と `pnpm-lock.yaml` を削除し、`pnpm install` を実行
