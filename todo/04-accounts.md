# 04. GitHub・Cloudflare のアカウントまわりの残り

## GitHub

- [ ] 個人アカウント（d-zenju）の Settings > Emails で **Keep my email addresses private** と **Block command line pushes that expose my email** を ON（コミットでメールアドレスが公開されないように）
- [ ] （推奨）信頼できるメンバーをもう1人、Organization `sailabilitytokyo` の **Owner** に追加する（オーナーが1人だけだと、その人がログインできなくなったときに管理できない）
- [ ] 誤って作った個人アカウント `sailability-tokyo` を削除するか Organization に変換する（そのまま残すと紛らわしい。残せば他人に名前を取られない利点はある）
- 他のメンバーを招待するときは、Organization の People から招待。役割は Member、リポジトリには Write 権限で十分

## Cloudflare

- [ ] **PR ごとのプレビュー用ビルドが失敗している**ので、ログを AI に見せる（Workers & Pages > sailability-tokyo-website > Deployments / Builds で失敗したビルドを開き、エラー部分をコピー）
- [ ] （任意）URL を短くする: Workers & Pages の右側「Account details」> **Subdomain** の「Change」で `noreply-sailabilitytokyo` を `sailabilitytokyo` などに変える（→ `sailability-tokyo-website.sailabilitytokyo.workers.dev`）。変えたら AI に伝えて docs を直す
