# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## 公式ドキュメント参照

機能の調査や実装時は、**必ず公式ドキュメントを参照**してください：

### Astro フレームワーク

- **公式ドキュメント**: https://docs.astro.build/
- **GitHub**: https://github.com/withastro/astro
- **インテグレーション**: https://docs.astro.build/en/guides/integrations-guide/

### 主要な依存関係

- **React 19**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **nanostores**: https://github.com/nanostores/nanostores
- **umaki**: https://github.com/TsubasaHiga/umaki（ユーティリティライブラリ）

**重要: 不明な点がある場合は、APIの動作を推測せず、必ず公式ドキュメントを確認すること。**

## プロジェクト概要

Actyは**Astro 5**で構築された静的Webサイトの**テンプレートリポジトリ**です。インタラクティブなコンポーネントには**React 19**を使用し、スタイリングにはTailwind CSSとSCSS、状態管理にはnanostoresを採用しています。

### テンプレートとしての性質

このリポジトリは新規プロジェクトのボイラープレートとして機能します。cloneした後、以下のファイルは利用者が自身の環境に合わせて設定する必要があります：

- `src/siteConfig.ts`: サイト名、URL、テーマカラー等
- `src/pageDataList.ts`: ページメタデータ
- `public/`: ファビコン、OGP画像等のアセット

以下のファイルは`.gitignore`で除外されており、利用者が各自で設定します：

- `.mcp.json`: MCP（Model Context Protocol）サーバー設定
- `.serena/`: Serena AI開発支援ツールの設定・メモリ
- `.claude/settings.local.json`: Claude Codeの個人設定

## 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# ステージング用ビルド（ビルド + distコピー）
pnpm build-stg

# ビルドしてプレビュー
pnpm preview

# ビルドしてdistアーカイブを作成
pnpm archive

# TypeScript/TSX/Astroファイルのリント
pnpm lint:scripts

# CSS/SCSS/HTML/Astroスタイルのリント
pnpm lint:styles

# HTML構造のリント（markuplint）
pnpm lint:html

# Prettierで全ファイルをフォーマット
pnpm format

