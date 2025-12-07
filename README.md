# Acty (Astro × React × Easy)

日本語ユーザー向けのAstro製静的サイト構築ボイラープレートです。

> [!IMPORTANT]
> **v0.0.12 破壊的変更: パッケージマネージャーをyarnからpnpmに変更しました**
>
> 既存の環境で開発を継続する場合は以下を実行してください：
>
> ```bash
> rm -rf node_modules yarn.lock && pnpm install
> ```

## 概要

Actyは、コーポレートサイトやランディングページなど、静的サイトを効率的に構築するためのボイラープレートです。Astroをベースに、実務で必要となる機能を事前に組み込んでいます。

### 想定プロジェクト

- コーポレートサイト
- ランディングページ（LP）
- キャンペーンサイト
- ポートフォリオサイト
- ドキュメントサイト

### Actyを使うメリット

- **すぐに開発を開始できる**: Lint設定、ビルド最適化、画像処理など、プロジェクト立ち上げ時の煩雑な初期設定が不要
- **チーム開発に対応**: Pre-commitフックとLint設定により、コード品質を自動で担保
- **納品形式に柔軟対応**: ZIPアーカイブ生成やディレクトリコピーなど、クライアントワークで求められる納品形式に対応
- **軽量な本番ビルド**: 静的サイト生成により高速なページ表示を実現

### 特徴

- **Astro + React**: 必要な箇所でのみReactを使用するIslands Architecture
- **nanostores**: 軽量な状態管理ライブラリによるコンポーネント間の状態共有
- **SCSS**: カスタムmixin（ブラウザ/OS検出、レスポンシブユーティリティ）を含む
- **自動画像最適化**: ビルド時にWebP変換を実行するカスタムインテグレーション
- **SEO対応**: OGP、sitemap、robots.txtの自動生成
- **厳格なLint**: ESLint、Stylelint、markuplint、Prettierによるコード品質管理
- **Pre-commitフック**: husky + lint-stagedによる自動検証
- **本番ビルド最適化**: console.log/debugger文の自動削除

## 動作環境

- Node.js `v23.4.0`
- pnpm `v9.15.4`

```bash
# macOS
$ sw_vers
ProductName:    macOS
ProductVersion: 14.4.1
BuildVersion:   23E224

$ node -v
23.4.0

$ pnpm -v
9.15.4

# Windows OS
$ ver
Microsoft Windows [Version 10.0.22631.4602]

$ node -v
23.4.0

$ pnpm -v
9.15.4
```

## 利用開始前の準備

Actyをclone/DLした後、開発を始める前に以下の対応を行ってください。

### 必須

| ファイル               | 対応                                          |
| ---------------------- | --------------------------------------------- |
| `CLAUDE.md`            | **削除**（Acty開発用のClaude Code設定のため） |
| `package.json`         | `name`, `version`を変更                       |
| `src/siteConfig.ts`    | サイト名、URL、テーマカラー等を変更           |
| `src/pageDataList.ts`  | ページメタデータを変更                        |
| `public/favicon.svg`   | ファビコンを差し替え                          |
| `public/ogp-image.png` | OGP画像を差し替え                             |
| `README.md`            | プロジェクトに合わせて書き換え                |

### 任意

以下は開発中に必要に応じて削除・編集してください。

- **サンプルコンポーネント**: `src/components/Foo/`, `Bar/`, `Baz/`
- **サンプル画像**: `src/images/`配下
- **サンプルページ**: `src/pages/about.astro`等
- **ドキュメント**: `docs/`配下（汎用的な内容のため残しても可）

## セットアップ

```bash
pnpm install
```

## 開発

```bash
pnpm dev
```

## ビルド

```bash
# 本番ビルド
pnpm build

# 本番ビルド + ZIPアーカイブ作成
pnpm archive
```

## プロジェクト構造

```
src/
├── components/     # Astro/Reactコンポーネント
├── layouts/        # レイアウトテンプレート
├── pages/          # ページファイル（ルーティング）
├── styles/         # グローバルSCSS（7-1パターンベース）
│   ├── abstracts/  # 変数・関数・mixin（Single Entry Point）
│   ├── base/       # リセット・ベーススタイル
│   ├── extends/    # プレースホルダーセレクタ
│   ├── utilities/  # ユーティリティクラス
│   └── main.scss   # エントリーポイント
├── store/          # nanostores状態管理
├── modules/        # TypeScriptモジュール
├── utils/          # ユーティリティ関数
├── types/          # 型定義
├── siteConfig.ts   # サイト設定
└── pageDataList.ts # ページメタデータ
```

## ドキュメント

- [スタイルシステム](./docs/style-system.md)
- [バージョニングについて](./docs/semver.md)
- [コミットメッセージについて](./docs/commit-message.md)
