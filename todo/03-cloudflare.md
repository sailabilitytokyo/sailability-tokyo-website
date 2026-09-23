# 03. Cloudflare Pages で仮公開（メンバー確認用 URL）

02（GitHub へのプッシュ）が終わってから行います。この段階ではドメインは変更しません（今の Google Sites はそのまま）。

## Cloudflare アカウントとプロジェクト

- [ ] https://dash.cloudflare.com/sign-up で無料アカウントを作る（団体用のメールアドレス推奨: sailabilitytokyo@gmail.com など）
- [ ] 「Workers & Pages」> 作成 > **Pages** > 「Git に接続（Import an existing Git repository）」
  - GitHub を連携し、`sailabilitytokyo/sailability-tokyo-website` を選ぶ（リポジトリへのアクセスはこのリポジトリだけに限定して OK）
  - プロジェクト名: `sailability-tokyo`（→ URL が `https://sailability-tokyo.pages.dev` になる）
  - 本番ブランチ: `main`
  - フレームワーク プリセット: **Astro**
  - ビルドコマンド: `npm run build`
  - ビルド出力ディレクトリ: `dist`
  - 環境変数: `NODE_VERSION` = `24`
- [ ] デプロイが終わったら `https://sailability-tokyo.pages.dev` を開いて表示を確認
- [ ] この URL をメンバーに共有して感想を集める（検索エンジンには載らない設定になっています）

※ Cloudflare の画面が変わっていて「Pages」が見つからない場合は、AI に画面のスクリーンショットを渡して相談してください（Workers の静的サイト機能でも同じことができます）。

## 毎日の自動再ビルド（任意・推奨）

- [ ] Pages プロジェクト > 設定 > ビルド > **デプロイフック** を追加（名前: `daily-rebuild`、ブランチ: `main`）→ 表示された URL をコピー
- [ ] GitHub のリポジトリ > Settings > Secrets and variables > Actions > **New repository secret**
  - Name: `CLOUDFLARE_DEPLOY_HOOK`
  - Secret: コピーした URL

## プレビュー URL を PR に表示

- [ ] Cloudflare と GitHub の連携が済んでいれば、PR を作ると自動でプレビュー URL がコメントされます。表示されない場合は Pages プロジェクト > 設定 > ビルド > 「プレビューデプロイ」が有効か確認
