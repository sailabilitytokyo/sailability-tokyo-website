# AGENTS.md — AI エージェント向け作業ガイド

このファイルは、このリポジトリで作業する AI エージェント（Claude Code / Codex / Gemini CLI / GitHub Copilot など）向けのルールです。
人間向けの説明は [README.md](README.md)、設計の背景は [docs/architecture.md](docs/architecture.md) を参照してください。
（`CLAUDE.md` と `GEMINI.md` はこのファイルを読み込むだけのファイルです。ルールはこのファイルにだけ書いてください。）

## このリポジトリについて

一般社団法人セイラビリティ東京（Sailability Tokyo）の公式ウェブサイト（https://www.sailabilitytokyo.jp/）です。
障がいの有無・年齢・経験に関わらず誰もが楽しめるセーリング（ハンザ級ヨット）の体験会や小学生ヨット教室を、東京・豊洲で開催している団体です。

- **更新する人の多くはプログラミングをしません。** 依頼は「10月の体験会の日程を追加して」のような日本語で来ます。
- **運営費は 0 円が前提です。** 有料サービス・有料プランが必要になる変更は提案しないでください。
- 更新頻度は月1回程度。アクセスは平常時 10/日、イベント時 300/日程度。

## 技術スタック

| 役割 | 使っているもの | 補足 |
| --- | --- | --- |
| サイト生成 | [Astro](https://docs.astro.build/) 7（静的サイト） | Node.js 24（`.nvmrc`） |
| コンテンツ | Markdown（`src/content/`）と YAML（`src/data/`） | 形式は `src/content.config.ts` / `src/lib/data.ts` で検証 |
| デザイン | Summer Sky Theme v2（Claude Design から取り込み、`design/`） | 色・文字・余白は `src/styles/tokens.css` |
| スタイル | 素の CSS（`src/styles/global.css`） | CSS フレームワークは使わない |
| フォント・アイコン | Figtree＋Noto Sans JP（Google Fonts）、Lucide（`src/icons/` に SVG 同梱） | |
| テスト | Playwright（表示確認・スクリーンショット比較）＋ 自作チェックスクリプト（`scripts/`） | |
| ホスティング | Cloudflare Workers（静的アセット・無料プラン、Workers Builds で自動ビルド） | main へのマージで自動公開、PR ごとにプレビュー URL（PR にコメントされる） |
| CI・自動化 | GitHub Actions（`.github/workflows/`）＋ Dependabot | |
| アクセス解析 | Google Analytics 4 | 本番ドメインでのみ計測 |
| フォーム | Google フォーム（外部リンク） | |

## ディレクトリ構成

```
src/
  content/pages/<言語>/*.md   固定ページ（home, about, membership, sailing-experience, junior-sailing-courses, privacy-policy）
  content/news/<言語>/*.md    お知らせ（ファイル名: YYYY-MM-DD-英数字.md）
  data/site.yaml              団体情報・メニュー・SNS・スポンサー・フォームURL・GA設定
  data/schedule.yaml          体験会・イベントの日程（過去の日程は自動で非表示）
  i18n/                       言語設定と画面の固定文言
  views/ layouts/ components/ 表示テンプレート（普段の更新では触らない）
  lib/                        データ読み込み・構造化データ（SEO）
  styles/tokens.css           デザイントークン（色・文字・余白・影・動き）
  styles/global.css           部品のスタイル（ボタン・カード・ヘッダーなど）
  icons/                      Lucide アイコン（SVG）
  assets/brand/               ロゴ
  assets/photos/              写真（npm run photos で変換したもの）
public/                       そのまま公開するファイル（PDF・favicon・Cloudflare 設定 _headers/_redirects）
wrangler.jsonc                Cloudflare Workers の配信設定
scripts/                      チェック・写真変換・監視スクリプト
tests/                        Playwright テスト
design/                       デザイン仕様書（Claude Design から取り込んだもの。design.md がルール）
docs/                         人間向けドキュメント（更新手順・運用・設計記録）
todo/                         管理者（人間）がやるべき作業リスト（終わった項目は消す。記録は docs/architecture.md へ）
```

## よくある依頼と、触るファイル

詳しい手順は [docs/editing-guide.md](docs/editing-guide.md) にあります。まずそちらを読んでください。

| 依頼 | 触るファイル |
| --- | --- |
| 体験会の日程を追加・中止・満員にする | `src/data/schedule.yaml` |
| お知らせを書く | `src/content/news/ja/YYYY-MM-DD-xxx.md`（新規作成） |
| 小学生ヨット教室の募集を開始・終了する | `src/content/pages/ja/junior-sailing-courses.md`（本文・`summary`・`cta`） |
| 参加費を変える | `src/data/site.yaml` の `experience.price` と `sailing-experience.md` の本文の**両方** |
| スポンサーを追加する | `src/data/site.yaml` の `sponsors`（ロゴは `npm run photos -- --out src/assets/sponsors <ファイル>`） |
| 写真を追加する | `npm run photos -- <ファイル>` → frontmatter の `image` / `imageAlt` |
| 役員・連絡先・SNS を変える | `src/data/site.yaml` |
| リンク切れの Issue・「外部リンクの確認」が赤い | 該当のリンク（`src/data/site.yaml` か本文）を正しい URL に直し、`npm run build && npm run check:external` で確認 |
| トップページの見出し・安心ポイント・会員募集の文 | `src/content/pages/ja/home.md` の frontmatter（`hero` / `highlights` / `intro` / `membership`） |
| ページ上部の小見出し・リード文・タグ | 各ページの frontmatter（`eyebrow` / `badge` / `lead` / `tags`） |
| 当日の流れ・よくあるご質問・地図 | 各ページの frontmatter（`steps` / `faq` / `map`） |
| 翻訳ページの文言 | `src/content/pages/{en,zh-hans,zh-hant}/*.md`（日本語を変えたら一緒に） |

## 作業の進め方（必ず守る）

1. **main ブランチに直接コミット・プッシュしない。** 作業用ブランチを作り、プルリクエスト（PR）を出す。
2. 変更後に **`npm run verify`** を実行し、すべて成功することを確認する（型チェック・画像チェック・ビルド・リンク切れ・表示テスト）。
   - 表示テストには Chromium が必要（`npx playwright install chromium`）。実行できない環境では、その旨を PR に書き、CI の結果で確認する。
3. PR の説明は**プログラミングをしない人が読める日本語**で書く:
   - 何を変えたか（箇条書き）
   - 確認してほしいページ（PR に Cloudflare がコメントするプレビュー URL で見る場所）
   - 判断が必要な点・気になった点
4. CI が失敗したら、原因を調べて同じ PR で直す。
5. 依頼が曖昧なとき（日付・金額・名前など事実が不明なとき）は、推測で埋めずに質問する。

## やっていいこと

- 依頼された範囲のコンテンツ（Markdown / YAML）の追加・修正
- 誤字脱字の修正（ただし事実関係の変更は依頼がある場合のみ）
- 依頼に関連する SEO の改善（description の追加、見出し構造の整理、alt の追加）
- テストが失敗する原因の修正
- Dependabot の PR の確認・修正（メジャーアップデートで壊れた箇所の対応）
- `docs/` の手順書を、実際の手順に合わせて更新すること（手順や設定が変わったら必ず同じ PR で更新する）
- `todo/` の終わった項目を消すこと（決定事項や経緯は `docs/architecture.md` の「立ち上げの記録」に残す）

## やってはいけないこと

- **個人情報をリポジトリ・Issue・PR に書かない**（会員名簿、申込者の氏名・連絡先、子どもの名前など）。このリポジトリは**公開**されている。
- **位置情報（EXIF）付きの写真をコミットしない。** 写真は必ず `npm run photos` で変換してから追加する。
- **掲載の同意が確認できていない人物写真（特に子どもの顔がわかる写真）を追加しない。** 迷ったら追加せず質問する。Git の履歴に残るため、後から完全に消すのは難しい。
- パスワード・API キー・トークンをコミットしない（必要なら GitHub の Secrets を使う）。
- 有料サービス・有料プランが必要になる変更。
- 依頼なしのデザイン変更（色・フォント・レイアウト）。デザインを変えるときは [design/design.md](design/design.md) のルールに従う。
- 依頼なしのライブラリ追加。追加が必要な場合は理由を PR に書く（依存が増えるほど保守が大変になるため、素の CSS / 標準機能で済むならそうする）。
- テストを通すためにテストを削除・無効化すること（テストが間違っている場合は理由を PR に書いて直す）。
- スクリーンショットの基準画像（`tests/visual.spec.ts-snapshots/`）を、意図しない見た目の変化を隠すために更新すること。
- `public/_redirects` の既存の転送設定の削除（旧 URL からのアクセスが切れる）。
- URL（ファイル名）の変更。変える場合は `public/_redirects` に旧 URL からの転送を追加する。
- `CLAUDE.md` / `GEMINI.md` にルールを書くこと（このファイルに一本化する）。

## デザインのルール（抜粋。詳しくは design/design.md）

- 色・文字サイズ・余白は `src/styles/tokens.css` の変数（`var(--...)`）を使い、数値や色を直接書かない。
- **絵文字は使わない**（見出し・ボタン・お知らせすべて）。アイコンが必要なら `<Icon name="..." />`（`src/icons/`）。
- **黄色（主ボタン）は1画面にひとつ**。黄色を文字色に使わない。
- ロゴの鳥のマークを単体で使わない。ロゴの色を変えない。
- 本文は 17px 未満にしない。タップできる部分は 48px 以上。
- 動きは design.md §5「サイトの動き」の範囲で。バウンド・回転・パララックスは使わない。「動きを減らす」設定（`prefers-reduced-motion`）では動かさない。
- 文章はですます調、一文にひとつの事実。「当団体」「実施しております」「随時」は使わない。

## 文章のルール（サイト全体で統一する）

一般的な日本の Web サイトのように、短く読みやすい文章にする。

- 本文は「です・ます」調。本文の文は「。」で終える
- **見出し・ボタン・タグ・箇条書きの項目には「。」を付けない**（箇条書きの中で2文になる場合だけ、1文目に「。」を付ける）
- **読点「、」は1文に2つまで**。長くなる文は2つに分ける（1文40字前後が目安）
- 1行ずつ改行する詩のような書き方はしない。短い段落にまとめる
- 「！」は使わない（「？」は、利用者の声を引用するときだけ）
- 数字は半角（1,500円、15〜20分、13:00〜15:00）。範囲は「〜」（全角の「～」やダッシュ「–」は使わない）
- 括弧は全角「（）」、引用・強調は「」（“” は使わない）。並列は「・」
- 「当団体」「実施しております」「随時」「〜となります」は使わない
- **太字 `**...**` を「」や（）のすぐ外側に付けない**（表示されなくなる）。「**強調**」のように括弧の内側に付ける
- ハンザについては「ひっくり返らない（設計の）ヨット」と書いてよい（2026-09-23 確認済み）
- 日付・日程の箇条書きに番号付きリスト（1. 2. …）は使わない。「- 第1回：8月30日（日）」のように書く（数字が並んで見にくいため）

## コンテンツを書くときのルール

- **日本語が正本。** 翻訳があるのは **すべての固定ページ**（トップ・セーリング体験会・小学生ヨット教室・会員募集・About・プライバシーポリシー） × 英語（`en`）・簡体字（`zh-hans`）・繁体字（`zh-hant`）。
  - 日本語ページを変えたら、**同じ PR で3言語の翻訳も更新する**（`src/content/pages/<言語>/<ページ>.md`）。事実（料金・時間・条件・日程）が食い違わないように特に注意する。小学生ヨット教室の期の切り替えも翻訳ごと行う
  - About の翻訳は要点をまとめた版（安全性の詳しい説明は訳していない）
  - 画面の固定文言（ボタン名など）は `src/i18n/ui.ts` の4言語すべてに書く。`site.yaml` / `schedule.yaml` の文言は `ja:` / `en:` / `zh-hans:` / `zh-hant:` で書き分けられる（日本語だけでもよい。その場合は日本語が表示される）
  - 翻訳ページ内のリンクは `/en/sailing-experience` のように言語付きで書く
  - プライバシーポリシーの翻訳は参考訳（「日本語版が優先」と冒頭に明記）
  - 日本語以外のメニュー・フッターには、その言語に翻訳があるページだけが出る（日本語ページには飛ばさない）。お知らせは日本語のみのため、翻訳ページではメニューに出さず、フッターから「News (in Japanese)」として日本語の一覧にリンクする
  - 新しい固定ページを作るときは、3言語の翻訳も同じ PR で作る（作らないと、その言語のメニューに出ない）
- 固定ページ・お知らせには必ず `description`（検索結果に出る説明文、80〜120字程度）を書く。
- 見出しは `##` から始める（`#` はページタイトルとして自動で付くため本文では使わない）。
- 画像には内容がわかる `imageAlt`（代替テキスト）を書く。
- 日付は `YYYY-MM-DD`、時刻は `HH:MM`。曜日は自動で表示されるので書かなくてよい（本文中は除く）。
- Markdown の改行はそのまま改行として表示される（`.prose p { white-space: pre-line }`）。段落を分けるときは空行を入れる。
- サイト内リンクは `/sailing-experience` のように先頭 `/`・末尾スラッシュなしで書く。
- **YAML（frontmatter・`src/data/*.yaml`）で、カンマ `,` やコロン `:` を含む文字は `'...'` で囲む。** 例: `{ label: '参加費 1,500円', icon: japanese-yen }`。囲まないと途中で切れる。

## コマンド

```sh
npm ci                  # 依存関係のインストール（初回）
npm run dev             # 開発サーバー（http://localhost:4321）。AI はバックグラウンドで: npx astro dev --background
npm run verify          # 公開前チェック一式（check → build → check:links → test）
npm run check:external  # 外部リンク切れの確認（ビルド後。外部サイトにアクセスするので verify には含めない）
npm run photos -- <写真ファイル or フォルダ>   # 写真を縮小・EXIF 削除して src/assets/photos/ へ
node scripts/make-favicons.mjs                # ロゴからファビコン一式を作り直す（ロゴを差し替えたとき）
npm run test:update-screenshots               # スクリーンショット基準画像の更新（通常は CI の Update screenshots で行う）
```

## 参考ドキュメント

- Astro: https://docs.astro.build/ （コンテンツコレクション: /en/guides/content-collections/、多言語: /en/guides/internationalization/）
- Cloudflare Workers（静的アセット）: https://developers.cloudflare.com/workers/static-assets/ （`_headers` / `_redirects` もここ）
- 構造化データ（イベント）: https://developers.google.com/search/docs/appearance/structured-data/event
