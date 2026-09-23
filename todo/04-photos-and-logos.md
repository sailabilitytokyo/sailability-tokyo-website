# 04. 写真・ロゴの用意

## 取り込み済み

- [x] 団体ロゴ（縦組み・横組み・白抜き）… Claude Design から取り込み済み（`src/assets/brand/`）

## 用意してほしいもの

- [ ] **Claude Design に入れた写真 8 枚の元ファイル**
  Claude Design からは 1 ファイル 256KB までしか読み込めず、写真は途中で切れてしまいました。元のファイルをください。
  （hero-sailing-toyosu / fleet-hansa-toyosu / sailing-summer / kids-onboard-smiling / instructor-briefing-kids / school-land-lesson / pontoon-toyosu / pet-aboard-dog）
  - Claude Design のプロジェクトからダウンロードするか、Google フォトの元データを使ってください
- [ ] 追加の写真があれば（トップの背景用の横長写真、About・会員募集ページ用など）
- [ ] **スポンサーのロゴ**（今のサイトに載っている 8 社分。今のサイトの画像を右クリックで保存したものでも可）
- [ ] About ページにあった「ハンザ303 ローラーファーリング」「ジブセールの取り付け（正しい/間違った）」の写真
- [ ] （あれば）車いすの方の乗り移りの写真、法人ロゴ入りのセールの写真 … デザイン仕様書で「不足している素材」とされているもの

**現在は「DUMMY PHOTO」と書かれたダミー画像**を、次の場所に置いています（`src/assets/photos/`）。
本物の写真を同じファイル名で置き換えるだけで差し替わります（`npm run photos` で変換すると、同じ名前の .jpg で保存されます）。

| 場所 | ファイル |
| --- | --- |
| トップ一番上の背景 | hero-sailing-toyosu.jpg |
| トップ一番上の右側 | kids-onboard-smiling.jpg |
| トップの団体紹介 | pontoon-toyosu.jpg |
| セーリング体験会（ページ上部・トップのカード） | fleet-hansa-toyosu.jpg |
| 小学生ヨット教室（ページ上部・トップのカード） | instructor-briefing-kids.jpg |
| 会員募集ページ上部 | sailing-summer.jpg |
| About ページ上部 | school-land-lesson.jpg |
| （未使用） | pet-aboard-dog.jpg |

- [ ] 差し替えたら、各ページの `imageAlt`（写真の説明）が実際の写真と合っているか確認する
- [ ] **ダミー画像のまま本番公開しない**（06 の公開前チェック）

## 注意

- [ ] **人物が写っている写真は、掲載の同意が取れているものだけ**にしてください。特に子どもの顔がわかる写真（kids-onboard-smiling・instructor-briefing-kids など）は保護者の同意が必要です（リポジトリは公開されており、履歴から完全に消すのは難しいため）
- 位置情報（EXIF）は変換時に自動で削除されます

## 渡し方

1. 写真をダウンロード
2. リポジトリの**外**のフォルダに置く（例: `~/work/sailability-tokyo/photos-raw/`）
   - Windows のエクスプローラーからは `\\wsl.localhost\Ubuntu\home\zenju\work\sailability-tokyo\` で開けます
3. AI に「photos-raw に写真を置いた。サイトに使って」と伝える
