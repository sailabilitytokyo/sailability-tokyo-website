# 02. GitHub の準備

## アカウントと Organization

- [x] GitHub アカウントを作る（既にあれば不要）
- [ ] コミットにメールアドレスが公開されないようにする: Settings > Emails で **Keep my email addresses private** と **Block command line pushes that expose my email** を ON
- [x] Organization を作る: 右上の「+」> New organization > **Free** プラン
  - 名前: `sailabilitytokyo`（`sailability-tokyo` は誤って個人アカウント名として取得済みのため）
  - Contact email: `sailabilitytokyo@gmail.com`（団体のアドレス）
  - This organization belongs to: **A business or institution** → 名前「一般社団法人セイラビリティ東京」
- [ ] （後で）誤って作った個人アカウント `sailability-tokyo` を Organization に変換するか削除する（残す場合は他人に名前を取られない代わりに、紛らわしいので注意）
- [ ] （推奨）信頼できるメンバーをもう1人 Owner に追加する（オーナーが1人だけだと、その人がログインできなくなったときに管理できない）
- [x] Organization にリポジトリを作る: 名前 `sailability-tokyo-website`、**Public**、README などは追加しない（空で作る）

## 【対応中】Organization が 404 になる問題（2026-09-23）

Organization `sailabilitytokyo` と、誤って作った個人アカウント `sailability-tokyo` が、他の人から 404 に見える状態です。
GitHub の不正利用対策で誤ってフラグが付いた可能性が高いため、GitHub サポートにチケットを作成済みです。

- [x] GitHub サポートにチケットを作成（返事は d-zenju のメールアドレスに届く）
- [ ] 解除されたら AI に「GitHub の制限が解除された」と伝える（未プッシュのコミットをプッシュし、下の設定に進む）
- [ ] 返事が来ない・時間がかかる場合は、個人アカウント `d-zenju` にリポジトリを置いて先に進め、解除後に Organization へ移す（Transfer）

## このパソコンから GitHub に接続

（2026-09-23 完了。Organization の Third-party access で OAuth アプリの制限を解除済み。これをしないと `gh` / git から Organization のリポジトリに書き込めない）

- [x] Claude Code で `! gh auth login` を実行（GitHub.com → HTTPS → ブラウザでログイン）
- [x] 終わったら AI に「GitHub にログインした。リポジトリにプッシュして」と伝える（AI が初回コミットとプッシュを行います）

## リポジトリの設定（プッシュ後）

- [ ] Settings > General > Pull Requests:
  - **Allow auto-merge** を ON（ライブラリ更新の自動マージに必要）
  - **Automatically delete head branches** を ON（マージ後の作業ブランチを自動で削除）
- [ ] Settings > Rules > Rulesets（または Branches）で main ブランチを保護:
  - Require a pull request before merging（承認数は 0 で OK。1人運用のため）
  - Require status checks to pass → `ビルドと表示確認` を追加
  - Block force pushes
- [ ] Settings > Code security（Advanced Security）:
  - **Dependabot alerts** を ON
  - **Dependabot security updates** を ON
  - **Secret Protection / Push protection** を ON（パスワード等の誤コミットを防ぐ。公開リポジトリは無料）
- [ ] Settings > Actions > General > Workflow permissions:
  - **Allow GitHub Actions to create and approve pull requests** は OFF のままで OK

## 他のメンバーを招待する場合

- [ ] Organization の People から招待。役割は Member、リポジトリには **Write** 権限で十分です。
