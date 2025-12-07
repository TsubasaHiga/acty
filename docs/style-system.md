# Style System

このドキュメントでは、Acty プロジェクトの SCSS アーキテクチャについて説明します。

## ディレクトリ構造

```
src/styles/
├── abstracts/           # 変数、関数、mixin（出力なし）
│   ├── _index.scss      # Public API（エントリーポイント）
│   ├── config/
│   │   ├── _index.scss
│   │   ├── _breakpoints.scss    # メディアクエリ用 SCSS 変数
│   │   └── _design-tokens.scss  # CSS Custom Properties
│   ├── functions/
│   │   ├── _index.scss
│   │   ├── _units.scss          # rem(), vw(), vh() など
│   │   ├── _color.scss          # convert-rgb()
│   │   └── _math.scss           # gcd()
│   └── mixins/                  # 1ファイル1mixin構成
│       ├── _index.scss          # 全mixinの集約
│       ├── _mqw-up.scss         # min-width メディアクエリ
│       ├── _mqw-down.scss       # max-width メディアクエリ
│       ├── _mqh-up.scss         # min-height メディアクエリ
│       ├── _mqh-down.scss       # max-height メディアクエリ
│       ├── _mq.scss             # カスタムメディアクエリ
│       ├── _canhover.scss       # ホバー可能デバイス判定
│       ├── _fz.scss             # フォントサイズ（rem変換）
│       ├── _fzs.scss            # フォントサイズ（SP用）
│       ├── _letter-spacing.scss # レタースペーシング
│       ├── _responsive-font-size.scss  # clampフォントサイズ
│       ├── _vh100.scss          # 100vh対応
│       ├── _aspect-ratio.scss   # アスペクト比
│       ├── _custom-scrollbar.scss  # カスタムスクロールバー
│       ├── _hover-opacity.scss  # ホバー透明度
│       ├── _hover-dark.scss     # ホバーダーク
│       ├── _is-loaded.scss      # ロード完了状態
│       ├── _is-open-menu.scss   # メニュー開閉状態
│       ├── _is-scroll.scss      # スクロール状態
│       ├── _is-page.scss        # 特定ページ判定
│       ├── _is-not-page.scss    # 特定ページ以外
│       ├── _first.scss          # 最初の要素
│       ├── _last.scss           # 最後の要素
│       ├── _notfirst.scss       # 最初以外
│       ├── _notlast.scss        # 最後以外
│       ├── _even.scss           # 偶数番目
│       ├── _odd.scss            # 奇数番目
│       ├── _icon-ini.scss       # 疑似要素初期化
│       ├── _triangle.scss       # 三角形
│       ├── _arrow.scss          # 矢印アイコン
│       ├── _hide-text.scss      # テキスト非表示
│       ├── _ellipsis.scss       # テキスト省略
│       ├── _placeholder.scss    # プレースホルダー
│       ├── _no-select.scss      # 選択不可
│       ├── _add-selection-color.scss  # 選択時背景色
│       └── detection/           # 環境検出系（1ファイル1mixin）
│           ├── _index.scss
│           ├── _is-safari.scss
│           ├── _is-safari-desktop.scss
│           ├── _is-safari-mobile.scss
│           ├── _is-firefox.scss
│           ├── _is-edge.scss
│           ├── _is-ios.scss
│           ├── _is-android.scss
│           ├── _is-macos.scss
│           ├── _is-ipados.scss
│           ├── _is-type-mobile.scss
│           ├── _is-type-tablet.scss
│           ├── _touch-support.scss
│           └── _orientation.scss
├── base/
│   ├── _index.scss
│   └── _reset.scss              # リセット＆ベーススタイル
├── extends/
│   ├── _index.scss
│   └── _spacer.scss             # スペーシング用プレースホルダー
├── utilities/
│   ├── _index.scss
│   ├── _animation.scss          # アニメーションユーティリティ
│   ├── _visibility.scss         # .u-visually-hidden など
│   ├── _responsive.scss         # .u-mqw-up, .u-mqw-down など
│   └── _plugins.scss            # focus-visible スタイル
└── main.scss                    # メインエントリーポイント
```

## 設計原則

### Single Entry Point パターン

外部ファイル（コンポーネント SCSS）からは、常に `abstracts` のみを参照します：

```scss
@use '@/styles/abstracts' as *;
```

これにより、内部構造の変更が外部に波及しません。

### CSS Custom Properties と SCSS 変数の使い分け

| 用途                                       | 方式                  | 理由                                  |
| ------------------------------------------ | --------------------- | ------------------------------------- |
| ブレークポイント                           | SCSS 変数             | メディアクエリでは CSS 変数が使用不可 |
| 色、フォント、スペーシング、トランジション | CSS Custom Properties | ランタイムで変更可能、テーマ対応      |

