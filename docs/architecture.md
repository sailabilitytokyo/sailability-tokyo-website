# 設計と決定の記録

このサイトの技術構成と、「なぜそうしたか」の記録です。構成を変えるときは、このファイルにも追記してください。

## 前提条件（2026年9月時点）

| 項目 | 内容 |
| --- | --- |
| 予算 | **月額 0 円**（ドメイン代のみ。バリュードメインで年払い） |
| 更新頻度 | 月1回程度 |
| アクセス | 平常時 約10/日、イベント時 約300/日（年2回程度） |
| 更新する人 | プログラミングをしない人。AI に指示して更新する。将来は AI を持っていない人に引き継ぐ可能性あり |
| 旧サイト | Google Sites（無料）＋ ブログは Blogger（blog.sailabilitytokyo.jp） |

## 全体像

```
更新する人 ──（AI に日本語で依頼 / GitHub の画面で直接編集）
   ↓
GitHub（sailabilitytokyo 組織の公開リポジトリ）
   ├─ プルリクエスト ──→ GitHub Actions: 公開前チェック（ビルド・リンク切れ・表示テスト）
   │                 └─→ Cloudflare Workers Builds: プレビュー URL を自動発行し PR にコメント（検索エンジンには載らない）
   └─ main にマージ ──→ Cloudflare Workers Builds: 本番サイトに自動公開
                        www.sailabilitytokyo.jp

毎日: GitHub Actions が 9:00 に死活監視
毎週: Dependabot がライブラリ更新 PR を作成 → CI が通れば自動マージ
```

## 決定の記録

### 1. サイト生成: Astro（静的サイト）

- **決めたこと**: Astro で HTML を事前生成する静的サイトにする。
- **理由**:
  - 静的サイトはサーバー不要で、無料のホスティングで公開でき、落ちにくく、攻撃される箇所も少ない。
  - 文章・日程を Markdown / YAML でコードと分けて管理でき、AI も人間も編集しやすい。
  - 書き方の誤り（日付の形式・必須項目の抜けなど）をビルド時に検出でき、壊れたまま公開されない。
  - 多言語対応（`/en/` など）が標準機能で用意されている。
  - 利用者が多く、どの AI もよく知っている。
- **見送った案**: 素の HTML（ページごとにヘッダー等が重複し、AI の編集ミスが起きやすい）、WordPress（サーバー費用と保守が必要）、Google Sites の継続（デザインの自由度・AI による更新ができない）。

### 2. ホスティング: Cloudflare Workers（静的アセット・無料プラン）

- **理由**: 団体利用でも無料、静的ファイルの配信は無制限、**PR ごとにプレビュー URL が出て PR にコメントされる**（コードが読めない人でも公開前に見た目を確認できる）。
- 当初は Cloudflare Pages の予定だったが、Cloudflare が新規には Workers を推奨しているため、Workers（Workers Builds で GitHub と連携）で作成した（2026-09-23）。`npm run build` の出力（`dist/`）を配信するだけなので、Pages とほぼ同じ。`_headers` / `_redirects` もそのまま使える。配信の設定はリポジトリの `wrangler.jsonc` に書いている。
- **見送った案**: GitHub Pages（プレビュー URL がない）、Vercel Hobby（非商用・個人利用限定の規約）、Netlify（無料枠の条件が変わりやすい）。

### 3. リポジトリ: GitHub の団体用 Organization・公開リポジトリ

- `sailabilitytokyo/sailability-tokyo-website`（Organization の種類は「A business or institution」、連絡先は団体のメールアドレス）

- **理由**: 個人アカウントに紐づけないことで引き継ぎやすくする。公開リポジトリは GitHub Actions が無料で使い放題。サイトの内容はもともと公開情報。
- **注意点**（AGENTS.md の「やってはいけないこと」に反映済み）:
  - 個人情報を書かない（Issue / PR も公開される）
  - 写真の位置情報（EXIF）を消す（`npm run photos`、CI でもチェック）
  - 掲載同意のない人物写真を入れない（Git の履歴から完全に消すのは難しい）

### 4. AI に依存しすぎない構成

- AI 向けのルールは **`AGENTS.md` に一本化**（Claude Code は `CLAUDE.md`、Gemini CLI は `GEMINI.md` から読み込む。Codex・GitHub Copilot は `AGENTS.md` を直接読む）。
- 手順書（`docs/editing-guide.md`）は人間も AI も読める普通の文章で書く。
- AI が使えない人でも、GitHub の画面で YAML / Markdown を直接編集できる。将来 Pages CMS（無料・フォーム入力で編集）を追加する余地もある。

### 5. コンテンツの持ち方

