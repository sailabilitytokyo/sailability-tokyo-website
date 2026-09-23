# 03. Cloudflare で仮公開（メンバー確認用 URL）

この段階ではドメインは変更しません（今の Google Sites はそのまま）。

## Cloudflare アカウントとプロジェクト（2026-09-23 完了）

- [x] Cloudflare の無料アカウントを作る
- [x] 「Workers & Pages」で GitHub の `sailabilitytokyo/sailability-tokyo-website` と連携（**Workers** として作成。Cloudflare が新規には Workers を推奨しているため）
- [x] 仮公開 URL で表示を確認: https://sailability-tokyo-website.noreply-sailabilitytokyo.workers.dev
- [x] 検索エンジンに載らない設定（`*.workers.dev` に `X-Robots-Tag: noindex`）… `public/_headers` で設定済み
- 「Protect with Cloudflare Access」は使わない（内容は公開情報で、メンバーにログインの手間をかけないため）

## 次にやること

- [ ] **ダミー画像のままであることを伝えたうえで**、仮公開 URL をメンバーに共有して感想を集める
- [ ] PR を作ったときに、Cloudflare からプレビュー URL のコメントが付くことを確認する（付かない場合は Workers & Pages > sailability-tokyo-website > Settings > Build で、本番以外のブランチのビルド（Preview / Non-production branch builds）が有効か確認）
- [ ] （任意）URL を短くする: Workers & Pages の右側「Account details」> **Subdomain** の「Change」で `noreply-sailabilitytokyo` を `sailabilitytokyo` などに変える（→ `sailability-tokyo-website.sailabilitytokyo.workers.dev`）。変えたら AI に伝えて docs を直す

## 補足

- 当初予定していた「毎日の自動再ビルド（デプロイフック）」は、Workers には同じ仕組みがないためやめました。過去の日程はブラウザ側で自動的に隠れるので、見た目上の問題はありません（docs/operations.md 参照）。
