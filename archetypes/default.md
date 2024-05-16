---
# Common-Defined params
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
date: {{ .Date }}
description: "Example article description" #記事の説明
categories: # カテゴリ
  - "Category 1"
tags:
  - "Test"
# menu: main  # オプション, メニューにページを追加: main, side, footer

comments: false # 特定のページでDisqusコメントを有効化
authorbox: true # 特定のページで作者ボックスを有効化
pager: true # 特定のページでページャーナビゲーション(前/次)を有効化
toc: true # 特定のページで目次を有効化
mathjax: true  # 特定のページでMathJaxを有効化
sidebar: "right" # サイドバーを特定のページで有効化(右側)
widgets:  # 特定のページでサイドバーウィジェットを有効化(順番)
  - "search"
  - "recent"
  - "taglist"
---
