---
name: work-issues
description: GitHub Issueの対応を開始する。Issue番号またはフィルタ条件を指定して、Issue対応フローに従い順次対応を進める。
argument-hint: '[Issue番号 or フィルタ条件]'
disable-model-invocation: true
---

# Issue対応開始

以下のIssue対応を開始してください: $ARGUMENTS

## 現在の状況

- Open Issues: !`gh issue list --state open --limit 20 --json number,title,labels`
- Open PRs: !`gh pr list --state open --limit 10 --json number,title,headRefName,baseRefName`

## 作業ルール

`CLAUDE.md` のガイドラインに従ってください。

要点:

- 若いIssue番号から順にノンストップで進める
- 対応完了後は feature ブランチにてコミット・PR作成まで進める
- ブランチ命名: `feature/#<Issue番号>`（main から作成）
- 自明な変更（typo修正、コメント追加等）以外は `/codex-review` でCodexコードレビューを実施し、Critical指摘は修正してからPRを作成する
- 既存のPRを先にマージした方が良い場合はお知らせする

## コミット前チェック

PR作成前に以下を必ず実行:

```bash
# スクリプトリント
pnpm lint:scripts

# スタイルリント
pnpm lint:styles

# フォーマット
pnpm format

# ビルド確認
pnpm build
```

全てエラーなしで通過してからコミット・PR作成に進むこと。
