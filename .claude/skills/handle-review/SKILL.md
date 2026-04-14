---
name: handle-review
description: PRレビューのフィードバックを確認し、対応の必要性を検討する。レビュー結果への対応方針を提案する。
argument-hint: '[PR番号（省略可）]'
disable-model-invocation: true
---

# レビューフィードバック対応

レビュー結果が届きましたので、対応の必要性を検討してください。

$ARGUMENTS

## 現在のPR状況

- Open PRs with reviews: !`gh pr list --state open --json number,title,reviewDecision,reviews`

## 対応方針

各レビューコメントについて:

1. 指摘内容を理解する
2. 対応の必要性を判断する（修正必要 / 議論必要 / 対応不要）
3. 修正が必要な場合は具体的な対応案を提示する
4. ユーザーに対応方針を確認してから実施する