- **日程は YAML のデータ**（`src/data/schedule.yaml`）にし、トップページ・体験会ページ・検索エンジン向けのイベント情報を自動生成する。旧ブログの「毎月の体験会のご案内」記事を書く手間をなくすため。
- **お知らせ**は Markdown ファイル（1件1ファイル）。
- 旧ブログ（Blogger）の過去 43 記事は移行せず、アーカイブとして残す（リンク切れを防ぎ、0 円・手間なし）。お知らせ一覧からリンクしている。

### 6. URL

- 旧 Google Sites と同じ URL（`/about`、`/sailing-experience` など、末尾スラッシュなし）を維持する。検索エンジンの評価と外部からのリンクを引き継ぐため。
- 旧 URL のうち `/home` → `/`、`/blog` → `/news` は `public/_redirects` で 301 転送する。

### 7. 多言語

- 日本語が正本（URL にプレフィックスなし）。英語 `/en/`、簡体字中国語 `/zh-hans/`、繁体字中国語 `/zh-hant/` を用意している（中国本土からの訪問者が多い想定のため簡体字を優先）。
- 翻訳ファイル（`src/content/pages/<言語>/<ページ>.md`）を置いたページだけが生成される。翻訳がない言語はメニューにも出ない。
- 翻訳対象は観光客向けのページ（トップ・セーリング体験会・About）を優先する。

### 8. SEO（検索エンジン対策）

- ページごとの `title` / `description` / canonical URL / OGP（SNS 共有時の表示）
- 構造化データ（JSON-LD）: 団体情報（SportsOrganization）、体験会の日程（Event: 日時・場所・参加費）、お知らせ（NewsArticle）。Google 検索でイベントとして表示される可能性がある。
- サイトマップ（`/sitemap-index.xml`）と robots.txt を自動生成。多言語ページには hreflang を出力。
- 仮公開・プレビュー URL（`*.workers.dev`）には `X-Robots-Tag: noindex` を付け、検索結果に重複して出ないようにしている（`public/_headers`）。
- 旧 URL を維持し、変更したものは 301 転送。
- 画像は Astro が自動で WebP 化・サイズ最適化。静的サイトなので表示が速い（Core Web Vitals に有利）。

### 9. アクセス解析: Google Analytics 4（継続）

- 測定 ID は `src/data/site.yaml` の `analytics.ga4`。
- **本番ドメインでのみ計測**（プレビューやローカルでの確認作業がデータに混ざらない）。
- 申込ボタンなどのクリックを GA4 のイベントとして送る（`data-track` 属性）:

| イベント名 | 内容 |
| --- | --- |
| `reserve_experience` | セーリング体験会の「予約する」ボタン |
| `apply_junior_course` | 小学生ヨット教室の申込ボタン（募集期間中のみ表示） |
| `social_click` | Instagram / YouTube へのリンク |

- Google フォームは別サイトのため、**実際に送信されたかは GA では計測できない**（フォームの回答数で確認する）。

### 10. 品質保証と自動化

| 仕組み | いつ | 何をする |
| --- | --- | --- |
| CI（`ci.yml`） | PR・main へのプッシュ | 型チェック、画像の EXIF チェック、ビルド、リンク切れ、全ページの表示テスト（PC・スマホ）、スクリーンショット比較 |
| Dependabot（`dependabot.yml`） | 毎週月曜 | ライブラリ更新の PR を作成（公開後7日以上経ったバージョンのみ） |
| 自動マージ（`dependabot-automerge.yml`） | Dependabot の PR | マイナー・パッチ更新は CI が通れば自動マージ。メジャー更新は人か AI が確認 |
| 外部リンクの確認（`ci.yml` の別ジョブ） | PR・main へのプッシュ | スポンサー・SNS などの外部リンク切れを確認（外部サイトの不調で止まらないよう、マージの必須条件にはしない） |
| 監視（`monitor.yml`） | 毎日 9:00 | 外部リンク切れ（常に）と、公開中サイトの全ページ・GA タグ・予約フォーム・旧ブログ（本番公開後）を確認し、問題があれば Issue を作成 |

- **過去の日程の非表示**: サイトは更新（ビルド）した日の日付で作られるため、その後に過ぎた日程はブラウザ側の JavaScript で隠す。すべて過ぎたら「現在ご案内できる開催日はありません」を表示する（テストあり）。Workers Builds には外部から再ビルドを起動する仕組み（Pages のデプロイフック）がないため、毎日の再ビルドはやめた。検索エンジン向けのイベント情報は次の更新時に最新になる。
- **依存ライブラリは最小限にする方針**。CSS フレームワークや UI ライブラリは使わない（更新の手間と壊れるリスクを減らすため）。Markdown の改行も、プラグインではなく CSS で対応している。
- GitHub は、リポジトリに 60 日間更新がないと定期実行ワークフローを止める。Dependabot の自動マージで定期的に更新が入るため、通常は問題ない。止まった場合は Actions タブから再開する。

