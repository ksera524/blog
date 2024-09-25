---
# Common-Defined params
title: 'Planning'
date: 2024-09-25T16:02:00+09:00
description: "おうちk8sの再建計画をまとめる" #記事の説明
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

# おうちk8sの再作成ロードマップ
おうちk8sが死んでしまったので新しく作成するが、前回の失敗を踏まえて再作成する。

## 反省点

### そもそも死んだ理由
k8sが死んだのは単純にホストPCのストレージ容量不足だった。
1台にコントロールプレーンとワーカーノードを詰め込んだが、CPUなどはまだまだ余裕があった。
ストレージを圧迫した理由は下記。
1. HarborのImageの容量
2. PGOの容量
3. CronJobの成功・失敗時の保持数を設定していなかった（全件保持していた）

### 手作業が多かった
試行錯誤を重ねていたので、どういう設定だったか覚えていない。
HarborのTLS証明書周りなどは完全に忘れた。

### 課題
1. 2024/8からCloudflear Tunnnelsの容量制限に引っかかってしまい、Github ActionsでbuildしたDocker ImageをHarborに送信できなくなってしまった。
2. Argo CD、Cloudfreardはコンテナ管理されていなかった。
3. manifestは各アプリケーションのリポジトリで管理していた。

## 再建計画

### インフラ管理
k8sクラスタ自体はTerraformで管理し、作成・破壊を簡単にできるようにしておく。
Host OSのUbunstuの定期バージョンアップ、k8sのバージョンアップ、k8sのディストリビューションの変更を気軽にできるようにしたい。
Terraformで管理したいと思っているところ
1. k8sのディストリビューション（今回はk3dを使ってみるが、頃合いをみてk8sに変えてみたい）
2. サーバーノード、コントロールノードの管理
3. 外部SSDのPV,PVCの管理
4. Secret Manegerの管理

一方で、アプリケーションのプロビジョニング管理はAnsibleを利用したい。このあたりの使い分けは[先人に倣う](https://zenn.dev/zenogawa/articles/home_cloud_overview)
Ansibleでは主にk8sへのアプリケーションデプロイを担う。

### アプリケーション管理
やってみたい細かいアプリケーションの設定を書いておく
1. Let's Encryptをk8s上で稼働させて自己証明を使えるようにする。
2. Harborの証明書は上記で発行したものを使い、ストレージは外部SSDを利用する
3. Cloudfreardはコンテナで管理する
4. Github ActionsをSelf Hosted Runnerでk8s上に稼働させ、CI/CDも自己管理する（Cloudfrearの容量制限への対策でもある）
5. PGOはいったんやめて、TiDB Serverlessの無料枠を利用する

##　いつかやってみたいリスト
1. OpenStackを使った仮想マシン上にk8sを展開する
2. メインPC(win)の寿命(win11へのupdate不可)が2025年なので、2台目のサーバーとして使う。
3. 構成図を書く