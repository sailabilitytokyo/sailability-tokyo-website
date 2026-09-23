# Sailability Tokyo ウェブサイト

一般社団法人セイラビリティ東京の公式ウェブサイトのソースです。
https://www.sailabilitytokyo.jp/

## サイトを更新したい人へ

プログラミングの知識は不要です。

- **AI に頼む**（おすすめ）: Claude Code / Codex / Gemini CLI などで、このリポジトリを開いて「10月の体験会の日程を追加して」のように日本語で依頼します。AI は [AGENTS.md](AGENTS.md) のルールに従って作業します。
- **自分で直す**: GitHub の画面でファイルを開き、鉛筆アイコンから編集できます。

どちらの場合も、変更はプルリクエストとして作られ、**プレビュー URL で見た目を確認してからマージ（公開）**します。

| やりたいこと | 読むもの |
| --- | --- |
| 日程・お知らせ・写真などの更新 | [docs/editing-guide.md](docs/editing-guide.md) |
| 公開・監視・ライブラリ更新の仕組み | [docs/operations.md](docs/operations.md) |
| 技術構成と、なぜそうしたか | [docs/architecture.md](docs/architecture.md) |
| 管理者がやるべき作業 | [todo/](todo/README.md) |

## 構成（概要）

- [Astro](https://astro.build/) で作った静的サイトを、Cloudflare Workers（無料）で公開しています。
- 文章は `src/content/`（Markdown）、日程や団体情報は `src/data/`（YAML）にあります。
- 運営費は 0 円（ドメイン代を除く）です。

## 開発者向け

```sh
nvm use          # Node.js 24
npm ci
npm run dev      # http://localhost:4321
npm run verify   # 型チェック・ビルド・リンク切れ・表示テスト
```

## 著作権

サイトの文章・写真・ロゴの著作権は一般社団法人セイラビリティ東京に帰属します。無断転載はご遠慮ください。
