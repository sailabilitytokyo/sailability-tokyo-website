# 運用手順

公開・監視・ライブラリ更新など、日々の更新以外の運用についてです。

## 公開の仕組み

- **main ブランチにマージされると、Cloudflare（Workers Builds）が自動でビルドして公開**します（数分）。
- PR を作ると、Cloudflare がプレビュー URL を発行し、PR にコメントします。URL はブランチ名から作られます（例: ブランチ `docs/foo` → `https://docs-foo-sailability-tokyo-website.noreply-sailabilitytokyo.workers.dev`）。
  - プレビューでは、存在しないページが自作の404ページではなく「Not found」の文字だけになります（Cloudflare のプレビュー機能がベータ版のため。本番では正しく表示される）。
  - Cloudflare 側のビルドが失敗したときは、PR のチェック「Workers Builds」の Details からログを開き、AI に渡してください。
- 仮公開 URL: https://sailability-tokyo-website.noreply-sailabilitytokyo.workers.dev （本番ドメイン接続までの間）
- 配信の設定はリポジトリの `wrangler.jsonc`（404 ページ・.html なし URL・プレビュー URL）と `public/_headers`・`public/_redirects`。
- Cloudflare のビルド設定（Workers & Pages > sailability-tokyo-website > Settings > Build）:

| 項目 | 値 |
| --- | --- |
| フレームワーク | Astro |
| ビルドコマンド | `npm run build` |
| 出力ディレクトリ | `dist` |
| 環境変数 | `NODE_VERSION` = `24` |

## GitHub の設定（2026-09-23 設定済み）

| 設定 | 場所 | 内容 |
| --- | --- | --- |
| main ブランチの保護 | Settings > Rules > Rulesets「main を保護」 | PR 経由でのみ変更可（承認は不要）、必須チェック `ビルドと表示確認`、強制プッシュ・削除の禁止 |
| 自動マージ | Settings > General > Pull Requests | Allow auto-merge、マージ後に作業ブランチを自動削除 |
| セキュリティ | Settings > Advanced Security | Dependabot alerts / security updates、Secret scanning / Push protection |
| 外部アプリの制限 | Organization の Settings > Third-party access | OAuth アプリの制限は解除済み（`gh` や AI ツールから操作できるようにするため） |
| ラベル | Issues > Labels | `dependencies`（Dependabot 用）、`monitor`（死活監視用） |

- main を保護しているため、**AI も人も、変更は必ず作業用ブランチ → PR → CI 成功 → マージ**の順で行います。

## ライブラリの自動更新（Dependabot）

| 更新の種類 | 動作 |
| --- | --- |
| マイナー・パッチ更新（例: 7.3.4 → 7.4.0） | 毎週月曜に PR 作成 → CI が成功すれば**自動でマージ・公開** |
| メジャー更新（例: 7.x → 8.0） | PR が作られるが自動マージしない。AI に確認を依頼する |
| 脆弱性の修正 | 見つかり次第 PR 作成（Settings > Code security で Dependabot security updates を ON） |

- 公開から 7 日未満のバージョンは採用しない設定です（公開直後の不具合や乗っ取られたパッケージを避けるため）。
- **一時的に止めている更新**: TypeScript のメジャー更新（型チェック用の `@astrojs/check` が TypeScript 7 に未対応のため。`.github/dependabot.yml` の `ignore`）。対応したら `ignore` を消す。
- CI では、全ページの表示・JavaScript エラー・スマホのメニュー動作・**スクリーンショットの見た目の比較**を確認するので、ライブラリ更新で見た目や動きが壊れた場合はマージされずに PR が残ります。

### メジャー更新の PR が来たら

AI に次のように依頼します。

> Dependabot の PR #番号 を確認して。変更履歴（リリースノート）を読んで、このサイトに影響があれば修正して、CI が通るようにして。

### CI が失敗した Dependabot の PR が残っていたら

> Dependabot の PR #番号 の CI が失敗しているので、原因を調べて直して。

## スクリーンショット比較（見た目のテスト）

- 各ページの見た目を「基準画像」（`tests/visual.spec.ts-snapshots/`）と比べ、1% 以上違うと失敗します。
- 日程・お知らせ一覧は日付で内容が変わるため、比較から除外しています。
- **デザインを意図的に変えたとき**は、その PR のブランチで Actions タブ >「Update screenshots」> Run workflow を実行すると、基準画像が更新されて PR に追加されます（その後、PR にもう一度変更をプッシュするか、CI を手動で再実行してください）。
- 基準画像は CI（Linux）で作る必要があります（パソコンによってフォントの描画が異なるため）。
- 基準画像がまだ無い間は、このテストはスキップされます。

## 毎朝の監視・外部リンクの確認

毎朝 9:00 に GitHub Actions の「Monitor」が次を確認し、問題があれば `monitor` ラベルの Issue を作ります（GitHub からメールが届く）。復旧すると自動で閉じます。

| 確認内容 | いつから |
| --- | --- |
| **外部リンク切れ**（スポンサー・SNS・予約フォーム・お知らせ本文などのリンク。`npm run check:external`） | 今から |
| 公開中サイトの全ページが表示できるか、Google Analytics のタグ、予約フォームが日程掲載中に「回答受付終了」になっていないか、旧ブログ（`scripts/monitor.mjs`） | リポジトリ変数 `MONITOR_BASE_URL` を設定してから（本番公開後） |

- 外部リンクは PR ごとにも「外部リンクの確認」として実行されます。外部サイトの一時的な不調で PR が止まらないよう、**マージの必須条件にはしていません**。赤くなったら内容を確認してください。
- 404・接続できない等は「リンク切れ」、401・403・429（ロボットからのアクセスを断っているだけのことが多い）は「注意」として表示されます。
- リンク切れの Issue が来たら、AI に「Issue #番号 のリンク切れを直して」と依頼します（リンク先を新しい URL に差し替える、など）。

## 過去の日程の扱い

- 日程表・予約バーは、ブラウザ側で「今日より前の日程」を隠します。サイトを作り直さなくても、過ぎた日程は表示されません。
- すべての日程が過ぎたら「現在ご案内できる開催日はありません」と表示されます。
- 検索エンジン向けのイベント情報（構造化データ）は、次にサイトを更新したときに最新になります。

## Google Analytics

- 管理画面: https://analytics.google.com/ （測定 ID: `G-M389XQJK35`）
- 申込ボタンのクリック数は、GA4 の「レポート > エンゲージメント > イベント」で `reserve_experience` / `apply_junior_course` を見ます。
- 小学生ヨット教室の募集期間中は、`apply_junior_course` を「キーイベント」に設定すると、流入元ごとの申込クリック数が見やすくなります。

## Google Search Console（検索エンジン）

- 本番公開後に登録し、サイトマップ `https://www.sailabilitytokyo.jp/sitemap-index.xml` を送信します（todo/05 参照）。
- 検索結果での表示状況・エラー（ページがインデックスされない等）を確認できます。

## ローカルでの開発（任意）

```sh
nvm use            # Node.js 24
npm ci
npm run dev        # http://localhost:4321
npm run verify     # 公開前チェック一式
```

表示テストを実行するには `npx playwright install --with-deps chromium` が必要です（Linux では sudo が必要）。
表示テストはテスト専用のポート（4329）でビルド済みのサイトを開くので、開発サーバー（4321）を動かしたままでも実行できます。
