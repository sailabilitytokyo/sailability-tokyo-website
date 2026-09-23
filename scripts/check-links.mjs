// ビルド結果（dist/）の中のサイト内リンク切れを検出する。
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
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    const pathname = url.split(/[?#]/)[0];
    if (!exists(pathname)) broken.push(`${relative(DIST, file)} → ${url}`);
  }
}

if (broken.length) {
  console.error(`サイト内のリンク切れが ${broken.length} 件あります:\n${broken.map((b) => `  - ${b}`).join('\n')}`);
  process.exit(1);
}
console.log('サイト内リンク: OK');