# 画像変換（必要に応じて個別実行）
pnpm convertImages
```

## パッケージ管理

- **pnpm**を使用（バージョン: 9.15.4）
- npmやyarnは使用しないこと
- **umaki**ユーティリティライブラリが利用可能（共通ユーティリティ関数）

## アーキテクチャ

### パスエイリアス

`tsconfig.json`で設定済み：

- `@/*` → `src/*`

すべてのimportは`@/`から始める形式に統一。例：

```typescript
import { siteConfig } from '@/siteConfig'
import Layout from '@/layouts/Layout.astro'
import { values } from '@/const/values'
import type { PageNameType } from '@/types/PageDataListType'
```

### Astroインテグレーション

#### ビルトインインテグレーション

- **@astrojs/react**: Reactコンポーネントサポート
- **@astrojs/sitemap**: サイトマップ自動生成

#### サードパーティインテグレーション

- **astro-relative-links**: 相対リンク変換
- **astro-robots-txt**: robots.txt自動生成
- **astro-seo**: SEOメタタグ管理

#### カスタムインテグレーション（`integrations/`に配置）

- **prettyHtml.ts**: 非本番ビルドでHTML出力を整形
- **imagesOptimize.ts**: ビルド/開発時に`scripts/convertImages.ts`経由で画像を自動変換

### ページデータシステム

ページメタデータは`src/pageDataList.ts`に集約されています。各ページには`PageNameType`（`src/types/PageDataListType.ts`で定義）があり、タイトル、説明文、階層構造にマッピングされます。`Layout.astro`コンポーネントは`pageName`をpropsとして受け取り、SEOメタデータを自動設定します。

### 状態管理

**nanostores**をReactバインディング（`@nanostores/react`）と共に使用。状態atomは`src/store/atoms/`に配置：

- `siteState.ts`: グローバルUIの状態（例: `isOpenMenu`）

### SCSSアーキテクチャ

グローバルSCSS変数、mixin、関数は`astro.config.ts`のVite設定で自動注入：

- `src/styles/_variables.scss`: デザイントークン
- `src/styles/_mixin.scss`: 再利用可能なmixin
- `src/styles/_functions.scss`: SCSS関数
- `src/styles/Extends/e-spacer`: スペーシングユーティリティ

mixinにはブラウザ検出（`is-safari`, `is-firefox`）、OS検出（`is-ios`, `is-android`）、レスポンシブユーティリティ（`mqw-up`, `mqw-down`）が含まれます。

### サイト設定

`src/siteConfig.ts`にはサイト全体の設定（名前、URL、ベースパス、テーマカラー、Twitterメタ）が含まれています。ビルドは`isProduction()`ユーティリティに基づいて動作を切り替えます。

### ビルドスクリプト

`scripts/`に配置：

- **convertImages.ts**: sharpによる画像最適化（`--watch`モード対応）
- **genDistArchive.ts**: 配布用アーカイブを作成
- **copyDistDirectory.ts**: ステージング用にdistフォルダをコピー

## 重要なパターン

- Reactコンポーネントは`.tsx`拡張子を使用し、`src/components/`に配置
- Astroコンポーネントは`.astro`拡張子を使用
- 本番ビルドではesbuild設定で`console.log`と`debugger`を削除
- インポートの並び順は`simple-import-sort` ESLintプラグインで強制
- StylelintはRecess順でプロパティを並び替え

## コード品質基準

### Git Hooks（husky + lint-staged）

コミット時に自動実行：

- `*.{ts,tsx,astro}` → `pnpm lint:scripts`
- `*.{css,scss,html,astro}` → `pnpm lint:styles`
- 全ファイル → `pnpm format`

### 命名規則

- **コンポーネント**: PascalCase（例: `Header`, `PageTitle`）
- **関数/変数**: camelCase（例: `getPageData`, `isProduction`）
- **定数**: UPPER_SNAKE_CASE（例: `SITE_NAME`, `BASE_PATH`）
- **ファイル名**: ユーティリティはcamelCase、コンポーネントはPascalCase（例: `siteConfig.ts`, `Header.tsx`）
- **CSSクラス**: kebab-case（Tailwind使用時は不要）

### TypeScriptベストプラクティス

- コードベース全体で**TypeScript**を使用
- 可能な限り厳密な型付けを適用（`astro/tsconfigs/strict`を継承）
- **`any`型は避ける** - 適切な型定義または型ガード付きの`unknown`を使用
- 複雑なオブジェクトにはinterfaceを定義
- 型が明らかな場合は型推論を活用
- 値が変更されない場合は`let`より`const`を優先

### TypeScript型チェックポリシー（Claude Code向け）

**⚠️ 重要: コード変更のたびに自動で型チェックを実行しないこと。**

型チェックを実行するタイミング：

- ✅ **ユーザーから明示的に依頼された場合のみ**
- ✅ コミット作成前（コミット前チェックリストの一部として）
- ✅ プルリクエスト作成前

型チェックを実行しないタイミング：

- ❌ ファイル編集やコード変更のたび
- ❌ Edit/Writeツール使用後（明示的に依頼されない限り）
- ❌ ユーザーの依頼なしに自動的に

**理由**: Astro開発サーバーは開発中にライブフィードバック付きで型チェックを実行しています。手動チェックはコミット/PR前の最終確認、または明示的に型の問題をデバッグする場合にのみ必要です。

## コミットメッセージ形式

### Gitコミットコマンド（Claude Code向け）

```
╔═══════════════════════════════════════════════════════════════════╗
║  ⚠️  重要: AuthorとCommitterの両方をClaudeに設定すること      ⚠️  ║
║                                                                   ║
║  コミット作成前に必ず以下を使用:                                  ║
║  ✅ GIT_COMMITTER_NAME="Claude"                                   ║
║  ✅ GIT_COMMITTER_EMAIL="noreply@anthropic.com"                   ║
║  ✅ --author="Claude <noreply@anthropic.com>"                     ║
║                                                                   ║
║  ❌ 環境変数と--authorの両方なしでコミットしないこと              ║
╚═══════════════════════════════════════════════════════════════════╝
```

**コミット作成時は必ずこの形式を使用:**

```bash
GIT_COMMITTER_NAME="Claude" GIT_COMMITTER_EMAIL="noreply@anthropic.com" \
git commit --author="Claude <noreply@anthropic.com>" -m "$(cat <<'EOF'
<type>: <emoji> <説明>

<詳細な説明（日本語）>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

タイプ: feat, fix, docs, style, refactor, test, chore, build, ci, perf, revert

### 検証（コミット後に必須）

```bash
git log -1 --pretty=fuller
```

期待される出力:

```
Author:     Claude <noreply@anthropic.com>
Commit:     Claude <noreply@anthropic.com>
```

どちらかがClaudeでない場合、直ちに修正:

```bash
GIT_COMMITTER_NAME="Claude" GIT_COMMITTER_EMAIL="noreply@anthropic.com" \
git commit --amend --author="Claude <noreply@anthropic.com>" --no-edit
```

## コミット前チェックリスト

**変更をコミットする前に全項目を完了すること:**

### コード品質（必須）

- [ ] `pnpm lint:scripts`がエラーなしで通過
- [ ] `pnpm lint:styles`がエラーなしで通過
- [ ] `pnpm build`がエラーなしで成功
- [ ] `pnpm dev`でテスト時にコンソールエラーなし

### スタイリング

- [ ] 適切な箇所でTailwind CSSを使用
- [ ] SCSSは`src/styles/`の既存パターンに従っている
- [ ] レスポンシブデザインを考慮

### Gitワークフロー

- [ ] コミットメッセージがconventional形式（絵文字付き）に従っている
- [ ] Authorが"Claude <noreply@anthropic.com>"に設定されている
- [ ] Committerが"Claude <noreply@anthropic.com>"に設定されている
- [ ] `git log -1 --pretty=fuller`で著者情報を確認済み

**チェックボックスが1つでも未完了の場合、コミットしないこと。まず問題を修正すること。**

## トラブルシューティング

### よくある問題と解決策

**ビルドエラー**

- 問題: 依存関係エラーでビルドが失敗
- 解決策: `pnpm install --force`でクリーン再インストール
- 解決しない場合: `node_modules/`と`pnpm-lock.yaml`を削除し、`pnpm install`を実行

**TypeScriptエラー**

- 問題: 型チェックが失敗
- 解決策: インポートと型定義を確認
- tsconfig.jsonのパスが正しいか確認

**開発サーバーが起動しない**

- 問題: `pnpm dev`が失敗
- 解決策: ポート4321が使用中でないか確認
- 実行中のプロセスを停止して再起動

**画像最適化の問題**

- 問題: 画像が変換されない
- 解決策: `pnpm convertImages`を手動実行
- ソース画像が正しい場所に存在するか確認

**SCSS警告**

- 問題: SCSSの非推奨警告が表示される
- 解決策: `astro.config.ts`で`SCSS_Logger`により`mixed-decls`、`legacy-js-api`等の警告は抑制済み

**デバッグのヒント**

- クライアントサイドのエラーはブラウザDevToolsコンソールで確認
- Astroビルド/開発エラーはターミナル出力を確認
- デバッグには`console.log()`を使用（コミット前に削除）
- 開発中は`@nanostores/logger`でストアの変更をログ出力可能

## Nodeバージョン

Node.js >= 20.18.1 が必要
