# CLAUDE.md

Claude Code 向けのガイダンスです。

## 参照ドキュメント

- **共有ガイドライン**: [docs/shared-guidelines.md](docs/shared-guidelines.md) - テックスタック、アーキテクチャ、コーディング規約、Git ワークフロー等

**重要**: `docs/shared-guidelines.md` は必ず参照すること。特に以下のセクションはすべての作業に適用される:

- **コーディング規約** - 命名規則、TypeScript 方針、スタイリング方針
- **Git ワークフロー** - ブランチ戦略、コミットメッセージ形式、Issue/PR の原則
- **プレコミットチェックリスト** - コミット前の必須確認項目

## Git ワークフロー

### ベースブランチ

**重要**: PR は必ず `main` ブランチに向けて作成してください。

```bash
gh pr create --base main ...
```

### GitHub Issue の扱い

**重要**: 既存の Issue が存在する場合、重複する Issue を新規作成しないこと。

- タスク着手時は、まず対応する既存 Issue があるか確認する
- 既存 Issue がある場合はその Issue を使い、必要に応じて内容を更新する（`gh issue edit`）
- 新規 Issue を作成するのは、対応する Issue が存在しない場合のみ

## Claude Code 向けポリシー

- **tsc**: コード変更のたびに自動実行しない。コミット前・PR 前・明示的な依頼時のみ実行
- **build**: 変更後に自動実行しない。明示的な依頼時のみ実行
- **lint**: コミット前に `pnpm lint:scripts` / `pnpm lint:styles` を実行。開発中は自動実行しない
- **format**: コミット前に `pnpm format` を実行。開発中は自動実行しない
- **git add**: 変更後に自動的にステージングしない。コミット直前のみ

## 公式ドキュメント参照

不明な点がある場合は、API の動作を推測せず公式ドキュメントを確認すること。

- **Astro**: https://docs.astro.build/
- **React 19**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **nanostores**: https://github.com/nanostores/nanostores
- **umaki**: https://github.com/TsubasaHiga/umaki