### 11. デザイン

- Claude Design で作ったデザインシステム「Summer Sky Theme v2」を取り込んだ（`design/`）。色・文字・余白などの値（トークン）は `src/styles/tokens.css` にそのまま移し、部品は React を使わず素の CSS と Astro コンポーネントで作り直した（依存を増やさないため）。
- フォントは Google Fonts（Figtree＋Noto Sans JP、無料）から読み込む。読み込めない環境では OS の日本語フォントで表示される。
- アイコンは Lucide（ISC ライセンス）の SVG を `src/icons/` に同梱し、ビルド時に埋め込む（実行時に外部から取得しない）。
- デザイン見本にあった料金・所要時間などの事実は仮のもので、サイトには確認済みの事実（一律1,500円・15〜20分・前期/後期 各全6回）を載せている。

## 立ち上げの記録（2026-09-23）

TODO から消した作業・決定の経緯です。

### 事実の確認（デザイン見本との食い違い）

Claude Design の見本には仮の事実が含まれていたため、次のとおり確認してサイトに反映した。

| 項目 | 確認した内容 |
| --- | --- |
| 体験会の参加費 | 一律 1,500円（見本の「予約1,000円／当日1,500円」は誤り） |
| 1回の乗船時間 | 15〜20分（見本の「20分」は誤り） |
| 予約 | 事前予約のほか、当日も空きがあれば乗船できる |
| ペット | 体験会もペットと一緒に乗船できる |
| 小学生ヨット教室 | 前期・後期制で各全6回。2026年後期（8〜11月）を開講中。URL は固定し、期ごとに差分だけ更新する |

### 移行時に変えた点（旧 Google Sites / Blogger から）

- 予約フォームは 2 つの短縮 URL が同じフォームを指していたため、`forms.gle/F7Vif…` に統一。旧ブログの「メールで予約」の記述はやめ、Google フォームに統一
- トップの Instagram・YouTube の埋め込みは外し、リンクにした
- About の出典 PDF（旧 WordPress 時代の URL）はリンク切れだったため、出典の文言だけ残した
- 英文の誤り「Sailability Tokyo is embraces」を「embraces」に修正
- スポンサーの s4e.org（Sailing For Everyone Foundation）はリンク切れのため、hansasailing.com（Hansa Sailing）に差し替え
- スポンサー名・並び順は現行の表記のままで確認済み
- 夢の島マリーナのサイトは `yumenoshima-marina.subaru-kougyou.jp`（接続不可になっていた）から `yumenoshima-marina.com` に移っていたため差し替え。これを機に外部リンクの自動確認を追加
- 小学生ヨット教室ページの見出しの絵文字は、デザインの方針（絵文字を使わない）に合わせて外した
- フッターの役員名の表記（「– Jiro Fujiwara –」形式）はそのまま移行
- 場所の英語表記（Toyosu Gururi Park Pier など）は仮の訳。英語版を作るときに確認する

### アカウントまわり

- Claude Design のデザインは `/design-login` で取り込んだ。ロゴは取り込めたが、写真は 1 ファイル 256KB の上限で取り込めず、ダミー画像にしている
- GitHub の Organization 作成で「Your browser did something unexpected」が続き、誤って個人アカウント `sailability-tokyo` を作成。Organization は `sailabilitytokyo` で作成した
- 作成直後に Organization と上記アカウントが外から 404 になった（不正利用対策の誤判定とみられる）。GitHub サポートに問い合わせ、同日中に解除された
- Organization の「OAuth アプリの制限」が有効だと `gh` / git から書き込めないため、制限を解除した
- Cloudflare は Pages ではなく Workers（Workers Builds）で作成された。Pages 向けだった設定（検索除外・毎日の再ビルド）を Workers 向けに直した
- PR ごとのプレビュー（`npx wrangler preview`）には `wrangler.jsonc` の `"previews": {}` が必要だった（ないとビルドが失敗する）
- 「Protect with Cloudflare Access」は使わない（内容は公開情報で、メンバーにログインの手間をかけないため）

## 依存ライブラリ一覧

| ライブラリ | 用途 |
| --- | --- |
| `astro` | サイト生成 |
| `@astrojs/sitemap` | サイトマップ生成 |
| `@astrojs/check` / `typescript` | 型チェック |
| `sharp` | 画像の最適化・写真変換スクリプト |
| `yaml` | `src/data/*.yaml` の読み込み |
| `@playwright/test`（開発用） | 表示テスト |

※ Cloudflare への公開には `wrangler`（Cloudflare 側のビルド環境で `npx` により実行）を使う。リポジトリの依存には入れていない。
