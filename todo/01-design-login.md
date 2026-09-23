# 01. Claude Design のデザイン取り込みのための認証

Claude Design で作ったデザイン（https://claude.ai/design/p/5c43bcb8-5a1d-4586-8bd4-6592db573f4e）を AI が読み込むには、デザインへのアクセスを許可する必要があります。

- [x] Claude Code で `/design-login` を実行し、画面の指示に従って claude.ai のアカウントで許可する
- [x] 終わったら Claude Code に「design-login した。デザインを取り込んで」と伝える（2026-09-23 取り込み済み。写真のみ未取得 → 04 参照）

取り込んだデザインは `design/` フォルダに参考資料として保存し、`src/styles/global.css` などに反映します。
