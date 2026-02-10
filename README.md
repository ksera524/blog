# ksera's Blog

Eleventyベースの個人ブログです。

### 開発サーバーの起動

```bash
npm install
npm run dev
```

サーバーは http://localhost:8080/ で起動します。

### 記事の作成

```bash
# Tech記事
content/tech/記事タイトル.md

# Cook記事
content/cook/記事タイトル.md
```

下書きを作る場合はコマンドでも生成できます。

```bash
# Techの下書き
npm run draft -- "記事タイトル"

# Cookの下書き
npm run draft:cook -- "記事タイトル"

# レシピURLからCook記事を生成
npm run cook:import -- "https://www.kurashiru.com/recipes/a6a3ef63-1da6-44c5-ba61-c79b0de066bd"
```

下書きにする場合は、フロントマターに `draft: true` を追加します。

### ビルド

```bash
npm run build
```

`npm run dev` では下書きも表示されます。

## 基本的な使い方

## ディレクトリ構成

```
blog/
├── content/        # コンテンツ（記事）
│   ├── tech/      # Eleventy Tech記事
│   └── cook/      # Eleventy Cook記事
├── layouts/       # Eleventyレイアウト
├── .eleventy.js   # Eleventy設定
├── package.json   # Eleventy依存関係
├── public/         # ビルド出力先
├── static/         # 静的ファイル（画像など）

```

## 機能

### サイドバーウィジェット

- **検索機能** - 記事を検索
- **年月アーカイブ** - 年月ごとの投稿数を表示

### 記事のフロントマター

```yaml
---
title: "記事タイトル"
date: 2025-09-20T15:00:00+09:00
draft: false
categories: ["カテゴリ名"]
tags: ["タグ1", "タグ2"]
---
```

## CI

GitHub Actionsでビルドチェックを実行します。

## ライセンス

このブログのコンテンツは著作者（ksera）に帰属します。
