// 写真をサイト用に変換して src/assets/photos/ に保存する。
//  - 長辺 2400px に縮小（大きすぎる写真でリポジトリが重くならないように）
//  - EXIF（撮影日時・位置情報・カメラ情報など）を削除
//  - 向き（回転）を正しく補正
//  - JPEG に統一（ページ表示時は Astro が WebP などに自動変換する）
//
// 使い方:
//   npm run photos -- ~/Downloads/photo1.jpg ~/Downloads/photo2.HEIC
//   npm run photos -- ~/Downloads/album/          （フォルダ内の写真をすべて）
// 保存先を変えたい場合: npm run photos -- --out src/assets/sponsors ~/Downloads/logo.png
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const EXT = /\.(jpe?g|png|webp|avif|tiff?|heic|heif)$/i;
const args = process.argv.slice(2);
let outDir = new URL('../src/assets/photos/', import.meta.url).pathname;
const inputs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') outDir = args[++i];
  else inputs.push(args[i]);
}
if (inputs.length === 0) {
  console.error('使い方: npm run photos -- <写真ファイルまたはフォルダ> ...');
  process.exit(1);
}

const files = inputs.flatMap((p) =>
  statSync(p).isDirectory()
    ? readdirSync(p)
        .filter((f) => EXT.test(f))
        .map((f) => join(p, f))
    : [p],
);

mkdirSync(outDir, { recursive: true });
for (const file of files) {
  const isPng = /\.png$/i.test(file);
  // ファイル名は英数字・ハイフンのみに（URL で扱いやすくするため）
  const name =
    basename(file, extname(file))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `photo-${Date.now()}`;
  const out = join(outDir, `${name}.${isPng ? 'png' : 'jpg'}`);
  let img = sharp(file).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true });
  img = isPng ? img.png({ compressionLevel: 9 }) : img.jpeg({ quality: 82, mozjpeg: true });
  await img.toFile(out); // sharp は明示しない限りメタデータを書き出さない
  console.log(`${file} → ${out}`);
}