## 使用方法

### コンポーネント SCSS ファイル

`astro.config.ts` で自動注入されるため、コンポーネント SCSS ファイルでは明示的な `@use` が不要です：

```scss
// src/components/MyComponent/MyComponent.module.scss

.my-component {
  // abstracts の mixin がそのまま使える
  @include mqw-up {
    padding: var(--space-md);
  }

  @include mqw-down {
    padding: var(--space-sm);
  }

  // extends のプレースホルダーも使える
  @extend %e-spacer;
}
```

### 主要な Mixin

#### メディアクエリ

```scss
// デスクトップ以上（md: 768px～）
@include mqw-up {
  // スタイル
}

// 特定のブレークポイント以上
@include mqw-up(lg) {
  // 1440px 以上
}

// モバイル（～md: 767px）
@include mqw-down {
  // スタイル
}

// 特定のブレークポイント以下
@include mqw-down(sm) {
  // 640px 以下
}

// 高さのメディアクエリ
@include mqh-up(lg) {
  // 高さ 910px 以上
}
```

#### タイポグラフィ

```scss
// フォントサイズ（rem 変換）
@include fz(16); // font-size: 1rem

// レスポンシブフォントサイズ
@include responsive-font-size(14, 18, 768px, 1440px);

// レタースペーシング
@include letter-spacing(100); // letter-spacing: 0.1em
```

#### 検出 Mixin

```scss
// ブラウザ検出
@include is-safari {
  // Safari 専用スタイル
}

@include is-firefox {
  // Firefox 専用スタイル
}

// OS 検出
@include is-ios {
  // iOS 専用スタイル
}

// デバイス検出
@include is-type-mobile {
  // モバイルデバイス専用
}

@include touch-support {
  // タッチデバイス専用
}
```

### CSS Custom Properties

`:root` で定義された CSS 変数は、どこからでも使用できます：

```scss
.element {
  // 色
  color: var(--color-primary);
  background-color: var(--color-gray);

  // スペーシング
  padding: var(--space-md);
  margin: var(--space-lg);

  // トランジション
  transition: opacity var(--short-ms) var(--short-es);

  // フォント
  font-family: var(--font-family);
}
```

### プレースホルダー（Extends）

スペーシング用のプレースホルダーが用意されています：

```scss
.container {
  // 左右のスペーサー（レスポンシブ）
  @extend %e-spacer;
}

.sidebar {
  // 左側のみ
  @extend %e-spacer-left;
}

// ネガティブマージンで親のスペーサーを打ち消す
.full-width {
  @extend %e-inherit-spacer;
}
```

### ユーティリティクラス

HTML で直接使用できるユーティリティクラス：

```html
<!-- スクリーンリーダー専用（視覚的に非表示） -->
<span class="u-visually-hidden">補足テキスト</span>

<!-- レスポンシブ表示制御 -->
<div class="u-mqw-up">デスクトップのみ表示</div>
<div class="u-mqw-down">モバイルのみ表示</div>

<!-- アニメーション -->
<div class="u-animation" data-animation="fade-in-up">フェードインアップ</div>
```

## ブレークポイント一覧

### 横幅（Width）

| キー  | 値     | 用途                         |
| ----- | ------ | ---------------------------- |
| `xxs` | 320px  | 最小モバイル                 |
| `xs`  | 375px  | 小型モバイル                 |
| `sm`  | 640px  | モバイル                     |
| `md`  | 768px  | タブレット（デフォルト境界） |
| `xmd` | 1280px | 小型デスクトップ             |
| `lg`  | 1440px | デスクトップ                 |
| `xl`  | 1600px | 大型デスクトップ             |
| `xl2` | 1860px | 超大型ディスプレイ           |

### 高さ（Height）

| キー  | 値    |
| ----- | ----- |
| `xs`  | 380px |
| `sm`  | 510px |
| `md`  | 668px |
| `xmd` | 845px |
| `lg`  | 910px |

## Dart Sass 対応

このプロジェクトは Dart Sass の最新仕様に準拠しています：

- `@import` の代わりに `@use` / `@forward` を使用
- グローバル関数の代わりに `sass:color`、`sass:math` などのモジュールを使用
- 除算には `/` の代わりに `math.div()` を使用

## ファイル命名規則

- パーシャルファイル（インポート専用）は `_` プレフィックス
- ディレクトリ名は小文字（`abstracts`, `base`, `extends`, `utilities`）
- ファイル名はケバブケース（`_design-tokens.scss`）
