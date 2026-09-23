// ビルド結果（dist/）の中の外部リンク（スポンサー・SNS・予約フォーム・お知らせ本文のリンクなど）が切れていないか確認する。
// 使い方: npm run build && npm run check:external
//
// - <a href="https://..."> のリンクだけを対象にする（フォントや計測タグの読み込みは対象外）
// - 404・410・5xx・接続できない → 「リンク切れ」として失敗
// - 401・403・429 → ロボットからのアクセスを断っているだけのことが多いので「注意」として表示（失敗にはしない）
// - 一時的な不調で誤判定しないよう、失敗したら少し待って2回まで再試行する
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const TIMEOUT_MS = 20_000;
const UA = 'Mozilla/5.0 (compatible; sailability-tokyo-link-check; +https://www.sailabilitytokyo.jp/)';

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (p.endsWith('.html')) yield p;
  }
}

/** URL → そのリンクがあるページの一覧 */
const links = new Map();
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  for (const [, raw] of html.matchAll(/<a\b[^>]*\bhref="(https?:\/\/[^"]+)"/g)) {
    const url = raw.replaceAll('&amp;', '&');
    if (!links.has(url)) links.set(url, new Set());
    links.get(url).add('/' + relative(DIST, file).replace(/(index)?\.html$/, ''));
  }
}

async function check(url) {
  let last = { status: 0, note: '' };
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 3000 * attempt));
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        headers: { 'User-Agent': UA, Accept: 'text/html,*/*' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      await res.body?.cancel();
      last = { status: res.status, note: '' };
      if (res.status < 400 || [401, 403, 429].includes(res.status)) return last;
    } catch (e) {
      last = { status: 0, note: e.cause?.code ?? e.name };
    }
  }
  return last;
}

const results = await Promise.all([...links.keys()].map(async (url) => ({ url, ...(await check(url)) })));
const broken = results.filter((r) => r.status === 0 || (r.status >= 400 && ![401, 403, 429].includes(r.status)));
const warned = results.filter((r) => [401, 403, 429].includes(r.status));
const where = (url) => [...links.get(url)].join(', ');

console.log(`外部リンク: ${results.length} 件を確認`);
for (const r of warned) console.log(`  注意（HTTP ${r.status}・ロボットのアクセスを断っている可能性）: ${r.url}  ← ${where(r.url)}`);
if (broken.length) {
  console.error(`リンク切れが ${broken.length} 件あります:`);
  for (const r of broken) console.error(`  - ${r.url}（${r.status ? `HTTP ${r.status}` : `接続できない ${r.note}`}）  ← ${where(r.url)}`);
  process.exit(1);
}
console.log('外部リンク: OK');
