import { readFileSync } from 'node:fs';

/** ビルド結果のサイトマップから、全ページのパスを取り出す（ページを追加すると自動でテスト対象になる） */
export function allPagePaths(): string[] {
  const xml = readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}
