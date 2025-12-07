# Acty

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
├── styles/         # グローバルSCSS
│   ├── mixins/     # SCSSミックスイン
│   └── Utilities/  # ユーティリティクラス
├── store/          # nanostores状態管理
├── modules/        # TypeScriptモジュール
├── utils/          # ユーティリティ関数
├── types/          # 型定義
├── siteConfig.ts   # サイト設定
└── pageDataList.ts # ページメタデータ
```

## ドキュメント

- [バージョニングについて](./docs/semver.md)
- [コミットメッセージについて](./docs/commit-message.md)
