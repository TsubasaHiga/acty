---
name: audit-app
description: アプリ全体を探索し、潜在的なバグ・改善点・UX課題を調査してIssueに起票する。重点ポイントを指定可能。
argument-hint: "[重点ポイント: バグ重点 / UX改善 / パフォーマンス / デグレ確認 等]"
disable-model-invocation: true
---

# アプリ全体調査・Issue起票

アプリ全体を探索し、潜在的なバグや改修の余地がないか調査してください。

重点ポイント: $ARGUMENTS

## 現在の状況

- Open Issues: !`gh issue list --state open --limit 20 --json number,title,labels`
- 最近のコミット: !`git log --oneline -10`

## 作業ルール

`CLAUDE.md` および `docs/shared-guidelines.md` のガイドラインに従ってください。

要点:
- 起票前に既存Issues（Open + Closed）との重複確認を行う
- 適切なラベル付けを行う（優先度は必須）
- **Closed済みでnot plannedのIssueと同様の内容は再起票しない**（過去の判断理由が現在も有効か確認すること）
- `console.log` の残存は起票しない（本番ビルドでBiomeにより自動削除されるため）
- プロフェッショナルな目線で、極限レベルで調査・起票する

## アーキテクチャ（3層構成）

```
┌─────────────────────────────────────────┐
│  メインClaude（オーケストレータ）          │
│  - 調査計画の策定                         │
│  - 結果のマージ・重複排除・精査            │
│  - Issue起票の最終判断                    │
└────────┬──────────────────┬──────────────┘
         │                  │
    ┌────▼────┐        ┌────▼────┐
    │ Claude  │        │ Codex   │
    │ 調査隊  │        │ 調査隊  │
    │(複数並行)│        │(codex   │
    └─────────┘        │ exec)   │
                       └─────────┘
```

**メインClaude** は自らコードを調査せず、以下の役割に専念する:
- 調査対象モジュールの割り振り
- 両調査隊の結果を突き合わせたクロスチェック
- 指摘の妥当性判断と既存Issueとの重複排除
- 最終的なIssue起票

## 調査手順

### ステップ1: 調査計画

重点ポイントに応じて調査対象モジュールを決定する。
主要モジュール:
- `src/components/` — React (.tsx) / Astro (.astro) コンポーネント
- `src/layouts/` — レイアウトコンポーネント
- `src/pages/` — ページ（Astro ルーティング）
- `src/store/atoms/` — nanostores 状態 atom
- `src/styles/` — SCSS（7-1 + Single Entry Point）
- `src/types/` — TypeScript 型定義
- `src/const/` — 定数定義
- `src/siteConfig.ts` / `src/pageDataList.ts` — サイト設定・ページメタデータ
- `scripts/` — ビルドスクリプト（convertImages, copyDistDirectory, genDistArchive, deleteDir）
- `integrations/` — カスタム Astro インテグレーション（prettyHtml, imagesOptimize, googleFontsOptimizer）

### ステップ2: 並行調査（Claude調査隊 + Codex調査隊）

以下の2つを**並行**で実行する:

#### A) Claude 調査隊（Explore サブエージェント）

`Agent` ツール（`subagent_type: "Explore"`）を使い、モジュールごとに複数のサブエージェントを**並行起動**する。

各サブエージェントには担当モジュールと重点ポイントを指示する:
- コードを実際に読み、ロジックの流れを追跡する
- エッジケース・状態管理・エラーハンドリングに注目する
- Astro 固有の問題（アイランドアーキテクチャ・ハイドレーション・ビルド時 vs ランタイム）に注意する
- SCSS/Tailwind CSS のスタイリング問題・レスポンシブ対応に注目する
- UI/UXの視点（操作性・アクセシビリティ）も含める

#### B) Codex 調査隊（`codex exec` — CLI直接実行・速度重視）

`codex exec` CLI を直接使い、Claudeとは**異なる視点**でコードを分析させる。

> **重要**: Codexの調査タスクにはプラグイン（`/codex:rescue`、`task` コマンド）を使用しない。
> プラグイン経由の `task` は調査タスクでハングする問題が確認されている。
> 代わりに `codex exec` CLI を直接 Bash ツールで実行する。
> なお、コードレビュー（`/codex:review`）はプラグイン経由で問題なく動作する。

##### 手順

1. **調査プロンプトを構築**:
   - 重点ポイント（$ARGUMENTS）を明示
   - 調査対象のディレクトリやファイルパターンを指定
   - デグレ確認の場合は `git diff <比較基点>..HEAD` の差分分析を指示
   - 通常調査の場合はコードベース全体の調査を指示
   - 各問題を `[重要度: Critical/High/Medium/Low]` 形式で報告するよう指示
   - **コードの変更は行わず、調査結果のレポートのみ出力するよう明示**

2. **`codex exec` をバックグラウンドで実行**:

   Bash ツールで以下のように実行する:
   ```bash
   codex exec --ephemeral -o /tmp/codex-audit-result.md "調査プロンプト"
   ```

   - `--ephemeral`: セッションファイルを残さない
   - `-o /tmp/codex-audit-result.md`: 結果をファイルに出力
   - `timeout: 600000`（10分）を設定する
   - `run_in_background: true` でバックグラウンド実行する

3. **結果の取得**:
   バックグラウンドタスク完了後、`Read` ツールで `/tmp/codex-audit-result.md` を読み取る。

##### 注意
- diffが5000行を超える場合は、変更量上位のファイルに絞る
- Codex がエラーまたはタイムアウトの場合はスキップしてClaude調査隊の結果のみで進行する

### ステップ3: 結果のマージ・クロスチェック

オーケストレータとして以下を行う:

1. **収集**: Claude調査隊とCodex調査隊の両方の結果を集める
2. **統合**: 同一の問題を指している発見をまとめる（出典を両方記録）
3. **クロスチェック**: 片方だけが発見した問題は、オーケストレータが該当コードを確認して妥当性を判断する
4. **重複排除**: 既存の Open Issues と重複するものを除外する
5. **重要度ソート**: Critical → High → Medium → Low の順に整理する

### ステップ4: 指摘の精査

両調査隊の指摘は**鵜呑みにしない**。各指摘を以下の基準で精査する:
- **妥当**: 実際のコードで確認でき、問題が再現可能 → 起票対象
- **的外れ**: プロジェクト文脈に合わない、過剰、または誤検出 → スキップし理由を明記
- **両方が検出**: 高い信頼度で起票対象とする

### ステップ5: Issue起票

精査済みの問題をGitHub Issueとして起票する。
Issue本文に発見元（Claude/Codex/両方）を記載する。

## 調査観点

指定された重点ポイントに加え、以下を総合的に調査:
- バグ・ロジックエラー
- UI/UXの改善余地
- パフォーマンス問題
- アクセシビリティ
- エッジケースの未処理
- Astro 固有の問題（アイランドアーキテクチャ・SSG・ハイドレーション）
- SCSS/Tailwind CSS のスタイリング問題
- ビルドスクリプト・インテグレーションの信頼性
