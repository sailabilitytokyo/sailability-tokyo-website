// ロゴ（src/assets/brand/logo-full.png）からファビコン一式を作る。ロゴを差し替えたら実行する。
// 使い方: node scripts/make-favicons.mjs
// ロゴの決まり（鳥のマーク単体は使わない）に従い、「Sailability Tokyo」の文字が入った縦組みロゴを使う。
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SRC = new URL('../src/assets/brand/logo-full.png', import.meta.url).pathname;
const OUT = new URL('../public/', import.meta.url).pathname;

/** 白い正方形の中央にロゴを置いた PNG */
async function square(size, padding = 0.06) {
  const inner = Math.round(size * (1 - padding * 2));
  const logo = await sharp(SRC).resize(inner, inner, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  writeFileSync(OUT + name, await square(size));
}

// favicon.ico（16・32・48px の PNG を1つのファイルにまとめる）
const images = await Promise.all([16, 32, 48].map((s) => square(s, 0.03)));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((img, i) => {
  const size = [16, 32, 48][i];
  const e = 6 + 16 * i;
  header.writeUInt8(size, e);
  header.writeUInt8(size, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(img.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += img.length;
});
writeFileSync(OUT + 'favicon.ico', Buffer.concat([header, ...images]));

// Android のホーム画面用
writeFileSync(
  OUT + 'site.webmanifest',
  JSON.stringify(
    {
      name: 'Sailability Tokyo',
      short_name: 'Sailability',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#072ac8',
      background_color: '#ffffff',
      display: 'browser',
    },
    null,
    2,
  ) + '\n',
);
console.log('ファビコンを作成しました（public/favicon.ico ほか）');
