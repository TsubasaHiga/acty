# Acty

Astro製の静的サイト構築ボイラープレート。

## Required Environment

- Node.js `v23.4.0`
- Yarn `v4.1.1`

```bash
# macOS
$ sw_vers
ProductName:    macOS
ProductVersion: 14.4.1
BuildVersion:   23E224

$ node -v
23.4.0

$ yarn -v
4.1.1

# Windows OS
$ ver
Microsoft Windows [Version 10.0.22631.4602]

$ node -v
23.4.0

$ yarn -v
4.1.1
```

## Install

```bash
yarn install
```

## Dev

```bash
yarn dev
```

## Build

```bash
# production build
yarn build

# production build + zip archive
yarn archive
```

## Docs

- [バージョニングについて](./docs/semver.md)
- [コミットメッセージについて](./docs/commit-message.md)
