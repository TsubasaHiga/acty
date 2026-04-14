---
name: post-release
description: リリース後の作業を実行する。GitHub Release作成（または更新）と次期バージョンに向けた課題整理を行う。
argument-hint: '[バージョンタグ e.g. 0.0.13]'
---

# ポストリリース

$ARGUMENTS のリリース後作業を実行します。

## 手順

### 1. GitHub Release 作成（または更新）

前回リリースタグからの変更内容を分析し、GitHub Release を作成または更新してください。

- 前回タグは `git describe --tags --abbrev=0 $ARGUMENTS^` で取得
- 既にリリースが存在する場合は `gh release edit` で更新する

```bash
gh release create $ARGUMENTS --title "$ARGUMENTS" --notes "$(cat <<'EOF'
## ✨ New Features

### 機能名 (#Issue番号)
機能の説明

## 🐛 Bug Fixes

- 修正内容 (#Issue番号)

## 💡 Improvements

- 改善内容 (#Issue番号)

## 📦 Dependencies

- 依存関係の更新内容

## 🔧 Maintenance

- メンテナンス内容

---

**Full Changelog**: https://github.com/OWNER/REPO/compare/<previous-tag>...$ARGUMENTS
EOF
)"
```

- セクションは該当する変更がある場合のみ記載
- リポジトリの OWNER/REPO は `gh repo view --json nameWithOwner -q .nameWithOwner` で取得する

### 2. 次期バージョンに向けた課題整理

コードベースを探索し、次期バージョンで対応すべき課題を調査してください。

**調査の重点**:

- 今回のリリースで導入された変更によるデグレがないか
- 潜在的なバグや修正しておいた方が良い内容
- UI/UXを改善できる箇所
- 依存関係のアップデート状況

**手順**:

1. 今回リリースの変更差分（`git diff <前回タグ>...$ARGUMENTS`）を確認し、リスクのある箇所を特定
2. サブエージェント（`subagent_type: "Explore"`）を使い、変更影響のあるモジュールを並行調査
3. 発見した課題をユーザーに報告し、起票の承認を得てからIssue化

**注意**: 起票前に既存 Issues（Open + Closed）との重複確認を行うこと。

### 3. 完了報告

以下を報告してください:

- 作成（または更新）した GitHub Release の URL
- 起票した Issue 一覧（ある場合）
