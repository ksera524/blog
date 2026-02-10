---
# Common-Defined params
title: 'Local用K8sの技術選定'
date: 2024-09-27T22:23:42+09:00
description: "Local用K8sの技術選定" #記事の説明
categories: ["おうちk8s"]
tags: ["k8s"]
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

おうちk8sでk3dを利用する予定だったが、普通にk8sを利用することにした。
いくつか選択肢があるようなので比較していく。
あんまり差分はなさそうである。

## [kind（Kubernetes IN Docker）](https://kind.sigs.k8s.io/)
名前の通りk8sを実行するDockerを作成してくれる。
テスト用らしい。
kubectlは別途インストール。

"k8s kind"で検索したときの結果がmanifestのkindと混ざるのが面倒。
まだv1.0に至っていない。
k8sのバージョンが飛び飛びらしい。

## [minikube](https://minikube.sigs.k8s.io/docs/)
同じくLocal用k8sを作成してくれる。
最新のk8sをサポート(重要)
kubectlは同梱っぽい。
公式ドキュメントが読みやすい。

## 結論
minikubeでいいや～
検索性は大事
