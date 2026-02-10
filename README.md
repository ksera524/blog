# ksera's Blog

Hugoベースの個人ブログです。

## 必要なツール

- [mise](https://mise.jdx.dev/) - バージョン管理ツール
- Hugo (miseでインストール済み)

## セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd blog

# サブモジュール（テーマ）を初期化
git submodule update --init --recursive

# miseでHugoを有効化
mise use hugo
```

## Eleventy (並行運用)

Hugoは残したままEleventyのビルドを追加しています。

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
```

下書きにする場合は、フロントマターに `draft: true` を追加します。

### ビルド

```bash
npm run build
```

`npm run dev` では下書きも表示されます。

## 基本的な使い方

### 開発サーバーの起動

```bash
# miseを有効化してHugoサーバーを起動
eval "$(mise activate bash)" && hugo server -D
```

サーバーは http://localhost:1313/ で起動します。

### 新しい記事の作成

```bash
# 新しいブログ記事を作成
hugo new post/記事タイトル.md
```

作成されたMarkdownファイルは `content/post/` ディレクトリに配置されます。

### ビルド

```bash
# 本番用ビルド（publicディレクトリに生成）
hugo

# ドラフトも含めてビルド
hugo -D
```

## ディレクトリ構成

```
blog/
├── archetypes/     # 記事テンプレート
├── config.toml     # サイト設定ファイル
├── content/        # コンテンツ（記事）
│   ├── post/      # Hugo記事
│   ├── tech/      # Eleventy Tech記事
│   └── cook/      # Eleventy Cook記事
├── layouts/       # Eleventyレイアウト
├── .eleventy.js   # Eleventy設定
├── package.json   # Eleventy依存関係
├── public/         # ビルド出力先
├── static/         # 静的ファイル（画像など）
└── themes/         # Hugoテーマ
    └── mainroad/   # Mainroadテーマ
```

## 設定ファイル

### config.toml

主要な設定項目：

- `baseURL` - サイトのベースURL
- `title` - サイトタイトル
- `theme` - 使用テーマ（mainroad）
- `[Params.sidebar]` - サイドバー設定
  - `widgets` - 表示するウィジェット（検索、アーカイブ、カテゴリなど）

## 機能

### サイドバーウィジェット

- **検索機能** - 記事を検索
- **年月アーカイブ** - 年月ごとの投稿数を表示
- **カテゴリ** - カテゴリ一覧
- **タグリスト** - タグ一覧
- **ソーシャルリンク** - GitHubリンク

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

## よく使うコマンド

```bash
# 記事一覧を確認
hugo list all

# 下書き記事も含めて確認
hugo list drafts

# サイトの統計情報
hugo env

# キャッシュクリア
hugo --gc
```

## CI

GitHub Actionsでビルドチェックを実行します。

## トラブルシューティング

### Hugoコマンドが見つからない場合

```bash
# miseを再度有効化
eval "$(mise activate bash)"

# または
mise use hugo
```

### テーマが表示されない場合

```bash
# サブモジュールを更新
git submodule update --init --recursive
```

## ライセンス

このブログのコンテンツは著作者（ksera）に帰属します。
Mainroadテーマは[MITライセンス](https://github.com/vimux/mainroad/blob/master/LICENSE.md)で提供されています。
