# 07. 余裕があれば

- [ ] **多言語化**: 英語・簡体字中国語・繁体字中国語のページを作る（AI に「セーリング体験会・トップ・About の英語版と中国語版を作って」と依頼）。予約用 Google フォームの英語版も必要か検討
- [ ] **スクリーンショット比較の基準画像を作る**: デザインが固まったら、Actions タブ > Update screenshots を作業ブランチで実行（docs/operations.md 参照）
- [ ] **AI を持っていない人向けの更新手段**（引き継ぎの前に）:
  - Gemini CLI の GitHub Action（Google の無料 API キーで、Issue に書いた依頼を AI が PR にする）
  - Pages CMS（https://pagescms.org/ 、無料。フォーム入力で YAML / Markdown を編集できる）
- [ ] **このパソコンで表示テストを動かす**（任意）: `! sudo npx playwright install-deps chromium` を実行するとローカルでも `npm test` が動く（現在は一時的な回避策で動かしています）
- [ ] GA4 で `apply_junior_course` / `reserve_experience` を「キーイベント」に設定（docs/operations.md 参照）
