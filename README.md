# Acty

Astro製の静的サイト構築ボイラープレート。

> [!IMPORTANT]
> **v0.0.12 破壊的変更: パッケージマネージャーをyarnからpnpmに変更しました**
>
> 既存の環境で開発を継続する場合は以下を実行してください：
>
> ```bash
> rm -rf node_modules yarn.lock && pnpm install
> ```

## Required Environment

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

## Install

```bash
pnpm install
```

## Dev

```bash
pnpm dev
```

## Build

```bash
# production build
pnpm build

# production build + zip archive
pnpm archive
```

## Docs

- [バージョニングについて](./docs/semver.md)
- [コミットメッセージについて](./docs/commit-message.md)
