# 02. GitHub の準備

## アカウントと Organization

- [ ] GitHub アカウントを作る（既にあれば不要）
- [ ] コミットにメールアドレスが公開されないようにする: Settings > Emails で **Keep my email addresses private** と **Block command line pushes that expose my email** を ON
- [ ] Organization を作る: 右上の「+」> New organization > **Free** プラン
  - 名前: `sailabilitytokyo`（`sailability-tokyo` は誤って個人アカウント名として取得済みのため）
  - Contact email: `sailabilitytokyo@gmail.com`（団体のアドレス）
  - This organization belongs to: **A business or institution** → 名前「一般社団法人セイラビリティ東京」
- [ ] （後で）誤って作った個人アカウント `sailability-tokyo` を Organization に変換するか削除する（残す場合は他人に名前を取られない代わりに、紛らわしいので注意）
- [ ] （推奨）信頼できるメンバーをもう1人 Owner に追加する（オーナーが1人だけだと、その人がログインできなくなったときに管理できない）
- [ ] Organization にリポジトリを作る: 名前 `sailability-tokyo-website`、**Public**、README などは追加しない（空で作る）

## このパソコンから GitHub に接続

- [ ] Claude Code で `! gh auth login` を実行（GitHub.com → HTTPS → ブラウザでログイン）
- [ ] 終わったら AI に「GitHub にログインした。リポジトリにプッシュして」と伝える（AI が初回コミットとプッシュを行います）

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
