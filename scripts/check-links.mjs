// ビルド結果（dist/）の中のサイト内リンク切れと、Markdown の書き間違い（太字の ** がそのまま表示される）を検出する。
// 使い方: npm run build && npm run check:links
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (p.endsWith('.html')) yield p;
  }
}

/** /about → dist/about.html など、URL パスに対応するファイルがあるか */
function exists(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/$/, '');
  const candidates = [clean, `${clean}.html`, join(clean, 'index.html')];
  if (clean === '') candidates.push('index.html');
  return candidates.some((c) => existsSync(join(DIST, c)) && statSync(join(DIST, c)).isFile());
}

const broken = [];
const markdownLeft = [];
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  // 本文に ** が残っていたら、太字の書き方が間違っている（「」のすぐ外側に ** を付けた、など）
  const text = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '');
  for (const m of text.matchAll(/.{0,15}\*\*.{0,15}/g)) markdownLeft.push(`${relative(DIST, file)}: 「${m[0].trim()}」`);
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    const pathname = url.split(/[?#]/)[0];
    if (!exists(pathname)) broken.push(`${relative(DIST, file)} → ${url}`);
  }
}

if (markdownLeft.length) {
  console.error(`太字の ** がそのまま表示されている箇所が ${markdownLeft.length} 件あります（「**強調**」のように括弧の内側に付けてください）:\n${markdownLeft.map((b) => `  - ${b}`).join('\n')}`);
}
if (broken.length) {
  console.error(`サイト内のリンク切れが ${broken.length} 件あります:\n${broken.map((b) => `  - ${b}`).join('\n')}`);
}
if (broken.length || markdownLeft.length) process.exit(1);
console.log('サイト内リンク・Markdown: OK');
