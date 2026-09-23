// リポジトリ内の写真に、撮影場所（GPS）などのメタデータ（EXIF）が残っていないか確認する。
// 公開リポジトリなので、位置情報付きの写真をコミットしないためのチェック。
// 問題があれば `npm run photos -- <ファイル>` で変換し直す。
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const DIRS = ['src', 'public'];
const EXT = /\.(jpe?g|png|webp|avif|tiff?|heic)$/i;
const MAX_BYTES = 3 * 1024 * 1024;

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (EXT.test(p)) yield p;
  }
}

const problems = [];
for (const dir of DIRS) {
  for (const file of files(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    const meta = await sharp(file).metadata();
    if (meta.exif) problems.push(`${rel}: EXIF（撮影日時・位置情報など）が含まれています`);
    if (statSync(file).size > MAX_BYTES) problems.push(`${rel}: ファイルサイズが 3MB を超えています`);
  }
}

if (problems.length) {
  console.error(`画像の確認で問題が見つかりました（npm run photos -- <ファイル> で変換してください）:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  process.exit(1);
}
console.log('画像: OK');
