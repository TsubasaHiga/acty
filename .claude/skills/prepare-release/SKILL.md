---
name: prepare-release
description: リリース準備を行う。指定バージョンタグから最新mainまでの変更内容を確認し、適切なバージョン番号を提案する。
argument-hint: '[現在のバージョンタグ e.g. 0.0.13]'
disable-model-invocation: true
---

# リリース準備

$ARGUMENTS のタグから最新の main までの変更内容を包括的に分析し、リリースに必要な情報をまとめてください。

## 情報収集

以下のコマンドを実行して情報を収集してください:

1. **差分コミット一覧**: !`git log $ARGUMENTS...main --oneline`
2. **変更ファイル数の統計**: !`git diff --stat $ARGUMENTS...main | tail -1`
3. **変更ファイル一覧**: !`git diff --name-only $ARGUMENTS...main`
4. **クローズ済みIssue一覧**: !`gh issue list --state closed --limit 30`
5. **マージ済みPR一覧**: !`git log $ARGUMENTS...main --merges --oneline`

## 出力フォーマット

### 1. バージョン提案

- 変更内容のサマリーを作成
- Semantic Versioning に基づき major/minor/patch を提案
- 提案理由を説明

### 2. リリースチェックリスト

- [ ] 全てのIssueが対応済みか確認
- [ ] 破壊的変更がないか確認（テンプレート利用者への影響）
- [ ] 依存関係の更新が必要か確認
- [ ] `pnpm lint:scripts` がエラーなしで通過
- [ ] `pnpm lint:styles` がエラーなしで通過
- [ ] `pnpm build` がエラーなしで成功

### 3. Changelog ドラフト

一般ユーザー向けのChangelogドラフトを以下のカテゴリで作成:

- ✨ 新機能
- 🐛 バグ修正
- 💡 改善
- 📦 依存関係
- 🔧 メンテナンス

各項目にはIssue番号 `(#xxx)` を付与してください。

## リリース実行

準備が整ったら以下を実行:

```bash
# package.json のバージョンを更新
npm version <patch|minor|major> --no-git-tag-version

# 変更をコミット・タグ作成
git add package.json
git commit -m "<version>"
git tag <version>
git push origin main --tags
```
