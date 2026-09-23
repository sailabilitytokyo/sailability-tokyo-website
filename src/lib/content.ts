import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, LOCALES, localePath, type Locale } from '../i18n/locales';

export type PageEntry = CollectionEntry<'pages'>;
export type NewsEntry = CollectionEntry<'news'>;

/** 'ja/about' → { lang: 'ja', slug: 'about' } */
export function splitId(id: string): { lang: Locale; slug: string } {
  const [lang, ...rest] = id.split('/');
  if (!(LOCALES as readonly string[]).includes(lang)) {
    throw new Error(`コンテンツ "${id}" は src/content/<pages|news>/<言語>/ の下に置いてください（言語: ${LOCALES.join(', ')}）`);
  }
  return { lang: lang as Locale, slug: rest.join('/') };
}

export async function getPages(lang: Locale): Promise<PageEntry[]> {
  return (await getCollection('pages')).filter((p) => splitId(p.id).lang === lang);
}

export async function getPage(lang: Locale, slug: string): Promise<PageEntry | undefined> {
  return (await getPages(lang)).find((p) => splitId(p.id).slug === slug);
}

/** 公開済みのお知らせ（新しい順） */
export async function getNews(lang: Locale): Promise<NewsEntry[]> {
  return (await getCollection('news'))
    .filter((n) => !n.data.draft && splitId(n.id).lang === lang)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** ページの URL。slug が 'home' ならトップページ */
export function pageUrl(lang: Locale, slug: string): string {
  return localePath(lang, slug === 'home' ? '/' : `/${slug}`);
}

export function newsUrl(lang: Locale, slug?: string): string {
  return localePath(lang, slug ? `/news/${slug}` : '/news');
}

/** そのページの翻訳が存在する言語の一覧（言語切替・hreflang 用） */
export async function localesWithPage(slug: string): Promise<Locale[]> {
  const all = await getCollection('pages');
  return LOCALES.filter((l) => all.some((p) => p.id === `${l}/${slug}`));
}

/** お知らせ一覧が存在する言語 = トップページがある言語 */
export async function localesWithNews(): Promise<Locale[]> {
  return localesWithPage('home');
}

export function isDefaultLocale(lang: Locale): boolean {
  return lang === DEFAULT_LOCALE;
}
