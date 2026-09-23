import type { APIRoute } from 'astro';

// 本番ドメインでは全ページのクロールを許可する。
// プレビュー（*.pages.dev）は public/_headers で X-Robots-Tag: noindex を付けて検索結果に出さない。
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
