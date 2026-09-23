# 06. 余裕があれば

- [ ] **翻訳の確認**: 英語・中国語のページ（全ページ。特に小学生ヨット教室・会員募集の金額や日程）を、できればその言語が分かる方に読んでもらう（AI の翻訳のため）
- [ ] **予約用 Google フォームの英語版**が必要か検討（今は日本語のフォームのみ）
- [ ] **スクリーンショット比較の基準画像を作る**: デザインと写真が固まったら、作業ブランチで Actions タブ > Update screenshots を実行（docs/operations.md 参照）
- [ ] **AI を持っていない人向けの更新手段**（引き継ぎの前に）:
  - Gemini CLI の GitHub Action（Google の無料 API キーで、Issue に書いた依頼を AI が PR にする）
  - Pages CMS（https://pagescms.org/ 、無料。フォーム入力で YAML / Markdown を編集できる）
- [ ] GA4 で `apply_junior_course` / `reserve_experience` を「キーイベント」に設定（docs/operations.md 参照）
- [ ] （任意）このパソコンで表示テストを動かすための準備: `! sudo npx playwright install-deps chromium`（今は一時的な回避策で動かしている）
