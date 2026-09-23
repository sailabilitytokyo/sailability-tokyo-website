// 公開中のサイトの死活監視（外形監視）。GitHub Actions から毎日実行される。
// 使い方: node scripts/monitor.mjs https://www.sailabilitytokyo.jp
//
// 確認すること:
//  - サイトマップに載っている全ページが正常に表示できる（HTTP 200）
//  - トップページに Google Analytics の計測タグが入っている
//  - 予約フォーム（Googleフォーム）が開ける・回答受付中である（日程が掲載されている間）
//  - 旧ブログ（アーカイブ）が開ける
// 問題があれば一覧を表示して終了コード 1 で終わる（ワークフローが Issue を作る）。
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const base = (process.argv[2] || '').replace(/\/$/, '');
if (!base) {
  console.error('使い方: node scripts/monitor.mjs <サイトのURL>');
  process.exit(2);
}

const site = parse(readFileSync(new URL('../src/data/site.yaml', import.meta.url), 'utf8'));
const schedule = parse(readFileSync(new URL('../src/data/schedule.yaml', import.meta.url), 'utf8')) ?? [];
const problems = [];
const ok = [];

async function get(url) {
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'sailability-tokyo-monitor' } });
    return { status: res.status, text: await res.text() };
  } catch (e) {
    return { status: 0, text: String(e) };
  }
}

// 1. 全ページ
const index = await get(`${base}/sitemap-index.xml`);
const sitemapUrls = [...index.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (index.status !== 200 || sitemapUrls.length === 0) problems.push(`サイトマップが取得できません（HTTP ${index.status}）`);
const pages = [];
for (const sm of sitemapUrls) {
  const r = await get(sm.replace(/^https?:\/\/[^/]+/, base));
  pages.push(...[...r.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, base)));
}
for (const url of pages) {
  const r = await get(url);
  if (r.status !== 200) problems.push(`ページが表示できません: ${url}（HTTP ${r.status}）`);
  else ok.push(url);
}

// 2. Google Analytics
if (site.analytics?.ga4) {
  const home = await get(`${base}/`);
  if (!home.text.includes(site.analytics.ga4)) problems.push(`トップページに Google Analytics の計測タグ（${site.analytics.ga4}）が見つかりません`);
}

// 3. 予約フォーム（今後の定例体験会が掲載されている間は、回答受付中であるべき）
const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());
const hasUpcoming = schedule.some((s) => String(s.date) >= today && (s.kind ?? 'experience') === 'experience' && (s.status ?? 'scheduled') === 'scheduled');
const form = await get(site.forms.experience);
if (form.status !== 200) problems.push(`予約フォームが開けません: ${site.forms.experience}（HTTP ${form.status}）`);
else if (hasUpcoming && /回答を受け付けていません|no longer accepting responses/i.test(form.text))
  problems.push(`体験会の日程を掲載中ですが、予約フォームが「回答受付終了」になっています: ${site.forms.experience}`);

// 4. 旧ブログ
const blog = await get(site.blogArchiveUrl);
if (blog.status !== 200) problems.push(`旧ブログ（アーカイブ）が開けません: ${site.blogArchiveUrl}（HTTP ${blog.status}）`);

console.log(`確認したページ: ${ok.length} / ${pages.length}`);
if (problems.length) {
  console.log(problems.map((p) => `- ${p}`).join('\n'));
  process.exit(1);
}
console.log('問題は見つかりませんでした');
