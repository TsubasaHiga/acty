# コミットメッセージについて

基本ルールは[@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional)を採用します。

<small>※ なおPJ特有のルールがある場合はこの限りではありません。</small>

## 基本形

```txt
<Type>: <Emoji> #<Issue Number> <Title>
```

## Type

- `build`: ビルドに関すること
- `chore`: カテゴライズできない雑事
- `ci`: ci に関すること
- `docs`: ドキュメント編集など
- `feat`: 新機能開発
- `fix`: バグフィックス
- `perf`: パフォーマンス向上
- `refactor`: リファクタリング
- `revert`: コミット取り消し
- `style`: コードスタイルに関すること
- `test`: テストに関すること

## Emoji

<https://gitmoji.dev/>より適切な絵文字をピックアップして記述します。

## Issue Number

Issue 番号を記述します。

## Title

内容を完結に記述します。
