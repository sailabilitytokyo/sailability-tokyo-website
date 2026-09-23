# 06. 本番公開（ドメイン切り替え）

メンバーの確認が終わり、デザイン・内容が固まってから行います。作業は 30 分〜1 時間程度、切り替え中も数時間は旧サイトと新サイトが混在して見えることがあります。

## 事前準備

- [ ] `src/assets/photos/` のダミー画像（DUMMY PHOTO）がすべて本物の写真に差し替わっている

- [ ] バリュードメインのコントロールパネルにログインできることを確認
- [ ] 今の DNS 設定をメモ（スクリーンショット）しておく
  - 2026年9月時点: `www` → `ghs.googlehosted.com`（Google Sites）、`blog` → `ghs.google.com`（Blogger）、ルート → バリュードメインの転送サービス、メール（MX）なし

## DNS を Cloudflare に移す

- [ ] Cloudflare のダッシュボード >「ドメインを追加」> `sailabilitytokyo.jp` > **Free** プラン
- [ ] Cloudflare が既存の DNS レコードを読み込むので、**`blog` の CNAME（ghs.google.com）が入っていること**を確認（旧ブログを残すため。プロキシは「DNS のみ（灰色の雲）」にする）
- [ ] Cloudflare に表示されたネームサーバー 2 つを、バリュードメインの「ネームサーバーの変更」に設定（`dnsv.jp` から置き換え）
- [ ] Cloudflare から「アクティブになりました」のメールが来るまで待つ（数分〜最大 24 時間）

## 新サイトにドメインをつなぐ

- [ ] Workers & Pages > `sailability-tokyo-website` > Settings > **Domains & Routes** > Add > Custom domain で `www.sailabilitytokyo.jp` を追加
- [ ] 同じく `sailabilitytokyo.jp`（www なし）も追加し、www へ転送する設定にする
  （Cloudflare の「リダイレクトルール」で `sailabilitytokyo.jp/*` → `https://www.sailabilitytokyo.jp/$1`（301）でも可）
- [ ] https://www.sailabilitytokyo.jp/ を開いて新サイトが表示されることを確認
- [ ] 旧 URL（`/home`、`/blog`、`/about` など）が正しく表示・転送されることを確認
- [ ] https://blog.sailabilitytokyo.jp/ （旧ブログ）が引き続き表示されることを確認

## 公開後の設定

- [ ] Google Analytics のリアルタイムレポートで、自分のアクセスが計測されていることを確認
- [ ] GitHub > Settings > Secrets and variables > Actions > **Variables** に `MONITOR_BASE_URL` = `https://www.sailabilitytokyo.jp` を追加（死活監視が動き始める）
- [ ] Actions タブ > Monitor > Run workflow で、監視が成功することを確認
- [ ] [Google Search Console](https://search.google.com/search-console) にドメインを登録（Cloudflare の DNS に TXT レコードを追加して所有権を確認）→ サイトマップ `https://www.sailabilitytokyo.jp/sitemap-index.xml` を送信
- [ ] Google Sites 側: しばらく（1〜2か月）残してから非公開にする。**Google Sites の「カスタムドメイン」設定は外しておく**
- [ ] Blogger 側: ブログのトップに「新しいお知らせは https://www.sailabilitytokyo.jp/news へ」という案内を追加するとよい
- [ ] Google ビジネスプロフィールや SNS のプロフィールに載せているサイト URL が正しいか確認
