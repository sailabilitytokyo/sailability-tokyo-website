# 06. 余裕があれば

- [ ] **翻訳の確認**: 英語・中国語のページ（トップ・セーリング体験会・About）を、できればその言語が分かる方に読んでもらう（AI の翻訳のため）
- [ ] **翻訳ページを増やす**（必要なら）: 小学生ヨット教室・会員募集など。予約用 Google フォームの英語版も必要か検討
- [ ] **スクリーンショット比較の基準画像を作る**: デザインと写真が固まったら、作業ブランチで Actions タブ > Update screenshots を実行（docs/operations.md 参照）
- [ ] **AI を持っていない人向けの更新手段**（引き継ぎの前に）:
  - Gemini CLI の GitHub Action（Google の無料 API キーで、Issue に書いた依頼を AI が PR にする）
  - Pages CMS（https://pagescms.org/ 、無料。フォーム入力で YAML / Markdown を編集できる）
- [ ] GA4 で `apply_junior_course` / `reserve_experience` を「キーイベント」に設定（docs/operations.md 参照）
- [ ] （任意）このパソコンで表示テストを動かすための準備: `! sudo npx playwright install-deps chromium`（今は一時的な回避策で動かしている）
