# デザイン資料

サイトのデザインの元になった資料です。デザインに関わる変更をするときは、まず [design.md](design.md) を読んでください。

| 項目 | 内容 |
| --- | --- |
| 元データ | Claude Design「Sailability Tokyo Design System」 https://claude.ai/design/p/5c43bcb8-5a1d-4586-8bd4-6592db573f4e |
| 取り込み日 | 2026-09-23 |
| テーマ | Summer Sky Theme v2 |

## このリポジトリでの対応関係

| デザインシステム | このリポジトリ |
| --- | --- |
| `tokens/*.css`（色・文字・余白・影・動き） | `src/styles/tokens.css`（値はそのまま） |
| `tokens/fonts.css`（Figtree + Noto Sans JP） | `src/layouts/BaseLayout.astro` の Google Fonts 読み込み |
| `tokens/base.css` と各コンポーネントの CSS | `src/styles/global.css`（`.button` `.card` `.tag` `.badge` など） |
| `assets/logo-*.png` | `src/assets/brand/`（白抜き版はロゴから自動生成） |
| `assets/photos/*` | `src/assets/photos/`（今はダミー画像。元データの受け取り待ち。todo/02 参照） |
| Icon コンポーネント（Lucide を実行時に取得） | `src/icons/*.svg` を同梱し、ビルド時に埋め込み（`src/components/Icon.astro`） |
| `ui_kits/website/*.jsx`（React の画面見本） | `src/views/`・`src/components/`（Astro で再実装。React は使わない） |

## デザイン見本との違い（意図的なもの）

- **料金・所要時間などの事実は、現行サイトの内容を使っています。** デザイン見本の「予約1,000円／当日1,500円」「1回20分」は誤りで、正しくは「一律1,500円」「15〜20分」（2026-09-23 確認）。
- デザイン見本の予約フォーム画面（BookingScreen）は作っていません。予約は引き続き Google フォームです。
- FAQ・当日の流れ・カリキュラムなど、見本で仮置きされていた文章は、事実確認ができていないため載せていません。
- アイコンは実行時に CDN から取得せず、SVG をリポジトリに同梱しています（外部サービスへの依存と表示の遅れをなくすため）。
